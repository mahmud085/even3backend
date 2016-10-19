var CONTAINERS_URL = '/containers/';
var loopback = require('loopback');
var app = loopback();
var fs = require('fs');
var path = require('path');
var businessname = "";
var ownermail = "";

var webUrl = require('../../server/url').webUrl ;
var baseUrl = require('../../server/url').baseUrl ;
var emailFrom = require('../../server/url').emailFrom ;

module.exports = function(Rating) {

	Rating.afterSave = function(next){

		if(this.value >= 3){
			console.log("Rating Changed! "+this.value+" business "+this.BusinessId);
			BusinessId = this.BusinessId;
			Rating.app.models.Business.find({
					where :{
						'id':this.BusinessId
					}
			},function(err,bsnss){
				if(err) throw err;
				console.log(bsnss);
				businessname = bsnss[0].Name;
			});
			Rating.app.models.Account.find({
					where :{
						'id':this.AccountId
					}
			},function(err,accnt){
				if(err) throw err;
				console.log(accnt);
				this.BusinessId = BusinessId;
				this.ownermail = accnt[0].email;
				sendemail();
			});
		}
		next();
	}
	var sendemail =function(){
		var myMessage = {businessname : businessname,link : webUrl+'/#/business/'+this.BusinessId }; 
            // prepare a loopback template renderer
            var renderer = loopback.template(path.resolve(__dirname, '../../server/views/ratingkudos.ejs'));
            var html_body = renderer(myMessage);
            loopback.Email.send({
                  to: this.ownermail,
                  from: {email:emailFrom,name:"Even3"},
                  subject: "Rating Changed",
                  text: "text",
                  html: html_body

            },
            function(err, result) {
                if (err) {
                    console.log('Something went wrong while sending email.');
                }
            	else if (result.message == 'success') {
                    console.log(result.message);	
            	}

            });
	}
};
