module.exports = function(app, express, busboy, subdomain){

	app.configure(function() {
	
		var RedisStore = require('connect-redis')(express);
		
		
		app.use(express.static(__dirname + '/../client_modules')); 		// set the static files location /public/img will be /img for users
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(subdomain({ base : 'dutnoticeboard.co.za', removeWWW : true }));
		app.use(busboy({
			highWaterMark: 2 * 1024 * 1024,
			limits: {
			fileSize: 10 * 1024 * 1024 * 1024 * 1024
			}
		}));
		app.use(express.json());
		app.use(express.urlencoded());
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