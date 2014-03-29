function query(req, res, pool, q){

	pool.getConnection(function(err, connection) {
		if(err) throw err;
		
		if(q=="login"){
			connection.query("select count(*) as count from Login where username='" + req.body.user + "' and password='" + req.body.pass + "'",
			function(err, rows, fields){
			
				if(err) throw err;
			
				if(rows[0].count==1)
				{
					req.session.user_id="test";
				}
			
				else
				{
					req.session.user_id=0;
				}
				res.redirect('/app');
			});
		}
		
		else if(q=="getNotices"){
		
			connection.query('select notice_id as id,lecturer_id as empid, lname AS name, caption AS notice FROM Notice_LCS join Lecturer on Notice_LCS.lecturer_id=Lecturer.id join Notice on Notice_LCS.notice_id=Notice.id ORDER BY name',
			function(err, rows, fields){
			if(err) throw err;
			
			res.send(JSON.stringify(rows));
			});
		}
		
		else{
			console.log("Unhandled query " + q);
		}
	
		connection.release();
	});

};

exports.query = query;