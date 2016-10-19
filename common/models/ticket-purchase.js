var loopback = require('loopback');
var app = loopback();

module.exports = function(TicketPurchase) {

TicketPurchase.afterRemote('create',function(ctx,data,done){
	console.log(ctx.args);
	
	var i=1,count=0;

	for( i =1;i<=data.Purchased;i++)
	{
		TicketPurchase.app.models.TicketPurchaseDetail.create({
			Consumed:false,
			TimeOfPurchase:ctx.args.data.TimeOfTicket,
			AccountId:ctx.args.data.AccountId,
			TicketPurchaseId:data.id,
			EventId:ctx.args.data.EventId
		},function(err,result){
			count++;
			console.log('It worked');
			console.log(result);
				if(count==data.Purchased)
           		done();
		});
	}


	//done();
});


};
