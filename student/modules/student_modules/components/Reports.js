'use strict';
   
function ReportsController($scope,$http ,myNotices,$window) {
	$scope.statusmessage =  'Updating...';
	$scope.ip = myNotices.ip;
	$scope.student_id=localStorage.getItem("student_id");
	
	$scope.reload =function(){
	$window.location.reload();
	}
	
	getSubjects();
	getStudentDetails();
	getStudentPicture();
	
	function getSubjects(){
		var d={'id' : $scope.student_id};
		var url = $scope.ip+'/returnstudentsubjects';

		myNotices.post(url,d).then(function(subject) {
						console.log(subject);
						getMarks(subject);
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});

		};
		
	function getMarks(subject){
	
		var subject_path=[];
		var subject_name=[];
		for(var i=0; i<subject.length; ++i)
		{
			subject_path.push("lecturer/"+subject[i].lecturer_id+"/marks/"+subject[i].id+".xlsx");
			subject_name.push(subject[i].name);
		}
		
		var d={'id' : $scope.student_id, 'subject_path': subject_path, 'subject_name': subject_name};
		var url = $scope.ip+'/returnstudentmarks';
		
		
		console.log(subject_path);

		myNotices.post(url,d).then(function(data) {
			console.log(data);
			$scope.data=data;
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

}						