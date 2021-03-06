// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','ngCordova','ngCordovaOauth', 'ionic-ratings'])

.config(function($ionicConfigProvider, $sceDelegateProvider){
  
  $ionicConfigProvider.backButton.text('').previousTitleText(false);
  $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.tabs.position('bottom');
  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})

.run(function($ionicPlatform,$ionicPopup,$cordovaLocalNotification,$state,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);              
    }    
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            $ionicPopup.alert({
                title: "",
                content: "Internet est requis dans cette application.",
                okText: "J'accepte"
            })
            .then(function(result) {
                  ionic.Platform.exitApp();
            });
        }else{
            backgroundGeolocation.isLocationEnabled(function(isRequest){
               if(!isRequest){
                  var confirmPopup = $ionicPopup.alert({
                      title: '',
                      template: "L'application a besoin d'activer la localisation",
                      okText: "J'accepte"
                  });
                  confirmPopup.then(function(res) {
                      cordova.plugins.diagnostic.switchToLocationSettings();
                  });
               }
             });
          }     
        }
    });
})

/**Create RootScope For Order */
.run(function($rootScope, AuthService, API_ENDPOINT, $cordovaLocalNotification, $state, LocalNotification){   
    $rootScope.listFoodForOrder = [];
    $rootScope.urlImage = '';
    $rootScope.idForNotification = 1;

    var ioServerUrl = API_ENDPOINT.root; 
    $rootScope.ioConnection = io.connect(ioServerUrl);   
    //Listen for order's msg 
    $rootScope.ioConnection.on('orderConfirmed', function(orderConfirmed){   
      if (AuthService.userInforIdSave() == orderConfirmed.user_order){
        LocalNotification.addOrderNotification($rootScope.idForNotification++, JSON.stringify(orderConfirmed));

        $rootScope.$on('$cordovaLocalNotification:click',
          function (event, notification, state) {                 
            $state.go('tabsController.mYORDER', {"orderNewNoti": JSON.stringify(orderConfirmed)});
          });
      }               
    });   
})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",  
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });
      
      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});