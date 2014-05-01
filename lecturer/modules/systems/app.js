var noticeboard = angular.module('App',['shoppinpal.mobile-menu', 'App.services']);
    
	noticeboard.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
        $routeProvider
            .when("/main", {
                templateUrl: "partial/main.html",
				  controller: 'MainController',
            })
			
			 .when("/profile", {
                templateUrl: "partial/profile.html",
            })
			
            .when("/mynotices", {
                templateUrl: "partial/mynotices.html",
				controller: 'MainController',
            })
			
			 .when("/lecturer", {
                templateUrl: "partial/lecturer.html",
				  controller: 'LecturerController',
            })
			
			 .when("/settings", {
                templateUrl: "partial/settings.html",
            })
			
            .otherwise({
                redirectTo: "/main"
            });
    }]);
