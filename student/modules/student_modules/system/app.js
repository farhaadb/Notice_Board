var noticeboard = angular.module('App',['ngRoute', 'shoppinpal.mobile-menu', 'App.services', 'ngSanitize'])
    
	noticeboard.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
        $routeProvider
            .when("/main", {
                templateUrl: "student_modules/partials/main.html",
				  controller: 'MainController',
            })
			
			 .when("/profile", {
                templateUrl: "student_modules/partials/profile.html",
				  controller: 'LecturerController',
            })

            .when("/reports", {
                templateUrl: "student_modules/partials/reports.html",
				  controller: 'ReportsController',
            })
			
			 .when("/lecturer", {
                templateUrl: "student_modules/partials/lecturer.html",
				  controller: 'LecturerController',
            })
			
			.when("/files", {
                templateUrl: "student_modules/partials/files.html",
				  controller: 'FilesController',
            })
			
			 .when("/settings", {
                templateUrl: "student_modules/partials/settings.html",
            })
			
			.when("/lecturerlist", {
                templateUrl: "student_modules/partials/lecturerlist.html",
				  controller: 'LecturerListController',
            })
			
			 .when("/about", {
                templateUrl: "student_modules/partials/about.html",
            })
			
            .otherwise({
                redirectTo: "/main"
            });
    }]);
