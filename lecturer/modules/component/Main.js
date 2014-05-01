'use strict';
   
function MainController($scope,$http ,myNotices,$window) {
	$scope.statusmessage =  'Updating...';
	$scope.reload =function(){
	$window.location.reload();
	$scope.dir;
	}
	init();
	//Makes call to factory to get lecturer id
		function init(){
				$scope.conn = true;
				var url = 'http://10.0.0.10:3000/returnid';
				
				myNotices.get(url).then(function(data) { //success
					$scope.msg = data;
					$scope.lecturer_id=data[0].id;
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
		
		//--------------------Makes call to factory to get subjects-----------------------------
		function getSubjects(){
		var d={'id' : $scope.lecturer_id};
		var url = 'http://10.0.0.10:3000/returnsubjects';
		
		myNotices.post(url,d).then(function(subject) {
						console.log(subject);
						$scope.subject=subject;
						console.log($scope.subject);
						//$scope.updateView("DSYS102");
						getNotices();
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING SUBJECTS DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		};
			//--------------------Makes call to factory to get notices----------------------------
		function getNotices(){
		var url = 'http://10.0.0.10:3000/returnnotices';
		
		myNotices.post(url,{'id':$scope.lecturer_id}).then(function(notices) {
						console.log(notices);
						$scope.notices=notices;
						console.log($scope.notices);
					
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING YOUR NOTICES';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		};
		
		
		//--------------------Makes call to factory to update View-----------------------------
		$scope.updateView = function(subject){
		
		if((document.getElementById("dropbox2").className) == "hidden")
		{
			var path = $scope.lecturer_id+"/subjects/"+subject;
		}
		
		else
		{
			var path = subject;
		}
		console.log(path);
		var url = 'http://10.0.0.10:3000/dir';
		
		myNotices.post(url,{'path':path}).then(function(dir) {
						console.log(dir);
						$scope.dir=dir;
						console.log($scope.dir);
						console.log($scope.subject);
						
						document.getElementById("dropbox").className = "hidden";
						document.getElementById("dropbox2").className = "";
						
						document.getElementById("dropbox3").innerHTML="";
						document.getElementById("dropbox3").className = "";
						
					//document.getElementById("dropbox3").innerHTML="<li>hello</li>";
					
						for (var i in dir)
						{
							if(dir[i].folder=="false")
							{
								document.getElementById("dropbox3").innerHTML=document.getElementById("dropbox3").innerHTML+"<a href=http://10.0.0.10:3000/lecturer/"+dir[i].path+" download><li  class='topcoat-list__item' style='background-color: #FFFFFF;'><div><img style='float:left; width 42px; height:45px; margin-right:10px;'class='movieimg' src='resources/img/1.png' /><strong style='font-size:17px;'></strong><p style='font-size:12px;'>"+dir[i].name+"</p></div><div style='clear:both;'></div></li></a>";
								//alert(x);
								//files.push(dir[i].name);
							}
						}
						
						
						
					/*	
						var x=document.getElementById("dropbox");
						x.innerHTML="";	

						
						$scope.html="<li  ng-show='ready' class='topcoat-list__item' style='background-color: #FFFFFF;'><strong style='font-size:17px;'>{{test}}</strong><p style='font-size:12px;'>{{item.status}}</p></div><div style='clear:both;'></div></li>";*/
		},
				function(data) { //failure
					console.log('WE ARE HAVING TROUBLE RETRIEVING PATH DATA');
					$scope.statusmessage =  'WE ARE HAVING TROUBLE RETRIEVING PATH DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});
		
		};
		/*
		$http({method: 'POST', url: 'http://10.0.0.10:3000/dir', data: {'path' : path}}).
					success(function(dir, status, headers, config) {
						
						//console.log(dir.names);
						console.log(dir);
						$scope.dir=dir;
						console.log($scope.dir);
						console.log($scope.subject);
									
						//document.getElementById("dropbox").className = "hidden";
						//document.getElementById("dropbox2").className = "";
						console.log($scope.dir);
						var x=document.getElementById("dropbox");
						x.innerHTML="";	

						$scope.test="hel";
						
						$scope.html="<li  ng-show='ready' class='topcoat-list__item' style='background-color: #FFFFFF;'><strong style='font-size:17px;'>{{test}}</strong><p style='font-size:12px;'>{{item.status}}</p></div><div style='clear:both;'></div></li>";
						/*
						angular.element(document).injector().invoke(function($compile) {
						var scope = angular.element($scope.hi).scope();
						$compile($scope.hi)(scope);
						});
						
						*
						
						
						//console.log(dir);
					}).
					error(function(data, status, headers, config) {
					
					});*/
			
			$scope.deleteNotice = function(id){
				console.log(id);
				
				var url = 'http://10.0.0.10:3000/deletenotice';
				
				myNotices.post(url,{'id':id}).then(function(notices) {
						console.log(notices);
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
		
}						
