'use strict';
   
function LecturerListController($scope,$http ,myNotices,$window) {
	$scope.statusmessage =  'Updating...';
	
	$scope.reload =function(){
	$window.location.reload();
	}
	
	$scope.student_id=localStorage.getItem("student_id");
	$scope.ip = myNotices.ip;
	var url = $scope.ip+'/getstudentlecturers';
	
	init();
	getStudentDetails();
	getStudentPicture();
	
		function init(){
				$scope.conn = true;
				myNotices.post(url,{'student_id':$scope.student_id}).then(function(data) { //success
					
					for(var i=0; i<data.length; ++i){
						//check if picture is valid and set path to picture
						if(data[i].picture==null){
							data[i].picture=$scope.ip+"/student_modules/resources/img/1.png";
						}
						
						else{
							data[i].picture=$scope.ip+"/lecturer/"+data[i].id+"/profile/"+data[i].picture;
						}
					}
					
					$scope.lecturer=data;

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
