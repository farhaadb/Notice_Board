'use strict';
   
function SettingsController($scope,$http,myNotices, $fileUploader) {

$scope.is_upload_complete=false;
$scope.pro_pic="http://localhost:3000/default/download.jpg";

$scope.show_default_image=false;
$scope.show_custom_image=false;

$scope.show_details_status=false;
$scope.show_password_status=false;

var ip="http://localhost:3000";

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

$scope.lecturer_id=localStorage.getItem("lecturer_id");

getDetails();
getProfilePic();

		//------------------------handle data from factory -------------------------------------//
	function getDetails(){
		//var d={'id' : $scope.lecturer_id};
		
		var d=$scope.lecturer_id;
		
		console.log(d);
		var url = ip+'/returnlecturerdetails';

		myNotices.post(url,{'id': d}).then(function(details) {
						var lecturer=details[0]	;
						$scope.user_name=lecturer.fname;
						$scope.user_lname=lecturer.lname;
						$scope.user_email=lecturer.email;
						$scope.user_title=lecturer.title;
						
						//use the below to check for any differences before saving
						$scope.saved_user_name = lecturer.fname;
						$scope.saved_user_lname = lecturer.lname;
						$scope.saved_user_email = lecturer.email;
						$scope.saved_user_title = lecturer.title;
						//$scope.selectedTitle=lecturer.title;
						//$scope.name=;
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING THE LECTURER DETAILS');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING THE LECTURER DETAILS';
        		}); 

		}
		
		function getProfilePic(){
	
		var d = $scope.lecturer_id;
		var url = ip+"/returnlecturerpicture";

		myNotices.post(url,{'path': d}).then(function(pic) {
						if(pic.status!=undefined)
						{
							$scope.show_custom_image=false;	
							$scope.show_default_image=true;
							
							$scope.is_upload_complete=false; //we do this in case a picture is uploaded and then deleted
						}
						
						else
						{
							$scope.image_name=pic[0].name;
							
							$scope.img=ip+"/lecturer/"+$scope.lecturer_id+"/profile/"+$scope.image_name;
							$scope.show_default_image=false;
							$scope.show_custom_image=true;	
						}
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING THE PROFILE PICTURE');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING THE PROFILE PICTURE';
        		}); 

		}
		
		$scope.deleteProfilePic = function(){
		
			var url = ip+"/removelecturerfile";
			
			var path = $scope.lecturer_id+"/profile/"+$scope.image_name;

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
				sql = "UPDATE lecturer SET fname='"+$scope.user_name+"'";
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
					sql = "UPDATE lecturer SET lname='"+$scope.user_lname+"'";
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
					sql = "UPDATE lecturer SET email='"+$scope.user_email+"'";
					has_started_string_construction=true;
				}
			}
			
			if($scope.saved_user_title!=$scope.user_title && $scope.user_title!="")
			{
				if(has_started_string_construction)
				{
					sql+=",title='"+$scope.user_title+"'";
				}
				
				else
				{
					sql = "UPDATE lecturer SET title='"+$scope.user_title+"'";
					has_started_string_construction=true;
				}
			}
			
			if(has_started_string_construction)
			{
				sql+=" WHERE id='"+$scope.lecturer_id+"'";
				
				var url=ip+"/updatelecturersettings";
				
				myNotices.post(url,{'sql': sql}).then(function(status) {
					getDetails();
					$scope.show_details_status=true;
					if(status.status=="success")
					{
						$scope.details_status="Details successfully changed";
					}
				},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING THE LECTURER DETAILS');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING THE LECTURER DETAILS';
        		}); 

			}
			
			else
			{
				console.log("Nothing to save");
			}	
		
		
		}
		
		var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: '../file-upload',
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
			uploader.formData.push({ key: $scope.lecturer_id+"/profile" });
		}
		

}		
		
