function walk(fs, path, req, res)
{
	console.log("path = " + path);
	fs.readdir(path, function(err, list) {
    if (err) return done(err);
	var filestatus=[];
	var i = list.length-1;
	var z = 0;
	
	list.forEach(function(file){ 
	
		var f=path+'/'+file;
	  	var stats = fs.statSync(f);
	  	filestatus[z]=stats.isDirectory();
		
		if (z==i){
			res.send({names:list,status:filestatus});
        }
		z++;
	 });
	});


}
exports.walk = walk;