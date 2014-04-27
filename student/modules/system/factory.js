noticeboard.factory('myNotices', function($http, $q, $timeout) {
   return {
		getMsg: function() {
		    var url = 'http://mysite.com/gettable.html';  //url to the server
			var deferred = $q.defer();
			$http.get(url)
				.success(function(data) {
					deferred.resolve(data); //resolves the promise
				})
				.error(function(){
					deferred.reject(); //rejects the promise
				});
			return deferred.promise;
		},
   }
});
