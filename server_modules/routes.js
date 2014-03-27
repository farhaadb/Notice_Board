module.exports = function(app, connection, auth){

	app.get("/", function(req, res){
		res.sendfile("login.html");
	});

	app.post("/login.html", function(req,res){
		connection.query("select count(*) as count from login where username='" + req.body.user + "' and password='" + req.body.pass + "'",
		function(err, rows, fields){
			if(err){
				console.log("error" + err);
			}
			
			if(rows[0].count==1)
			{
				req.session.user_id="test";
			}
			
			else
			{
				req.session.user_id=0;
			}
			res.redirect('/app');
			console.log(JSON.stringify(rows));
		});
	});
	
	app.get("/gettable.html", function(req, res) {

		connection.query('select notice_id as id,lecturer_id as empid, lname AS name, caption AS notice FROM Notice_LCS join Lecturer on Notice_LCS.lecturer_id=Lecturer.id join Notice on Notice_LCS.notice_id=Notice.id ORDER BY name',
		function(err, rows, fields){
			if(err){
				console.log("error" + err);
			}
			res.send(JSON.stringify(rows));
			console.log(JSON.stringify(rows));
		});
	});
	
	app.get('/app', auth, function(req,res){
		res.sendfile("app.html");
	});
};