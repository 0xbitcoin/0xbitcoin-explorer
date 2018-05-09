var INFURA_ROPSTEN_URL = 'https://ropsten.infura.io/gmXEVo5luMPUGPqg6mhy';
var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';


const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider(INFURA_MAINNET_URL));

var deployedContractInfo = require('../contracts/DeployedContractInfo.json');
var _0xBitcoinContract = require('../contracts/_0xBitcoinToken.json');

var embeddedWeb3 = require('web3')

var web3utils = require('web3-utils')


export default class EthHelper {


    init( alertRenderer ){
        this.alertRenderer = alertRenderer;


        return this.connectWeb3(new embeddedWeb3());
    }

    connectWeb3(web3){

            window.web3 = new Web3(new Web3.providers.HttpProvider(INFURA_MAINNET_URL));
            console.log('connected to web3!')
            return window.web3;

    }



    async connectToContract(web3,  callback)
    {
      var tokenContract = this.getWeb3ContractInstance(
        web3,
        this.getContractAddress(),
        this.getContractABI()
      )

       console.log('contract' , tokenContract)

       var contractAddress = this.getContractAddress() ;

       var difficulty = await tokenContract.getMiningDifficulty().toNumber() ;

       var challenge_number = await tokenContract.getChallengeNumber()  ;

       var amountMined = await tokenContract.tokensMinted()

       var totalSupply = await tokenContract._totalSupply()


       var lastRewardAmount = await tokenContract.lastRewardAmount()


        var lastRewardTo = await tokenContract.lastRewardTo()

       var lastRewardEthBlockNumber = await tokenContract.lastRewardEthBlockNumber()

       var hashrateEstimate = this.estimateHashrateFromDifficulty(  difficulty  )



      var decimals = Math.pow(10,8);
       var renderData = {
         contractUrl: 'https://etherscan.io/address/'+contractAddress,
         contractAddress : contractAddress,
         difficulty: difficulty,
         challenge_number: challenge_number,
         amountMined: (parseInt(amountMined) / decimals),
         totalSupply: (parseInt(totalSupply) / decimals),
         hashrateEstimate: hashrateEstimate,
         lastRewardTo: lastRewardTo,
         lastRewardAmount: (parseInt(lastRewardAmount) / decimals),
         lastRewardEthBlockNumber: lastRewardEthBlockNumber


       }



       callback(renderData);

    }




    async getSearchResults(web3,query,callback)
    {

      var self = this ;

      var results = [];

      console.log('getting search results');


      if(Number.isNaN(query))
      {
        callback(results)
        return;
      }

      if(web3utils.isAddress(query))
      {

        var accountData = await self.getAccountData(web3,query)
        console.log('accountData',accountData)

      }

      var tx = await new Promise(function (fulfilled,error) {
        web3.eth.getTransaction(query,function(err,result){
          fulfilled(result)
        });
      });

      console.log('tx',tx)


      if(accountData!=null)
      {
        results.push( {type:'account', address: accountData.address, url: "/account.html?address=" + accountData.address, data: accountData}  )
      }

      if(tx!=null)
      {
        results.push( {type:'tx', address: tx.hash, url: "/transaction.html?hash="+tx.hash, data: tx}  )
      }

      callback(results)
    }


    async getAccountData(web3,address)
    {

      var tokenContract = this.getWeb3ContractInstance(
        web3,
        this.getContractAddress(),
        this.getContractABI()
      )

      var tokenBalance = await new Promise(function (fulfilled,error) {
         tokenContract.balanceOf.call(address,function(err,result){
          fulfilled(result)
        });
      });

      var etherBalance = await new Promise(function (fulfilled,error) {
        web3.eth.getBalance(address,function(err,result){
          fulfilled(result)
        });
      });


      return {
        address: address,
        tokenBalance: tokenBalance.toNumber(),
        etherBalance: etherBalance.toNumber()
      }


    }

    async getTransactionData(web3,hash)
    {
      var tx = await new Promise(function (fulfilled,error) {
        web3.eth.getTransaction(hash,function(err,result){
          fulfilled(result)
        });
      });

      var txType = null;

      if(tx.input.substring(0,10) == "0xa9059cbb")
      {
        txType = 'transfer';
        tx.transferAmountRaw = tx.input.substring(tx.input.length - 64)
        tx.transferAmount = parseInt(tx.transferAmountRaw,16) / 10e8
      }

      if(tx.input.substring(0,10) == "0x095ea7b3")
      {
        txType = 'approve';
        tx.transferAmountRaw = tx.input.substring(tx.input.length - 64)
        tx.transferAmount = parseInt(tx.transferAmountRaw,16) / 10e8
      }

      if(tx.input.substring(0,10) == "0x1801fbe5")
      {
        txType = 'mint';
        tx.mintNonce = tx.input.substring(tx.input.length - 64)
      }

      tx.fromUrl = '/account.html?address='+tx.from
      tx.toUrl = '/account.html?address='+tx.to

      tx.etherscanUrl = 'https://etherscan.io/tx/'+tx.transactionHash


      tx.txType = txType;

      return tx;
    }


    estimateHashrateFromDifficulty(difficulty){


       var timeToSolveABlock =  10*60;  //seconds.. ten minutes

        var hashrate = web3utils.toBN(difficulty)
              .mul( web3utils.toBN(2)
              .pow(  web3utils.toBN(22) ))
              .div( web3utils.toBN(timeToSolveABlock ))

      var gigHashes = hashrate / ( parseFloat( web3utils.toBN(10).pow( web3utils.toBN(9) )) )

       console.log('hashrate is ',hashrate )
     return gigHashes.toFixed(2).toString() + " GH/s"

    }

    async getEventList(web3,type)
    {

      var tokenContract = this.getWeb3ContractInstance(
        web3,
        this.getContractAddress(),
        this.getContractABI()
      )

      var current_block = await this.getCurrentEthBlockNumber(web3);


      var mint_topic = '0xcf6fbb9dcea7d07263ab4f5c3a92f53af33dffc421d9d121e1c74b307e68189d';
      var transfer_topic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

      var logTypeTopic = null;

      if(type == 'mint')
      {
        logTypeTopic = mint_topic;
      }

      if(type == 'transfer')
      {
        logTypeTopic = transfer_topic;
      }

      var list = await new Promise(function (fulfilled,error) {

        eth.getLogs({
           fromBlock: (current_block-10000),
           toBlock: current_block,
           address: '0xB6eD7644C69416d67B522e20bC294A9a9B405B31',
           topics: [logTypeTopic, null],
         }).then((result) => {
           if(address == null)
           {
             fulfilled(result)
           }


         })

       });


    return list;


    }

    async getCurrentEthBlockNumber(web3)
    {
      var ethBlockNumber = await new Promise(function (fulfilled,error) {
            web3.eth.getBlockNumber(function(err, result)
          {
            if(err){error(err);return}
            console.log('eth block number ', result )
            fulfilled(result);
            return;
          });
       });
       return ethBlockNumber;
    }

    getWeb3ContractInstance(web3, contract_address, contract_abi )
    {
      if(contract_address == null)
      {
        contract_address = this.getContractAddress();
      }

      if(contract_abi == null)
      {
        contract_abi = this.getContractABI();
      }

        return web3.eth.contract(contract_abi).at(contract_address)


    }


    getContractAddress()
    {
       return deployedContractInfo.networks.mainnet.contracts._0xbitcointoken.blockchain_address;
    }

    getContractABI()
    {
       return _0xBitcoinContract.abi;
    }


}
