'use strict';
   
function ProfileController($scope,$http,myNotices, $fileUploader) {

$scope.is_upload_complete=false;
var ip=myNotices.ip;
$scope.default_pic=ip+"/student_modules/resources/img/1.png";
$scope.delete_pic=ip+"/default/y.png";

$scope.show_default_image=false;
$scope.show_custom_image=false;

$scope.show_details_status=false;
$scope.show_password_status=false;



//not used at the moment
$scope.titles =[
    {
        "name": "Prof"
    },
    {
        "name": "Dr"
    },
    {
        "name": "Mr"
    },
    {
        "name": "Mrs"
    },
    {
        "name": "Miss"
    }
];

console.log($scope.titles);

$scope.selectedTitle="Prof";

$scope.student_id=localStorage.getItem("student_id");

getDetails();
getProfilePic();

		//------------------------handle data from factory -------------------------------------//
	function getDetails(){
		
		var d=$scope.student_id;
		
		console.log(d);
		var url = ip+'/returnstudentdetails';

		myNotices.post(url,{'id': d}).then(function(details) {
						var student=details[0]	;
						$scope.user_name=student.fname;
						$scope.user_lname=student.lname;
						$scope.user_email=student.email;
						
						//use the below to check for any differences before saving
						$scope.saved_user_name = student.fname;
						$scope.saved_user_lname = student.lname;
						$scope.saved_user_email = student.email;

		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING THE STUDENT DETAILS');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING THE STUDENT DETAILS';
        		}); 

		}
		
	function getProfilePic(){
	
		var d = $scope.student_id;
		var url = ip+"/returnstudentpicture";

		myNotices.post(url,{'path': d}).then(function(pic) {
						if(pic.status!=undefined)
						{
							$scope.show_custom_image=false;	
							$scope.show_default_image=true;
							
							$scope.is_upload_complete=false; //we do this in case a picture is uploaded and then deleted
							
							updateStudentPicture("empty");
						}
						
						else
						{
							$scope.image_name=pic[0].name;
							
							$scope.img=ip+"/student/"+$scope.student_id+"/profile/"+$scope.image_name;
							$scope.show_default_image=false;
							$scope.show_custom_image=true;	
							
							updateStudentPicture($scope.image_name);
						}
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING THE PROFILE PICTURE');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING THE PROFILE PICTURE';
        		}); 

		}
		
		$scope.deleteProfilePic = function(){
		
			var url = ip+"/removestudentfile";
			
			var path = $scope.student_id+"/profile/"+$scope.image_name;

			myNotices.post(url,{'path': path}).then(function(status) {
			
				if(status.status=="success")
				{
					getProfilePic();
				}
						
			},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE DELETING THE PROFILE PICTURE');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE DELETING THE PROFILE PICTURE';
        		}); 

		}
		
		$scope.save = function(){
		
			var has_started_string_construction = false;
			var sql;
			
			if($scope.saved_user_name!=$scope.user_name && $scope.user_name!="")
			{
				sql = "UPDATE student SET fname='"+$scope.user_name+"'";
				has_started_string_construction=true;
				
			}
			
			if($scope.saved_user_lname!=$scope.user_lname && $scope.user_lname!="")
			{
				if(has_started_string_construction)
				{
					sql+=",lname='"+$scope.user_lname+"'";
				}
				
				else
				{
					sql = "UPDATE student SET lname='"+$scope.user_lname+"'";
					has_started_string_construction=true;
				}
			}
			
			if($scope.saved_user_email!=$scope.user_email && $scope.user_email!="" && $scope.user_email!=undefined)
			{
				if(has_started_string_construction)
				{
					sql+=",email='"+$scope.user_email+"'";
				}
				
				else
				{
					sql = "UPDATE student SET email='"+$scope.user_email+"'";
					has_started_string_construction=true;
				}
			}
			
			if(has_started_string_construction)
			{
				sql+=" WHERE id='"+$scope.student_id+"'";
				
				var url=ip+"/updatestudentsettings";
				
				myNotices.post(url,{'sql': sql}).then(function(status) {
					getDetails();
					$scope.show_details_status=true;
					if(status.status=="success")
					{
						$scope.details_status="Details successfully changed";
					}
				},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING THE STUDENT DETAILS');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING THE STUDENT DETAILS';
        		}); 

			}
			
			else
			{
				console.log("Nothing to save");
			}	
		
		
		}
		
		var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: '../student-picture-upload',
            filters: [
                function (item) {                    // first user filter
                    var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
					type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
					return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            ],
			queueLimit: 1,
			autoUpload: true,
			removeAfterUpload: true
        });


		uploader.bind('completeall', function (event, items) {
			//get directory listing first so that we can delete the previous uploaded picture
			if($scope.show_default_image==false) //we can safely assume that the folder is already empty so no need to delete
			{
				$scope.deleteProfilePic(); //deleteProfilePic() will also call getProfilePic()
			}
			
			else
			{
				getProfilePic();
			}
			
			$scope.is_upload_complete=true;
            
			
        });
		
		uploader.bind('afteraddingfile', function (event, items) {
			$scope.is_upload_complete=false;
			$scope.file_name=items.file.name;
            			
        });
		
		updateUploadPath();

		//update path to upload to
		function updateUploadPath(){
			uploader.formData.push({ key: $scope.student_id+"/profile" });
		}
		
		function updateStudentPicture(picture){
		
			var url=ip+"/updatestudentpicture";
		
			myNotices.post(url,{'id': $scope.student_id, 'picture': picture}).then(function(pic) {
				console.log("image successfully uploaded");
			},
			
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE ADDING THE PROFILE PICTURE TO THE DATABASE');
				$scope.statusmessage =  'WE ARE HAVING ADDING THE PROFILE PICTURE TO THE DATABASE';
       		}); 

		}
		

}		
		
