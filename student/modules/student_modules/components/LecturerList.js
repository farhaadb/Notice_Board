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
	
		function init(){
				$scope.conn = true;
				myNotices.post(url,{'student_id':$scope.student_id}).then(function(data) { //success
				
					for(var i=0; i<data.length; ++i){
						//check if picture is valid and set path to picture
						if(data[i].picture==null){
							data[i].picture=$scope.ip+"/student_modules/resources/img/1.png";
						}
						
						else{
							data[i].picture=$scope.ip+"/lecturer/"+data[i].lecturer_id+"/profile/"+data[i].picture;
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
} 							
