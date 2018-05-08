var INFURA_ROPSTEN_URL = 'https://ropsten.infura.io/gmXEVo5luMPUGPqg6mhy';
var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';

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


      var accountData = await self.getAccountData(web3,query)

      console.log('accountData',accountData)

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
        results.push( {type:'tx', url: tx.address, data: tx}  )
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
