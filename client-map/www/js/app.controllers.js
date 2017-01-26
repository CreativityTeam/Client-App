angular.module('app.controllers',['ngMap'])

.constant('API_ENDPOINT','http://192.168.0.101:3000')

.controller('loginController',function($scope, $state){
    $scope.login = function(){
        $state.go('map');
    }
})

.controller('mapController',function($scope, NgMap, API_ENDPOINT, MapService){                
    $scope.anchor = {'lat':16.791537, 'lng':107.198179};
    $scope.marker = new google.maps.Marker();
    $scope.directionsDisplay = new google.maps.DirectionsRenderer();        
    var initMap = function(){
        NgMap.getMap().then(function(map){
            $scope.map = map;                                    
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
        })
    }
    initMap();

    var ioConnect = function(){
        var ioLocation = io.connect(API_ENDPOINT);
        ioLocation.on('location',function(location){
            console.log('Location from server: ' + location['latitude'] + ' ' + location['longitude']);
            $scope.trackLocation = {'lat': location['latitude'], 'lng': location['longitude']};            
            if ($scope.map){
                // MapService.eraseAllMarkers($scope.markers);
                MapService.addMarker($scope.map, $scope.trackLocation, $scope.marker, $scope.anchor);
                // MapService.eraseAllDirectionsDisplays($scope.directionsDisplay);
                MapService.getDirection($scope.map, $scope.trackLocation, $scope.anchor, $scope.directionsDisplay);
            }            
        })
    }

    ioConnect();
})