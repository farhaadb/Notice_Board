'use strict';
   
function MainController($scope,$http ,myNotices,$window) {
	$scope.statusmessage =  'Updating...';
	$scope.reload =function(){
	$window.location.reload();
	}
	init();
	
		function init(){
				$scope.conn = true;
				myNotices.getMsg().then(function(data) { //success
					$scope.msg = data;
					$scope.ready = true;		
				},
				function(data) { //failure
					$scope.statusmessage =  ' WE ARE HAVING TROUBLE RETRIEVING DATA';
					$scope.ready =true;
					$scope.conn = false;
        		});
		};
} 							
