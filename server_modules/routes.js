module.exports = function(app, pool, auth, dbquery){

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
	
	app.get('/upload', function(req,res){
		res.sendfile("upload.html");
	});
	
	app.post('/file-upload', function(req, res) {
	
	console.log("test");
	console.log(req.headers);	
	console.log(req.body);
    console.log(req.files);
	
	res.send("successful");
	
	});
	
};
