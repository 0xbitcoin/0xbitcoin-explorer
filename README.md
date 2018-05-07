### 0xBitcoin Explorer

A block explorer website that shows all transactions and accounts related to 0xbitcoin.  


#### How it works 

A geth --light node will run on the server.  Rails 5.2 in --api only mode will manage the backend database + api for the static frontend.   This database is Postgresql + redis.  

The frontend will be static webpacked Vue.js + Html + SASS out of the /public folder which will be able to serve the content dynamically through the local Rails actioncable api.
