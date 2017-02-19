angular.module('app.services', [])

.constant('API_ENDPOINT',{         
    root:'http://test3721.herokuapp.com/',
    url: 'http://test3721.herokuapp.com/server'
})

.service('AuthService',function($q, $http,API_ENDPOINT){
    var token_local = "Create Toke Pls";
    var userlogedID = "Nhatdev";
    var isAuthenticated = false;
    var authToken;
    var userSaveID;

    var useToken = function(token){
        isAuthenticated = true;
        authToken = token;
    };

    var useInfor = function(userNotSave){
        window.localStorage.getItem(userlogedID);
        userSaveID = userNotSave;
    };

    var storeToken = function(token){
        window.localStorage.setItem(token_local,token);
        useToken(token);
    };

    var storeID = function(userID){
        window.localStorage.setItem(userlogedID,userID);
        useInfor(userID);
    };

    var destroyToken = function(){
        authToken = undefined;
        userSaveID = undefined;
        isAuthenticated = false;
        window.localStorage.removeItem(token_local);
        window.localStorage.removeItem(userlogedID);
    };

    var register = function(user){
        return $q(function(resolve,reject){
            $http.post(API_ENDPOINT.url + '/api/users/register' , user).then(function(response){
                if(response.data.success){
                    storeToken(response.data.token);
                    resolve(response.data.msg);
                }else{
                    reject(response.data.msg);
                }
            });
        });
    };

    var login = function(user){
        return $q(function(resolve,reject){
            $http.post(API_ENDPOINT.url + '/api/users/login' , user).then(function(response){
                if(response.data.success){
                    storeToken(response.data.token);
                    $http.get(API_ENDPOINT.url + '/api/users/findone/' + response.data.token).success(function(response){
                        if(response.success){
                            storeID(response.data._id);
                        }
                    });
                    resolve(response.data.msg);
                }else{
                    reject(response.data.msg);
                }
            });  
        })
    };

    var checkToken = function(){
        var token = window.localStorage.getItem(token_local);
        var userInfomarionID = window.localStorage.getItem(userlogedID);
        if(token){
            useToken(token);
            useInfor(userInfomarionID)
        }
    };

    checkToken();
    
    var logout = function(){
        destroyToken();
    };

  return {
    login: login,
    register: register,
    logout: logout,
    setToken : function(token) { return storeToken(token);},
    userInforIdSave : function() { return userSaveID},
    tokensave : function() {return authToken;},
    isAuthenticated: function() {return isAuthenticated;}
  };
})

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

    this.addMarker = function(map, location, markers, anchorPoint){        
        var latLng = new google.maps.LatLng(location['lat'], location['lng']);                        
                     
        var marker = new google.maps.Marker({
            map: map,
            title: 'Shipper\'s location',
            animation: google.maps.Animation.BOUNCE,
            position: latLng,
            icon: 'https://maps.google.com/mapfiles/kml/shapes/motorcycling.png'            
        });    
        markers.push(marker);
        var bounds = new google.maps.LatLngBounds();        
        bounds.extend(anchorPoint);
        bounds.extend(marker.position);        
        map.fitBounds(bounds);

        // addCircle(map,latLng);        
    };

    this.eraseAllMarkers = function(markers){        
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
            markers[i] = null;
        }
        markers.length = 0;
    };

    this.getDirection = function(map, origin, destination, directionsDisplays){
        var directionsService = new google.maps.DirectionsService();    
        var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        directionsDisplay.setPanel(document.getElementById('directions-panel'));         
        directionsDisplays.push(directionsDisplay);
        var request = {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        };           
        directionsService.route(request, function (response, status) {            
            if (status == 'OK') {          
                console.log('Get direction done');      
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);                               
            }
            else {  
                console.log('Error ' + status);                              
                console.log('Something wrong. Maybe the shipper\'s position is unknown now!');                                                                                       
            }        
        });
    };     

    this.eraseAllDirectionsDisplays = function(directionsDisplays){
        for (var i = 0; i < directionsDisplays.length; i++) {
            directionsDisplays[i].setMap(null);
            directionsDisplays[i] = null;
        }
        directionsDisplays.length = 0;
    };
})

.service('RatingService', function(API_ENDPOINT, $http, AuthService){        
    this.getRatingsObject = function(childUrl){                   
        return {
            iconOn: 'ion-ios-star',    //Optional
            iconOff: 'ion-ios-star-outline',   //Optional
            iconOnColor: 'rgb(200, 200, 100)',  //Optional
            iconOffColor:  'rgb(200, 100, 100)',    //Optional
            rating:  0, //Optional
            minRating:0,    //Optional
            readOnly: true, //Optional
            callback: function(rating, index) {    //Mandatory
                console.log('Selected rating is : ', rating, ' and the index is : ', index);        
                var ratingReq = {'score': rating, 'userId': AuthService.userInforIdSave()};                
                $http.put(API_ENDPOINT.url + childUrl, ratingReq).success(function(response){
                    console.log('Update rating successfully');
                });               
            }
        };
      };
})