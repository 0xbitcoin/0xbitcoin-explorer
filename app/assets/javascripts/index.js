
const $ = require('jquery');

import jumboLogo from '../img/0xbitcoin-logo-white.png'
import githubLogo from '../img/GitHub-Mark-64px.png'
import redditLogo from '../img/reddit-mark-64px.png'
import contractQR from '../img/0xbitcoinContractQR.png'






import Vue from 'vue'

import AlertRenderer from './alert-renderer'
import HomeRenderer from './home-renderer'

import Navbar from './navbar'

import EthHelper from './ethhelper'

import SearchHelper from './search-helper'

import HomeDashboard from './home-dashboard'


var homeRenderer= new HomeRenderer()

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

      homeRenderer.init(ethHelper, web3);

      console.log('load free shift')
  //  wallet.init(alertRenderer,ethHelper);

    navbar.init();

    searchHelper.init();



});


//dashboardRenderer.hide();
