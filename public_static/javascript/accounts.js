$(document).ready(function () {

	let  selectedAccount;

	let  currTemplate;

	var pubnub = new PubNub({
		    subscribeKey: "sub-c-4fea603a-3196-11e9-ae9a-6e31a7d5aca7",
		    publishKey: "pub-c-ba352f79-f9b4-4604-a9ec-34d7d02706e1",
		    ssl: true
	})

	pubnub.addListener({
        
        message: function(msg) {

            console.log(msg.message);

            changeScreen(activationTemplate, {
		           
				accountid: msg.message.transactionDetails.args._customerId,
				transCode: msg.message.transactionDetails.transactionHash
					           
			});

		    pubnub.unsubscribe({
    			channels: [selectedAccount.toLowerCase()]
			})
            
        },
       
    })      

	let confirmTemplate    = Handlebars.compile($("#confirm-template").html());
	let loadingTemplate    = Handlebars.compile($("#loading-template").html());
	let subscribedTemplate = Handlebars.compile($("#subscribed-template").html());
	let activationTemplate = Handlebars.compile($("#activation-template").html());

	$('#submit').click(function () {

	    selectedAccount = $('#acc-no').val();

	    if(selectedAccount != ""){

	    	changeScreen(loadingTemplate, { accountid: selectedAccount });

		    $("#submit").attr('disabled', 'disabled');

		    $.ajax({
		     	
	            url:'/getStatus',
		     	
		     	data: { "address": selectedAccount },
		     	
		     	dataType: 'json',
		     	
		     	success: function(response){

		     		if(response.accExists){
		     			
		     			if(!response.accSubs){
		     				
		     				changeScreen(confirmTemplate, { accountid: selectedAccount });
		     			
		     				pubnub.subscribe({
       						 
       						 	channels: [selectedAccount.toLowerCase()]
       						 
    						});		
		     			
		     			} else {
		     				
		     				changeScreen(subscribedTemplate, { accountid: selectedAccount });
		     				
		     			}

		     		} else {

		     			alert("Invalid Account : " + selectedAccount);
		     			document.location.reload();
		     		
		     		}
		     		
			    }  
		    });
	      

	    } else {

	      alert("Enter a valid account number");
	      document.location.reload();

	    }

	})

	$("body").on("click", "a", function(event){
	    
	    if(currTemplate == confirmTemplate){

	        $.post('/subscribe', {"address" : selectedAccount}, function (response) {
	      
	             console.log(response);

	        });

	        changeScreen(loadingTemplate, { accountid: selectedAccount });

	    }

	});

	$("body").on("click", "button", function(event){
	    
	    document.location.reload();

	});

	function changeScreen(template, paramObj){

		currTemplate = template;

	    let content = currTemplate(paramObj);

		$('.subscription-stage').html(content);

	}


})
