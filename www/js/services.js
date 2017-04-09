angular.module('app.services', [])

    .constant('API_ENDPOINT', {
        root: 'http://test3721.herokuapp.com',
        url: 'http://test3721.herokuapp.com/server'
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

    .service('SubjectDetailService', function (API_ENDPOINT, AuthService, $http, $q) {
        var checkSameDate = function(date1, date2){
            if (! (date1 instanceof Date) || !(date2 instanceof Date)){
                throw "Not Date object";
            }            
            return (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getYear() == date2.getYear());
        }
        this.checkIfCommentOnThisToday = function (comments, userIdCheck) {
            //comments is an array with 'date_created' ascending sorted
            for (var i=comments.length-1; i>=0; i--) {
                if (comments[i].user_id._id == userIdCheck) {
                    var date_created = new Date(comments[i].date_created);                    
                    var today = new Date();                    
                    try{
                        if (checkSameDate(date_created, today) == true){
                            console.log("Already comment on this today");
                            return true;
                        }
                    }
                    catch (err){
                        console.log(err);
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

            return $q(function (resolve, reject) {
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

        this.saveComment = function(comment, subjectType, subjectId, callback){            
            var tailUrl = '';
            switch (subjectType) {
                case 'food':
                    tailUrl = '/api/foods/addcomment/';
                    break;
                case 'restaurant':
                    tailUrl = '/api/restaurants/addcomment/';
                    break;
                case 'service':
                    tailUrl = '/api/services/addcomment/';
                    break;
            }

            var promise = $q(function(resolve, reject){                                
                if (comment.content == "") {
                    reject(alreadyCommentOnThisToday);
                } else {
                    var commentSave = {
                        user_id: AuthService.userInforIdSave(),
                        content: comment.content
                    }
                    $http.post(API_ENDPOINT.url + '/api/comments/create/', commentSave).success(function(response) {
                        if (response.success == true) {
                            var commentId = response.data._id;
                            $http.put(API_ENDPOINT.url + tailUrl + subjectId + "/" + commentId).success(function(response) {
                                resolve(response.data);
                            })
                        }
                    });
                }
            })     

            return promise;       
        }
    })

    .service('FileUpload', function($cordovaFileTransfer, $q){
        this.imageUpload = function(imagePath){
            // Destination URL            
            var url = 'https://api.cloudinary.com/v1_1/trongnghia94/image/upload';            

            var options = {                
                params: {'upload_preset': 'm0wsj7yq'}                
            };            

            var promise = $q(function(resolve, reject){
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

    .service('LocalNotification', function($cordovaLocalNotification){
        this.addOrderNotification = function(notificationId, data){
            $cordovaLocalNotification.schedule({
                id: notificationId,          
                message: "Your order confirmed",
                title: "Order confirmed",          
                autoCancel: true,
                sound: null,
                data: data
            }).then(function () {
                console.log("The notification has been set");
            }); 
        }
    })