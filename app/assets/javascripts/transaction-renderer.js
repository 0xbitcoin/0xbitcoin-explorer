
const $ = require('jquery');
import Vue from 'vue';


//require('owl.carousel')

var txData;
var resultsContainer;


export default class TransactionRenderer {

    async init( ethHelper, web3 )
    {

      var self = this ;



      var url = new URL( window.location.href  );
      var txHash = url.searchParams.get("hash");
      console.log('txHash',txHash);


      txData = await ethHelper.getTransactionData( web3 , txHash)


          console.log('txData',txData)

          resultsContainer = new Vue({
            el: '#tx-data',
            data: {
              txData: txData,

            }
          });

    }

     update( renderData )
    {


    }



}
