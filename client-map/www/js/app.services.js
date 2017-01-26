angular.module('app.services',[])

.service('MapService',function(){
    var addCircle = function(map, center, radius){
        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: center,
            radius: radius
        });
    };

    this.addMarker = function(map, location, marker, anchorPoint){        
        var latLng = new google.maps.LatLng(location['lat'], location['lng']);        
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        if (marker){
            for (var prop in marker){
                console.log(marker[prop]);
            }            
            console.log('Marker map ' + marker.map);
            marker.setMap(null); 
            marker = null;                       
        }
        marker = new google.maps.Marker({
            map: map,
            title: 'Shipper\'s location',
            animation: google.maps.Animation.BOUNCE,
            position: latLng
        });    
        // markers.push(marker);
        var bounds = new google.maps.LatLngBounds();        
        bounds.extend(anchorPoint);
        bounds.extend(marker.position);        
        map.fitBounds(bounds);

        addCircle(map,latLng);        
    };

    // this.eraseAllMarkers=function(markers){
    //     console.log('Markers length ' + markers.length);
    //     for (var i = 0; i < markers.length; i++) {
    //         markers[i].setMap(null);
    //         markers[i] = null;
    //     }
    // };

    this.getDirection = function(map, origin, destination, directionsDisplay){
        var directionsService = new google.maps.DirectionsService();
        if (directionsDisplay){
            directionsDisplay.setMap(null);
        }
        directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});         
        var request = {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        };           
        directionsService.route(request, function (response, status) {            
            if (status == 'OK') {                
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                // directionsDisplays.push(directionsDisplay);                
            }
            else {  
                console.log('Error ' + status);                              
                console.log('Something wrong. Maybe the shipper\'s position is unknown    now!');                                                                                       
            }        
        });
    };     

    // this.eraseAllDirectionsDisplays=function(directionsDisplays){
    //     for (var i = 0; i < directionsDisplays.length; i++) {
    //         directionsDisplays[i].setMap(null);
    //         directionsDisplays[i] = null;
    //     }
    // };
})