var noticeboard = angular.module('App',['ngRoute', 'shoppinpal.mobile-menu', 'App.services', 'angularFileUpload']);
    
	noticeboard.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
        $routeProvider
            .when("/main", {
                templateUrl: "lecturermodules/partials/main.html",
				  controller: 'MainController',
            })
			
			 .when("/profile", {
                templateUrl: "lecturermodules/partials/profile.html",
            })
			
            .when("/mynotices", {
                templateUrl: "lecturermodules/partials/mynotices.html",
				controller: 'NoticesController',
            })
			
			 .when("/lecturer", {
                templateUrl: "lecturermodules/partials/lecturer.html",
				  controller: 'LecturerController',
            })
			
			 .when("/settings", {
                templateUrl: "lecturermodules/partials/settings.html",
				 controller: 'SettingsController',
            })
			
			.when("/students", {
                templateUrl: "lecturermodules/partials/students.html",
				 controller: 'StudentsController',
            })
			
            .otherwise({
                redirectTo: "/main"
            });
    }]);
