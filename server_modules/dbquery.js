function query(req, res, pool, q){

	pool.getConnection(function(err, connection) {
		if(err) throw err;
		
		if(q=="studentLoginReq"){
			connection.query("select count(*) as count from student where id='" + req.body.user + "' and password='" + req.body.pass + "'",
			function(err, rows, fields){
			
				if(err) throw err;
				if(rows[0].count==1)
				{
					req.session.student_id=req.body.user;
					res.send({'status':'true','id':req.body.user});
				}
			
				else
				{
					req.session.user_id=0;
					res.send({'status':'false'});
				}
				
			});
		}
		
		else if(q=="lecturerLoginReq"){
		
			connection.query("select count(*) as count from lecturer where id='" + req.body.user + "' and password='" + req.body.pass + "'",
			function(err, rows, fields){
				console.log(rows);
				if(err) throw err;
				if(rows[0].count==1)
				{
					req.session.lecturer_id=req.body.user;
					res.send({'status':'true','id':req.body.user});
				}
			
				else
				{
					req.session.user_id=0;
					res.send({'status':'false'});
				}
			});
		}
		
		else if(q=="studentAppLogin"){
			console.log(req.body);
			connection.query("select count(*) as count from student where id='" + req.body.student_no + "' and password='" + req.body.password + "'",
			function(err, rows, fields){
			
				if(err) throw err;
				if(rows[0].count==1)
				{
					console.log("sending true");
					res.send({'status':'true'});
				}
			
				else
				{
					console.log("sending false");
					res.send({'status':'false'});
				}
			});
		}
		
		else if(q=="getNotices"){
		
			connection.query('select notice_id as id,lecturer_id as empid, lname AS name, body AS notice FROM notice_ls join lecturer on notice_ls.lecturer_id=lecturer.id join notice on notice_ls.notice_id=notice.id ORDER BY name',
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
			
			connection.query("SELECT notice.id as id, notice.title as title, notice.body as notice, CONVERT_TZ(notice.timestamp,'+00:00','+02:00') as time, subject.name as module from notice_ls join notice on notice.id=notice_ls.notice_id join subject on notice_ls.subject_id=subject.id where notice_ls.lecturer_id='"+id+"'",
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
			var now=new Date();
			var time = [[now.getFullYear(), AddZero(now.getMonth() + 1), AddZero(now.getDate())].join("-"), [AddZero(now.getHours()), AddZero(now.getMinutes()), AddZero(now.getSeconds())].join(":")].join(" ");
			
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
		
		else if(q=="returnLecturerDetails"){
		
			var id=req.body.id;
			
			connection.query("SELECT title, fname, lname, email from lecturer where id="+id,
			function(err, rows, fields){
				if(err) throw err;
				res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="updateLecturerSettings"){
		
			var sql=req.body.sql;
			
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				res.send({status:"success"});
			});
		}
		
		else if(q=="updateLecturerPicture"){
		
			if(req.body.picture=="empty"){
				var sql="UPDATE lecturer SET picture=NULL WHERE id='"+req.body.id+"'";
			}
			
			else{
				var sql="UPDATE lecturer SET picture='"+req.body.picture+"' WHERE id='"+req.body.id+"'";
			}
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				res.send({status:"success"});
			});
		}
		
		else if(q=="addStudent"){
			
			var students=req.body.students;
			var subject=req.body.subject;
			var lecturer=req.body.lecturer;
			
			//student needs to exist first - get valid student id's
			var first_sql = "SELECT id from student WHERE ";
			for(var i=0; i<students.length; ++i)
			{
				if(i>0)
				{
					first_sql+=" OR id='"+students[i]+"'";
				}
				
				else //i==0
				{
					first_sql+="id='"+students[i]+"'";
				}
			}
			
			connection.query(first_sql,
			function(err, rows, fields){
				if(err) throw err;
				
				var students2=[];
				var second_sql="select student.id from student join student_ls on student.id=student_ls.student_id where student.id in (";
				
				for(var j=0; j<rows.length; ++j)
				{
					students2.push(rows[j].id);
					
					if(j>0)
					{
						second_sql+=", '"+rows[j].id+"'";
					}
					
					else
					{
						second_sql+="'"+rows[j].id+"'";
					}
				}
				
				second_sql+=") and student_ls.subject_id='"+subject+"'";
				
				//then we need to check if the student is already assigned to that subject - get list of students already assigned
				connection.query(second_sql,
					function(err, rows, fields){
					if(err) throw err;
					
					//prune array - remove those that are common
					var remove;
					
					for(var k=0; k<rows.length; ++k)
					{
						remove=rows[k].id;
						console.log(students2);
						for(var m = students2.length -1; m >= 0 ; m--){
							if(students2[m] == remove){
								students2.splice(m, 1);
							}
						}
					}
					
					console.log(students2);
					//then we do an insert
					for(var n=0; n<students2.length; ++n)
					{
						var third_sql="INSERT into student_ls VALUES('"+students2[n]+"','"+lecturer+"','"+subject+"')";
						
						connection.query(third_sql,
						function(err, rows, fields){
							if(err) throw err;
						});
					}
					
				});
				
			});
			
		/*
			var sql=req.body.sql;
			
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				res.send({status:"success"});
			});*/
		}
				
		else{
			console.log("Unhandled query " + q);
		}
	
		connection.release();
	});

};

//Pad given value to the left with "0" - used for generating timestamp in query above
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

exports.query = query;