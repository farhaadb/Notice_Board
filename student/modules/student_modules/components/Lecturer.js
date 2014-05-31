'use strict';
   
function LecturerController($scope,$http,myNotices,$location) {

		$scope.student_id=localStorage.getItem("student_id");
		$scope.ip = myNotices.ip;
		$scope.email;
		$scope.full_name;
		$scope.picture;
		
		var url = $scope.ip+'/getnoticesbylecturerid';
		var id = getUrlVars();
	    $scope.id = id;
		//------------------------handle data from factory -------------------------------------//
	    myNotices.post(url,{'lecturer_id':getUrlVars(), 'student_id':$scope.student_id}).then(function(data) {
			console.log(data);
			
			for(var i=0; i<data.length; ++i)
				{
					//show time in human readable manner
					data[i].timestamp=data[i].timestamp.slice(0, 19).replace('T', ' ');
						
					//check if picture is valid and set path to picture
					if(data[i].picture==null)
					{
						$scope.picture=$scope.ip+"/default/download.jpg";
					}
						
					else
					{
						$scope.picture=$scope.ip+"/lecturer/"+data[i].lecturer_id+"/profile/"+data[i].picture;
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
					
					}
						
					$scope.email=data[i].email;
					$scope.full_name=data[i].lecturer_title+" "+data[i].fname+" "+data[i].lname;
					$scope.data=data;
				}
		},
		function(data) { //failure
			console.log('WE ARE HAVING TROUBLE RETRIEVING INFORMATION FROM THE DATABASE');
			$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING INFORMATION FROM THE DATABASE';
			$scope.ready =true;
			$scope.conn = false;
        });
 //Always quuery the db???
		//-------------- slice everything before the ? from the url ---------------------------//
		function getUrlVars() {
		
			var urlId = $location.url().slice($location.url().indexOf('?')+ 1);
            return urlId;
		}  
}		
		
