namespace :db do




    desc 'Refresh account balances'
    task update_ethereum_accounts: :environment do
      puts 'updating ethereum accounts...'



      eth_client = getEthereumClient()

      Account.find_each do |account|
        updateAccount(account, eth_client )
      end

      puts 'updated ethereum accounts...'
    end

end


def updateAccount (account, eth_client)


  #how to tell if contractual??

  account.eth_balance = eth_client.get_balance(account.address, 'latest')['result'].hex / (10.0**18)

   code_data = eth_client.get_code(account.address, 'latest')
  account.assembly =  code_data['result'].hex
#  account.storage = eth_client.get_storage(account.address, 'latest')['result'].hex

  account.contractual = code_data['result'].size > 2
  #THIS IS BROKEN


  puts  code_data
  if account.contractual
    puts 'contractual'
  else
    puts 'non contractual'
  end

  account.tx_sent_count =  account.transactions_sent.size
  account.tx_received_count = account.transactions_received.size

  if account.save
    puts 'updated balance for account '.concat(account.address)
  end

end
