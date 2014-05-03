function directory(fs, path, req, res, action)
{
	if(action=="list"){
		console.log("path = " + path);
		fs.readdir(path, function(err, list) {
		if (err) 
		{
			console.log(err);
			res.send(err);
			return;
		}
		
		if(list.length>0){
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
					console.log(f+"======");
			
					res.send(f);
				}
				z++;
			});
		}
		
		else{
			res.send({'status':'empty'});
		}
		
		});
	}
		
	else if(action=="removeFile"){
		console.log("Removing file " + path);
		
		fs.unlink(path, function (err) {
			if (err){
				console.log(err);
				res.send({'status':'failure'});
				return;
			}
		
			res.send({'status':'success'});
		});
	}
		
	else if(action=="removeFolder"){
		console.log("Removing Folder " + path);
		
		var rimraf = require("rimraf"); //to simulate rm -rf
		
		rimraf(path, function (err) {
			if (err){
				console.log(err);
				res.send({'status':'failure'});
				return;
			}
		
			res.send({'status':'success'});
		});
	}
	
	else if(action=="addFolder"){
		console.log("Add Folder " + path);
		
		fs.mkdir(path, function (err) {
			if (err){
				console.log(err);
				return;
			}
		
			res.send({'status':'success'});
		});
	}
	
	else{
		console.log("Uknown action " + action);
		return;
	}
		
		
 

}
exports.directory = directory;