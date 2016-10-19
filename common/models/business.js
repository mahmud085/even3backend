var CONTAINERS_URL = '/containers/';
var loopback = require('loopback');
var app = loopback();
var fs = require('fs');
var path = require('path');

var emailFrom = require('../../server/url').emailFrom ;

module.exports = function(Business) {

     /* edit a business*/

    Business.editbusiness = function (ctx,options,cb) {
        if(!options) options = {};
        ctx.req.params.container = 'businesspic';
      Business.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(err) {
                cb(null,err);
            } 
            if(fileObj.files.hasOwnProperty('file'))
             { 
                var fileInfo = fileObj.files.file[0];
                if(fileObj.fields.hasOwnProperty('Id'))
                    var Id=fileObj.fields.Id[0];
                if(fileObj.fields.hasOwnProperty('Name'))
                    var Name=fileObj.fields.Name[0];
                if(fileObj.fields.hasOwnProperty('LocationLat'))
                    var LocationLat=fileObj.fields.LocationLat[0];
                if(fileObj.fields.hasOwnProperty('LocationLong'))
                    var LocationLong=fileObj.fields.LocationLong[0];
                if(fileObj.fields.hasOwnProperty('Address'))
                    var Address=fileObj.fields.Address[0];                
                if(fileObj.fields.hasOwnProperty('Description'))
                    var Description=fileObj.fields.Description[0]; 
                if(fileObj.fields.hasOwnProperty('BusinessCategoryId'))
                    var categoryId=fileObj.fields.BusinessCategoryId[0]; 

                if (fileObj.fields.hasOwnProperty("Phone"))
                    var Phone = fileObj.fields.Phone[0];
                if (fileObj.fields.hasOwnProperty("email"))
                    var email = fileObj.fields.email[0];
                if (fileObj.fields.hasOwnProperty("Website"))
                    var Website = fileObj.fields.Website[0];
                if (fileObj.fields.hasOwnProperty("valid"))
                    var valid = fileObj.fields.valid[0];               

            var extensionType= fileInfo.type.split('/');
            var fileCurrentPath= './server/storage/businesspic'+'/'+fileInfo.name;
            newFilePath='./server/storage/businesspic'+'/'+Id+'.'+extensionType[1];

            fs.rename(fileCurrentPath, newFilePath, function (err) {
            if (err) throw err;
            //console.log('renamed complete');
            });
            Business.find({where:{"id":Id}},function(err,busnes){
                if(err)
                    console.log(err);
                else
                {
                    busnes[0].Name=Name;
                    if (LocationLat && LocationLong) {
                        busnes[0].Location= new loopback.GeoPoint({lat: LocationLat, lng: LocationLong});
                    };
                    busnes[0].Address=Address;
                    busnes[0].BusinessPicture=CONTAINERS_URL+fileInfo.container+'/download/'+Id+'.'+extensionType[1];
                    busnes[0].Description=Description;
                    busnes[0].BusinessCategoryId = categoryId;
                    busnes[0].Phone = Phone;
                    busnes[0].email = email ;
                    busnes[0].Website = Website ;
                    busnes[0].valid = valid;
                    busnes[0].save();       
                }

            cb(null,busnes[0]);
                });
    }
     else
     {
                if(fileObj.fields.hasOwnProperty('Id'))
                    var Id=fileObj.fields.Id[0];
                if(fileObj.fields.hasOwnProperty('Name'))
                    var Name=fileObj.fields.Name[0];
                if(fileObj.fields.hasOwnProperty('LocationLat'))
                    var LocationLat=fileObj.fields.LocationLat[0];
                if(fileObj.fields.hasOwnProperty('LocationLong'))
                    var LocationLong=fileObj.fields.LocationLong[0];
                if(fileObj.fields.hasOwnProperty('Address'))
                    var Address=fileObj.fields.Address[0];                
                if(fileObj.fields.hasOwnProperty('Description'))
                    var Description=fileObj.fields.Description[0];  
                if(fileObj.fields.hasOwnProperty('BusinessCategoryId'))
                    var categoryId=fileObj.fields.BusinessCategoryId[0];

                if (fileObj.fields.hasOwnProperty("Phone"))
                    var Phone = fileObj.fields.Phone[0];
                if (fileObj.fields.hasOwnProperty("email"))
                    var email = fileObj.fields.email[0];
                if (fileObj.fields.hasOwnProperty("Website"))
                    var Website = fileObj.fields.Website[0];  
                if (fileObj.fields.hasOwnProperty("valid"))
                    var valid = fileObj.fields.valid[0];  

            Business.find({where:{"id":Id}},function(err,busnes){
                if(err)
                    console.log(err);
                else
                {
                    busnes[0].Name=Name;
                    if (LocationLat && LocationLong) {
                        busnes[0].Location= new loopback.GeoPoint({lat: LocationLat, lng: LocationLong});
                    };
                    busnes[0].Address=Address;
                    busnes[0].Description=Description;
                    busnes[0].BusinessCategoryId = categoryId;
                    busnes[0].Phone = Phone;
                    busnes[0].email = email ;
                    busnes[0].Website = Website ;
                    busnes[0].valid = valid;
                    busnes[0].save();       
                }
            cb(null,busnes[0]);
                });
     }
  });
};  

    /*create a new business*/

    Business.newBusiness = function(ctx,options,cb){

        if(!options) options = {};
        ctx.req.params.container = 'businesspic';
        Business.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(err) {
                cb(null,err);
            } else {
                var busnes={};
                
                if(fileObj.fields.hasOwnProperty('Name'))
                    var Name=fileObj.fields.Name[0];
                if(fileObj.fields.hasOwnProperty('LocationLat'))
                    var LocationLat=fileObj.fields.LocationLat[0];
                if(fileObj.fields.hasOwnProperty('LocationLong'))
                    var LocationLong=fileObj.fields.LocationLong[0];
                if(fileObj.fields.hasOwnProperty('Address'))
                    var Address=fileObj.fields.Address[0];                
                if(fileObj.fields.hasOwnProperty('Description'))
                    var Description=fileObj.fields.Description[0]; 
                if(fileObj.fields.hasOwnProperty('BusinessCategoryId'))
                    var categoryId=fileObj.fields.BusinessCategoryId[0]; 

                if (fileObj.fields.hasOwnProperty("Phone"))
                    var Phone = fileObj.fields.Phone[0];
                if (fileObj.fields.hasOwnProperty("email"))
                    var email = fileObj.fields.email[0];
                if (fileObj.fields.hasOwnProperty("Website"))
                    var Website = fileObj.fields.Website[0];
                if (fileObj.fields.hasOwnProperty("valid"))
                    var valid = fileObj.fields.valid[0]; 
                if (fileObj.fields.hasOwnProperty("AccountId"))
                    var accountId = fileObj.fields.AccountId[0]; 
                    
                busnes.Name = Name;
                if (LocationLat && LocationLong) {
                    busnes.Location= new loopback.GeoPoint({lat: LocationLat, lng: LocationLong});
                }
                busnes.Address=Address;
                busnes.Description=Description;
                busnes.BusinessCategoryId = categoryId;
                busnes.Phone = Phone;
                busnes.email = email ;
                busnes.Website = Website ;
                busnes.valid = valid; 
                busnes.AccountId = accountId;
                
                if(fileObj.files.hasOwnProperty('file')) { 
                    var fileInfo = fileObj.files.file[0];
                    var date=new Date();
                    var Id=date.getTime();
                    var extensionType= fileInfo.type.split('/');
                    var fileCurrentPath= './server/storage/businesspic'+'/'+fileInfo.name;
                    var newFilePath='./server/storage/businesspic'+'/'+Id+'.'+extensionType[1];

                    fs.rename(fileCurrentPath, newFilePath, function (err) {
                    if (err) {
                        throw err
                    } else {
                        busnes.BusinessPicture=CONTAINERS_URL+fileInfo.container+'/download/'+Id+'.'+extensionType[1];
                        Business.create(busnes,function(err,result){
                        if(err){
                            console.log(err);
                            throw err;
                        }else{
                            console.log("Result = ",result);
                            cb(null,result);
                        }
                    });
                    }
                  });
                } else {
                     Business.create(busnes,function(err,result){
                        if(err){
                            console.log(err);
                            throw err;
                        }else{
                            console.log("Result = ",result);
                            cb(null,result);
                        }
                    });
                }
            } 
        });
    };

    /*search a business by address and location longitude and latitude*/

    Business.search=function(data,cb){

        var response={};
        if(!data.req.body.Address&&data.req.body.LocationLat&&data.req.body.LocationLong)
        {
            Event.find({where:{"LocationLat":data.req.body.LocationLat,"LocationLong":data.req.body.LocationLong}},function(err,event){
                if(err)
                {
                    cb(null,err);
                }
                console.log(event);
                response=JSON.parse(JSON.stringify(event));
                cb(null,response);
            });

        }

        if(data.req.body.Address)
        {
            Event.find(function(err,event){

                if(err)
                {
                    cb(null,err);
                }

               var res=JSON.parse(JSON.stringify(event));
               var result=[];
               for(sample in res)
                {        
                            if(res[sample].hasOwnProperty('Address'))
                            if(res[sample].Address.toLowerCase().search(Address.toLowerCase())!=-1)
                                result.push(res[sample]);                        
                }
              
            cb(null,result);
                            
            })
        }

     

    };

    Business.afterRemote('newBusiness',function(context,business,next){
        Business.app.models.Account.find({
            where: {
                "id" : business.AccountId
            }
        },function(error,owner){

            if(error)
                console.log("error ",error);
            else{

                var myMessage = {username : owner[0].FirstName}; 
                // prepare a loopback template renderer
                var renderer = loopback.template(path.resolve(__dirname, '../../server/views/newBsnessWcEmail.ejs'));
                var html_body = renderer(myMessage);
                loopback.Email.send({
                    to: owner[0].email,
                    from: {email:emailFrom,name:"Even3"},
                    subject: "Thank You for Creating Your Business",
                    text: "text message",
                    html: html_body
                },
                function(err, result) {
                    if (err) {
                        console.log('Something went wrong while sending email.',err);
                        //cb(null,'Something went wrong while sending email.');
                    }else{
                        console.log("Success ",result);
                    }                    
                });        
            }
        });

        next();
    });

 Business.remoteMethod(
        'editbusiness',
        {  http: {verb: 'post'},
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} }
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            }
        }
    );

 Business.remoteMethod(
        'newBusiness',
        {  http: {verb: 'post'},
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} }
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            }
        }
    );

   Business.remoteMethod(
    'search',
    {
      http: {path: '/search', verb: 'post'},
      accepts: { arg: 'data', type: 'object', http: { source: 'context' } },

      /*[{ 
        arg: 'LocationLat', 
        type: 'number'
      },
      { 
        arg: 'LocationLong', 
        type: 'number'
      },
        { 
        arg: 'Address', 
        type: 'string'
      }
  ],*/
      returns: {arg: 'res', type: 'object', 'http': {source: 'res'}}
    }
  );

};
