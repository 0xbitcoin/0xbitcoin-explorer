
const $ = require('jquery');
import Vue from 'vue';


//require('owl.carousel')

var accountData;
var resultsContainer;


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
              etherBalance: accountData.etherBalance
            }
          });






    }

     update( renderData )
    {


    }



}
