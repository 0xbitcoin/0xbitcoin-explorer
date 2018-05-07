### 0xBitcoin Explorer

A block explorer website that shows all transactions and accounts related to 0xbitcoin.  


#### How it works 

A geth --light node will run on the server.  Rails 5.2 in --api only mode will manage the backend database + api for the static frontend.   This database is Postgresql + redis.  
