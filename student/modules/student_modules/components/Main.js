'use strict';
   
function MainController($scope,$http ,myNotices,$window) {
	$scope.statusmessage =  'Updating...';
	
	$scope.reload =function(){
	$window.location.reload();
	}
	
	$scope.student_id=localStorage.getItem("student_id");
	$scope.ip = myNotices.ip;
	
	var url = $scope.ip+'/getnotices';
	
	init();
	getStudentDetails();
	getStudentPicture();
	
		function init(){
				$scope.conn = true;
				myNotices.post(url,{'student_id':$scope.student_id}).then(function(data) { //success
					console.log(data);
					
					for(var i=0; i<data.length; ++i)
					{
						//show time in human readable manner
						data[i].timestamp=data[i].timestamp.slice(0, 19).replace('T', ' ');
						
						//check if picture is valid and set path to picture
						if(data[i].picture==null)
						{
							data[i].picture=$scope.ip+"/student_modules/resources/img/1.png";
						}
						
						else
						{
							data[i].picture=$scope.ip+"/lecturer/"+data[i].lecturer_id+"/profile/"+data[i].picture;
						}
						
						//display appropriate subject name if 'all' is the subject
						if(data[i].subject_name=="ALL")
						{
							data[i].subject_name="All Students";
						}
						
						//display as uploads with a link
						if(data[i].type=="upload")
						{
							var link = data[i].body.substr(32);
							console.log(link);
							data[i].body="Files have been uploaded. <a href = #/files/?"+link+">Click here to go to uploads</a>";
						}
						
						//do something if it was marks
						else if(data[i].type=="marks")
						{
							data[i].body="Marks have been uploaded. <a href = #/reports/?>Click here to go to marks</a>";
						}
						
					}
					$scope.msg = data;
					$scope.ready = true;		
				},
				function(data) { //failure
					$scope.statusmessage =  ' WE ARE HAVING TROUBLE RETRIEVING DATA';
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
} 							
