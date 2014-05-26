var noticeboard = angular.module('App',['shoppinpal.mobile-menu', 'App.services'])
    
	noticeboard.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
        $routeProvider
            .when("/main", {
                templateUrl: "studentmodules/partials/main.html",
				  controller: 'MainController',
            })
			
			 .when("/profile", {
                templateUrl: "studentmodules/partials/profile.html",
            })
			
            .when("/reports", {
                templateUrl: "studentmodules/partials/reports.html",
            })
			
			 .when("/lecturer", {
                templateUrl: "studentmodules/partials/lecturer.html",
				  controller: 'LecturerController',
            })
			
			 .when("/settings", {
                templateUrl: "studentmodules/partials/settings.html",
            })
			
            .otherwise({
                redirectTo: "/main"
            });
    }]);
