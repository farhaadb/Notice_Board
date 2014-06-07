'use strict';
   
function ReportsController($scope,$http ,myNotices,$window) {
	$scope.statusmessage =  'Updating...';
	var ip = myNotices.ip;
	$scope.student_id=localStorage.getItem("student_id");
	
	getSubjects();
	
	function getSubjects(){
		var d={'id' : $scope.student_id};
		var url = ip+'/returnstudentsubjects';

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
		var url = ip+'/returnstudentmarks';
		
		
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

}						