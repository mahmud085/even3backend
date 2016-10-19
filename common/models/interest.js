module.exports = function(Interest) {
Interest.remoteMethod(
	'userinterest',
	{
		http : {'verb':'post'},
		accepts : {'arg':'allinterests','type':'object'},
		returns : {'arg':'message','type':'string'}
	}

);

/* create and save user interests */

Interest.userinterest = function (allinterests,cb){
	
	userId = allinterests.AccountId;
	names = allinterests.names;
	len = names.length;

	console.log("all names = ",names);
	// for(i=0;i<len;i++){
	// 	(function(item){

			Interest.findOne({
				where : { 'AccountId' : userId }
			},function(err,result){
				if(err){
					console.log("Something wrong finding Interest!");
					throw err;
				}
				if(!result){
					var newInterest = {};
					// var users = [];
					// users.push({'AccountId':userId});
					newInterest.names = names;
					newInterest.AccountId = userId;
					Interest.create(newInterest,function(err,res){
						if(err){
							console.log("Not Able to create interest ",err);
							throw err;
						}
						else{
							console.log("successfull creation interest == ",res);
						}
					});
				}else{
					result.names = names;
					result.save();
					console.log("result = ",result);
				}
			});
	// 	})(i);
	// }
	cb(null,"successfull!");
}

};
