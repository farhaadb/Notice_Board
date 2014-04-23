module.exports = function(app, pool, auth, dbquery, excelParser, fs, listDir, path){

	app.get("/", function(req, res){
		res.sendfile("login.html");
	});

	app.post("/login.html", function(req, res){
		dbquery.query(req, res, pool, "login");
	});
	
	app.get("/gettable.html", function(req, res) {
		dbquery.query(req, res, pool, "getNotices");
	});
	
	app.get('/app', auth, function(req,res){
		res.sendfile("app.html");
	});
	
	app.get('/excel', function(req,res){
		excelParser.parse({
		inFile: 'test.xlsx',
		worksheet: 1,
		skipEmpty: true,
		},function(err, records){
			if(err) console.error(err);
			console.log(records);
			res.send("Hello");
		});
		
	
	});
	
	app.get('/dir', function(req,res){
		listDir.walk(fs,__dirname+"/..", req, res);
	});
	
	app.get('/upload', function(req,res){
		res.sendfile("upload.html");
	});
	
	app.get('/subdomain/lecturer/upload', function(req,res){
		res.send("Worked");
	});
	
	app.post('/file-upload', function(req, res) {
	
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			
			var saveTo = path.resolve(__dirname, '..', fieldname, path.basename(filename));
			console.log(saveTo);
			file.pipe(fs.createWriteStream(saveTo));
		});
		
		req.busboy.on('finish', function() {
			res.send("success");
		});
		
		req.pipe(req.busboy);
		 
		//console.log(req.headers);	
		//console.log(req.body);
		//console.log(req.files);
	
	});
	
};
