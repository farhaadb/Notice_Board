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
		
		else if(q=="returnLecturerId"){
		
			connection.query("select id from login where username='"+req.session.user_id+"'",
			function(err, rows, fields){
			if(err) throw err;
			
			res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="returnLecturerSubjects"){
		
			var id=req.body.id;
			
			connection.query("SELECT subject.id, subject.name from subject join lecturer_cs on lecturer_cs.subject_id=subject.id where lecturer_cs.lecturer_id='"+id+"'",
			function(err, rows, fields){
			if(err) throw err;
			
			res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="returnLecturerNotices"){
		
			var id=req.body.id;
			
			connection.query("SELECT notice.id as id, notice.title as title, notice.body as notice, notice.timestamp as time, subject.name as module from notice_ls join notice on notice.id=notice_ls.notice_id join subject on notice_ls.subject_id=subject.id where notice_ls.lecturer_id='"+id+"'",
			function(err, rows, fields){
			if(err) throw err;
			console.log(JSON.stringify(rows));
			res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="addLecturerNotice"){
		
			var subject=req.body.subject;
			var lecturer=req.body.lecturer;
			var title=req.body.title;
			var body=req.body.body;
			var time=new Date().toISOString().slice(0, 19).replace('T', ' ');
			var notice_id;
			
				
			connection.query("SELECT notice.id as id FROM notice ORDER BY id DESC LIMIT 1",
					function(err1, rows1, fields1){
						if(err1) throw err1;
						if(rows1[0].id!=undefined || rows1[0].id!=null)
						{
							notice_id=(rows1[0].id)+1;
							
							var values1=notice_id+",'"+title+"','"+body+"','"+time+"'";
							var values2=lecturer+",'"+subject+"',"+notice_id;
							
							connection.query("INSERT into notice VALUES("+values1+")",
							function(err2, rows2, fields2){
								if(err2) throw err1;
							
								connection.query("INSERT into notice_ls VALUES("+values2+")",
								function(err3, rows3, fields3){
									if(err3) throw err3;
									res.send({'status':'success'});
								});
			
							}); 
						}
					});
		}
		
		else if(q=="deleteLecturerNotice"){
		
			var id=req.body.id;
			
			connection.query("DELETE from notice where id="+id,
			function(err, rows, fields){
				if(err) throw err;
				console.log("DELETE from notice where id="+id);
				res.send({'status':'success'});
			});
		}
				
		else{
			console.log("Unhandled query " + q);
		}
	
		connection.release();
	});

};

exports.query = query;