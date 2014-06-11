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
					res.send({'status':'true','id':req.body.user, 'type':'student'});
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
					res.send({'status':'true','id':req.body.user, 'type':'lecturer'});
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
			var sql = "select notice_id,lecturer_id, fname, lname, notice.title, notice.body, notice.type, notice_ls.subject_id, subject.name as subject_name, lecturer.picture, CONVERT_TZ(notice.timestamp,'+00:00','+02:00') as timestamp FROM notice_ls join lecturer on notice_ls.lecturer_id=lecturer.id join notice on notice_ls.notice_id=notice.id join subject on notice_ls.subject_id=subject.id WHERE lecturer_id IN (select lecturer_id from student_ls where student_id='"+student+"') AND (notice_ls.subject_id IN (select subject_id from student_ls WHERE student_id='"+student+"') OR notice_ls.subject_id='ALL') ORDER BY timestamp DESC";
			
			connection.query(sql,
			function(err, rows, fields){
			if(err) throw err;
			
			res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="getNoticesById"){
		
			var lecturer = req.body.lecturer_id;
			var student = req.body.student_id;
			var sql = "select notice_id,lecturer_id, fname, lname, notice.title, notice.body, notice.type, notice_ls.subject_id, subject.name as subject_name, lecturer.picture,lecturer.email, lecturer.title as lecturer_title, CONVERT_TZ(notice.timestamp,'+00:00','+02:00') as timestamp FROM notice_ls join lecturer on notice_ls.lecturer_id=lecturer.id join notice on notice_ls.notice_id=notice.id join subject on notice_ls.subject_id=subject.id WHERE lecturer_id = '"+lecturer+"' AND (notice_ls.subject_id IN (select subject_id from student_ls WHERE student_id='"+student+"') OR notice_ls.subject_id='ALL') ORDER BY timestamp DESC";
		
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
			
			connection.query("SELECT notice.id as id, notice.title as title, notice.body as notice, CONVERT_TZ(notice.timestamp,'+00:00','+02:00') as time, subject.name as module from notice_ls join notice on notice.id=notice_ls.notice_id join subject on notice_ls.subject_id=subject.id where notice_ls.lecturer_id='"+id+"' ORDER BY time DESC",
			function(err, rows, fields){
			if(err) throw err;
			
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
					var path=require("path");
					var mkdirp=require("mkdirp");
					
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
						
						var make=path.resolve(__dirname,"../uploads/student",id+"/profile/");
						
						//create folder for student
						mkdirp(make, function (err) {
						if (err) console.error(err);
						});
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
				
				if(rows.length!=0) //delete students
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
						
						res.send("success");
					});
				}
				
				else
				{
					console.log("no one to delete from student_ls");
					res.send("success");
				}
			
			});
		}
		
		else if(q=="addSubject"){
			//this checks for subjects to be added and adds them to the subject table if they do not already exist
			
			var subjects=req.body.subjects;
			var lecturer=req.body.lecturer;
			
			//first check if the subject exists in subject table
			var all_subjects="";

			//get all subject ids and put it in a format suitable for query
			for(var i=0; i<subjects.length; ++i)
			{				
				if(i==0)
				{
					all_subjects+="'"+subjects[i].subject_id+"'";
				}
				
				else
				{
					all_subjects+=",'"+subjects[i].subject_id+"'";
				}
			}
			
			var sql="SELECT id FROM subject WHERE id IN ("+all_subjects+")";
			req.body.all_subjects=all_subjects; //for use when adding to lecturer_cs and when deleting from lecturer_cs/notice_ls
	
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				
				//go through subjects object and only add the ones that need to be inserted into subject table
				var subjects_to_be_added=[];
				for(var i=0; i<subjects.length; ++i)
				{
					subjects_to_be_added.push(subjects[i]);
					
					for(var j=0; j<rows.length; ++j)
					{
						if(rows[j].id==subjects[i].subject_id)
						{
							subjects_to_be_added.pop();
						}
					}
				}
				
				if(subjects_to_be_added.length!=0) //add subjects in
				{
					var insert_subject_sql="INSERT INTO subject (id, name) VALUES ";
					
					for(var i=0; i<subjects_to_be_added.length; ++i)
					{
						var id=subjects_to_be_added[i].subject_id;
						var name=subjects_to_be_added[i].name;
												
						if(i==0)
						{
							insert_subject_sql+="('"+id+"','"+name+"')";
						}
						
						else
						{
							insert_subject_sql+=",('"+id+"','"+name+"')";
						}
					}
					connection.query(insert_subject_sql,
					function(err, rows, fields){
						if(err) throw err;
			
						//once the subject is added, call addLecturerToSubject
						query(req, res, pool, "addLecturerToSubject");
					});
				}
				
				else
				{
					//just call addLecturerToSubject
					console.log("no subject to add");
					
					query(req, res, pool, "addLecturerToSubject");
				}
				
			});
			
		}
		
		else if(q=="addLecturerToSubject"){
						
			var subjects=req.body.subjects;
			var lecturer=req.body.lecturer;
			var all_subjects=req.body.all_subjects;
			
			var sql="SELECT subject_id FROM lecturer_cs WHERE subject_id IN ("+all_subjects+") AND lecturer_id='"+lecturer+"'";
			
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;

				//go through subjects object and only add the ones that need to be inserted into lecturer_cs table
				var subjects_to_be_added=[];
				for(var i=0; i<subjects.length; ++i)
				{
					subjects_to_be_added.push(subjects[i]);
					
					for(var j=0; j<rows.length; ++j)
					{
						if(rows[j].subject_id==subjects[i].subject_id)
						{
							subjects_to_be_added.pop();
						}
					}
				}
				console.log(subjects_to_be_added);
				if(subjects_to_be_added.length!=0) //add subjects in and create folders
				{
					var insert_subject_sql="INSERT INTO lecturer_cs (subject_id, lecturer_id) VALUES ";
					var path=require("path");
					var mkdirp = require('mkdirp');
					
					for(var i=0; i<subjects_to_be_added.length; ++i)
					{
						var subject_id=subjects_to_be_added[i].subject_id;
																		
						if(i==0)
						{
							insert_subject_sql+="('"+subject_id+"','"+lecturer+"')";
						}
						
						else
						{
							insert_subject_sql+=",('"+subject_id+"','"+lecturer+"')";
						}
						
						var make=path.resolve(__dirname,"../uploads/lecturer",lecturer+"/subjects/"+subject_id);
						
						//create subjects folder for lecturer
						mkdirp(make, function (err) {
						if (err) console.error(err);
						});
					}
					
					connection.query(insert_subject_sql,
					function(err, rows, fields){
						if(err) throw err;

					});
				}
				
				else
				{
					console.log("no subject to add to lecturer_cs");
				}
				//now call DeleteLecturerFromSubject
				query(req, res, pool, "DeleteNoticesFromSubject");
				
			});
		}
		
		else if(q=="DeleteNoticesFromSubject"){
		
			//this function deletes all notices for subjects that a lecturer no longer takes
						
			var subjects=req.body.subjects;
			var lecturer=req.body.lecturer;
			var all_subjects=req.body.all_subjects;
			
			var sql="SELECT subject_id FROM lecturer_cs WHERE subject_id NOT IN ("+all_subjects+") AND lecturer_id='"+lecturer+"'";
			var subject_id_sql=""; //stores subject id's for where in clause - e.g ('DSYS101', 'ELEN103')
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				
				if(rows.length!=0) //get notices to delete...
				{
					var get_notices_sql="SELECT notice_id from notice_ls join notice on notice_ls.notice_id=notice.id WHERE subject_id IN ";
					
					
					for(var i=0; i<rows.length; ++i)
					{
						var subject_id=rows[i].subject_id;
																		
						if(i==0)
						{
							subject_id_sql+="('"+subject_id+"'";
						}
						
						else
						{
							subject_id_sql+=",'"+subject_id+"'";
						}
					}
					
					subject_id_sql+=")";
					req.body.subject_id_sql=subject_id_sql; //for use in DeleteLecturerFromSubject
					
					get_notices_sql+=subject_id_sql+" AND lecturer_id IN ('"+lecturer+"')";
					console.log(get_notices_sql);
		
					
					connection.query(get_notices_sql,
					function(err, rows, fields){
						if(err) throw err;		

						if(rows.length!=0) //...now delete the notices
						{
							var delete_notices_sql="DELETE FROM notice WHERE id IN ";
					
					
							for(var i=0; i<rows.length; ++i)
							{
								var notice_id=rows[i].notice_id;
																		
								if(i==0)
								{
									delete_notices_sql+="('"+notice_id+"'";
								}
						
								else
								{
									delete_notices_sql+=",'"+notice_id+"'";
								}
							}
					
					
							delete_notices_sql+=")";
							console.log(delete_notices_sql);
							
							connection.query(delete_notices_sql,
							function(err, rows, fields){
								if(err) throw err;						
						
								query(req, res, pool, "DeleteLecturerFromSubject");
							});
						}
						
						else
						{
							query(req, res, pool, "DeleteLecturerFromSubject");
						}
					});
				}
				
				else
				{
					//if there is nothing to delete i.e the query returns empty, then this also means that we do not need to delete subject
					console.log("no notice/subject to delete");
					res.send("success");
				}
			
			});
		}
		
		else if(q=="DeleteLecturerFromSubject"){
		
			var subjects=req.body.subjects;
			var lecturer=req.body.lecturer;
			var all_students=req.body.all_students;
			var subject_id_sql=req.body.subject_id_sql;
			
			var sql="DELETE FROM lecturer_cs WHERE subject_id IN "+subject_id_sql+" AND lecturer_id IN ('"+lecturer+"')";
			console.log(sql);
			
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				
				res.send("success");
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
		
		else if(q=="returnStudentDetails"){
		
			var id=req.body.id;
			
			connection.query("SELECT fname, lname, email from student where id="+id,
			function(err, rows, fields){
				if(err) throw err;
				res.send(JSON.stringify(rows));
			});
		}
		
		else if(q=="updateStudentPicture"){
		
			if(req.body.picture=="empty"){
				var sql="UPDATE student SET picture=NULL WHERE id='"+req.body.id+"'";
			}
			
			else{
				var sql="UPDATE student SET picture='"+req.body.picture+"' WHERE id='"+req.body.id+"'";
			}
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				res.send({status:"success"});
			});
		}
		
		else if(q=="updateStudentSettings"){
		
			var sql=req.body.sql;
			
			connection.query(sql,
			function(err, rows, fields){
				if(err) throw err;
				res.send({status:"success"});
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