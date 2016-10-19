var CONTAINERS_URL = '/containers/';
var fs = require('fs');
var path = require('path');
var loopback = require('loopback');
var app = loopback();
module.exports = function(EventComment) {

	/* add a comment to an event */

	EventComment.addcomment = function(ctx, options, cb) {
		if (!options)
			options = {};
		ctx.req.params.container = 'eventcommentpic';
		EventComment.app.models.container.upload(ctx.req, ctx.result, options, function(err, fileObj) {
			if (err)
				cb(null, err);
			if (fileObj.files.hasOwnProperty('file')) {

				var fileInfo = fileObj.files.file[0];

				if (fileObj.fields.hasOwnProperty("CommentBody"))
					var CommentBody = fileObj.fields.CommentBody[0];

				if (fileObj.fields.hasOwnProperty("EventId"))
					var EventId = fileObj.fields.EventId[0];

				if (fileObj.fields.hasOwnProperty("BusinessId"))
					var BusinessId = fileObj.fields.BusinessId[0];

				if (fileObj.fields.hasOwnProperty("Id"))
					var Id = fileObj.fields.Id[0];

				if (fileObj.fields.hasOwnProperty("Time"))
					var Time = fileObj.fields.Time[0];

				//var Commenter =JSON.parse(JSON.stringify(ctx.req.accessToken.userId));

				// create an event comment  

				EventComment.create({
					CommentBody: CommentBody,
					EventId: EventId,
					BusinessId: BusinessId,
					AccountId: Id,
					Time: Time
				}, function(err, eventcomment) {
					if (err) {
						cb(null, err); 
                        console.log("post comment error = " + err);
                    }
					console.log(fileInfo.name);
					var fileCurrentPath = './server/storage/eventcommentpic' + '/' + fileInfo.name;
					newFilePath = './server/storage/eventcommentpic' + '/' + eventcomment.id + '.jpg';
					fs.rename(fileCurrentPath, newFilePath, function(err) {
						if (err) throw err;
						//console.log('renamed complete');
					});
					eventcomment.CommentPicture = CONTAINERS_URL + fileInfo.container + '/download/' + eventcomment.id + '.jpg';
					eventcomment.save();
                    console.log("post comment success = " + eventcomment);
					cb(null, eventcomment);
				});
			} else {
				if (fileObj.fields.hasOwnProperty("CommentBody"))
					var CommentBody = fileObj.fields.CommentBody[0];

				if (fileObj.fields.hasOwnProperty("EventId"))
					var EventId = fileObj.fields.EventId[0];

				if (fileObj.fields.hasOwnProperty("BusinessId"))
					var BusinessId = fileObj.fields.BusinessId[0];

				if (fileObj.fields.hasOwnProperty("Id"))
					var Id = fileObj.fields.Id[0];

				if (fileObj.fields.hasOwnProperty("Time"))
					var Time = fileObj.fields.Time[0];
				EventComment.create({
					CommentBody: CommentBody,
					EventId: EventId,
					BusinessId: BusinessId,
					AccountId: Id,
					Time: Time
				}, function(err, eventcomment) {
					if (err) {
						cb(null, err);
                        console.log("post comment error = " + err);
                    } else {
                        console.log("post comment success = " + eventcomment);
                        cb(null, eventcomment);
                    }
				});
			}
		});

	};

	/* after remote method for add comment. it will execute after creating an event comment 
		find the owner of the corresponding event or business and send them notification if
		anyone comments */

	EventComment.afterRemote('addcomment', function(ctx, data, done) {

		console.log(data);

		if (data.EventId === undefined) {
			EventComment.app.models.Business.find({
				where: {
					'id': data.BusinessId
				}
			}, function(err, business) {
				if (!business[0])
					done();
				if (business[0]) {
                    var message = {
							BusinessId: data.BusinessId,
							name : business[0].Name,
							creator : business[0].AccountId,
							event : false
						}
                        
						EventComment.app.models.Account.find({
							where: {
								'id': data.AccountId
							}
						}, function(err, acnt) {
							if (acnt[0]) {
                               
                                if (String(data.AccountId) == String(business[0].AccountId)) {
                                   console.log("comment from owner");
                                } else {
                                    message.text = 'New comment from ' + acnt[0].FirstName + " in " + business[0].Name ;
                                    EventComment.app.models.Push.sendNotification(business[0].AccountId, message);
                                }
                            }
						});
                }
					
			});
		} else {
			
            EventComment.app.models.Event.find({
				where: {
					'id': data.EventId
				}
			}, function(err, event) {
				if (!event[0])
					done();
				
                var message = {
					EventId: data.EventId,
					name : event[0].Name,
					creator : event[0].AccountId,
                    event : true
				}
				
                EventComment.app.models.Account.find({
					where: {
                        'id': data.AccountId
					}
				}, function(err, acnt) {
					 if (acnt[0]) {
                         if (String(data.AccountId) == String(event[0].AccountId)) {
                              console.log("comment from owner");
                         } else {
                              message.text = 'New comment from ' + acnt[0].FirstName + " in " + event[0].Name ;
                              EventComment.app.models.Push.sendNotification(event[0].AccountId, message);
                         }
                     }			
				});
			});
		}
        
        done();
	});


	EventComment.remoteMethod(
		'addcomment', {
			http: {
				verb: 'post'
			},
			description: 'Uploads a file',
			accepts: [{
				arg: 'ctx',
				type: 'object',
				http: {
					source: 'context'
				}
			}, {
				arg: 'options',
				type: 'object',
				http: {
					source: 'query'
				}
			}],
			returns: {
				arg: 'fileObject',
				type: 'object',
				root: true
			}
		}
	);



};