'use strict';
   
function MainController($scope,$http ,myNotices,$window) {
	$scope.statusmessage =  'Updating...';
	var ip = "http://localhost:3000";
	var path_history=[];
	var disallowed_characters=["\\", "/", ":", "*", "?", "\"", "<", ">", "|"];
	$scope.is_button_disabled=true;
	$scope.reload =function(){
	$window.location.reload();
	$scope.dir;
	}
	init();
	//Makes call to factory to get lecturer id
		function init(){
				$scope.conn = true;
				var url = ip+'/returnid';
				
				myNotices.get(url).then(function(data) { //success
					$scope.msg = data;
					$scope.lecturer_id=data[0].id;
					$scope.ready = true;
					getSubjects();
				},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING DATA');
					$scope.statusmessage =  ' WE ARE HAVING TROUBLE RETRIEVING DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		};
		
		//--------------------Makes call to factory to get subjects-----------------------------//
		function getSubjects(){
		var d={'id' : $scope.lecturer_id};
		var url = ip+'/returnsubjects';
		
		myNotices.post(url,d).then(function(subject) {
						console.log(subject);
						$scope.subject=subject;
						console.log($scope.subject);
						//$scope.updateView("DSYS102");
						getNotices();
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		};
			//--------------------Makes call to factory to get notices----------------------------//
		function getNotices(){
		var url = ip+'/returnnotices';
		
		myNotices.post(url,{'id':$scope.lecturer_id}).then(function(notices) {
						console.log(notices);
						$scope.notices=notices;
						console.log($scope.notices);
					
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		}
		
		$scope.deleteNotice = function(id){
			console.log(id);
				
			var url = ip+'/deletenotice';
				
			myNotices.post(url,{'id':id}).then(function(notices) {
					console.log(notices);
					$scope.notices=notices;
					console.log($scope.notices);
					
			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES';
				$scope.ready =true;
				$scope.conn = false;
        	});
			
		}
		
		//-------------------------------------------------------------------------------------//
		//All functions pertaining to the directory listing
		//-------------------------------------------------------------------------------------//
		
		
		//--------------------Makes call to factory to update View-----------------------------//
		$scope.updateView = function(subject, initial_view){
		
		initial_view = initial_view || false; //assigns false by default if no parameter is passed in
		
		if(initial_view)
		{
			document.getElementById("initial").className = "";
			document.getElementById("file").className = "hidden";
			document.getElementById("folder").className = "hidden";
			document.getElementById("directory_options").className = "hidden";
			return;
		}
		
		if((document.getElementById("folder").className) == "hidden" && (document.getElementById("file").className) == "hidden"
			&& (document.getElementById("directory_options").className) == "hidden")
		{
			var path = $scope.lecturer_id+"/subjects/"+subject;
		}
		
		else
		{
			var path = subject;
		}
		console.log(path);
		
		if(path_history.length>0) //don't store duplicates
		{ console.log(path_history[(path_history.length-1)]+"==="+path);
			if(path_history[(path_history.length-1)]!=path)
			{
				path_history.push(path);		
			}
		}
		
		else
		{
			path_history.push(path);
		}
		var url = ip+'/listDirectory';
		
		myNotices.post(url,{'path':path}).then(function(dir) {
						console.log(dir);
						$scope.dir=dir;
						
						if(dir.status!=undefined) //no file or folder in directory
						{
							document.getElementById("file").className = "hidden";
							document.getElementById("folder").className = "hidden";
							return;
						}
						
						document.getElementById("initial").className = "hidden";
						
						var has_folder=false;
						var has_file=false;
						
						for (var i in dir)
						{
							if(dir[i].folder=="false") //this is a file
							{
								has_file=true;
							}
							
							else
							{
								has_folder=true;
							}
						}
						
						if(has_file)
						{
							document.getElementById("file").className = "";
						}
						
						else
						{
							document.getElementById("file").className = "hidden";
						}
						
						if(has_folder)
						{
							document.getElementById("folder").className = "";
						}
						
						else
						{
							document.getElementById("folder").className = "hidden";
						}
						
						
						document.getElementById("directory_options").className = "";
		},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE RETRIEVING PATH DATA');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING PATH DATA';
				$scope.ready =true;
				$scope.conn = false;
        	});
		
		}
		
		//--------------------Goes up one level to previous folder-----------------------------//
		$scope.goBack = function(){
		
			var path=path_history.pop();
			
			if(path_history.length==0)
			{
				$scope.updateView(path, true);
			}
			
			else
			{
				path=path_history.pop(); //pop another since the current directory will be stored as well
				$scope.updateView(path);
			}
						
		}
		
		//--------------------Performs sanity check for disallowed characters in folder name-----------------------------//
		$scope.checkCharacters = function(){
		
			var s=$scope.folder_name;
			
			if(s==="" || s==null)
			{
				$scope.is_button_disabled=true;
				return;
			}
						
			var found_disallowed=false;
			
			for(var i=0; i<disallowed_characters.length; ++i)
			{
			
				if(s.indexOf(disallowed_characters[i])!=-1)
				{
					found_disallowed=true;
				}
			}
			
			if(found_disallowed)
			{
				$scope.is_button_disabled=true;
				document.getElementById("folder_error").className = "";
			}
			
			else
			{
				$scope.is_button_disabled=false;
				document.getElementById("folder_error").className = "hidden";
			}
						
		}
		
		//--------------------Creates a new folder within working directory-----------------------------//
		$scope.addFolder = function(folder){
			
			var path=path_history[(path_history.length-1)]+"/"+folder;
			var url = ip+'/addfolder';
			
			myNotices.post(url,{'path':path}).then(function(status) {
			
				//should reload view here
				
				if(status.status=="success")
				{
					$scope.updateView(path_history[(path_history.length-1)]);
					$scope.folder_name="";
					$scope.is_button_disabled=true;
				}
						
			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE ADDING THE FOLDER');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE ADDING THE FOLDER';
				$scope.ready =true;
				$scope.conn = false;
        	});
			
		}
		
		//--------------------Removes a specific file within working folder-----------------------------//
		$scope.removeFile = function(path){
			console.log(path);
			
			var url = ip+'/removefile';
			
			myNotices.post(url,{'path':path}).then(function(status) {
			
				//should reload view here
				
				if(status.status=="success")
				{
					$scope.updateView(path_history[(path_history.length-1)]);
				}
						
			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE DELETING THE FILE');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE DELETING THE FILE';
				$scope.ready =true;
				$scope.conn = false;
        	});
			
		}
		
		//--------------------Removes folder and all subfolders and files-----------------------------//
		$scope.removeFolder = function(path){
			console.log(path);
			
			var url = ip+'/removefolder';
			
			myNotices.post(url,{'path':path}).then(function(status) {
			
				//should reload view here
	
				if(status.status=="success")
				{
					$scope.updateView(path_history[(path_history.length-1)]);
				}
						
			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE DELETING THE FOLDER');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE DELETING THE FOLDER';
				$scope.ready =true;
				$scope.conn = false;
        	});
			
		}
		
		//-------------------------------------------------------------------------------------//
		//End of all functions pertaining to the directory listing
		//-------------------------------------------------------------------------------------//
		
		
		
}						
