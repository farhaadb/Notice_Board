module.exports = function(app, pool, auth, dbquery, excelParser, fs, dir, path){

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
	res.sendfile("lecturer/index.html")
		//res.sendfile("app.html");
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
	
	app.post('/listDirectory', function(req,res){
	
		var d = path.resolve(__dirname,"../uploads/lecturer",req.body.path);
		console.log(d);
		dir.directory(fs, d, req, res, "list");
	});
	
	app.post('/addfolder', function(req,res){
	
		var d = path.resolve(__dirname,"../uploads/lecturer",req.body.path);
		console.log(d);
		dir.directory(fs, d, req, res, "addFolder");
	});
	
	app.post('/removefile', function(req,res){
	
		var d = path.resolve(__dirname,"../uploads/lecturer",req.body.path);
		console.log(d);
		dir.directory(fs, d, req, res, "removeFile");
	});
	
	app.post('/removefolder', function(req,res){
	
		var d = path.resolve(__dirname,"../uploads/lecturer",req.body.path);
		console.log(d);
		dir.directory(fs, d, req, res, "removeFolder");
	});
	
	app.get('/upload', function(req,res){
		res.sendfile("upload.html");
	});
	
	app.get('/subdomain/lecturer', function(req,res){
		res.sendfile("lecturer/index.html");
	});
	
	app.post('/file-upload', function(req, res) {
	
		var destination="";
		
		req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			console.log('Field [' + fieldname + ']: value: ' + val);
			destination=val;
		});
	
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			
			var saveTo = path.resolve(__dirname, '..', destination, path.basename(filename));
			console.log(destination);
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
	
	app.post('/addnotice', function(req, res) {
		console.log(req.body);
		res.send("thanks");
	});
	
	app.get('/returnid', function(req, res) {
		dbquery.query(req, res, pool, "returnId");
	});
	
	app.post('/returnsubjects', function(req, res) {
		dbquery.query(req, res, pool, "returnSubjects");
	});
	
	app.post('/returnnotices', function(req, res) {
		dbquery.query(req, res, pool, "returnNotices");
	});
	
	app.post('/deletenotice', function(req, res) {
		console.log(req.body.id);
		//dbquery.query(req, res, pool, "returnNotices");
	});
	
};
