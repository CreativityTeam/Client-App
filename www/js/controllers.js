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
   
.controller('rESTAURANTCtrl',function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading) {

    var getListRestaurantCategory = function(){
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });
         $scope.listCategoryRestaurant = [];
         $http.get(API_ENDPOINT.url + '/api/categories/getList').success(function(response){
            $ionicLoading.hide();
            for(var item in response.data){
                if(response.data[item].mainCategory == "Restaurant"){
                    $scope.listCategoryRestaurant.push(response.data[item]);
                }
            }
        });
    };

    getListRestaurantCategory()

})

.controller('listRestaurantCtrl',function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading) {    
    $scope.hasDelivery = "all";
    $scope.options = [
        {value: "all", label: 'All'},
        {value: "no", label: 'No'},
        {value: "yes", label: 'Yes'},
    ];    
    $scope.setSelected = function(delivery){
        $scope.hasDelivery = delivery.value;
    };
    $scope.setSearch = function(search){
        $scope.search = search;
    };
    $scope.isActive = function(item){                   
        if (item.codesiret == $scope.search || !$scope.search){            
            if ($scope.hasDelivery == "all"){
                return true;
            }
            if ($scope.hasDelivery == "yes" && item.delivery == true){
                return true;
            }
            if ($scope.hasDelivery == "no" && item.delivery == false){
                return true;
            }
        }
        return false;
    }
    var getListRestaurant = function(){
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });
         $scope.listRestaurant = [];
         $http.get(API_ENDPOINT.url + '/api/restaurants/findresbytype/' + $stateParams.idCategory).success(function(response){
            $ionicLoading.hide();
            for(var item in response.data){
                if(!response.data[item].hasOwnProperty("photo1")){
                    response.data[item].photo1 = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841"
                    $scope.listRestaurant.push(response.data[item]);
                }else{
                    $scope.listRestaurant.push(response.data[item]);
                }
            }
        });
    };

    getListRestaurant()
})
  
.controller('bARKTVCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading) {

     var getListBarKtv = function(){
         $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });
         $scope.listBarKtv = [];
         $http.get(API_ENDPOINT.url + '/api/services/findcategory/588328b0703173267024daf9' ).success(function(response){
            $ionicLoading.hide();
            for(var item in response.data){
                if(!response.data[item].hasOwnProperty("photo1")){
                    response.data[item].photo1 = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841"
                    $scope.listBarKtv.push(response.data[item]);
                }
            }
        });
    };

    getListBarKtv()

})
   
.controller('loisirListeCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading) {
    var getListServiceBelongLoisir = function(){
         $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });
         $scope.listLoisir = [];
         $http.get(API_ENDPOINT.url + '/api/services/findcategory/' + $stateParams.idLoisir).success(function(response){
            $ionicLoading.hide();
            for(var item in response.data){
                if(!response.data[item].hasOwnProperty("photo1")){
                    response.data[item].photo1 = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841"
                    $scope.listLoisir.push(response.data[item]);
                }
            }
        });
    };

    getListServiceBelongLoisir()

})
   
.controller('sALONDETHPATISSERUECtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading) {

    var getListSaLonDeth = function(){
         $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });
         $scope.listSalon = [];
         $http.get(API_ENDPOINT.url + '/api/services/findcategory/5883289f703173267024daf6' ).success(function(response){
            $ionicLoading.hide();
            for(var item in response.data){
                if(!response.data[item].hasOwnProperty("photo1")){
                    response.data[item].photo1 = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841"
                    $scope.listSalon.push(response.data[item]);
                }
            }
        });
    };

    getListSaLonDeth()
})
   
.controller('mYCARTCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading,$rootScope,$ionicPopup) {
    $scope.totalPriceOrder = 0;
    $scope.orderSaveDB = {
        address : " ",
        point : {
            lon : " ",
            lat : " "    
        },
        comment : " ",
        price : " "
    };
    $scope.listFood = $rootScope.listFoodForOrder;     
     function initMap() {
        var map = new google.maps.Map(document.getElementById('mapInOrder'), {
          zoom: 15,
          center: new google.maps.LatLng(51.508742,-0.120850)
        });

        var infoWindow = new google.maps.InfoWindow({map: map});
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map.setCenter(pos);
            var marker = new google.maps.Marker({
                position: pos,
                animation: google.maps.Animation.DROP,
                draggable:true,
                map: map
            });
            $scope.mapPosition = {
                lat : pos.lat,
                lng : pos.lng  
            }
            marker.addListener('dragend', function() {
            $scope.mapPosition = {
                lat : marker.getPosition().lat(),
                lng : marker.getPosition().lng()
            }
            });
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    }

    initMap();

    var calculatePrice = function(){
        var totalPrice = 0;
        if($scope.listFood != []){
            for(var item in $scope.listFood){
                totalPrice = totalPrice + $scope.listFood[item].foodDetail.price * $scope.listFood[item].quantity
            }
        }
        $scope.totalPriceOrder = totalPrice;
    };  

    $scope.order = function(){
        if($scope.totalPriceOrder == 0){
            var alertPopup = $ionicPopup.alert({
                    title: 'Order Exception',
                    template: "Your cart is empty, Please order something!!!"
            });
        }else{
            $scope.orderSaveDB.foods = $rootScope.listFoodForOrder;            
            $scope.orderSaveDB.user_order_id = AuthService.userInforIdSave();
            $scope.orderSaveDB.price = $scope.totalPriceOrder;            
            if ($scope.mapPosition){
                $scope.orderSaveDB.point.lon = $scope.mapPosition.lng;
                $scope.orderSaveDB.point.lat = $scope.mapPosition.lat;
            }                      
            $http.post(API_ENDPOINT.url + '/api/orders/create',  $scope.orderSaveDB).success(function(response){
                if(response.success){                                                              
                    $rootScope.listFoodForOrder = [];
                    $scope.listFood = [];                    
                    calculatePrice();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Checkout successfully',
                        template: "You 've just checked out successfully!"
                     });                                         
                }
            });      
        }
    }              

    calculatePrice();

    $scope.deleteItemInListOrder = function(id){        
        for(var i in $scope.listFood){
            if($scope.listFood[i].foodDetail._id == id){
                $scope.listFood.splice(i,1);
            }
        }        

        calculatePrice();                
    }
})
   
.controller('mYORDERCtrl', function ($scope, $stateParams, $state, API_ENDPOINT, AuthService, $http, $interval) {

    var getOrderCurrentUser = function(){        
        $http.get(API_ENDPOINT.url + '/api/orders/findinfobyuser/' + AuthService.userInforIdSave()).success(function(response){
            if(response.success){                                
                $scope.orderCurrentUser = response.data;
            }
        });   
    }

    var stop = $interval(getOrderCurrentUser,500);

    $scope.$on('$destroy', function(){ 
        console.log("DESTROYED");       
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;            
        }
    });           
})
   
.controller('fAVORITEFOODCtrl', function ($scope, $stateParams, $state, API_ENDPOINT, AuthService, $http,$rootScope,$ionicPopup,$timeout) {

    var checkCart = function(food){                        
        if ($rootScope.listFoodForOrder.length == 0){
            return true;
        }        
        if (food.res_belong != $rootScope.listFoodForOrder[0].foodDetail.res_belong){
            return false;
        } 
        return true;
    }

    var getListFood = function(){
        $http.get(API_ENDPOINT.url + '/api/users/findfoodfav/' + AuthService.tokensave()).success(function(response){
            $scope.listMenuFood = response.data.foods_favorite;
        });
    }

    $scope.orderFood = function(foodObject){
            if (checkCart(foodObject) == false){
                var alertPopup = $ionicPopup.alert({
                    title: 'Order Exception',
                    template: "You could only order foods from only 1 restaurant at a time. Please check out in your Cart first!"
                });
                return;
            }
            $scope.foodForOrder = {};
            var quantityPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="foodForOrder.quantity">',
            title: 'Enter Your quantity',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.foodForOrder.quantity) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                        return $scope.foodForOrder.quantity;
                        }
                    }
                }
                ]
            });

            quantityPopup.then(function(res) {
                for(var item in $rootScope.listFoodForOrder){
                    if($rootScope.listFoodForOrder[item].foodDetail._id == foodObject._id){
                        $rootScope.listFoodForOrder[item].quantity = $rootScope.listFoodForOrder[item].quantity + parseInt(res);
                        foodObject = " ";
                        res = 0;
                    }
                }
                if(foodObject != " " && parseInt(res) != 0){
                    $rootScope.listFoodForOrder.push({
                        foodDetail : foodObject,
                        quantity : parseInt(res)
                    }) 
                }                                       
            });

            $timeout(function() {
                quantityPopup.close(); //close the popup after 3 seconds for some reason
            }, 5000);
    }

    getListFood()
})
   
.controller('fAVORITERESTAURANTCtrl', function ($scope, $stateParams, $state, API_ENDPOINT, AuthService, $http) {

    var getListRes = function(){
        $http.get(API_ENDPOINT.url + '/api/users/findresfav/' + AuthService.tokensave()).success(function(response){            
            $scope.listRestaurant = response.data;
        });
    }

    getListRes()
})
   
.controller('aroundCtrl', function ($scope, $stateParams, $state, API_ENDPOINT, AuthService, $http) {
    
   function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: new google.maps.LatLng(51.508742,-0.120850)
        });
        var infowindow = new google.maps.InfoWindow({
                content:"Your Current Location"  
        });        

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Your Current Location"
            });
            infowindow.open(map,marker);
            map.setCenter(pos);
          }, function(error) {
              console.log(error);
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
        findLocation(map)
      }

      function findLocation(map){
        $http.get(API_ENDPOINT.url + '/api/restaurants/findres').success(function(response){
            for(var item in response.data){
                var content = "<p><b>" + response.data[item].res_name + "</b></p><p>" 
                + response.data[item].location.housenumber + "," + response.data[item].location.street + "," + response.data[item].location.district + "," 
                + response.data[item].location.city; + "</p>";
                var infowindow = new google.maps.InfoWindow({
                        content:content  
                });
                var position = {
                        lat : response.data[item].location.point.latitude,
                        lng : response.data[item].location.point.longitude
                };
                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: response.data[item].res_name
                });
                infowindow.open(map,marker);
                google.maps.event.addListener(marker,'click',(function(marker){
                    return function(){
                        map.setZoom(15);
                        map.setCenter(marker.getPosition());
                   }; 
                })(marker));
                /*marker.addListener('click',function(){
                   return function(){
                        map.setZoom(20);
                        map.setCenter(marker.getPosition());
                   }
                });*/
            }
        });
      }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    }

    
    initMap();

})

.controller('sHIPPINGCtrl',function($scope, $stateParams, NgMap, API_ENDPOINT, MapService, $ionicPopup, $http){      
    $scope.ioLocation = {};    
    $scope.anchor = {'lat': parseFloat($stateParams.lat), 'lng': parseFloat($stateParams.lng)};
    console.log("Anchor");
    console.log($scope.anchor);                    
    $scope.marker = new google.maps.Marker();
    $scope.markers = [];
    $scope.directionsDisplays = [];    
    $scope.directionsDisplay = new google.maps.DirectionsRenderer();        

    var checkLocationOrdered = function(){
        if (!$stateParams.lat || !$stateParams.lng){            
            return false;   
        }        
        return true;
    }

    var initMap = function(){        
        if (checkLocationOrdered() === false){
            $ionicPopup.alert({
                title: 'Order missing info',
                template: 'No specified location for this order!'
            });
        }
        else{
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: new google.maps.LatLng($scope.anchor['lat'],  $scope.anchor['lng'])
            });         
            $scope.map = map;
            var marker = new google.maps.Marker({
                map: $scope.map,
                title: 'Order\'s location',
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng($scope.anchor['lat'],  $scope.anchor['lng']),
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'            
            });    
            $http.get(API_ENDPOINT.url + '/api/orders/getLatestLocation/' + $stateParams.orderid).success(function(response){
                if(response.success){
                    if (response.data){
                        var latestLocation = {"lat": parseFloat(response.data.latitude), "lng": parseFloat(response.data.longitude)};                        
                        MapService.addMarker($scope.map, latestLocation, $scope.markers, $scope.anchor);
                        MapService.getDirection($scope.map, latestLocation, $scope.anchor, $scope.directionsDisplays);
                    }                                        
                }
            });   
        }        
    }        

    var ioConnect = function(){   
        if (checkLocationOrdered() === false){
            return;
        }     
        $scope.ioLocation = io.connect(API_ENDPOINT.root);
        $scope.ioLocation.on('location',function(location){
            // console.log('Location from server: order #' + location['id'] + ' ' + location['latitude'] + ' ' + location['longitude']);
            $scope.trackLocation = {'lat': parseFloat(location['latitude']), 'lng': parseFloat(location['longitude'])};                        
            if ($scope.map && $stateParams.orderid == location['id']){
                MapService.eraseAllMarkers($scope.markers);
                MapService.addMarker($scope.map, $scope.trackLocation, $scope.markers, $scope.anchor);
                MapService.eraseAllDirectionsDisplays($scope.directionsDisplays);
                MapService.getDirection($scope.map, $scope.trackLocation, $scope.anchor, $scope.directionsDisplays);
            }            
        })
        $scope.ioLocation.on('status',function(status){
            console.log('Status from server: order #' + status['order_id'] + ' ' + status['status']);                                    
            if ($scope.map && $stateParams.orderid == status['order_id']){                 
                if (status['status'] == 'shipped'){
                    if ($scope.markers[0]){
                        $scope.markers[0].setAnimation(null);
                    }
                    $ionicPopup.alert({
                        title: 'Order shipped',
                        template: 'Order shipped. Tracking stop!'
                    });
                }
            }            
        })
    }

    ioConnect();

    $scope.$on("$ionicView.enter", function(event, data){
        // handle event
        initMap();
        console.log("Enter");        
    });    

    $scope.$on('$destroy',function(){        
        if ($scope.ioLocation){
            $scope.ioLocation.disconnect();
        }
    })
})
      
.controller('pROFILECtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http) {
    var getCurrentUserInformation = function(){
           $http.get(API_ENDPOINT.url + '/api/users/findone/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                $scope.currentUser = response.data;
                if(!$scope.currentUser.hasOwnProperty("avatar")){
                    $scope.currentUser.avatar = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841" 
                }
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
   
.controller('loginCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$ionicPopup,$ionicLoading,$cordovaOauth,$http,$cordovaToast) {
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
    $scope.resetPassword = function(){
        $http.post(API_ENDPOINT.url + '/api/users/resetpassword',$scope.user).success(function(res){
            if(res.success){
                $cordovaToast.showShortCenter(res.msg).then(function(success) {})   
            }else{
                $cordovaToast.showShortCenter(res.msg).then(function(success) {})
            }
        })
    }
})
   
.controller('fOODDETAILCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading,$ionicPopup,RatingService,$cordovaToast) {
    var childUrl = '/api/foods/updaterating/' + $stateParams.idFood;
    $scope.ratingsObject = RatingService.getRatingsObject(childUrl);
    $scope.comment = {
        content : ""
    };    
    var getFoodDetail = function(){
         $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });
         $http.get(API_ENDPOINT.url + '/api/foods/findinfo/' + $stateParams.idFood ).success(function(response){
            $ionicLoading.hide();
            $scope.currentSubject = response.data            
            if ($scope.currentSubject.comments){
                $scope.currentSubject.comments.sort(function(food1, food2){
                    return food1.date_created < food2.date_created;
                });
            }            
            for (var i = 0; i < $scope.currentSubject.ratings.length; ++i){                
                    if ($scope.currentSubject.ratings[i].userId == AuthService.userInforIdSave()){                    
                        $scope.ratingsObject.rating = $scope.currentSubject.ratings[i].score;
                        break;
                    }
                }                        
                $scope.averageRating = Math.round(($scope.currentSubject.totalRating / $scope.currentSubject.ratings.length) * 10) /10;
            if(!$scope.currentSubject.hasOwnProperty("photo1")){
                $scope.currentSubject.photo1 = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841"
            }
            console.log($scope.currentSubject)
         });
    };

    $scope.commentButton = function(idFood){
        if($scope.comment.content == ""){
            var alertPopup = $ionicPopup.alert({
                    title: 'System Exception',
                    template: "Please type something in comment box!!!"
            });
        }else{
            $scope.commentSave = {
                user_id : AuthService.userInforIdSave(),
                content : $scope.comment.content
            } 
            $http.post(API_ENDPOINT.url + '/api/comments/create/',$scope.commentSave).success(function(response){
                if(response.success == true){
                    $http.put(API_ENDPOINT.url + '/api/foods/addcomment/' + idFood + "/" + response.data._id).success(function(response){
                        getFoodDetail();
                    })    
                }
            });
        }
    }

    $scope.addFoodFav = function(food){
        var checkExistFoodId = new Promise(function(resolve,reject){
                $http.get(API_ENDPOINT.url + '/api/users/findfoodfav/' + AuthService.tokensave()).success(function(response){
                if(response.success == false){
                    reject(false)
                }else{
                    for(var item in response.data){
                        if(response.data[item]._id == food._id){
                            $http.delete(API_ENDPOINT.url + '/api/users/deleteFoodFav/' + AuthService.tokensave() + '/' + food._id).success(function(response){
                            resolve(true);
                            })   
                        }
                    }
                }
            });    
        })
        checkExistFoodId.then(function(isDelete){
            if(isDelete == true){
                $http.put(API_ENDPOINT.url + '/api/users/addfoodfav/' + AuthService.tokensave(),food).success(function(response){
                     $cordovaToast.showShortCenter(response.msg).then(function(success) {})
                })   
            }
        }).catch(function(isDelete){
            if(isDelete == false){
                $http.put(API_ENDPOINT.url + '/api/users/addfoodfav/' + AuthService.tokensave(),food).success(function(response){
                    $cordovaToast.showShortCenter(response.msg).then(function(success) {})
                })   
            }
        })
    }

    getFoodDetail()
})
   
.controller('DTailCtrl_tab6', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading,$ionicPopup, RatingService) {    
    var childUrl = '/api/services/updaterating/' + $stateParams.idSubject
    $scope.ratingsObject = RatingService.getRatingsObject(childUrl);
    $scope.comment = {
        content : ""
    };
    $scope.commentButton = function(idService){
        if($scope.comment.content == ""){
            var alertPopup = $ionicPopup.alert({
                    title: 'System Exception',
                    template: "Please type something in comment box!!!"
            });
        }else{
            $scope.commentSave = {
                user_id : AuthService.userInforIdSave(),
                content : $scope.comment.content
            } 
            $http.post(API_ENDPOINT.url + '/api/comments/create/',$scope.commentSave).success(function(response){
                if(response.success == true){
                    $http.put(API_ENDPOINT.url + '/api/services/updatecomment/' + idService + "/" + response.data._id).success(function(response){
                        getSubjectDetail();
                    })    
                }
            });
        }
    }

    var getSubjectDetail = function(){
         $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });
         $http.get(API_ENDPOINT.url + '/api/services/findinfo/' + $stateParams.idSubject ).success(function(response){
                $ionicLoading.hide();            
                $scope.currentSubject = response.data    
                for (var i = 0; i < $scope.currentSubject.ratings.length; ++i){                
                    if ($scope.currentSubject.ratings[i].userId == AuthService.userInforIdSave()){                    
                        $scope.ratingsObject.rating = $scope.currentSubject.ratings[i].score;
                        break;
                    }
                }        
                $scope.averageRating = Math.round(($scope.currentSubject.totalRating / $scope.currentSubject.ratings.length) * 10) /10;
                if(!$scope.currentSubject.hasOwnProperty("photo1")){
                    $scope.currentSubject.photo1 = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841"
                }    
         });
    };

    getSubjectDetail()
})

.controller('DTailCtrl_tab1', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading,$ionicPopup, RatingService) {
    var childUrl = '/api/services/updaterating/' + $stateParams.idSubject;
    $scope.ratingsObject = RatingService.getRatingsObject(childUrl);

    $scope.comment = {
        content : ""
    };
    $scope.commentButton = function(idService){
        if($scope.comment.content == ""){
            var alertPopup = $ionicPopup.alert({
                    title: 'System Exception',
                    template: "Please type something in comment box!!!"
            });
        }else{
            $scope.commentSave = {
                user_id : AuthService.userInforIdSave(),
                content : $scope.comment.content
            } 
            $http.post(API_ENDPOINT.url + '/api/comments/create/',$scope.commentSave).success(function(response){
                if(response.success == true){
                    $http.put(API_ENDPOINT.url + '/api/services/updatecomment/' + idService + "/" + response.data._id).success(function(response){
                        getSubjectDetail();
                    })    
                }
            });
        }
    }

    var getSubjectDetail = function(){
         $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });
         $http.get(API_ENDPOINT.url + '/api/services/findinfo/' + $stateParams.idSubject ).success(function(response){
            $ionicLoading.hide();
            $scope.currentSubject = response.data
            for (var i = 0; i < $scope.currentSubject.ratings.length; ++i){                
                if ($scope.currentSubject.ratings[i].userId == AuthService.userInforIdSave()){                    
                    $scope.ratingsObject.rating = $scope.currentSubject.ratings[i].score;
                    break;
                }
            }
            $scope.averageRating = Math.round(($scope.currentSubject.totalRating / $scope.currentSubject.ratings.length) * 10) /10;
            if(!$scope.currentSubject.hasOwnProperty("photo1")){
                $scope.currentSubject.photo1 = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841"
            }
         });
    };

    getSubjectDetail()
})

.controller('DTailCtrl_tab5', function ($scope, $stateParams) {

console.log("tab 5")
})
   
.controller('restaurantLocationCtrl', function ($scope, $stateParams) {
    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: new google.maps.LatLng(51.508742,-0.120850)
        });
        var infoWindow = new google.maps.InfoWindow({map: map});
        var pos = {
              lat: parseFloat($stateParams.lat),
              lng: parseFloat($stateParams.lng)
        };
        console.log(pos);
        infoWindow.setPosition(pos);
        infoWindow.setContent($stateParams.name);
        map.setCenter(pos);
        // Try HTML5 geolocation.
        /*if (navigator.geolocation) {
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
        }*/
      }
    initMap();

})
   
.controller('foodCtrl', function ($scope, $stateParams, $state) {    

})

.controller('tabsController', function ($scope, $stateParams, $state) {
    $scope.goTo = function(args) {
        $state.go(args, {}, {
            reload: true,
            inherit: false,
            notify: true
        });
    };

})
   
.controller('cONTACTCtrl', function ($scope, $stateParams) {


})

.controller('restaurantDetailCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading,$ionicPopup,RatingService,PhoneCallService) {
    var childUrl = '/api/restaurants/updaterating/' + $stateParams.idRestaurant;
    $scope.ratingsObject = RatingService.getRatingsObject(childUrl);
    $scope.comment = {
        content : ""
    };
    $scope.liked = false; 
    $scope.commentTodayOnThis = false; 
    var checkExistResId = function(res){
        return new Promise(function(resolve,reject){
            $http.get(API_ENDPOINT.url + '/api/users/findresfav/' + AuthService.tokensave()).success(function(response){                
                if(response.success == false){                    
                    reject(false);
                }else{                                      
                    for(var item in response.data){
                        if(response.data[item]._id == res._id){                            
                            resolve(true);                            
                        }
                    }
                    resolve(false);
                }
            });    
        });
    }   
    var getRestaurantDetail = function(){
         $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>',
         });            

        checkExistResId($stateParams.idRestaurant).then(function(isExisted){
            console.log("Existed");
            $scope.liked = true;
        }, function(isExisted){
            console.log("Not Existed");
            $scope.liked = false;
        });

        $http.get(API_ENDPOINT.url + '/api/users/findfoodfav/' + AuthService.tokensave()).success(function(response){
            if (response.data){
                $scope.listMenuFood = response.data;
            }               
        });
         $http.get(API_ENDPOINT.url + '/api/restaurants/findinfo/' + $stateParams.idRestaurant ).success(function(response){
            $ionicLoading.hide();
            $scope.currentSubject = response.data
            //Sort comments ascending
            if ($scope.currentSubject.comments){
                $scope.currentSubject.comments.sort(function(food1, food2){
                    return food1.date_created < food2.date_created;
                });
            } 

            //Check if user already comment on this today
            for (var i in $scope.currentSubject.comments){                
                if ($scope.currentSubject.comments[i].user_id._id == AuthService.userInforIdSave()){                    
                    var date_created = new Date($scope.currentSubject.comments[i].date_created);
                    date_created = new Date(date_created.getTime() + (date_created.getTimezoneOffset()*60000));                    
                    var today = new Date();
                    if ((date_created.getDate() == today.getDate()) && (date_created.getMonth() == today.getMonth()) && (date_created.getYear() == today.getYear())){
                        console.log("Already comment on this today");
                        $scope.commentTodayOnThis = true;
                    }                    
                    break;
                }
            }
            for (var i = 0; i < $scope.currentSubject.ratings.length; ++i){                
                if ($scope.currentSubject.ratings[i].userId == AuthService.userInforIdSave()){                    
                    $scope.ratingsObject.rating = $scope.currentSubject.ratings[i].score;
                    break;
                }
            }
            $scope.averageRating = Math.round(($scope.currentSubject.totalRating / $scope.currentSubject.ratings.length) * 10) /10;
            if(!$scope.currentSubject.hasOwnProperty("photo1")){
                $scope.currentSubject.photo1 = "http://vignette3.wikia.nocookie.net/galaxylife/images/7/7c/Noimage.png/revision/latest?cb=20120622041841"
            }
            console.log($scope.currentSubject)
         });
    };

    $scope.commentButton = function(idRes){
        if ($scope.commentTodayOnThis == true){
            $ionicPopup.alert({
                    title: 'System Exception',
                    template: "Only 1 comment on this today!!!"
            });
        }
        else{
            if($scope.comment.content == ""){
            var alertPopup = $ionicPopup.alert({
                    title: 'System Exception',
                    template: "Please type something in comment box!!!"
            });
            }else{            
                $scope.commentSave = {
                    user_id : AuthService.userInforIdSave(),
                    content : $scope.comment.content
                } 
                $http.post(API_ENDPOINT.url + '/api/comments/create/',$scope.commentSave).success(function(response){
                    if(response.success == true){
                        $http.put(API_ENDPOINT.url + '/api/restaurants/updatecomment/' + idRes + "/" + response.data._id).success(function(response){
                            getRestaurantDetail();
                        })    
                    }
                });
            }
        }

        
    }

    $scope.handleResFav = function(res){ 
        checkExistResId(res).then(function(isExisted){
            if(isExisted == true){
                console.log("Res Fav Existed");                
                $http.delete(API_ENDPOINT.url + '/api/users/deleteResFav/' + AuthService.tokensave() + "/" + res._id).success(function(response){})   
                $scope.liked = false;
            }
            else if(isExisted == false){
                console.log("Res Fav Not Existed");                
                $http.put(API_ENDPOINT.url + '/api/users/addresfav/' + AuthService.tokensave(),res).success(function(response){});   
                $scope.liked = true;
            }
        }).catch(function(isExisted){
            if(isExisted == false){                
                console.log("No Res Fav Now")                
                $http.put(API_ENDPOINT.url + '/api/users/addresfav/' + AuthService.tokensave(),res).success(function(response){});   
                $scope.liked = true;
            }
        })
    }

    $scope.call = function(phoneNumber){
        PhoneCallService.call(phoneNumber);
    };

    getRestaurantDetail();

})

.controller('listFoodBelongMenuCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$http,$ionicLoading,$ionicPopup,$rootScope,$timeout) {
    //Check if foods in the cart belong to over 1 restaurant
    var checkCart = function(food){                        
        if ($rootScope.listFoodForOrder.length == 0){
            return true;
        }        
        if (food.res_belong != $rootScope.listFoodForOrder[0].foodDetail.res_belong){
            return false;
        } 
        return true;
    }

    var getFoodByMenu = function(){
        $http.get(API_ENDPOINT.url + '/api/foods/findfoodbymenu/' + $stateParams.idMenu).success(function(data){
            console.log(data.data);
            $scope.listMenuFood = data.data;               
        });   
    }
    
    $scope.orderFood = function(foodObject){
            if (checkCart(foodObject) == false){
                var alertPopup = $ionicPopup.alert({
                    title: 'Order Exception',
                    template: "You could only order foods from only 1 restaurant at a time. Please check out in your Cart first!"
                });
                return;
            }
            $scope.foodForOrder = {};
            var quantityPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="foodForOrder.quantity">',
            title: 'Enter Your quantity',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.foodForOrder.quantity) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                        return $scope.foodForOrder.quantity;
                        }
                    }
                }
                ]
            });

            quantityPopup.then(function(res) {
                for(var item in $rootScope.listFoodForOrder){
                    if($rootScope.listFoodForOrder[item].foodDetail._id == foodObject._id){
                        $rootScope.listFoodForOrder[item].quantity = $rootScope.listFoodForOrder[item].quantity + parseInt(res);
                        foodObject = " ";
                        res = 0;
                    }
                }
                if(foodObject != " " && parseInt(res) != 0){
                    $rootScope.listFoodForOrder.push({
                        foodDetail : foodObject,
                        quantity : parseInt(res)
                    }) 
                }                                       
            });

            $timeout(function() {
                quantityPopup.close(); //close the popup after 3 seconds for some reason
            }, 5000);
    }
    getFoodByMenu();
}) 