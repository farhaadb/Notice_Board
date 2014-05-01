function query(req, res, pool, q){

	pool.getConnection(function(err, connection) {
		if(err) throw err;
		
		if(q=="login"){
			connection.query("select count(*) as count from Login where username='" + req.body.user + "' and password='" + req.body.pass + "'",
			function(err, rows, fields){
			
				if(err) throw err;
			
				if(rows[0].count==1)
				{
					req.session.user_id=req.body.user;
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
		
		else if(q=="returnId"){
		
			connection.query("select id from login where username='"+req.session.user_id+"'",
			function(err, rows, fields){
			if(err) throw err;
			
			res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="returnSubjects"){
		
			var id=req.body.id;
			
			connection.query("SELECT subject.id, subject.name from subject join lecturer_cs on lecturer_cs.subject_id=subject.id where lecturer_cs.lecturer_id='"+id+"'",
			function(err, rows, fields){
			if(err) throw err;
			
			res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="returnNotices"){
		
			var id=req.body.id;
			
			connection.query("SELECT notice.id as id, notice.caption as title, notice.article as notice, subject.name as module from notice_lcs join notice on notice.id=notice_lcs.notice_id join subject on notice_lcs.subject_id=subject.id where notice_lcs.lecturer_id='"+id+"'",
			function(err, rows, fields){
			if(err) throw err;
			console.log(JSON.stringify(rows));
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