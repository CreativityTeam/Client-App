angular.module('app.controllers', ['ngMap'])
  
.controller('lOISIRCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http) {

    var getListLoisirCategory = function(){
         $scope.listLoisirCategory = [];
         $http.get(API_ENDPOINT.url + '/api/categories/getList').success(function(response){
            for(var item in response.data){
                if(response.data[item].mainCategory == "Loisir"){
                    $scope.listLoisirCategory.push(response.data[item]);
                }
            }
        });
    };

    getListLoisirCategory()
})
   
.controller('rESTAURANTCtrl',function ($scope, $stateParams) {


})
   
.controller('bARKTVCtrl', function ($scope, $stateParams) {


})
   
.controller('loisirListeCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http) {
    var getListServiceBelongLoisir = function(){
         $scope.listLoisir = [];
         $http.get(API_ENDPOINT.url + '/api/services/findcategory/' + $stateParams.idLoisir).success(function(response){
            for(var item in response.data){
                    $scope.listLoisir.push(response.data[item]);
            }
        });
    };

    getListServiceBelongLoisir()

})
   
.controller('sALONDETHPATISSERUECtrl', function ($scope, $stateParams) {


})
   
.controller('mYCARTCtrl', function ($scope, $stateParams) {


})
   
.controller('mYORDERCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http) {

    var getOrderCurrentUser = function(){
        $http.get(API_ENDPOINT.url + '/api/orders/findinfobyuser/' + AuthService.userInforIdSave()).success(function(response){
            if(response.success){                                
                $scope.orderCurrentUser = response.data;
            }
        });   
    }

    getOrderCurrentUser();
})
   
.controller('fAVORITEFOODCtrl', function ($scope, $stateParams) {


})
   
.controller('fAVORITERESTAURANTCtrl', function ($scope, $stateParams) {


})
   
.controller('aroundCtrl', function ($scope, $stateParams) {
    
   function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }
    initMap();

})
   
// .controller('sHIPPINGCtrl', function ($scope, $stateParams) {    
//     function initMap() {
//         var map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 15
//         });
//         var infoWindow = new google.maps.InfoWindow({map: map});

//         // Try HTML5 geolocation.
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(function(position) {
//             var pos = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             };

//             infoWindow.setPosition(pos);
//             infoWindow.setContent('Location found.');
//             map.setCenter(pos);
//           }, function() {
//             handleLocationError(true, infoWindow, map.getCenter());
//           });
//         } else {
//           // Browser doesn't support Geolocation
//           handleLocationError(false, infoWindow, map.getCenter());
//         }
//       }
//     initMap();

// })

.controller('sHIPPINGCtrl',function($scope, $stateParams, NgMap, API_ENDPOINT, MapService){                    
    // console.log("Order ID: " + $stateParams.orderid);
    // console.log("Order Lat: " + $stateParams.lat);
    // console.log("Order Lng: " + $stateParams.lng);
    $scope.anchor = {'lat':parseFloat($stateParams.lat), 'lng':parseFloat($stateParams.lng)};
    $scope.marker = new google.maps.Marker();
    $scope.directionsDisplay = new google.maps.DirectionsRenderer();        
    var initMap = function(){
        NgMap.getMap().then(function(map){
            $scope.map = map;                                                
        })
    }
    initMap();

    var ioConnect = function(){
        var ioLocation = io.connect(API_ENDPOINT.root);
        ioLocation.on('location',function(location){
            console.log('Location from server: order #' + location['id'] + ' ' + location['latitude'] + ' ' + location['longitude']);
            $scope.trackLocation = {'lat': location['latitude'], 'lng': location['longitude']};                        
            if ($scope.map && $stateParams.orderid == location['id']){                
                // MapService.eraseAllMarkers($scope.markers);
                MapService.addMarker($scope.map, $scope.trackLocation, $scope.marker, $scope.anchor);
                // MapService.eraseAllDirectionsDisplays($scope.directionsDisplay);
                MapService.getDirection($scope.map, $scope.trackLocation, $scope.anchor, $scope.directionsDisplay);
            }            
        })
        ioLocation.on('status',function(status){
            // console.log('Status from server: order #' + status['order_id'] + ' ' + status['status']);                                    
            if ($scope.map && $stateParams.orderid == status['order_id']){                
                if (status['status'] == 'shipped'){
                    console.log('Order shipped');
                }
            }            
        })
    }

    ioConnect();
})
      
.controller('pROFILECtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http) {
    var getCurrentUserInformation = function(){
           $http.get(API_ENDPOINT.url + '/api/users/findone/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                $scope.currentUser = response.data;
                $http.get(API_ENDPOINT.url + '/api/orders/findinfobyuser/' + $scope.currentUser._id).success(function(response){
                    if(response.success){
                            $scope.orderCurrentUser = response.data;
                    }
                });
            }
        });
    }

    $scope.logout = function(){
        AuthService.logout();
        $state.go('login');
    };
    getCurrentUserInformation();
})
   
.controller('signupCtrl', function ($scope, $stateParams,$state,AuthService,$ionicPopup,$ionicLoading) {

    $scope.newUser = {
        email: '',
        firstname: '',
        lastname : '',
        password : '',
        password2: ''
    };

    $scope.register = function(){
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
        });
        AuthService.register($scope.newUser).then(function(msg){
            $ionicLoading.hide();
            $state.go("tabsController.food");  
        },function(errMsg){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Sign-Up Exception',
                template: errMsg
            });   
        });
    };

})
   
.controller('loginCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$ionicPopup,$ionicLoading,$cordovaOauth,$http) {
    $scope.loginFace = function(){
        $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner></ion-spinner>',
        });
        $cordovaOauth.facebook("1878320485734515", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result){
            displayData($http, result.access_token);
        },  function(error){
            alert("Error: " + error);
            $ionicLoading.hide();
        });

        function displayData($http, access_token)
        {
            $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: access_token, fields: "id,name,gender,email,picture", format: "json" }}).then(function(result) {
                 $http.post(API_ENDPOINT.url + '/api/users/createFace', result.data).success(function(response){
                        if(response.success){
                            $ionicLoading.hide();
                            AuthService.setToken(response.token);
                            $state.go("tabsController.food");
                        }
                    });       
            }, function(error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        }
    };
    $scope.user = {
        username: '',
        password: ''
    };
    $scope.login = function(){
        if($scope.user.username == "" || $scope.user.password == "") {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Exception',
                template: "Username Or Password Are Missing"
            });    
        }else{
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner></ion-spinner>',
            });
            AuthService.login($scope.user).then(function(msg){
                $ionicLoading.hide();
                $state.go("tabsController.food"); 
            },function(errMsg){
                var alertPopup = $ionicPopup.alert({
                    title: 'Login Exception',
                    template: errMsg
                });
                $ionicLoading.hide();
            });
        }
    };
})
   
.controller('fOODDETAILCtrl', function ($scope, $stateParams) {


})
   
.controller('DTailCtrl', function ($scope, $stateParams) {


})
   
.controller('restaurantLocationCtrl', function ($scope, $stateParams) {


})
   
.controller('foodCtrl', function ($scope, $stateParams) {


})
   
.controller('cONTACTCtrl', function ($scope, $stateParams) {


})
 