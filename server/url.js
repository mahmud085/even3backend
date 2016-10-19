var loopback = require('loopback');
var app = module.exports = loopback();
module.exports.baseUrl = "http://api.even3app.com";
//module.exports.baseUrl = "localhost:3000";
module.exports.webUrl = "http://even3app.com";
module.exports.emailFrom = "admin@even3app.com";
module.exports.verifyHost = "api.even3app.com";

module.exports.paystackSkeyTest = 'sk_test_b9556c4e0c92ee6b485d1c1d50ae839b51296925';
module.exports.stripeSkeyTest = 'sk_test_Bq7mNSro7mxzeJrrfLb2SIPg';