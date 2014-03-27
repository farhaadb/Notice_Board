module.exports = function(app, express){

	app.configure(function() {
	
		var RedisStore = require('connect-redis')(express);
		
		app.use(express.static(__dirname + '/../client_modules')); 		// set the static files location /public/img will be /img for users
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(express.bodyParser()); 							// pull information from html in POST
		app.use(express.methodOverride()); 						// simulate DELETE and PUT
		app.use(express.cookieParser());
		app.use(express.session({ secret: 'password', 
            store: new RedisStore({
            host: '107.170.89.145',
            port: '6379'                                         
            })  
        }));
		app.use(app.router);
	});

};