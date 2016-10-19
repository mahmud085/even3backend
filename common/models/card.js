var loopback = require('loopback');
var app = module.exports = loopback();
var paystackSkeyTest = require('../../server/url').paystackSkeyTest ;
var stripeSkeyTest = require('../../server/url').stripeSkeyTest ;

var stripe = require("stripe")(stripeSkeyTest);
var paystack = require('paystack')(paystackSkeyTest);


module.exports = function(Card) {

Card.addcard = function(data,cb){

	console.log("Card Info =",data.req.body);

	var gateway = data.req.body.gateway;
	var AccountId = data.req.body.AccountId;
	
	if(gateway === "stripe"){

		var token = data.req.body.stripeToken;
		var last4 = data.req.body.last4;


	    stripe.customers.create({
	       source: token // obtained with Stripe.js
	    }, 
	    function(err, customer) {
	      	//console.log("Customer = ",customer);
	      	if(err){
	      		console.log("Token Error =",err.message);
	      		cb(null,err.message);
	      	}
	      	else if(customer === null)
	      	{
	      		cb(null,"Something went wrong creating customer!");
	      	}
	      	else{
		      	Card.app.models.Card.create({
			    	customerRefNum : customer.id ,
			    	last4 : last4,
			    	gateway : gateway,
			        AccountId : AccountId
			    },function(err,card){
			      	if(err) throw err;
			        console.log("Create Card=",card);
			        cb(null,card);
			    });
	      	}
	     });
 	}
 	if(gateway === "paystack"){
 		var reference = data.req.body.reference;
		
		paystack.transaction.verify(reference,function(body,error) {
         	
         	body = JSON.parse(body);
          	//console.log("Verified Data =",body.data);
			var paystackAuth = body.data.authorization.authorization_code;
			var last4 = body.data.authorization.last4;
			
			Card.app.models.Card.create({
		    	paystackAuth : paystackAuth,
		    	last4 : last4,
		    	gateway : gateway,
		        AccountId : AccountId
		    },function(err,card){
		      	if(err) throw err;
		        console.log("Create Card=",card);
		        cb(null,card);
		    });
        });
 	
 	}
}

/*Payment via card*/


Card.cardpayment = function (data,cb) {

		console.log("charge data = ",data.req.body);
		// if(data.req.body.isTest==true)
		// var stripe = require("stripe")("sk_test_NvxNY3Ph9h2vqH9SAGOLdobD");
		// else
		// var stripe = require("stripe")("sk_live_rppF6b0bLRS5sh0zFDXK1njt");
		var gateway = data.req.body.gateway;
		if(gateway === "stripe"){
			var customerRefNum = data.req.body.customerRefNum;
			var charge = stripe.charges.create({
			  amount: data.req.body.amount, 
			  currency: data.req.body.currency,
			  customer: customerRefNum,
			  description: data.req.body.description
			}, function(err, charge) {
				console.log(err);
			  if(charge)
			  	cb(null, {"payment" : charge });
			  else
			  	cb(err);
			});
		}
		if(gateway === "paystack"){
			var paystackAuth = data.req.body.paystackAuth;
			var email = data.req.body.email;
			var amount = data.req.body.amount;
			paystack.transaction.charge({
				authorization_code : paystackAuth,
				email : email,
				amount : amount
			},function(err,charge){
				console.log(err);
			    if(charge)
			  	   cb(null, {"payment" : charge });
			    else
			  	   cb(err);
			});

		}

}

Card.remoteMethod(
        'cardpayment',
        {
          accepts:{ arg: 'data', type: '[object]', http: { source: 'context' } },
              
          returns:{
           arg: 'message', type: 'string', root: true
          },

          http: {verb: 'post'}

        });
Card.remoteMethod(
        'addcard',
        {
          accepts:{ arg: 'data', type: 'object', http: { source: 'context' } },
              
          returns:{
           arg: 'message', type: 'string', root: true
          },

          http: {verb: 'post'}

    });
}
