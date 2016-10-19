var loopback = require('loopback');
var app = loopback();

module.exports = function(Push) {

    /* SEND NOTIFICATION TO USER */
    Push.sendNotification = function (userId, message) {
        console.log('sendNotification > to : ' + userId + " , message = " + message);
        if (!userId) {
            return ;
        }
        
        Push.app.models.Installation.find({
            where : {"userId" : userId}
        }, function (error, devices) {
            if (!error) {
                console.log('devices installed count = ' + devices.length);
                if (devices.length > 0) {
                    var notification = Push.app.models.Notification;
                    var note = new notification({
                            expirationInterval: 3600, // Expires 1 hour from now.
                            badge: 1,
                            sound: 'ping.aiff',
                            message: message ,
                            messageFrom: 'Even3'
                    });
                    
                    Push.notifyById(devices[0].id, note, function (err) {
                        if (err) {
                            console.error('Cannot notify %j: %s', userId, err.stack);
                            return;
                        }
                        console.log('push payload = ' + JSON.stringify(note));
                        console.log('pushing notification to %j', userId);
                    });
                }
            } else {
                console.log("push installation error = " + error);
            }
        });   
    }

      /* SEND MAIL TO USER */

    Push.sendEmail = function (email, subject, message) {
        loopback.Email.send({
            to: email,
            from: {email:'admin@even3app.com',name:"Even3"},
            subject: subject,
            text: "",
            html: message
          }, function(err, result) {
                if (err) {
                    console.log("Error = ",err);
                    console.log('Something went wrong while sending email.');
                } else {
                    console.log('mail sent to ' + email);
                }
          });
    }
    
    /* send push notification */

    Push.sendpush = function (data, cb) {
        var userId = data.req.body.userId ;
        var message = data.req.body.message ;
        
        if (userId === undefined) {
            return ;
        }
        
        Push.sendNotification(userId, message);
        cb(null, {status : 'success'});
    }
    
    Push.remoteMethod(
        'sendpush', {
            http: {
                path: '/sendpush',
                verb: 'post'
            },
            accepts: {
                arg: 'data',
                type: 'object',
                http: {
                    source: 'context'
                }
            },
            returns: {
                arg: 'res',
                type: 'object',
                'http': {
                    source: 'res'
                }
            }
        });
    
};