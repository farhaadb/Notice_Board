'use strict';
   
function MainController($scope,$http ,myNotices,$window, $fileUploader) {
	$scope.statusmessage =  'Updating...';
	var ip = myNotices.ip;
	$scope.lecturer_id=localStorage.getItem("lecturer_id");
	$scope.notice_text_limit=140;
	$scope.path_history=[];
	$scope.disallowed_characters=["\\", "/", ":", "*", "?", "\"", "<", ">", "|"];
	$scope.is_folder_button_disabled=true;
	$scope.is_notice_button_disabled=true;

	$scope.show_initial=true;
	$scope.show_file=false;
	$scope.show_folder=false;
	$scope.show_directory_options=false;
	$scope.show_file_upload=false;
	$scope.dir;

	$scope.reload =function(){
	$window.location.reload();
	}
	getSubjects();

		//--------------------Makes call to factory to get subjects-----------------------------//
		function getSubjects(){
		var d={'id' : $scope.lecturer_id};
		var url = ip+'/returnlecturersubjects';

		myNotices.post(url,d).then(function(subject) {
						console.log(subject);
						$scope.subject=subject;
						//getNotices();
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});

		};

		//this function is also called when files are added so beware when changing this
		$scope.addNotice = function(subject, title, body, type){

			var url = ip+'/addlecturernotice';

			myNotices.post(url,{'subject':subject, 'title':title, 'body':body, 'type':type, 'lecturer':$scope.lecturer_id}).then(function(status) {

					if(status.status=="success");
					{
						$scope.notice_title="";
						$scope.notice_body="";
						$scope.notice_text_limit=140;
					}

			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE ADDING YOUR NOTICE');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE ADDING YOUR NOTICE';
				$scope.ready =true;
				$scope.conn = false;
        	});

		}


		$scope.checkLimit = function(){
			$scope.notice_text_limit=140-$scope.notice_body.length;	
			$scope.checkNoticeButton();
		}

		$scope.checkNoticeButton = function(){
			if($scope.notice_subject==undefined || $scope.notice_subject=="" || $scope.notice_title==undefined || $scope.notice_title=="" ||
			$scope.notice_body==undefined || $scope.notice_body=="")
			{
				$scope.is_notice_button_disabled=true;
			}

			else
			{
				$scope.is_notice_button_disabled=false;
			}

		}

		//-------------------------------------------------------------------------------------//
		//All functions pertaining to the directory listing
		//-------------------------------------------------------------------------------------//


		//--------------------Makes call to factory to update View-----------------------------//
		$scope.updateView = function(subject, initial_view){

		//to disable navigation when uploading
		if($scope.uploader.isUploading)
		{
			return;
		}

		initial_view = initial_view || false; //assigns false by default if no parameter is passed in

		if(initial_view)
		{
			$scope.show_initial=true;
			$scope.show_file=false;
			$scope.show_folder=false;
			$scope.show_directory_options=false;
			$scope.show_file_upload=false;

			//document.getElementById("initial").className = "";
			//document.getElementById("file").className = "hidden";
			//document.getElementById("folder").className = "hidden";
			//document.getElementById("directory_options").className = "hidden";
			return;
		}

		if(!$scope.show_folder && !$scope.show_file && !$scope.show_directory_options && !$scope.show_file_upload)
		{
			var path = $scope.lecturer_id+"/subjects/"+subject;
			$scope.subject_directory = subject //used for uploading a notice after upload complete
		}

		else
		{
			var path = subject;
		}
		console.log(path);

		if($scope.path_history.length>0) //don't store duplicates
		{ 
			if($scope.path_history[($scope.path_history.length-1)]!=path)
			{
				$scope.path_history.push(path);		
			}
		}

		else
		{
			$scope.path_history.push(path);
		}
		var url = ip+'/listlecturerdirectory';

		//push new path to file uploader
		updateUploadPath();

		myNotices.post(url,{'path':path}).then(function(dir) {
						console.log(dir);
						$scope.dir=dir;

						if(dir.status!=undefined) //no file or folder in directory
						{
							$scope.show_initial=false;
							$scope.show_file=false;
							$scope.show_folder=false;
							$scope.show_directory_options=true;
							$scope.show_file_upload=true;


							//document.getElementById("directory_options").className = "";
							//document.getElementById("file").className = "hidden";
							//document.getElementById("folder").className = "hidden";
							return;
						}
						$scope.show_initial=false;
						//document.getElementById("initial").className = "hidden";

						var has_folder=false;
						var has_file=false;

						for (var i in dir)
						{
							if(dir[i].folder=="false") //this is a file
							{
								has_file=true;
							}

							else
							{
								has_folder=true;
							}
						}

						if(has_file)
						{
							$scope.show_file=true;
						}

						else
						{
							$scope.show_file=false;
						}

						if(has_folder)
						{
							$scope.show_folder=true;
						}

						else
						{
							$scope.show_folder=false;
						}


						$scope.show_directory_options=true;
						$scope.show_file_upload=true;
		},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE RETRIEVING PATH DATA');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING PATH DATA';
				$scope.ready =true;
				$scope.conn = false;
        	});

		}

		//--------------------Goes up one level to previous folder-----------------------------//
		$scope.goBack = function(){

			var path=$scope.path_history.pop();

			if($scope.path_history.length==0)
			{
				$scope.updateView(path, true);
			}

			else
			{
				path=$scope.path_history.pop(); //pop another since the current directory will be stored as well
				$scope.updateView(path);
			}

		}

		//--------------------Performs sanity check for disallowed characters in folder name-----------------------------//
		$scope.checkCharacters = function(){

			var s=$scope.folder_name;

			if(s==="" || s==null)
			{
				$scope.is_folder_button_disabled=true;
				return;
			}

			var found_disallowed=false;

			for(var i=0; i<$scope.disallowed_characters.length; ++i)
			{

				if(s.indexOf($scope.disallowed_characters[i])!=-1)
				{
					found_disallowed=true;
				}
			}

			if(found_disallowed)
			{
				$scope.is_folder_button_disabled=true;
				document.getElementById("folder_error").className = "";
			}

			else
			{
				$scope.is_folder_button_disabled=false;
				document.getElementById("folder_error").className = "hidden";
			}

		}

		//--------------------Creates a new folder within working directory-----------------------------//
		$scope.addFolder = function(folder){

			var path=$scope.path_history[($scope.path_history.length-1)]+"/"+folder;
			var url = ip+'/addlecturerfolder';

			myNotices.post(url,{'path':path}).then(function(status) {

				//should reload view here

				if(status.status=="success")
				{
					$scope.updateView($scope.path_history[($scope.path_history.length-1)]);
					$scope.folder_name="";
					$scope.is_folder_button_disabled=true;
				}

			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE ADDING THE FOLDER');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE ADDING THE FOLDER';
				$scope.ready =true;
				$scope.conn = false;
        	});

		}

		//--------------------Removes a specific file within working folder-----------------------------//
		$scope.removeFile = function(path){
			console.log(path);

			var url = ip+'/removelecturerfile';

			myNotices.post(url,{'path':path}).then(function(status) {

				//should reload view here

				if(status.status=="success")
				{
					$scope.updateView($scope.path_history[($scope.path_history.length-1)]);
				}

			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE DELETING THE FILE');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE DELETING THE FILE';
				$scope.ready =true;
				$scope.conn = false;
        	});

		}

		//--------------------Removes folder and all subfolders and files-----------------------------//
		$scope.removeFolder = function(path){
			console.log(path);

			var url = ip+'/removelecturerfolder';

			myNotices.post(url,{'path':path}).then(function(status) {

				//should reload view here

				if(status.status=="success")
				{
					$scope.updateView($scope.path_history[($scope.path_history.length-1)]);
				}

			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE DELETING THE FOLDER');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE DELETING THE FOLDER';
				$scope.ready =true;
				$scope.conn = false;
        	});

		}

		//-------------------------------------------------------------------------------------//
		//End of all functions pertaining to the directory listing
		//-------------------------------------------------------------------------------------//

		//-------------------------------------------------------------------------------------//
		//All functions pertaining to file uploads
		//-------------------------------------------------------------------------------------//

		// create a uploader with options
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: '../file-upload',
            filters: [
                function (item) {                    // first user filter
                    console.info('filter1');
                    return true;
                }
            ]
        });


		uploader.bind('completeall', function (event, items) {
            $scope.updateView($scope.path_history[($scope.path_history.length-1)]);
			
			
			//upload notice here
			
			//remove lecturer_id/subjects from path
			var str = $scope.path_history[($scope.path_history.length-1)],
			delimiter = '/',
			start = 2,
			tokens = str.split(delimiter).slice(start),
			result = $scope.lecturer_id+"/subjects/"+tokens.join(delimiter);
			
			var title="Files uploaded";
			var body="New files have been uploaded to " + result;
			
			$scope.addNotice($scope.subject_directory,title,body,"upload");
        });

		//update path to upload to
		function updateUploadPath(){
			uploader.formData.push({ key: $scope.path_history[($scope.path_history.length-1)] });
		}


}						