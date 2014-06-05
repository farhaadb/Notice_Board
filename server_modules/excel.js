function parse(req, res, dbquery, pool, parser, path){

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
	
	function getStudentDetails(records){
		//this function gets the student numbers, first name, and last name and stores it in json format
		
		var has_column_offsets=false; //used to find which column contains the student numbers
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
					
					var first_name_result = (name.indexOf("firstname")!=-1 || name.indexOf("firstnames")!=-1);
							
					var last_name_result = (name.indexOf("lastname")!=-1 || name.indexOf("lastnames")!=-1);
					
					
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

}

exports.parse=parse;