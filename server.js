const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getStatus', (req, res) => {
  console.log("**** GET /getStatus ****");
  console.log(req.query);

  let currentAcount  = req.query.address;
  truffle_connect.getSubsStatus(currentAcount,function (answer) {
    res.send(answer);
  })
});


app.get('/getCount', (req, res) => {
  console.log("**** GET /getCount ****");
  truffle_connect.getCustCount( (answer) => {
    res.send(answer);
  })
});

app.post('/subscribe', (req, res) => {
  console.log("**** POST /subscribe ****");
  

  
  let add  = req.body.address;
  
  truffle_connect.SubscribeTransaction(add, (status) => {
    res.send(status);
  });
});



app.listen(port, () => {

  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));



   truffle_connect.start(function(status) {
    console.log(status);
  });

  console.log("Express Listening at http://localhost:" + port);

});
