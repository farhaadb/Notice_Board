'use strict';
   
function AboutController($scope,$http,myNotices,$location) {

	$scope.student_id=localStorage.getItem("student_id");
	$scope.ip = myNotices.ip;
		
	$scope.reload =function(){
		$window.location.reload();
	}
	
	getStudentDetails();
	getStudentPicture();
	
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
		
