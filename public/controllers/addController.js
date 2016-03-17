// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var addCtrl = angular.module('addCtrl', ['geolocation', 'mapService']);
addCtrl.controller('addController', function($scope, $http, geolocation, map, $rootScope){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;
	// Get User's actual coordinates based on HTML5 at window load
	geolocation.getLocation().then(function(data){

		// Set the latitude and longitude equal to the HTML5 coordinates
		coords = {lat:data.coords.latitude, long:data.coords.longitude};

		// Display coordinates in location textboxes rounded to three decimal points
		$scope.formData.longitude = parseFloat(coords.long).toFixed(3);
		$scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

		// Display message confirming that the coordinates verified.
		$scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
		
		map.refresh($scope.formData.latitude, $scope.formData.longitude);
		$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+parseFloat(coords.lat)+','+parseFloat(coords.long)+'&key=AIzaSyAifPrAptAl7C1g88PYQWZ4GnTdtFXfu_k')
				.success(function(data){
					console.log(data.results[0].formatted_address);
					$scope.formData.address=data.results[0].formatted_address
				});
	});
    // Functions
    // Get coordinates based on mouse click. When a click event is detected....
		$rootScope.$on("clicked", function(){

			// Run the gservice functions associated with identifying coordinates
			$scope.$apply(function(){
				$scope.formData.latitude = parseFloat(map.clickLat).toFixed(3);
				$scope.formData.longitude = parseFloat(map.clickLong).toFixed(3);
				$scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
			});
			$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.formData.latitude+','+$scope.formData.longitude+'&key=AIzaSyAifPrAptAl7C1g88PYQWZ4GnTdtFXfu_k')
				.success(function(data){
					console.log(data);
					$scope.formData.address=data.results[0].formatted_address
				});
		});
    // Creates a new user based on the form fields
    $scope.createUser = function() {
		
        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";
				// Refresh the map with new data
				map.refresh($scope.formData.latitude, $scope.formData.longitude);
                
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
	$scope.viewPanorama= function(){
		document.getElementById('image').src = 'https://maps.googleapis.com/maps/api/streetview?size=645x322&location='+$scope.formData.latitude+','+$scope.formData.longitude+'&heading=151.78&pitch=-0.76&key=AIzaSyAifPrAptAl7C1g88PYQWZ4GnTdtFXfu_k';
		$scope.view = 1;
		
	};
	
});