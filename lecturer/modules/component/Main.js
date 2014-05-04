'use strict';
   
function MainController($scope,$http ,myNotices,$window) {
	$scope.statusmessage =  'Updating...';
	var ip = "http://localhost:3000";
	$scope.notice_text_limit=140;
	var path_history=[];
	var disallowed_characters=["\\", "/", ":", "*", "?", "\"", "<", ">", "|"];
	$scope.is_folder_button_disabled=true;
	$scope.is_notice_button_disabled=true;
	
	$scope.reload =function(){
	$window.location.reload();
	$scope.dir;
	}
	init();
	//Makes call to factory to get lecturer id
		function init(){
				$scope.conn = true;
				var url = ip+'/returnlecturerid';
				
				myNotices.get(url).then(function(data) { //success
					$scope.msg = data;
					$scope.lecturer_id=data[0].id;
					localStorage.setItem("lecturer_id",$scope.lecturer_id);
					$scope.ready = true;
					getSubjects();
				},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING DATA');
					$scope.statusmessage =  ' WE ARE HAVING TROUBLE RETRIEVING DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		};
		
		//--------------------Makes call to factory to get subjects-----------------------------//
		function getSubjects(){
		var d={'id' : $scope.lecturer_id};
		var url = ip+'/returnlecturersubjects';
		
		myNotices.post(url,d).then(function(subject) {
						console.log(subject);
						$scope.subject=subject;
						getNotices();
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		};
			//--------------------Makes call to factory to get notices----------------------------//
		function getNotices(){
		var url = ip+'/returnlecturernotices';
		
		myNotices.post(url,{'id':$scope.lecturer_id}).then(function(notices) {
						console.log(notices);
						
						//show time in human readable manner
						for(var i=0; i<notices.length; ++i)
						{
							notices[i].time=notices[i].time.slice(0, 19).replace('T', ' ');
						}
						
						$scope.notices=notices;
						console.log($scope.notices);
					
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		}
		
		$scope.addNotice = function(subject, title, body){
						
			var url = ip+'/addlecturernotice';
			
			myNotices.post(url,{'subject':subject, 'title':title, 'body':body, 'lecturer':$scope.lecturer_id}).then(function(status) {
					
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
		
		$scope.deleteNotice = function(id){
			console.log(id);
				
			var url = ip+'/deletelecturernotice';
				
			myNotices.post(url,{'id':id}).then(function(notices) {
					if(notices.status=="success")
					{
						getNotices();
					}
					
			},
			function(data) { //failure
				console.log('WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES');
				$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES';
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
		
		initial_view = initial_view || false; //assigns false by default if no parameter is passed in
		
		if(initial_view)
		{
			document.getElementById("initial").className = "";
			document.getElementById("file").className = "hidden";
			document.getElementById("folder").className = "hidden";
			document.getElementById("directory_options").className = "hidden";
			return;
		}
		
		if((document.getElementById("folder").className) == "hidden" && (document.getElementById("file").className) == "hidden"
			&& (document.getElementById("directory_options").className) == "hidden")
		{
			var path = $scope.lecturer_id+"/subjects/"+subject;
		}
		
		else
		{
			var path = subject;
		}
		console.log(path);
		
		if(path_history.length>0) //don't store duplicates
		{ 
			if(path_history[(path_history.length-1)]!=path)
			{
				path_history.push(path);		
			}
		}
		
		else
		{
			path_history.push(path);
		}
		var url = ip+'/listlecturerdirectory';
		
		myNotices.post(url,{'path':path}).then(function(dir) {
						console.log(dir);
						$scope.dir=dir;
						
						if(dir.status!=undefined) //no file or folder in directory
						{
							document.getElementById("directory_options").className = "";
							document.getElementById("initial").className = "hidden";
							document.getElementById("file").className = "hidden";
							document.getElementById("folder").className = "hidden";
							return;
						}
						
						document.getElementById("initial").className = "hidden";
						
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
							document.getElementById("file").className = "";
						}
						
						else
						{
							document.getElementById("file").className = "hidden";
						}
						
						if(has_folder)
						{
							document.getElementById("folder").className = "";
						}
						
						else
						{
							document.getElementById("folder").className = "hidden";
						}
						
						
						document.getElementById("directory_options").className = "";
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
		
			var path=path_history.pop();
			
			if(path_history.length==0)
			{
				$scope.updateView(path, true);
			}
			
			else
			{
				path=path_history.pop(); //pop another since the current directory will be stored as well
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
			
			for(var i=0; i<disallowed_characters.length; ++i)
			{
			
				if(s.indexOf(disallowed_characters[i])!=-1)
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
			
			var path=path_history[(path_history.length-1)]+"/"+folder;
			var url = ip+'/addlecturerfolder';
			
			myNotices.post(url,{'path':path}).then(function(status) {
			
				//should reload view here
				
				if(status.status=="success")
				{
					$scope.updateView(path_history[(path_history.length-1)]);
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
					$scope.updateView(path_history[(path_history.length-1)]);
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
					$scope.updateView(path_history[(path_history.length-1)]);
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
		
		
		
}						
