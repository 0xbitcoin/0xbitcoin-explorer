
const $ = require('jquery');

var web3utils = require('web3-utils')
var sigUtil = require('eth-sig-util')

import Vue from 'vue'

var _0xBitcoinABI = require('../contracts/_0xBitcoinToken.json')
var erc20TokenABI = require('../contracts/ERC20Interface.json')

var deployedContractInfo = require('../contracts/DeployedContractInfo.json')
var lavaWalletContract;
var _0xBitcoinContract;

var searchResults = {};


export default class SearchHelper {


  async init( )
  {
    var self = this;




          console.log('init search');


          $(document.body).on('click', '.nav-search-go',function (e) {
                self.submitSearch(this);
                return false;    //<---- Add this line

            });

            $(document.body).on('keypress', '.nav-search',function (e) {

                  if (e.which == 13) {
                    self.submitSearch(this);
                    return false;    //<---- Add this line
                  }
              });



    }

    refreshSearchHandlers()
    {
      console.log('refresh')
      var self = this;
 

    }


    submitSearch(element)
    {
      console.log('submitSearch')
      var inputElement = $(element).closest('.nav-search-container').find('.nav-search').first()
      console.log(inputElement)
      var query = $(inputElement).val();

      if(query && query.length > 0)
      {
        console.log('submit search',query)

          window.location.href = '/search.html?query='+query;
      }

    }


}
