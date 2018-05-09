
const $ = require('jquery');




import jumboLogo from '../img/0xbitcoin-logo-white.png'
import githubLogo from '../img/GitHub-Mark-64px.png'
import redditLogo from '../img/reddit-mark-64px.png'
import contractQR from '../img/0xbitcoinContractQR.png'






import Vue from 'vue'

import AlertRenderer from './alert-renderer'
import HomeRenderer from './home-renderer'
import SearchRenderer from './search-renderer'
import AccountRenderer from './account-renderer'
import TransactionRenderer from './transaction-renderer'

import Navbar from './navbar'

import EthHelper from './ethhelper'

import SearchHelper from './search-helper'



var homeRenderer= new HomeRenderer()
var searchRenderer= new SearchRenderer()
var accountRenderer= new AccountRenderer()
var transactionRenderer= new TransactionRenderer()

var alertRenderer = new AlertRenderer();
var ethHelper = new EthHelper();
var navbar = new Navbar();

var searchHelper = new SearchHelper();



var pjson = require('../../../package.json');




var navbarComponent = new Vue({
  el: '#navbar',
  data: {
    jumboLogo: jumboLogo,
    githubLogo: githubLogo,
    redditLogo: redditLogo,
    contractQR: contractQR,
    projectVersion: pjson.version
  }
})


$(document).ready(function(){



    var web3 = ethHelper.init( alertRenderer);


    if($('#home').length > 0)
    {
      homeRenderer.init(ethHelper, web3);
    }

    if($('#search').length > 0)
    {
      searchRenderer.init(ethHelper, web3);
    }

    if($('#account').length > 0)
    {
      accountRenderer.init(ethHelper, web3);
    }

    if($('#transaction').length > 0)
    {
      transactionRenderer.init(ethHelper, web3);
    }



    navbar.init();

    searchHelper.init();



});


//dashboardRenderer.hide();
