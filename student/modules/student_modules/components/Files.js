'use strict';
   
function FilesController($scope,$http ,myNotices,$window,$location) {
	$scope.statusmessage =  'Updating...';
	$scope.ip = myNotices.ip;
	$scope.student_id=localStorage.getItem("student_id");;
	
	$scope.path_history=[];
	
	$scope.is_folder_button_disabled=true;
	$scope.is_notice_button_disabled=true;

	$scope.show_initial=true;
	$scope.show_file=false;
	$scope.show_folder=false;
	$scope.show_directory_options=false;
	$scope.dir;

	$scope.reload =function(){
	$window.location.reload();
	}
	
	getStudentDetails();
	getStudentPicture();
	
		
	//-------------- slice everything before the ? from the url ---------------------------//
	function getUrlVars() {
		
		var urlId = $location.url().slice($location.url().indexOf('?')+ 1);
		return urlId;
	}  

	//--------------------Makes call to factory to get subjects-----------------------------//
	function getSubjects(){
	var d={'id' : $scope.student_id};
	var url = $scope.ip+'/returnstudentsubjects';
	myNotices.post(url,d).then(function(subject) {
		console.log(subject);
		$scope.subject=subject;
						
						//getNotices();
		},
		function(data) { //failure
			console.log('WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA');
			$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA';
			$scope.ready =true;
			$scope.conn = false;
       	});

	};
		
	function getStudentDetails()
	{
		var url=$scope.ip+'/returnstudentdetails';
		
		myNotices.post(url,{'id': $scope.student_id}).then(function(details) {
			
				var student=details[0];
				$scope.fname=student.fname;
				$scope.lname=student.lname;
						
			},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING THE PROFILE DETAILS');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING THE PROFILE DETAILS';
        		}); 
	}
	

	function getStudentPicture()
	{
		var url=$scope.ip+'/returnstudentpicture';
		
		myNotices.post(url,{'path': $scope.student_id}).then(function(pic) {
			if(pic.status!=undefined)
			{
				$scope.profile_image=myNotices.default_profile_picture;
			}
						
			else
			{
				console.log(myNotices.default_profile_picture);
				$scope.image_name=pic[0].name;
				$scope.profile_image=$scope.ip+"/student/"+$scope.student_id+"/profile/"+$scope.image_name;
				
			}

		},
		function(data) { //failure
			console.log('WE ARE HAVING TROUBLE RETRIEVING THE PROFILE PICTURE');
			$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING THE PROFILE PICTURE';
        }); 
	}

		//-------------------------------------------------------------------------------------//
		//All functions pertaining to the directory listing
		//-------------------------------------------------------------------------------------//


		//--------------------Makes call to factory to update View-----------------------------//
		$scope.updateView = function(subject, lecturer_id, initial_view){
	
		initial_view = initial_view || false; //assigns false by default if no parameter is passed in
		lecturer_id = lecturer_id || 0; //assigns 0 by default if no parameter is passed in

		if(initial_view)
		{
			$scope.show_initial=true;
			$scope.show_file=false;
			$scope.show_folder=false;
			$scope.show_directory_options=false;
			$scope.show_file_upload=false;

			//document.getElementById("initial").className = "";
			//document.getElementById("file").className = "hidden";
			//document.getElementById("folder").className = "hidden";
			//document.getElementById("directory_options").className = "hidden";
			return;
		}

		if(!$scope.show_folder && !$scope.show_file && !$scope.show_directory_options)
		{	
			if(lecturer_id==0)
			{
				console.log("We have a lecturer id of 0 - this should not happen");
			}
			
			else
			{
				var path = lecturer_id+"/subjects/"+subject; //should only be called when we are in initial view
			}
		}

		else
		{
			var path = subject;
		}
		console.log(path);

		if($scope.path_history.length>0) //don't store duplicates
		{ 
			if($scope.path_history[($scope.path_history.length-1)]!=path)
			{
				$scope.path_history.push(path);		
			}
		}

		else
		{
			$scope.path_history.push(path);
		}
		var url = $scope.ip+'/listlecturerdirectory';
	
		myNotices.post(url,{'path':path}).then(function(dir) {
						console.log(dir);
						$scope.dir=dir;

						if(dir.status!=undefined && dir.status!="false") //no file or folder in directory
						{
							$scope.show_initial=false;
							$scope.show_file=false;
							$scope.show_folder=false;
							$scope.show_directory_options=true;
							
							//document.getElementById("directory_options").className = "";
							//document.getElementById("file").className = "hidden";
							//document.getElementById("folder").className = "hidden";
							return;
						}
						
						else if(dir.status=="false")
						{
							console.log("resetting...");
							$scope.path_history.length=0; //clear array
							$scope.updateView(path, 0, true); //go to initial view
							return;
							
						}
						$scope.show_initial=false;
						//document.getElementById("initial").className = "hidden";

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
							$scope.show_file=true;
						}

						else
						{
							$scope.show_file=false;
						}

						if(has_folder)
						{
							$scope.show_folder=true;
						}

						else
						{
							$scope.show_folder=false;
						}


						$scope.show_directory_options=true;
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

			var path=$scope.path_history.pop();

			if($scope.path_history.length==0)
			{
				$scope.updateView(path, 0, true);
			}

			else
			{
				path=$scope.path_history.pop(); //pop another since the current directory will be stored as well
				$scope.updateView(path);
			}

		}


		//-------------------------------------------------------------------------------------//
		//End of all functions pertaining to the directory listing
		//-------------------------------------------------------------------------------------//
		$scope.init = function(){
		
			getSubjects();
			var path=getUrlVars();
			path=path.replace(/%2F/g,"/");
			
			var num_slash = (path.match(/\//g)||[]).length; //find number of occurrences of the '/'
			
			if(num_slash>=2)
			{
				var tokens = path.split('/').slice(0);
				var lecturer=tokens[0];
				var subject=tokens[2];
				
				if(num_slash==2) //behave as if we were in initial view
				{
					$scope.updateView(subject, lecturer);
					
				}
				
				else //behave as if we were in a file or folder view
				{
					$scope.path_history.push(tokens[0]+"/"+tokens[1]+"/"+tokens[2]); // lecture_id/subjects/subject_id
					
					for(var i=3; i<tokens.length; ++i)
					{
						//build rest of path history
						$scope.path_history.push($scope.path_history[$scope.path_history.length-1]+"/"+tokens[i]); 
					}
					
					//force this so when we update view it'll go through the correct sequence
					$scope.show_directory_options=true; 
					$scope.show_initial=false;
					
					$scope.updateView(path);					
				
				}
				
			}
		}
		
		$scope.init();
}						