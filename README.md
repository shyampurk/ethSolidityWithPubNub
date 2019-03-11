

# PubNub Driven Smart Contract App with Ethereum

PubNub powered smart contract app with realtime transaction notification.

## Install Steps

### Step 0: Install Truffle suite

    npm install truffle

### Step 1: Install Ganache

### Step 2: Configure Ganache settings 

Check the settings for port number and network ID.
    
Port Number should be 8545

Network ID should be 666

Run Ganache

### Step 3: Install and deploy contracts

    npm install
  
    truffle compile
  
    truffle migrate --reset
  
    truffle migrate --network development

### Step 4: Run Server

    npm start
    
### Step 5: Open the app on browser

    http://localhost:3000
   
