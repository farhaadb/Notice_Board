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
		
			var student = req.body.student_id;
			var sql = "select notice_id,lecturer_id, fname, lname, notice.title, notice.body, notice.type, notice_ls.subject_id, subject.name as subject_name, lecturer.picture, CONVERT_TZ(notice.timestamp,'+00:00','+02:00') as timestamp FROM notice_ls join lecturer on notice_ls.lecturer_id=lecturer.id join notice on notice_ls.notice_id=notice.id join subject on notice_ls.subject_id=subject.id WHERE lecturer_id IN (select lecturer_id from student_ls where student_id='"+student+"') AND (notice_ls.subject_id IN (select subject_id from student_ls WHERE student_id='"+student+"') OR notice_ls.subject_id='ALL') ORDER BY timestamp";
			
			connection.query(sql,
			function(err, rows, fields){
			if(err) throw err;
			
			res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="getNoticesById"){
		
			var lecturer = req.body.lecturer_id;
			var student = req.body.student_id;
			var sql = "select notice_id,lecturer_id, fname, lname, notice.title, notice.body, notice.type, notice_ls.subject_id, subject.name as subject_name, lecturer.picture,lecturer.email, lecturer.title as lecturer_title, CONVERT_TZ(notice.timestamp,'+00:00','+02:00') as timestamp FROM notice_ls join lecturer on notice_ls.lecturer_id=lecturer.id join notice on notice_ls.notice_id=notice.id join subject on notice_ls.subject_id=subject.id WHERE lecturer_id = '"+lecturer+"' AND (notice_ls.subject_id IN (select subject_id from student_ls WHERE student_id='"+student+"') OR notice_ls.subject_id='ALL') ORDER BY timestamp";
		
			connection.query(sql,
			function(err, rows, fields){
			if(err) throw err;
			
			res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="registerDevice"){
		
			var student=req.body.student;
			var device=req.body.device;
		
			//first check if device exists
			connection.query("select count(*) as count from device where student_id='"+student+"'",
			function(err, rows, fields){
				if(err) throw err;
			
				var sql="";
			
				if(rows[0].count==0){
					sql="INSERT INTO device VALUES('"+student+"','"+device+"','1')";
				}
			
				else{
					sql="UPDATE device SET device_id='"+device+"' WHERE student_id='"+student+"'";
				}
				
				connection.query(sql,
				function(err1, rows1, fields1){
					if(err1){
						res.send({'status':'false'});
					}
					
					else{
						res.send({'status':'true'});
					}
				});
			
			});
		}
		
		else if(q=="getStudentLecturers"){
		
			connection.query("select lecturer.id, lecturer.title, lecturer.fname, lecturer.lname, lecturer.picture from lecturer join student_ls on lecturer.id=student_ls.lecturer_id where student_ls.student_id='"+req.body.student_id+"'",
			function(err, rows, fields){
				if(err) throw err;
				console.log(rows);
			
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
			var type=req.body.type;
			var now=new Date();
			var time = [[now.getFullYear(), AddZero(now.getMonth() + 1), AddZero(now.getDate())].join("-"), [AddZero(now.getHours()), AddZero(now.getMinutes()), AddZero(now.getSeconds())].join(":")].join(" ");
			
			var notice_id;
			
				
			connection.query("SELECT notice.id as id FROM notice ORDER BY id DESC LIMIT 1",
					function(err1, rows1, fields1){
						if(err1) throw err1;
						if(rows1[0].id!=undefined || rows1[0].id!=null)
						{
							notice_id=(rows1[0].id)+1;
							
							var values1=notice_id+",'"+title+"','"+body+"','"+type+"','"+time+"'";
							var values2=lecturer+",'"+subject+"',"+notice_id;
							
							connection.query("INSERT into notice VALUES("+values1+")",
							function(err2, rows2, fields2){
								if(err2) throw err1;
							
								connection.query("INSERT into notice_ls VALUES("+values2+")",
								function(err3, rows3, fields3){
									if(err3) throw err3;
									res.send({'status':'success'});
									
									//get ids of devices for push
									var select;
									
									if(subject=="ALL")
									{
										select = "SELECT device_id FROM device WHERE student_id in (SELECT student_id FROM student_ls WHERE lecturer_id='"+lecturer+"') AND enabled='1'";
									}

									else
									{
										select = "SELECT device_id FROM device WHERE student_id in (SELECT student_id FROM student_ls WHERE lecturer_id='"+lecturer+"' AND subject_id='"+subject+"') AND enabled='1'";
									}
									
									connection.query(select,
									function(err4, rows4, fields4){
										if(err4) throw err;
										if(rows4.length==0)
										{
											console.log("empty");
										}
										
										//send the notification
										else
										{
											var android = require("./androidpush");
											android.send(rows4, type, title, body);
											
										}
										
									});
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
			//this checks for students to be added and adds them to the student table if they do not already exist
			
			var students=req.body.students;
			var subject=req.body.subject;
			var lecturer=req.body.lecturer;
			
			//first check if the student exists in student table
			var all_students="";

			//get all student numbers and put it in a format suitable for query
			for(var i=0; i<students.length; ++i)
			{				
				if(i==0)
				{
					all_students+="'"+students[i].student_number+"'";
				}
				
				else
				{
					all_students+=",'"+students[i].student_number+"'";
				}
			}
			
			var sql="SELECT id FROM student WHERE id IN ("+all_students+")";
			req.body.all_students=all_students; //for use when adding to student_ls and when deleting from student_ls
	
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				
				//go through students object and only add the ones that need to be inserted into student table
				var students_to_be_added=[];
				for(var i=0; i<students.length; ++i)
				{
					students_to_be_added.push(students[i]);
					
					for(var j=0; j<rows.length; ++j)
					{
						if(rows[j].id==students[i].student_number)
						{
							students_to_be_added.pop();
						}
					}
				}
				
				if(students_to_be_added.length!=0) //add students in
				{
					var insert_student_sql="INSERT INTO student (id, fname, lname, email, password) VALUES ";
					
					for(var i=0; i<students_to_be_added.length; ++i)
					{
						var id=students_to_be_added[i].student_number;
						var fname=students_to_be_added[i].first;
						var lname=students_to_be_added[i].last;
						var email=id+"@dut4life.ac.za";
						var password=id; //make this the default password
												
						if(i==0)
						{
							insert_student_sql+="('"+id+"','"+fname+"','"+lname+"','"+email+"','"+password+"')";
						}
						
						else
						{
							insert_student_sql+=",('"+id+"','"+fname+"','"+lname+"','"+email+"','"+password+"')";
						}
					}
					connection.query(insert_student_sql,
					function(err, rows, fields){
						if(err) throw err;
			
						//once the student is added, call addStudentToSubject
						query(req, res, pool, "addStudentToSubject");
					});
				}
				
				else
				{
					//just call addStudentToSubject
					console.log("no one to add to student");
					query(req, res, pool, "addStudentToSubject");
				}
				
			});
			
		}
		
		else if(q=="addStudentToSubject"){
						
			var students=req.body.students;
			var subject=req.body.subject;
			var lecturer=req.body.lecturer;
			var all_students=req.body.all_students;
			
			var sql="SELECT student_id FROM student_ls WHERE student_id IN ("+all_students+")";
			
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				
				//go through students object and only add the ones that need to be inserted into student_ls table
				var students_to_be_added=[];
				for(var i=0; i<students.length; ++i)
				{
					students_to_be_added.push(students[i]);
					
					for(var j=0; j<rows.length; ++j)
					{
						if(rows[j].student_id==students[i].student_number)
						{
							students_to_be_added.pop();
						}
					}
				}
				
				if(students_to_be_added.length!=0) //add students in
				{
					var insert_student_sql="INSERT INTO student_ls (student_id, lecturer_id, subject_id) VALUES ";
					
					for(var i=0; i<students_to_be_added.length; ++i)
					{
						var student_id=students_to_be_added[i].student_number;
																		
						if(i==0)
						{
							insert_student_sql+="('"+student_id+"','"+lecturer+"','"+subject+"')";
						}
						
						else
						{
							insert_student_sql+=",('"+student_id+"','"+lecturer+"','"+subject+"')";
						}
					}
					connection.query(insert_student_sql,
					function(err, rows, fields){
						if(err) throw err;
					});
				}
				
				else
				{
					console.log("no one to add to student_ls");
				}
				//now call DeleteStudentFromSubject
				query(req, res, pool, "DeleteStudentFromSubject");
				
			});
		}
		
		else if(q=="DeleteStudentFromSubject"){
		
			var students=req.body.students;
			var subject=req.body.subject;
			var lecturer=req.body.lecturer;
			var all_students=req.body.all_students;
			
			var sql="SELECT student_id FROM student_ls WHERE student_id NOT IN ("+all_students+")";
			
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				
				if(rows.length!=0) //add students in
				{
					var delete_student_sql="DELETE FROM student_ls WHERE student_id IN ";
					
					for(var i=0; i<rows.length; ++i)
					{
						var student_id=rows[i].student_id;
																		
						if(i==0)
						{
							delete_student_sql+="('"+student_id+"'";
						}
						
						else
						{
							delete_student_sql+=",'"+student_id+"'";
						}
					}
					
					delete_student_sql+=") AND lecturer_id IN ('"+lecturer+"') AND subject_id IN ('"+subject+"')";
					//console.log(delete_student_sql);
					
					connection.query(delete_student_sql,
					function(err, rows, fields){
						if(err) throw err;
					});
				}
				
				else
				{
					console.log("no one to delete from student_ls");
				}
			
			});
		}
		
		else if(q=="returnStudentSubjects"){
		
			var id=req.body.id;
			
			connection.query("SELECT subject.id, subject.name, student_ls.lecturer_id from subject join student_ls on student_ls.subject_id=subject.id where student_ls.student_id='"+id+"'",
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

//Pad given value to the left with "0" - used for generating timestamp in query above
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

exports.query = query;