
const $ = require('jquery');
import Vue from 'vue';


//require('owl.carousel')

var resultsList;
var resultsContainer;


import jumboLogo from '../img/0xbitcoin-logo-white.png'


export default class SearchRenderer {

    init( ethHelper, web3 )
    {

      var self = this ;



      var url = new URL( window.location.href  );
      var searchQuery = url.searchParams.get("query");
      console.log('searchQuery',searchQuery);





        ethHelper.getSearchResults( web3 , searchQuery , function(results){

          resultsList = results;
          console.log('resultsList',resultsList)

          resultsContainer = new Vue({
            el: '#search-results',
            data: {
              query: searchQuery,
              results: resultsList,
              noResults: (resultsList == null || resultsList.length == 0)
            }
          });



        } );






    }

     update( renderData )
    {


    }



}
