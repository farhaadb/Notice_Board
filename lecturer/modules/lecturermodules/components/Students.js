'use strict';
 
function StudentsController($scope,$http ,myNotices,$window, $fileUploader) {

	var ip="http://localhost:3000";
	var m = document.getElementById("mark_subject");
	var s = document.getElementById("student_subject");
	var post_notice=false; //check if we need to post a notice or not
	var subject; //used when adding a notice
	
	$scope.lecturer_id=localStorage.getItem("lecturer_id");

	$scope.show_marks=false;
	$scope.show_students=false;
	$scope.is_mark_upload_complete=false;
	$scope.is_student_upload_complete=false;
	
	getSubjects();
	
	function getSubjects(){
		var d={'id' : $scope.lecturer_id};
		var url = ip+'/returnlecturersubjects';

		myNotices.post(url,d).then(function(subject) {
			console.log(subject);
			$scope.subject=subject;
		},
		function(data) { //failure
			console.log('WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA');
			$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA';
			$scope.ready =true;
			$scope.conn = false;
        });

	};
	
	//this function is also called only when marks are uploaded
	$scope.addNotice = function(subject, title, body){

		var url = ip+'/addlecturernotice';

		myNotices.post(url,{'subject':subject, 'title':title, 'body':body, 'lecturer':$scope.lecturer_id}).then(function(status) {
			console.log("successfully added notice");
		},
		function(data) { //failure
			console.log('WE ARE HAVING TROUBLE ADDING YOUR NOTICE');
			$scope.statusmessage =  'WE ARE HAVING TROUBLE ADDING YOUR NOTICE';
			$scope.ready =true;
			$scope.conn = false;
       	});
	}
	
	$scope.invertMarks = function(){
	
		$scope.show_marks=!$scope.show_marks;
		if($scope.show_marks)
		{
			$scope.show_students=false;
			updateUploadPath("marks");
		}
	}
	
	$scope.invertStudents = function(){
	
		$scope.show_students=!$scope.show_students;
		if($scope.show_students)
		{
			$scope.show_marks=false;
			updateUploadPath("students");
		}
	}
	
	var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: '../upload-student-data',
            filters: [
                function (item) {                    // first user filter
                    var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
					type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
					return '|vnd.openxmlformats-officedocument.spreadsheetml.sheet|xlx|xlsx|'.indexOf(type) !== -1;
                }
            ],
			queueLimit: 1,
			autoUpload: true,
			removeAfterUpload: true
    });


	uploader.bind('completeall', function (event, items) {
		$scope.is_upload_complete=true;
		
		if(post_notice)
		{
			var title="Marks uploaded";
			var body="Marks have been uploaded for " + subject.text;
			
			$scope.addNotice(subject.value, title, body);
			post_notice=false;
		}
    });
		
	uploader.bind('afteraddingfile', function (event, items) {
		$scope.is_upload_complete=false;  
		
		if($scope.show_marks)
		{
			subject = m.options[m.selectedIndex];
			post_notice=true;
		}
    });
	
	function updateUploadPath(path){
		uploader.formData.push({ path: $scope.lecturer_id+"/"+path }); //marks or students - path on file system
		updateType(path);
	}
	
	uploader.formData.push({ lecturer: $scope.lecturer_id }); //which lecturer
	
	function updateSubject(id){
		uploader.formData.push({ subject: id }); //which subject
	}
	
	function updateType(type){
		uploader.formData.push({ type: type }); //marks or students - used to tell server to update table and add student
	}
	
	$scope.setSelectedMarkSubject = function(){
		
		console.log(m.options[m.selectedIndex].value);
		s.selectedIndex=m.selectedIndex;
		updateSubject(m.options[m.selectedIndex].value);
	
	}
	
	$scope.setSelectedStudentSubject = function(){
		
		console.log(s.options[s.selectedIndex].value);
		m.selectedIndex=s.selectedIndex;
		updateSubject(s.options[s.selectedIndex].value);
	
	}
	
	
	
		
		
} 										