function walk(fs, path, req, res)
{
	console.log("path = " + path);
	fs.readdir(path, function(err, list) {
    if (err) 
	{
		console.log(err);
		res.send(err);
		return;
	}
	var filestatus=[];
	var i = list.length-1;
	var z = 0;
	
	list.forEach(function(file){ 
	
		var f=path+'/'+file;
	  	var stats = fs.statSync(f);
	  	filestatus[z]=stats.isDirectory();
		
		if (z==i){
			var test = '[';
			for(var k=0; k<list.length; k++)
			{
				test+="{\"name\":\""+list[k]+"\",\"folder\":\""+filestatus[k]+"\"\,\"path\":\""+req.body.path+"/"+list[k]+"\"},";
			}
			
			var f=test.slice(0, - 1); //get rid of last comma
			f+=']';
			console.log(f);
			
			res.send(f);
        }
		z++;
	 });
	});


}
exports.walk = walk;