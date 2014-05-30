module.exports = function(app, pool, auth, dbquery, excelParser, excel, fs, dir, path){

	app.get("/", function(req, res){
		res.sendfile("studentlogin.html");
	});

	app.get("/lecturer", function(req, res){
		res.sendfile("lecturerlogin.html");
	});
	
	app.get("/android", function(req, res){
		res.sendfile("android/index.html");
	});
	
	app.post("/studentloginreq", function(req, res){
		console.log(req.body);
		dbquery.query(req, res, pool, "studentLoginReq");
	});
	
	app.post("/lecturerloginreq", function(req, res){
		console.log(req.body);
		dbquery.query(req, res, pool, "lecturerLoginReq");
	});
	
	app.post("/studentapplogin", function(req, res){
		dbquery.query(req, res, pool, "studentAppLogin");
	});
	
	
	app.get("/gettable.html", function(req, res) {
		dbquery.query(req, res, pool, "getNotices");
	});
	
	app.get('/studentindex', auth, function(req,res){
	res.sendfile("student/index.html")
		//res.sendfile("app.html");
	});
	
	app.get('/lecturerindex', auth, function(req,res){
	res.sendfile("lecturer/index.html")
		//res.sendfile("app.html");
	});
	
	app.get("/studentlogout", function(req, res){
		req.session.destroy();
		res.redirect("/");
	});
	
	app.get("/lecturerlogout", function(req, res){
		req.session.destroy();
		res.redirect("/lecturer");
	});
	
	app.get('/excel', function(req,res){
		excelParser.parse({
		inFile: 'Marks.xlsx',
		worksheet: 1,
		skipEmpty: false,
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
	
	});
	
	app.post('/upload-student-data', function(req, res) {
	
		var destination; 
		var name;
		var saveTo;
		var ext;
		var type;
		
		req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			console.log('Field [' + fieldname + ']: value: ' + val);
			
			if(fieldname=="path")
				destination=path.resolve(__dirname,"../uploads/lecturer",val);
			if(fieldname=="type")
				type=val;
			if(fieldname=="lecturer")
				req.body.lecturer=val;
			if(fieldname=="subject")
			{
				name=val;
				req.body.subject=val;
			}
						
		});
	
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			
			ext = path.extname(filename);
			var f = name+"_temp"+ext;
			saveTo = path.resolve(destination, f);
			//console.log(saveTo);
			file.pipe(fs.createWriteStream(saveTo));
		});
		
		req.busboy.on('finish', function() {
			var new_destination = path.resolve(destination, name+ext);

			fs.rename(saveTo, new_destination, function (err) {
				if (err) console.log(err);
				
				if(type=="students")
				{
					req.body.path=new_destination;
					req.body.type="upload_students"; //used by parser to identify type of operation
					
					excel.parse(req, res, dbquery, pool, excelParser);
				}
			
			});
			
			res.send("success");
		});
		
		req.pipe(req.busboy);
	
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
	
	app.post('/returnlecturerdetails', function(req, res) {
		dbquery.query(req, res, pool, "returnLecturerDetails");
	});
	
	app.post('/returnlecturerpicture', function(req, res) {
		var d = path.resolve(__dirname,"../uploads/lecturer",req.body.path,"profile");
		console.log(d);
		dir.directory(fs, d, req, res, "list");
	});
	
	app.post('/updatelecturerpicture', function(req, res) {
		dbquery.query(req, res, pool, "updateLecturerPicture");
	});
	
	app.post('/updatelecturersettings', function(req, res) {
		dbquery.query(req, res, pool, "updateLecturerSettings");
	});
	
	app.post('/returnstudentsubjects', function(req, res) {
		dbquery.query(req, res, pool, "returnStudentSubjects");
	});
	
};
