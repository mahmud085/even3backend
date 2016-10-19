var loopback = require('loopback');
var boot = require('loopback-boot');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var app = module.exports = loopback();
var loggedIn = false;


var paystackSkeyTest = require('./url').paystackSkeyTest ;
var stripeSkeyTest = require('./url').stripeSkeyTest ;

var stripe = require("stripe")(stripeSkeyTest);
var paystack = require('paystack')(paystackSkeyTest);
// uuid module is required to create a random reference number
var uuid = require('node-uuid');



app.middleware('initial', bodyParser.urlencoded({ extended: true }));


var Notification = app.models.notification;
var Application = app.models.application;
var PushModel = app.models.push;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function register() {
  app.models.application.register('even3appdeveloper',
    'even3app', {
      description: 'LoopBack Push Notification Demo Application',
      pushSettings: {
        apns: {
          pushOptions: {},
          feedbackOptions: {
            batchFeedback: true,
            interval: 300
          }
        },
        gcm: {
          serverApiKey: 'AIzaSyApKoyaRxr-59rV0fKvb-8YBW9a8-95YS8'
        }
      }
    },
    function(err, app) {
      console.log(app);
    }
  );
}

function prepareForPush() {

app.models.application.find(function(err, result) {
     if (err)
          return;
     if (result[0])
          return;
     else
      register();
  });

};
function isAuthenticated(req,res,next){
  console.log("user ",loggedIn);
    if (loggedIn)
        return next();
      res.redirect('/');

}
app.get('/',function(req,res){
  
  res.render('login.ejs',{
    showErr : 'hidden',
    err_msg : ''
  });
});
app.post('/login',function(req,res){
  console.log('Body ',req.body);
  var username = req.body.username;
  var pass = req.body.pass;
  app.models.admin.login(
    {
      username: username,
      password: pass
    }, 
    function (err, token) {
     //console.log(token.id);
     if(err) {
      res.render('login.ejs',{
        showErr : 'visible',
        err_msg : 'Incorrect Username or Email'
      });
     }
      else {
        loggedIn = true;
        res.redirect('/newsletter');
      }
   });
});
app.get('/user',isAuthenticated,function(req,res){
    app.models.Account.find(function(err,user){
        if(err)console.log("Users Not found !");
        else {

            res.render('user.ejs',{
              users : user
            });
        }
    });

});
app.get('/newsletter',isAuthenticated,function(req,res){
    console.log("here");
        app.models.subscribers.find(function(err,result){
          //console.log("Subscribers = ",subscribers);
          if(err)console.log("Subscribers Not found !");
          else {
               app.models.Account.find({
                    where : {
                         "Newsletter" : true
                    }
               },function(err,user){
                    if(err)console.log("Users Not found !");
                    else {
                      console.log("users = ",user);
                         res.render('newsLetter.ejs',{
                            subscribers : result,
                            users : user
                         });
                    }
               });
          }
        });
});
app.get('/reset-password',function(req,res){
    var mail = '';
    for (var i = 0; i < req.query.token.length; i++)
    mail = mail + String.fromCharCode(req.query.token.charCodeAt(i) - 2);
    res.render('passreset.ejs',{
      email : mail
    });
});
app.get('/verified',function(req,res){
      var mail = '';
    for (var i = 0; i < req.query.user.length; i++)
    mail = mail + String.fromCharCode(req.query.user.charCodeAt(i) - 2);
      console.log("here verify ",mail);
      var name = "User";
       token = "undefined";
      app.models.Account.find({
        where: {
          'email': mail
        }
      }, 
      function(err, result) {
          if(err) throw err;
          else {
            if(result[0].tokenFromRef!==undefined)
            token = result[0].tokenFromRef;

            name = result[0].FirstName;
            
            console.log("result=",result[0].FirstName," token=",token);
            var myMessage = {username : result[0].FirstName }; 
 
            // prepare a loopback template renderer
            var renderer = loopback.template(path.resolve(__dirname, '../server/views/wcemail.ejs'));
            var html_body = renderer(myMessage);
            loopback.Email.send({
                  to: mail,
                  from: {email:'admin@even3app.com',name:"Even3"},
                  subject: "Welcome "+name,
                  text: "text",
                  html: html_body

            },
            function(err, result) {
                if (err) {
                    console.log('Something went wrong while sending email.');
                }
            
                if (result.message == 'success') {
                    console.log(result.message);
                }
            });

            app.models.Account.findOne({
              where: {
                tokenToRef: token
              }
            }, 
            function(err, result) {
                if(err) {
                  console.log("err=",err);
                  throw err;
                }
                if(!result){
                  console.log("Sorry we couldn't find your reference account");
                }
                else {
                  result.bonuspoint = result.bonuspoint + 10;
                  result.save();
                  var message = "You earn +10 bonus point. Earn more by inviting others.";
                  app.models.Push.sendNotification(result.id, message);
                  console.log("result=",result);
                }
            });
          }
      });
      //console.log("Token to Ref =",token);
      res.render('verified.ejs');
});

app.post('/admin/newsletter',function(req,res){
     console.log("Body = ",req.body);
     emailcontent = req.body.emailBody;
     selected = req.body.select;
     console.log("selected = ",selected);
     subject = req.body.subject;
     if(typeof selected !=='object'){
          app.models.Push.sendEmail(selected, subject, emailcontent);
     }else{
          for(i=0;i<selected.length;i++)
          app.models.Push.sendEmail(selected[i], subject, emailcontent);
     }
     res.render('success.ejs');
});
app.get('/delete/:id',function(req,res){
  console.log("id = ",req.params.id);
    app.models.Event.destroyAll({
        AccountId : req.params.id
      },
      function(err,result){
      if(err) console.log("Error ",err);
      else
      {
        console.log("Success ",result);
      }
    });
    app.models.Business.destroyAll({
        AccountId : req.params.id
      },
      function(err,result){
      if(err) console.log("Error ",err);
      else
      {
        console.log("Success ",result);
      }
    });
    app.models.Account.destroyAll({
        id : req.params.id
      },
      function(err,result){
      if(err) console.log("Error ",err);
      else
      {
        console.log("Success ",result);
      }
    });
        res.redirect('/user');
});
app.get('/card',function(req,res){
    res.render('paystack.ejs');
});
app.post('/card1',function(req,res){
  //console.log("id",req.body.token.id);
  console.log("request body = ", req.body);
  // // var cardnumber = req.body.cardnumber ;
  // // var cvc = req.body.cvc ;
  // // var month = req.body.month ;
  // // var year = req.body.year ;
    // var token = req.body.token,
    //     email = req.body.email,
    //     amount = req.body.amount;
    //     var ref = uuid.v1();
    //     console.log("ref = ",ref);
    //     paystack.transaction.initialize({
    //       email:     email,        // a valid email address
    //       amount:    amount, // only kobo and must be integer
    //        reference: ref 
    //     },function(error, body) {
    //       //res.send({error:error, body:body});
    //       console.log("body = ",body.data);
            paystack.transaction.verify(req.body.reference,function(body,error) {
              console.log("Verify ",body);
              res.json(body);
            });
    //     });

//     paystack.transaction.chargeToken({
//       token:     token,        // token sent by mobile app, to be generated by mobile app
//       email:     email,        // a valid email address
//       amount:    amount, // only kobo and must be integer
//       reference: uuid.v1()     // time-based uuid
//     },function(error, body) {
//        res.send({error:error, body:body});
//      });
  

});
app.get('/logout',function(req,res){
  loggedIn = false;
  res.redirect('/');

});
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
    prepareForPush();
  });
};

boot(app, __dirname, function(err) {

  if (err) throw err;
  if (require.main === module)
    app.start();
});