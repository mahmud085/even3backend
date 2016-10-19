module.exports = function(Installation) {


	Installation.beforeRemote('create', function(ctx, unused, next) {

		Installation.app.models.Application.find(function(err,result){

			ctx.args.data.appId=result[0].id;
			next();
		});

	});

};
