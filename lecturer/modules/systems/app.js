var noticeboard = angular.module('App',['shoppinpal.mobile-menu', 'App.services', 'angularFileUpload']);
    
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
				controller: 'NoticesController',
            })
			
			 .when("/lecturer", {
                templateUrl: "partial/lecturer.html",
				  controller: 'LecturerController',
            })
			
			 .when("/settings", {
                templateUrl: "partial/settings.html",
				 controller: 'SettingsController',
            })
			
			.when("/students", {
                templateUrl: "partial/students.html",
				 controller: 'StudentsController',
            })
			
            .otherwise({
                redirectTo: "/main"
            });
    }]);
