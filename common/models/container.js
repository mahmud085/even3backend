var loopback = require('loopback');
var app = loopback();
var fs = require('fs');

module.exports = function(Container) {

	Container.beforeRemote('upload', function(context, user, next) {
		next();
	});



	Container.afterRemote('upload', function(context, affectedInstance, next) { 

		var account = Container.app.models.Account;
		var container = affectedInstance.result.files.file[0].container;
		var newFilePath;

		if(container=='profilepic') {   
			if(affectedInstance.result.files.hasOwnProperty('file'))
			var fileName  = affectedInstance.result.files.file[0].name; 
			if(affectedInstance.result.fields.hasOwnProperty('FirstName'))
			var FirstName= affectedInstance.result.fields.FirstName[0];
			if(affectedInstance.result.fields.hasOwnProperty('LastName'))
			var LastName = affectedInstance.result.fields.LastName[0];
			if(affectedInstance.result.fields.hasOwnProperty('email'))
			var Email = affectedInstance.result.fields.email[0];
			if(affectedInstance.result.fields.hasOwnProperty('password'))
			var Password = affectedInstance.result.fields.password[0];
		    if(affectedInstance.result.fields.hasOwnProperty('Newsletter'))
			var Newsletter = affectedInstance.result.fields.Newsletter[0];
		    if(affectedInstance.result.fields.hasOwnProperty('FacebookID'))
			var FacebookID = affectedInstance.result.fields.FacebookID[0];
		    if(affectedInstance.result.fields.hasOwnProperty('GoogleID'))
			var GoogleID = affectedInstance.result.fields.GoogleID[0];			
		    if(affectedInstance.result.fields.hasOwnProperty('SavedBusiness'))
			var SavedBusiness = affectedInstance.result.fields.SavedBusiness[0];	
		    if(affectedInstance.result.fields.hasOwnProperty('EmailNotification'))
			var EmailNotification = affectedInstance.result.fields.EmailNotification[0];	
		    if(affectedInstance.result.fields.hasOwnProperty('PushNotification'))
			var PushNotification = affectedInstance.result.fields.PushNotification[0];	

			account.create({
				FirstName:FirstName,
				LastName:LastName,
				email:Email,
				password:Password,
				UserPicture:fileName,
				Newsletter:Newsletter,
				FacebookID:FacebookID,
				GoogleID:GoogleID,
				SavedBusiness:SavedBusiness,
				EmailNotification:EmailNotification,
				PushNotification:PushNotification
			}, function(err,ant) {
				console.log(err);
				if(err)
				next();

				var fileCurrentPath= './server/storage/'+container+'/'+fileName;
				newFilePath='./server/storage/'+container+'/'+ant.id+'.jpg';

				fs.rename(fileCurrentPath, newFilePath, function (err) {
		        if (err) throw err;
		        //console.log('renamed complete');
		        });

				ant.UserPicture=newFilePath;
				ant.save();
				
				var res= JSON.parse(JSON.stringify(ant));
		  		context.result={
		  			data:res
		  		}

  				next();
  	});


}
		

		if(container=='eventpic')
		{   
			var event = Container.app.models.Event;

			if(affectedInstance.result.files.hasOwnProperty('file'))
			var fileName  = affectedInstance.result.files.file[0].name;
			if(affectedInstance.result.fields.hasOwnProperty('Name'))
			var Name= affectedInstance.result.fields.Name[0];
			if(affectedInstance.result.fields.hasOwnProperty('StartDate'))
			var StartDate= affectedInstance.result.fields.StartDate[0];		
			if(affectedInstance.result.fields.hasOwnProperty('EndDate'))
			var EndDate= affectedInstance.result.fields.EndDate[0];			
			if(affectedInstance.result.fields.hasOwnProperty('LocationLat'))
			var LocationLat= affectedInstance.result.fields.LocationLat[0];	
			if(affectedInstance.result.fields.hasOwnProperty('LocationLong'))
			var LocationLong= affectedInstance.result.fields.LocationLong[0];		
			if(affectedInstance.result.fields.hasOwnProperty('Address'))
			var Address= affectedInstance.result.fields.Address[0];	

			if(affectedInstance.result.fields.hasOwnProperty('Id'))
			var Id = affectedInstance.result.fields.Id[0];	

			var fileCurrentPath= './server/storage/'+container+'/'+fileName;
			newFilePath='./server/storage/'+container+'/'+Id+'.jpg';

			fs.rename(fileCurrentPath, newFilePath, function (err) {
	        if (err) throw err;
	        //console.log('renamed complete');

	        });




		  	event.find({where:{"id":Id}},function(err,evnt){
		  		if(err)
		  			console.log(err);
		  		else
		  		{
		  			evnt[0].Name=Name;
		  			evnt[0].StartDate=StartDate;
		  			evnt[0].EndDate=EndDate;
		  			evnt[0].LocationLat=LocationLat;
		  			evnt[0].LocationLong=LocationLong;
		  			evnt[0].Address=Address;
		  			evnt[0].EventPicture=newFilePath;
		  			evnt[0].save();
		  		}
		  		context.result={
		  			data:evnt[0]
		  		}
		  	    next();
		  		});

		}



		if(container=='businesspic')
		{   
			var business = Container.app.models.Business;

			if(affectedInstance.result.files.hasOwnProperty('file'))
			var fileName  = affectedInstance.result.files.file[0].name;
			if(affectedInstance.result.fields.hasOwnProperty('Name'))
			var Name= affectedInstance.result.fields.Name[0];		
			if(affectedInstance.result.fields.hasOwnProperty('LocationLat'))
			var LocationLat= affectedInstance.result.fields.LocationLat[0];	
			if(affectedInstance.result.fields.hasOwnProperty('LocationLong'))
			var LocationLong= affectedInstance.result.fields.LocationLong[0];		
			if(affectedInstance.result.fields.hasOwnProperty('Address'))
			var Address= affectedInstance.result.fields.Address[0];	
			if(affectedInstance.result.fields.hasOwnProperty('Id'))
			var Id = affectedInstance.result.fields.Id[0];	
			if(affectedInstance.result.fields.hasOwnProperty('Description'))
			var Description = affectedInstance.result.fields.Description[0];	


			var fileCurrentPath= './server/storage/'+container+'/'+fileName;
			newFilePath='./server/storage/'+container+'/'+Id+'.jpg';

			fs.rename(fileCurrentPath, newFilePath, function (err) {
	        if (err) throw err;
	        //console.log('renamed complete');

	        });




		  	business.find({where:{"id":Id}},function(err,busnes){
		  		if(err)
		  			console.log(err);
		  		else
		  		{
		  			busnes[0].Name=Name;
		  			busnes[0].LocationLat=LocationLat;
		  			busnes[0].LocationLong=LocationLong;
		  			busnes[0].Address=Address;
		  			busnes[0].BusinessPicture=newFilePath;
		  			busnes[0].Description=Description;
		  			busnes[0].save();

		  		}
		  		context.result={
		  			data:busnes[0]
		  		}
		  	    next();
		  		});

		}


});


};