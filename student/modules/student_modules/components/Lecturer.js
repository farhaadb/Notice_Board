'use strict';
   
function LecturerController($scope,$http,myNotices,$location) {
		var url = 'http://10.0.0.4:3000/gettable.html';
		var id = getUrlVars();
	    $scope.id = id;
		//------------------------handle data from factory -------------------------------------//
	    myNotices.get(url).then(function(data) {
		$scope.msg = data;
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
		
