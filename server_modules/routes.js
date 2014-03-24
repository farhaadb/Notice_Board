module.exports = function(app, connection){

	app.get("/", function(req, res){

		res.sendfile("index.html");
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
};