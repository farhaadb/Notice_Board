function parse(req, res, dbquery, pool, parser, path){

	var path=req.body.path;
	var type=req.body.type;
	
	if(type=="upload_students")
	{
		parser.parse({
		inFile: path,
		worksheet: 1,
		skipEmpty: false,
		},function(err, records){
			if(err) console.error(err);
			getStudentNumbers(records);
		});
	}
	
	function getStudentNumbers(records){
		var has_column_offset=false; //used to find which column contains the student numbers
		var column = -1; //used to know exactly what column to look in for student number
		var students = [];
		
		for(var i=0; i<records.length; ++i)
		{ 
			if(!has_column_offset)
			{
				for(var j=0; j<records[i].length; ++j)
				{
					var name=records[i][j].toLowerCase(); //column name
					name = name.replace(/\s+/g, ''); //remove spaces - using regular expression
					var result = (name.indexOf("studentnumber")!=-1 || name.indexOf("studentnumbers")!=-1 ||
							name.indexOf("studentno")!=-1 || name.indexOf("studentnos")!=-1);
					
					if(result)
					{
						has_column_offset=true;
						column=j;
						break;
					}
				}
			}
			
			else
			{
				if(column==-1)
				{
					console.log("This is not supposed to happen - column=-1");
				}
				
				else
				{
					students.push(records[i][column]);
				}
			}
		}
		
		//should call database function from here and give it students array
		if(students.length>0)
		{
			req.body.students=students;
			dbquery.query(req, res, pool, "addStudent");
		}
	
	}

}

exports.parse=parse;