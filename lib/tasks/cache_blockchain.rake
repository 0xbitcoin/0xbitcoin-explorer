namespace :db do


    task delete_blockchain: :environment do
        puts 'deleting blockchain...'
        Block.delete_all
        puts 'deleted blockchain'
    end

    desc 'Fill database with chain data'
    task cache_blockchain: :environment do



    #  while next_block_to_cache_id <= most_recent_mined_block_id do
    #    @block_json = eth_client.get_block_by_number(next_block_to_cache_id,true)
    #    importBlockFromJSON(@block_json['result'])


    #    next_block_to_cache_id+=1

    #    most_recent_mined_block_id = eth_client.block_number['result'].hex

    #  end

    eth_client = getEthereumClient()



    while (true) do




        ##recheck where we are each time
        most_recent_cached_block = Block.all.last

        if most_recent_cached_block
          most_recent_cached_block_height = most_recent_cached_block.height
        else
          most_recent_cached_block_height = -1
        end

        #learn what the latest block id is (have to convert from hex from the JSONRPC)
        most_recent_mined_block_height = eth_client.block_number['result'].hex




    puts 'most recent mined block: '.concat(most_recent_mined_block_height.to_s)

    next_block_to_cache_height = most_recent_cached_block_height+1
    #next_block_to_cache_height = 800000

    puts 'next block to cache: '.concat(next_block_to_cache_height.to_s)


    if( most_recent_cached_block_height >= most_recent_mined_block_height )
      puts 'up to date with the blockchain!'
      sleep 10 #wait for ten seconds
    end



    #number to import at once
    import_chunk_size = 5000


    #dont try to import more than there are
    unimported_blocks_count = most_recent_mined_block_height - most_recent_cached_block_height
    if( import_chunk_size > unimported_blocks_count )
      import_chunk_size = unimported_blocks_count
    end

    import_chunk_size.times do |i|
       @block_json = eth_client.get_block_by_number(next_block_to_cache_height,true)
        importBlockFromJSON(@block_json['result'],eth_client)

        next_block_to_cache_height += 1

    end

    puts 'importing block chunk of count '.concat(import_chunk_size.to_s)
    puts 'added block chunk'

    end



      puts 'cached blockchain...'
    end

end


def importBlockFromJSON(json,eth_client)


  block = Block.new(
    block_hash: json['hash'],
    block_hash_lower: json['hash'].downcase,
    height: json['number'].hex,
    difficulty: json['difficulty'].hex,
    parent_block_hash: json['parentHash'],
    mined_at: Time.at(json['timestamp'].hex),
    miner_hash: json['miner'],
    size: json['size'].hex,
    extra_data: json['extraData'],
    tx_count:  json['transactions'].size,
    gas_limit: json['gasLimit'].hex,
    gas_used: json['gasUsed'].hex,
    nonce: json['nonce']   #null if pending block - so keep tryin to update
  )

  importAccount(json['miner'],eth_client)

  puts 'block '.concat(block.height.to_s).concat(' has ').concat(json['transactions'].size.to_s).concat(' transactions.')

  if json['uncles'] and json['uncles'].size > 0
    json['uncles'].each do |uncle_hash|
      BlockUncle.create(parent_block_hash: block.block_hash, uncle_block_hash: uncle_hash)
    end
  end

  if json['transactions'] and json['transactions'].size > 0
    json['transactions'].each do |transaction_json|
        importTransactionFromJSON( transaction_json ,eth_client )  #may need to only grab result.. not sure
      end
  end

  block.save!

  return block

end


def importTransactionFromJSON(json,eth_client)
  puts 'importing tx'


  tx = Tx.new(
     tx_hash: json['hash'],
     tx_hash_lower: json['hash'].downcase,
     block_hash: json['blockHash'],
    block_height: json['blockNumber'].hex,
    height: json['transactionIndex'].hex ,
    from_account_address: json['from'],
    to_account_address: json['to'],
    eth_value:  (json['value'].hex / 10.0 **18),
    gas_used: json['gas'].hex,
    gas_price: json['gasPrice'],
    input: json['input']  #can be the contract creation bytecode!

  )

  createAccount( json['from'] ,eth_client )

  if(json['to'] != nil && json['to'].size > 0)
    createAccount( json['to'] , eth_client )
  else
    #get smart contract creation info
     @tx_receipt = eth_client.get_transaction_receipt(json['hash'])['result']
     tx.contract_account_address = @tx_receipt['contractAddress']

       createAccount( @tx_receipt['contractAddress'] , eth_client )
     puts 'imported smart contract creation address'
  end

  tx.save


  puts 'imported tx '.concat(tx.height.to_s)
  return tx
end

def createAccount(account_hash,eth_client)

  if(account_hash == nil)
    return
  end


   balance = eth_client.get_balance(account_hash, 'latest')['result'].hex / (10.0**18)

   code_data = eth_client.get_code(account_hash, 'latest')

account =  Account.create(
  address: account_hash,
  address_lower: account_hash.downcase,
  contractual: code_data['result'].size > 2,
  assembly:  code_data['result'],
  eth_balance: balance
)

  if(account)
    puts 'imported account '.concat(account.address.to_s)
  else
  #  puts 'account already exists '.concat(account_hash.to_s)
  end

  return account
end


def getEthereumClient
  #Bind to the Ethereum GO Client using JSON-RPC
require ('ethereum')

begin

    #should this be a singleton?
     client = Ethereum::IpcClient.new("#{ENV['HOME']}/.ethereum/geth.ipc")


  puts 'Bound to ethereum client'

  puts  client
rescue
  puts 'WARNING: ---FAILED TO BIND TO ETHEREUM CLIENT---'
end

  return  client
end
