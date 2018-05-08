
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


      $('.nav-search').keypress(function (e) {
          if (e.which == 13) {
            self.submitSearch();
            return false;    //<---- Add this line
          }
        });


        $('.nav-search-go').click(function (e) {
              self.submitSearch();
              return false;    //<---- Add this line

          });




    }


    submitSearch()
    {
      var query = $('.nav-search').val();

      if(query && query.length > 0)
      {
        console.log('submit search',query)

          window.location.href = '/search.html?query='+query;
      }

    }


}
