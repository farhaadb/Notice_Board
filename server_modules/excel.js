function parse(req, res, dbquery, pool, parser, path){

	var u = require('underscore');
	var counter=0;
	var to_send=[];
	var path=req.body.path;
	var type=req.body.type;
	
	if(type=="upload_students")
	{
		parser.parse({
		inFile: path,
		worksheet: 1,
		skipEmpty: true,
		},function(err, records){
			if(err) console.error(err);
			var students=getStudentDetails(records);
			req.body.students=students;
			dbquery.query(req, res, pool, "addStudent");
		});
	}
	
	else if(type=="upload_subjects")
	{
		parser.parse({
		inFile: path,
		worksheet: 1,
		skipEmpty: true,
		},function(err, records){
			if(err) console.error(err);
			var subjects=getSubjectDetails(records);
			req.body.subjects=subjects;
			console.log(subjects);
			dbquery.query(req, res, pool, "addSubject");
		});
	}
	else if(type=="get_marks")
	{
		parseIt(counter);
	}
	
		
	function parseIt(count){
		parser.parse({
			inFile: path[count],
			worksheet: 1,
			skipEmpty: false,
			},function(err, records){
				if(err)
				{
					console.error(err);
					bufferAndSend(false);
				}
			
				else{
					getStudentMarks(records, counter);
				}			
				
			});
	}
	
	function bufferAndSend(data){
	
		if(data!=false)
		{
			to_send.push(data);
		}
		
		console.log(data);
		
		counter++;
		
		if(counter==path.length){

			res.send(to_send);
		}
		
		else{
		
			parseIt(counter);
		}
	
	}

	
	function getStudentDetails(records){
		//this function gets the student numbers, first name, and last name and stores it in json format
		
		var has_column_offsets=false; //used to check if all columns exist
		var student_number_column = -1; //used to know exactly what column to look in for student number
		var first_name_column = -1;
		var last_name_column = -1;
		
		var students = [];
		
		for(var i=0; i<records.length; ++i)
		{ 
			if(!has_column_offsets)
			{
				for(var j=0; j<records[i].length; ++j)
				{
					var name=records[i][j].toLowerCase(); //column name
					name = name.replace(/\s+/g, ''); //remove spaces - using regular expression
					
					//check which column the particular details reside in
					var student_number_result = (name.indexOf("studentnumber")!=-1 || name.indexOf("studentnumbers")!=-1 ||
							name.indexOf("studentno")!=-1 || name.indexOf("studentnos")!=-1);
					
					var first_name_result = (name.indexOf("firstname")!=-1 || name.indexOf("firstnames")!=-1 || name=="name");
							
					var last_name_result = (name.indexOf("lastname")!=-1 || name.indexOf("lastnames")!=-1 || name=="surname");
					
					
					if(student_number_result)
					{
						student_number_column=j;
					}
					
					else if(first_name_result)
					{
						first_name_column=j;
					}
					
					else if(last_name_result)
					{
						last_name_column=j;
					}
					
					if(student_number_column!=-1 && first_name_column!=-1 && last_name_column!=-1)
					{
						//we have all the columns needed and can break out from this loop
						has_column_offsets=true;
						break;
					}
				}
			}
			
			else
			{
				if(student_number_column==-1 || first_name_column==-1 || last_name_column==-1)
				{
					console.log("This is not supposed to happen - column=-1");
				}
				
				else
				{
					students.push({'student_number':records[i][student_number_column], 'first':records[i][first_name_column], 'last':records[i][last_name_column]});
				}
			}
		}
		
		//should call database function from here and give it students array
		if(students.length>0)
		{
			return students;
		}
	
	}
	
	function getSubjectDetails(records){
		//this function gets the subject code and name and stores it in json format
		
		var has_column_offsets=false; //used to check if all columns exist
		var subject_code_column = -1; //used to know exactly what column to look in for student number
		var subject_name_column = -1;
				
		var subjects = [];
		
		for(var i=0; i<records.length; ++i)
		{ 
			if(!has_column_offsets)
			{
				for(var j=0; j<records[i].length; ++j)
				{
					var name=records[i][j].toLowerCase(); //column name
					name = name.replace(/\s+/g, ''); //remove spaces - using regular expression
					
					//check which column the particular details reside in
					var subject_code_result = (name.indexOf("code")!=-1);
					
					var subject_name_result = (name.indexOf("name")!=-1);
							
								
					if(subject_code_result)
					{
						subject_code_column=j;
					}
					
					else if(subject_name_result)
					{
						subject_name_column=j;
					}
					
					if(subject_code_column!=-1 && subject_name_column!=-1)
					{
						//we have all the columns needed and can break out from this loop
						has_column_offsets=true;
						break;
					}
				}
			}
			
			else
			{
				if(subject_code_column==-1 || subject_name_column==-1)
				{
					console.log("This is not supposed to happen - column=-1");
				}
				
				else
				{
					subjects.push({'subject_id':records[i][subject_code_column], 'name':records[i][subject_name_column]});
				}
			}
		}
		
		//should call database function from here and give it students array
		if(subjects.length>0)
		{
			return subjects;
		}
	
	}
	
	function getStudentMarks(records, subject){
		var student_id=req.body.id;
		var has_student_number=false;
		var column_names=[];
		var number_of_columns=0; 
		var number_of_students=0;
		var student_results=[];
		var student_averages=[];


		if(records.length>1) //we have at least 2 rows - one for the headings and the rest are the students marks
		{
			var first_row_length=records[0].length;
			
			//get all column names
			for(var i=1; i<first_row_length; ++i)
				{
					column_names.push(records[0][i]);
					number_of_columns++;
				}
			
						
			student_averages=new Array(number_of_columns+1).join('0').split('').map(parseFloat); //initialise array with 0
			var student_positions=new Array(number_of_columns); //allocate space to array
			
			for(var i=0; i<student_positions.length; ++i)
			{
				student_positions[i]=[];
			}
			
			for(var i=1; i<records.length; ++i)
				{					
					//get marks for all students to calculate averages
					for(var j=1; j<records[i].length; ++j)
					{
						var mark=parseFloat(records[i][j])*100;
						
						if(!isNaN(mark)) //is a number
						{
							student_averages[j-1]+=mark; //j-1 because we start the loop at position 1 to avoid student numbers
							student_positions[j-1].push(mark);
							
							//get student marks	for our student only
							if(records[i][0]==student_id)
							{
								student_results.push(mark);
							}
						}
						
						else
						{
							student_averages[j-1]+=0;
							student_positions[j-1].push(0);
							
							//get student marks	for our student only
							if(records[i][0]==student_id)
							{
								student_results.push(0);
							}
						}
						
					}
					
					number_of_students++;
				}
			
				//attach subject name
				var send='[{"subject":"'+req.body.subject_name[counter]+'"}';
				
				//construct json - column name as key, results as value
				for(var i=0; i<column_names.length; ++i)
				{
					if(i==0)
					{
						send+=',{"'+column_names[i]+'":"'+student_results[i]+'"';
					}
					
					else
					{
						send+=',"'+column_names[i]+'":"'+student_results[i]+'"';
					}
					
				}

				send+="}";
			
				//calculate student averages and construct json
				for(var i=0; i<student_averages.length; ++i)
				{
					console.log("==== "+number_of_students);
					if(i==0)
					{
						send+=',{"'+i+'":"'+(student_averages[i]/number_of_students).toPrecision(4)+'"';
					}
					
					else
					{
						send+=',"'+i+'":"'+(student_averages[i]/number_of_students).toPrecision(4)+'"';
					}
					
				}
				
				send+="}";
				
				//get student position in test, assignment etc
				for(var i=0; i<student_positions.length; ++i)
				{
					student_positions[i]=u.sortBy(student_positions[i], function(marks) {return marks}).reverse();
					student_positions[i]=u.uniq(student_positions[i], true);
					
					student_positions[i]=(u.indexOf(student_positions[i], student_results[i]))+1;
					
					if(i==0)
					{
						send+=',{"'+i+'":"'+student_positions[i]+'"';
					}
					
					else
					{
						send+=',"'+i+'":"'+student_positions[i]+'"';
					}
				}
				
				send+='}]';
				
				console.log(send);
				//res.send(send);
				bufferAndSend(JSON.parse(send));
		}
	}

}

exports.parse=parse;