const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const  rp = require('request-promise')
const Stellar = require('stellar-sdk')
const MongoClient = require('mongodb').MongoClient;


const port = parseInt(process.env.HTTP_PORT) || 4321;
const app = express()

//mongodb
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'stellar';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Global Vars */
const server = new Stellar.Server('https://horizon-testnet.stellar.org')
Stellar.Network.useTestNetwork()


/* Stellar Interactions */
const createAccount = async (req, res) => {  
  	// Create Account and request balance on testnet
  	//get random keypair
  	console.log('req body :',req.body)
  	let pair = Stellar.Keypair.random()    
	  let account = null  	
  	console.log('public key :', pair.publicKey())
	  try{
      await rp.get({
        uri: 'https://friendbot.stellar.org',
        qs: { addr: pair.publicKey() },
        json: true
      })  
    }catch(err){
      console.log('ada error : ', err)
    }    
	account = await server.loadAccount(pair.publicKey()) // Load newly created account
	console.log('account :', account);
	// Print balances at account.balances[0].balance
	console.log('\nBalances for account: ' + pair.publicKey())
	account.balances.forEach((balance) => {
  	console.log('Type:', balance.asset_type, ', Balance:', balance.balance)
	})
	
	// write object to json file (only for dump purpose)  
	var jsonObj = {
		'account_name':req.body.account_name, 
		'password':req.body.password,
		'stellar_keypair':pair,
    'stellar_public_key':pair.publicKey(),
		'stellar_acct_properties':account
	}
	

  MongoClient.connect(url, function(err, client) {  
    if (err) {
      return res.send("error creating account ! " + err)
    }
    const db = client.db(dbName);  
    db.collection("user").insertOne(jsonObj, function(err, result) {
      client.close();
    });
    return res.send(jsonObj)
  });
}

const getAccount = (req,res) => {

  MongoClient.connect(url, function(err, client) {  
    if (err) {
      return res.send("error get account ! " + err)
    }
    const db = client.db(dbName);
    var accountName = req.body.account_name;
    var password = req.body.password;
    var query ={ $and :[{account_name:accountName},{password:password}]}

    var status = '';
    var data =null;
    var responseObject ={};

    db.collection("user").findOne(query, function(err, result) {      
      if(result !== null){              
        status = 'OK';
        data = result;
      }else{
        status ='ERROR';
        data = "No specified user found";
      }

      responseObject['status'] = status;
      responseObject['data'] = data;
      console.log(responseObject)      
      res.send(responseObject)
      client.close();
    });      
  });
}


/* Initiate payment from acc A to acc B */
const makePayment = async (req, res) => {
  
  var senderAccount = await server.loadAccount(req.body.sender.stellar_key) 
  var receiverAccount = await server.loadAccount(req.body.receiver.stellar_key)

  const transaction = new Stellar.TransactionBuilder(senderAccount)
    .addOperation(Stellar.Operation.payment({
      destination: receiverAccount.stellar_public_key,
      asset: Stellar.Asset.native(),
      amount: req.body.sender.tx_amount
    }))
    
    .build()

  transaction.sign(req.body.sender.stellar_keypair)

  // Let's see the XDR (encoded in base64) of the transaction we just built
  console.log("\nXDR format of transaction: ", transaction.toEnvelope().toXDR('base64'))

  var status = '';
  var data =null;
  var responseObject ={};
  try {
    const transactionResult = await server.submitTransaction(transaction)
    status = 'OK';
    data = transactionResult;        
    res.send("Transaction successful!")
  } catch (err) {
    status = 'ERROR';
    data = err;                
  }
  responseObject['status'] = status;
  responseObject['data'] = data;
  console.log(responseObject)      
  res.send(responseObject)  
}

/* Retrieve transaction history for AccountA */
const getHistory = async (req, res) => {
  // Retrieve latest transaction
  let historyPage = await server.transactions()
    .forAccount(accountA.accountId())
    .call()

  console.log(`\n\nHistory for public key ${pairA.publicKey()} with accountID ${accountA.accountId()}:`)
  
  // Check if there are more transactions in history
  // Stellar only returns one (or more if you want) transaction
  let hasNext = true
  while(hasNext) {
    if(historyPage.records.length === 0) {
      console.log("\nNo more transactions!")
      hasNext = false
    } else {
      // Print tx details and retrieve next historyPage
      console.log("\nSource account: ", historyPage.records[0].source_account)
      let txDetails = Stellar.xdr.TransactionEnvelope.fromXDR(historyPage.records[1].envelope_xdr, 'base64')
      
      txDetails._attributes.tx._attributes.operations.map(operation => console.log(`Transferred amount: ${operation._attributes.body._value._attributes.amount.low} XLM`))
      historyPage = await historyPage.next()
    }
  }

  res.send("History retrieved successful!")
}

/* CORS */
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type')

  // Pass to next layer of middleware
  next()
})

/* API Routes */
app.post('/createAccount', createAccount)
app.post('/getAccount', getAccount)
app.post('/payment', makePayment)
app.get('/getHistory', getHistory)

/* Serve API */
var instance = app.listen(port, () => {
  console.log(`Stellar test app listening on port ${port}!`)
})