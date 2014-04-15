module.exports = function(app, express, multer){

	app.configure(function() {
	
		var RedisStore = require('connect-redis')(express);
		
		app.use(express.static(__dirname + '/../client_modules')); 		// set the static files location /public/img will be /img for users
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(multer({
			dest: './uploads/',
			rename: function(fieldname, filename) {
			return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
			},
			limits: {
				fileSize: 100000,
			},
		}));
		//app.use(express.limit('4mb'));
		//app.use(express.bodyParser({uploadDir:'./uploads'}));	// pull information from html in POST
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