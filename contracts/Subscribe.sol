pragma solidity ^0.5;

contract Subscribe {
	
	//Store customer accounts that have subscription
	mapping(address => bool) public customers;
	
	//Store  customer count
	uint private customerCount;

	//Subscribe event
	event subscribedEvent (address indexed _customerId);

	constructor() public {
		
		customerCount = 0;
	
	}

	

	function getSubscriptionStatus(address _customerId) public view returns(bool) {

		if (customers[_customerId]) {
			return true;
		} else {
			return false;
		}
		
	}

	function getCustomerCount() public view returns(uint){

		
		return customerCount;

	}

	function performSubscription() public returns(bool sufficient){

		//Require that customer haven't subscribed yet
		if(customers[msg.sender]) return false;

		customerCount++	;	
		customers[msg.sender] = true;

		emit subscribedEvent(msg.sender);

		return true;	

	}

	
}
