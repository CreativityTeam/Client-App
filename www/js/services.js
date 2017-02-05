angular.module('app.services', [])

.constant('API_ENDPOINT',{
    url: 'https://test3721.herokuapp.com/server'
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
});