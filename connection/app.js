const contract = require('truffle-contract');
const Subscribe_artifact = require('../build/contracts/Subscribe.json');

var Subscribe = contract(Subscribe_artifact);
var PubNub = require('pubnub')

pubnub = new PubNub({
        publishKey : 'pub-c-ba352f79-f9b4-4604-a9ec-34d7d02706e1',
        subscribeKey : 'sub-c-4fea603a-3196-11e9-ae9a-6e31a7d5aca7'
    })

module.exports = {
  start: function(callback) {
    var self = this;

    self.account = self.web3.eth.accounts[0]


    // Bootstrap the MetaCoin abstraction for Use.
    Subscribe.setProvider(self.web3.currentProvider);

    //Set up listened for Subscription  events
     Subscribe.deployed().then(function(instance) {
      
      instance.subscribedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("New Subscribe transaction ", event);
        console.log("For Account Id ", event.args._customerId);
        
        pubnub.publish(
          {

              message: { 
                          transactionDetails : event 
                       },

              channel: event.args._customerId,
               

          }, 
          function (status, response) {
              if (status.error) {
                  // handle error
                  console.log(status)
              } else {
                  console.log("message Published w/ timetoken", response.timetoken)
              }
        });

      });

    });

   
  },
  getSubsStatus: function(account, callback) {

    var self = this;
    self.subscriptionFlag = false;

    var accExists = false;

    for(var accNum = 0; accNum < self.web3.eth.accounts.length;accNum++ ){

      if(account.toLowerCase() == self.web3.eth.accounts[accNum].toLowerCase() ){
        accExists = true;
        break
      }
    }

    Subscribe.setProvider(self.web3.currentProvider);

    var status;
    

    Subscribe.deployed().then(function(instance) {
      
      status = instance.getSubscriptionStatus(account, {from: account});
      
      status.then(function(value){

          self.subscriptionFlag = value.valueOf();
          console.log("Subscription Flag " + self.subscriptionFlag);
          callback({ 
                "accExists" : accExists,
                "accSubs"   : self.subscriptionFlag
          });


      }).catch(function(e) {
        console.log(e);
        callback("Error 404");
      });    

    });

  },
  
  getCustCount: function(callback) {

    var self = this;

    Subscribe.setProvider(self.web3.currentProvider);

    var count;
    Subscribe.deployed().then(function(instance) {
      count = instance;
      return count.getCustomerCount();
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });

  },

  SubscribeTransaction: function(address , callback) {
    var self = this;
    
    console.log("**** Inside SubscribeTransaction ***")
    console.log(address)

    Subscribe.setProvider(self.web3.currentProvider);

    var trans;
    Subscribe.deployed().then(function(instance) {
      trans = instance;
      return trans.performSubscription( {from: address});
    }).then(function() {
      console.log("under then")
      self.getCustCount(function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
}
