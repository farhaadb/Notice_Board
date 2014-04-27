noticeboard.factory('myNotices', function($http, $q, $timeout) {
   return {
		getMsg: function() {
		    var url = 'http://10.0.0.4/NoticeBoard/Sputnik/0.0.2/notices.php?callback=JSON_CALLBACK';  //url to the server
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