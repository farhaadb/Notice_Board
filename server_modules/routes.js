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
	
	app.post('/listlecturerdirectory', function(req,res){
	
		var d = path.resolve(__dirname,"../uploads/lecturer",req.body.path);
		console.log(d);
		dir.directory(fs, d, req, res, "list");
	});
	
	app.post('/addlecturerfolder', function(req,res){
	
		var d = path.resolve(__dirname,"../uploads/lecturer",req.body.path);
		console.log(d);
		dir.directory(fs, d, req, res, "addFolder");
	});
	
	app.post('/removelecturerfile', function(req,res){
	
		var d = path.resolve(__dirname,"../uploads/lecturer",req.body.path);
		console.log(d);
		dir.directory(fs, d, req, res, "removeFile");
	});
	
	app.post('/removelecturerfolder', function(req,res){
	
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
	
		var destination; 
		
		req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			console.log('Field [' + fieldname + ']: value: ' + val);
			destination=path.resolve(__dirname,"../uploads/lecturer",val);
		});
	
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			
			var saveTo = path.resolve(destination, path.basename(filename));
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
	
	app.get('/returnlecturerid', function(req, res) {
		dbquery.query(req, res, pool, "returnLecturerId");
	});
	
	app.post('/returnlecturersubjects', function(req, res) {
		dbquery.query(req, res, pool, "returnLecturerSubjects");
	});
	
	app.post('/returnlecturernotices', function(req, res) {
		dbquery.query(req, res, pool, "returnLecturerNotices");
	});
	
	app.post('/addlecturernotice', function(req, res) {
		dbquery.query(req, res, pool, "addLecturerNotice");
	});	
	
	app.post('/deletelecturernotice', function(req, res) {
		dbquery.query(req, res, pool, "deleteLecturerNotice");
	});
	
};
