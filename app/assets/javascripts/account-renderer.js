
const $ = require('jquery');
import Vue from 'vue';


//require('owl.carousel')

var accountData;
var resultsContainer;


var transferList;
var mintList;

export default class AccountRenderer {

    async init( ethHelper, web3 )
    {

      var self = this ;



      var url = new URL( window.location.href  );
      var accountAddress = url.searchParams.get("address");
      console.log('accountAddress',accountAddress);





      accountData = await ethHelper.getAccountData( web3 , accountAddress)


          console.log('accountData',accountData)

          resultsContainer = new Vue({
            el: '#account-data',
            data: {
              address: accountData.address,
              tokenBalance: accountData.tokenBalance,
              etherBalance: accountData.etherBalance,
              tokenBalanceFormatted: accountData.tokenBalance / 10e7,
              etherBalanceFormatted: accountData.etherBalance / 10e17,
              etherscanUrl: 'https://etherscan.io/address/'+accountData.address

            }
          });



/*

          var mints = await ethHelper.getEventList(web3,'mint');

          mints = mints.slice(0,10)
                        .map(function(item){
                            item.blockNumberFormatted = item.blockNumber.toNumber();
                            item.hashFormatted = item.transactionHash.substring(0,16);
                            item.url = "/transaction.html?hash="+ item.transactionHash;
                            return item;
                        })



            mintList = new Vue({
             el: '#mint-list',
             data: {list: mints}
           });



          var transfers = await ethHelper.getEventList(web3,'transfer');

          transfers = transfers.slice(0,10)
                                .map(function(item){
                                    item.blockNumberFormatted = item.blockNumber.toNumber();
                                    item.hashFormatted = item.transactionHash.substring(0,16);
                                    item.url = "/transaction.html?hash="+ item.transactionHash;

                                    //item.transferAmountRaw = item.input.substring(32)

                                    return item;
                                })
            transferList = new Vue({
             el: '#transfer-list',
             data: {list: transfers}
           });
*/



    }

     update( renderData )
    {


    }



}
