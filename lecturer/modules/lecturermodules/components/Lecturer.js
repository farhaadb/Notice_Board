'use strict';
   
function LecturerController($scope,$http,myNotices,$location) {
		
		var id = getUrlVars();
	    $scope.id = id;
		//------------------------handle data from factory -------------------------------------//
	    myNotices.getMsg().then(function(data) {
		$scope.msg = data;
		console.log(data);
				$.each(data, function(i,item){ 	
						if (item.empid  == id) {
								$scope.title = item.name ;	
					    }
				
			    })
		});
 //Always quuery the db???
		//-------------- slice everything before the ? from the url ---------------------------//
		function getUrlVars() {
		
			var urlId = $location.url().slice($location.url().indexOf('?')+ 1);
            return urlId;
		}  
}		
		
