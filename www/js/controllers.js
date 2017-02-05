angular.module('app.controllers', [])
  
.controller('lOISIRCtrl', function ($scope, $stateParams) {


})
   
.controller('rESTAURANTCtrl',function ($scope, $stateParams) {


})
   
.controller('bARKTVCtrl', function ($scope, $stateParams) {


})
   
.controller('loisirListeCtrl', function ($scope, $stateParams) {


})
   
.controller('sALONDETHPATISSERUECtrl', function ($scope, $stateParams) {


})
   
.controller('mYCARTCtrl', function ($scope, $stateParams) {


})
   
.controller('mYORDERCtrl', function ($scope, $stateParams) {


})
   
.controller('fAVORITEFOODCtrl', function ($scope, $stateParams) {


})
   
.controller('fAVORITERESTAURANTCtrl', function ($scope, $stateParams) {


})
   
.controller('aroundCtrl', function ($scope, $stateParams) {


})
   
.controller('sHIPPINGCtrl', function ($scope, $stateParams) {


})
      
.controller('pROFILECtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService) {
    $scope.logout = function(){
        AuthService.logout();
        $state.go('login');
    };
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
   
.controller('loginCtrl', function ($scope, $stateParams,$state,API_ENDPOINT, AuthService,$ionicPopup,$ionicLoading,$http) {

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
 