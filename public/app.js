// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('meanMapApp', ['addCtrl', 'queryCtrl', 'geolocation', 'mapService', 'ngRoute'])
	// Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider){
        // Join Team Control Panel
        $routeProvider.when('/join', {
            controller: 'addController as addCtrl', 
            templateUrl: 'partials/addForm.html',

            // Find Teammates Control Panel
        }).when('/find', {
			controller: 'queryController as queryCtrl',
            templateUrl: 'partials/queryForm.html',

            // All else forward to the Join Team Control Panel
        }).otherwise({redirectTo:'/join'})
    });