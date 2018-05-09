
const $ = require('jquery');
import Vue from 'vue';


//require('owl.carousel')

var dashboardData;
var app;
var jumbotron;

var transferList;
var mintList;

import jumboLogo from '../img/0xbitcoin-logo-white.png'


export default class HomeRenderer {

    async init( ethHelper, web3 )
    {

      var self = this ;


     setInterval( function(){


         ethHelper.connectToContract( web3 , function(renderData){

           self.update(renderData);

         } );

      },30 * 1000);





        ethHelper.connectToContract( web3 , function(renderData){


           jumbotron = new Vue({
            el: '#jumbotron',
            data: {
              jumboLogo: jumboLogo,
              errorMessage: ''

            }
          })


          dashboardData = renderData;

             app = new Vue({
            el: '#dashboard',
            data: dashboardData
          });


          self.update(renderData);

        } );



        var mints = await ethHelper.getEventList(web3,'mint');

        mints = mints.slice(0,10)
                      .map(function(item){
                          item.blockNumberFormatted = item.blockNumber.toNumber();
                          item.url = "/transaction.html?hash="+ item.transactionHash;
                          return item;
                      })



        var mintList = new Vue({
           el: '#mint-list',
           data: {list: mints}
         });



        var transfers = await ethHelper.getEventList(web3,'transfer');

        transfers = transfers.slice(0,10)
                              .map(function(item){
                                  item.blockNumberFormatted = item.blockNumber.toNumber();
                                  item.url = "/transaction.html?hash="+ item.transactionHash;
                                  return item;
                              })
        var transferList = new Vue({
           el: '#transfer-list',
           data: {list: transfers}
         });



        console.log('transfers',transfers.slice(10))




    }

     update( renderData )
    {

      dashboardData = renderData;


    }



}
