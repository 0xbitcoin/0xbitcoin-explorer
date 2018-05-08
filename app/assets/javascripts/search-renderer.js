
const $ = require('jquery');
import Vue from 'vue';


//require('owl.carousel')

var dashboardData;
var app;
var jumbotron;


import jumboLogo from '../img/0xbitcoin-logo-white.png'


export default class SearchRenderer {

    init( ethHelper, web3 )
    {

      var self = this ;


     
      var url = new URL( window.location.href  );
      var searchQuery = url.searchParams.get("query");
      console.log('searchQuery',searchQuery);




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






    }

     update( renderData )
    {

      dashboardData = renderData;


    }



}
