'use strict';
   
function NoticesController($scope,$http ,myNotices,$window) {

	var ip = "http://localhost:3000";
	$scope.lecturer_id=localStorage.getItem("lecturer_id");
	
	getNotices();

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
	
}