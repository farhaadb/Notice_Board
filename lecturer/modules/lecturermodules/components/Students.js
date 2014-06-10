'use strict';
 
function StudentsController($scope,$http ,myNotices,$window, $fileUploader) {

	var ip=myNotices.ip;
	var s = document.getElementById("subject");

	var post_notice=false; //check if we need to post a notice or not
	var subject; //used when adding a notice
	
	$scope.lecturer_id=localStorage.getItem("lecturer_id");
	$scope.show_options=false;
	$scope.show_dropdown=true;
	
	getSubjects();
	
	function getSubjects(){
		var d={'id' : $scope.lecturer_id};
		var url = ip+'/returnlecturersubjects';

		myNotices.post(url,d).then(function(subject) {
			console.log(subject);
			if(subject.length!=0){
				$scope.show_options=true;
				document.getElementById("marks_id").checked=true;
			}
			
			else{
				document.getElementById("subject_id").checked=true;
			}
			$scope.subject=subject;
		},
		function(data) { //failure
			console.log('WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA');
			$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA';
			$scope.ready =true;
			$scope.conn = false;
        });

	};
	
	$scope.changePath = function(type){
		if(type=="marks"){
			updateUploadPath("marks");
			$scope.show_dropdown=true;
		}
		
		else if(type=="students"){
			updateUploadPath("students");
			$scope.show_dropdown=true;
		}
		
		else if(type=="subjects"){
			updateUploadPath("subjects");
			$scope.show_dropdown=false;
		}
		
		else{
			console.log("We do not support the type "+ type);
		}
	
	}
	
	//this function is also called only when marks are uploaded
	$scope.addNotice = function(subject, title, body, type){

		var url = ip+'/addlecturernotice';

		myNotices.post(url,{'subject':subject, 'title':title, 'body':body, 'type':type, 'lecturer':$scope.lecturer_id}).then(function(status) {
			console.log("successfully added notice");
		},
		function(data) { //failure
			console.log('WE ARE HAVING TROUBLE ADDING YOUR NOTICE');
			$scope.statusmessage =  'WE ARE HAVING TROUBLE ADDING YOUR NOTICE';
			$scope.ready =true;
			$scope.conn = false;
       	});
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
			
			$scope.addNotice(subject.value, title, body, "marks");
			post_notice=false;
		}
		
		getSubjects();
		MainController($scope,$http ,myNotices,$window, $fileUploader); //used to update post notices modal
    });
		
	uploader.bind('afteraddingfile', function (event, items) {
		$scope.is_upload_complete=false;  
		
		if($scope.value=="marks")
		{
			subject = s.options[s.selectedIndex];
			post_notice=true;
		}
    });
	
	function updateUploadPath(path){
		uploader.formData.push({ path: $scope.lecturer_id+"/"+path }); //marks/students/subjects - path on file system
		updateType(path);
	}
	
	uploader.formData.push({ lecturer: $scope.lecturer_id }); //which lecturer
	
	function updateSubject(id){
		uploader.formData.push({ subject: id }); //which subject
	}
	
	function updateType(type){
		uploader.formData.push({ type: type }); //marks/students/subjects - used to tell server to update table and add student
	}
	
	$scope.setSelectedSubject = function(){
		
		console.log(s.options[s.selectedIndex].value);
		s.selectedIndex=s.selectedIndex;
		updateSubject(s.options[s.selectedIndex].value);
	
	}

		
} 										