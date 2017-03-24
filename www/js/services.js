angular.module('app.services', [])

    .constant('API_ENDPOINT', {
        root: 'https://test3721.herokuapp.com/',
        url: 'https://test3721.herokuapp.com/server'
    })

    .service('AuthService', function ($q, $http, API_ENDPOINT) {
        var token_local = "Create Toke Pls";
        var userlogedID = "Nhatdev";
        var isAuthenticated = false;
        var authToken;
        var userSaveID;

        var useToken = function (token) {
            isAuthenticated = true;
            authToken = token;
        };

        var useInfor = function (userNotSave) {
            window.localStorage.getItem(userlogedID);
            userSaveID = userNotSave;
        };

        var storeToken = function (token) {
            window.localStorage.setItem(token_local, token);
            useToken(token);
        };

        var storeID = function (userID) {
            window.localStorage.setItem(userlogedID, userID);
            useInfor(userID);
        };

        var destroyToken = function () {
            authToken = undefined;
            userSaveID = undefined;
            isAuthenticated = false;
            window.localStorage.removeItem(token_local);
            window.localStorage.removeItem(userlogedID);
        };

        var register = function (user) {
            return $q(function (resolve, reject) {
                $http.post(API_ENDPOINT.url + '/api/users/register', user).then(function (response) {
                    if (response.data.success) {
                        storeToken(response.data.token);
                        storeID(response.data.data._id);
                        resolve(response.data.msg);
                    } else {
                        reject(response.data.msg);
                    }
                });
            });
        };

        var login = function (user) {
            return $q(function (resolve, reject) {
                $http.post(API_ENDPOINT.url + '/api/users/login', user).then(function (response) {
                    if (response.data.success) {
                        storeToken(response.data.token);
                        storeID(response.data.data._id);
                        resolve(response.data.msg);
                    } else {
                        reject(response.data.msg);
                    }
                });
            })
        };

        var checkToken = function () {
            var token = window.localStorage.getItem(token_local);
            var userInfomarionID = window.localStorage.getItem(userlogedID);
            if (token) {
                useToken(token);
                useInfor(userInfomarionID)
            }
        };

        checkToken();

        var logout = function () {
            destroyToken();
        };

        return {
            login: login,
            register: register,
            logout: logout,
            setToken: function (token) { return storeToken(token); },
            userInforIdSave: function () { return userSaveID },
            tokensave: function () { return authToken; },
            isAuthenticated: function () { return isAuthenticated; }
        };
    })

    .service('MapService', function ($ionicPopup) {        
        this.addMarker = function (map, location, markers, anchorPoint) {
            var latLng = new google.maps.LatLng(location['lat'], location['lng']);

            var marker = new google.maps.Marker({
                map: map,
                title: 'Shipper\'s location',
                animation: google.maps.Animation.BOUNCE,
                position: latLng,
                icon: 'https://maps.google.com/mapfiles/kml/shapes/motorcycling.png'
            });
            markers.push(marker);
        };

        this.eraseAllMarkers = function (markers) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
                markers[i] = null;
            }
            markers.length = 0;
        };

        this.getDirection = function (map, origin, destination, directionsDisplays) {
            document.getElementById('directions-panel').innerHTML = "";
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
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
                    $ionicPopup.alert({
                        title: 'Order missing info',
                        template: 'Something wrong. Maybe the shipper\'s position is unknown now!'
                    });
                }
            });
        };

        this.eraseAllDirectionsDisplays = function (directionsDisplays) {
            for (var i = 0; i < directionsDisplays.length; i++) {
                directionsDisplays[i].setMap(null);
                directionsDisplays[i] = null;
            }
            directionsDisplays.length = 0;
        };
    })

    .service('RatingService', function (API_ENDPOINT, $http, AuthService) {
        this.getRatingsObject = function (childUrl) {
            return {
                iconOn: 'ion-ios-star',    //Optional
                iconOff: 'ion-ios-star-outline',   //Optional
                iconOnColor: 'rgb(200, 200, 100)',  //Optional
                iconOffColor: 'rgb(200, 100, 100)',    //Optional
                rating: 0, //Optional
                minRating: 0,    //Optional
                readOnly: true, //Optional
                callback: function (rating, index) {    //Mandatory
                    console.log('Selected rating is : ', rating, ' and the index is : ', index);
                    var ratingReq = { 'score': rating, 'userId': AuthService.userInforIdSave() };
                    $http.put(API_ENDPOINT.url + childUrl, ratingReq).success(function (response) {
                        console.log('Update rating successfully');
                    });
                }
            };
        };
    })

    .service('PhoneCallService', function () {
        function onSuccess(result) {
            console.log("Success:" + result);
        }

        function onError(result) {
            console.log("Error:" + result);
        }

        this.call = function (phoneNumber) {
            if (!window.plugins) {
                alert("Only use this function in device");
            }
            else {
                window.plugins.CallNumber.callNumber(onSuccess, onError, phoneNumber, false);
            }
        }
    })

    .service('SubjectDetailService', function (API_ENDPOINT, AuthService, $http) {
        this.checkIfCommentOnThisToday = function (comments, userIdCheck) {
            for (var i in comments) {
                if (comments[i].user_id._id == userIdCheck) {
                    var date_created = new Date(comments[i].date_created);
                    date_created = new Date(date_created.getTime() + (date_created.getTimezoneOffset() * 60000));
                    var today = new Date();
                    if ((date_created.getDate() == today.getDate()) && (date_created.getMonth() == today.getMonth()) && (date_created.getYear() == today.getYear())) {
                        console.log("Already comment on this today");
                        return true;
                    }
                    break;
                }
            }
            return false;
        }

        this.checkIfSubjectLiked = function (subjectId, subjectType) {
            var tailUrl = '';
            switch (subjectType) {
                case 'food':
                    tailUrl = '/api/users/findfoodfav/';
                    break;
                case 'restaurant':
                    tailUrl = '/api/users/findresfav/';
                    break;
            }

            return new Promise(function (resolve, reject) {
                $http.get(API_ENDPOINT.url + tailUrl + AuthService.tokensave()).success(function (response) {
                    if (response.success == false) {
                        reject(false);
                    } else {
                        for (var item in response.data) {
                            if (response.data[item]._id == subjectId) {
                                resolve(true);
                            }
                        }
                        resolve(false);
                    }
                });
            });
        }        
    })

    .service('FileUpload', function($cordovaFileTransfer){
        this.imageUpload = function(imagePath){
            // Destination URL            
            var url = 'https://api.cloudinary.com/v1_1/trongnghia94/image/upload';            

            var options = {                
                params: {'upload_preset': 'm0wsj7yq'}                
            };            

            var promise = new Promise(function(resolve, reject){
                $cordovaFileTransfer.upload(url, imagePath, options).then(function (result) {                                                    
                    var response = JSON.parse(decodeURIComponent(result.response));
                    resolve(response.url);                    
                })
                .catch(function(err){    
                    reject(err);
                });
            })            
            return promise;
        }        
    })