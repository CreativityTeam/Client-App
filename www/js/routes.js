angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.lOISIR', {
    url: '/loisir',
    views: {
      'tab1': {
        templateUrl: 'templates/lOISIR.html',
        controller: 'lOISIRCtrl'
      }
    }
  })

  .state('tabsController.rESTAURANT', {
    url: '/restaurant',
    views: {
      'tab6': {
        templateUrl: 'templates/rESTAURANT.html',
        controller: 'rESTAURANTCtrl'
      }
    }
  })

   .state('tabsController.listRestaurant', {
    url: '/listRestaurant/:idCategory',
    views: {
      'tab6': {
        templateUrl: 'templates/listRestaurant.html',
        controller: 'listRestaurantCtrl'
      }
    }
  })

  .state('tabsController.listFoodBelongMenu', {
    url: '/listFood/:idMenu',
    views: {
      'tab6': {
        templateUrl: 'templates/listFoodBelongMenu.html',
        controller: 'listFoodBelongMenuCtrl'
      }
    }
  })

  .state('tabsController.restaurantDetail', {
    url: '/restaurantDetail/:idRestaurant',
    views: {
      'tab6': {
        templateUrl: 'templates/DTailres.html',
        controller: 'restaurantDetailCtrl'
      },
      'tab5': {
        templateUrl: 'templates/DTailres.html',
        controller: 'restaurantDetailCtrl'
      }
    }
  })

  .state('tabsController.bARKTV', {
    url: '/bar',
    views: {
      'tab6': {
        templateUrl: 'templates/bARKTV.html',
        controller: 'bARKTVCtrl'
      }
    }
  })

  .state('tabsController.loisirListe', {
    url: '/loisirliste/:idLoisir',
    views: {
      'tab1': {
        templateUrl: 'templates/loisirListe.html',
        controller: 'loisirListeCtrl'
      }
    }
  })

  .state('tabsController.sALONDETHPATISSERUE', {
    url: '/salonde',
    views: {
      'tab6': {
        templateUrl: 'templates/sALONDETHPATISSERUE.html',
        controller: 'sALONDETHPATISSERUECtrl'
      }
    }
  })

  .state('tabsController.mYCART', {
    url: '/cart',
    views: {
      'tab3': {
        templateUrl: 'templates/mYCART.html',
        controller: 'mYCARTCtrl'
      }
    }
  })

  .state('tabsController.mYORDER', {
    url: '/myorder/:orderNewNoti',
    views: {
      'tab5': {
        templateUrl: 'templates/mYORDER.html',
        controller: 'mYORDERCtrl'
      }
    }
  })

  .state('tabsController.fAVORITEFOOD', {
    url: '/favfood',
    views: {
      'tab5': {
        templateUrl: 'templates/fAVORITEFOOD.html',
        controller: 'fAVORITEFOODCtrl'
      }
    }
  })

  .state('tabsController.fAVORITERESTAURANT', {
    url: '/favres',
    views: {
      'tab5': {
        templateUrl: 'templates/fAVORITERESTAURANT.html',
        controller: 'fAVORITERESTAURANTCtrl'
      }
    }
  })

  .state('tabsController.around', {
    url: '/around',
    views: {
      'tab2': {
        templateUrl: 'templates/around.html',
        controller: 'aroundCtrl'
      }
    }
  })

  .state('tabsController.sHIPPING', {
    url: '/shipping/:orderid?lat?lng',
    views: {
      'tab5': {
        templateUrl: 'templates/sHIPPING.html',
        controller: 'sHIPPINGCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.pROFILE', {
    url: '/profile',
    views: {
      'tab5': {
        templateUrl: 'templates/pROFILE.html',
        controller: 'pROFILECtrl'
      }
    }
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('forgotpass', {
    url: '/forgotpass',
    templateUrl: 'templates/forgotpass.html',
    controller: 'loginCtrl'
  })

  .state('tabsController.fOODDETAIL', {
    url: '/fooddetail/:idFood',
    views: {
      'tab6': {
        templateUrl: 'templates/fOODDETAIL.html',
        controller: 'fOODDETAILCtrl'
      },
      'tab5': {
        templateUrl: 'templates/fOODDETAIL.html',
        controller: 'fOODDETAILCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.DTail'
      2) Using $state.go programatically:
        $state.go('tabsController.DTail');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab6/locadetail
      /page1/tab1/locadetail
      /page1/tab5/locadetail
  */
  .state('tabsController.DTail', {
    url: '/locadetail/:idSubject',
    views: {
      'tab6': {
        templateUrl: 'templates/DTail_tab6.html',
        controller: 'DTailCtrl_tab6'
      },
      'tab1': {
        templateUrl: 'templates/DTail_tab1.html',
        controller: 'DTailCtrl_tab1'
      },
      'tab5': {
        templateUrl: 'templates/DTail_bar.html',
        controller: 'DTailCtrl_tab5'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.restaurantLocation'
      2) Using $state.go programatically:
        $state.go('tabsController.restaurantLocation');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab6/reslocation
      /page1/tab1/reslocation
      /page1/tab5/reslocation
  */
  .state('tabsController.restaurantLocation', {
    url: '/reslocation/:lat/:lng/:name',
    views: {
      'tab6': {
        templateUrl: 'templates/restaurantLocation.html',
        controller: 'restaurantLocationCtrl'
      },
      'tab1': {
        templateUrl: 'templates/restaurantLocation.html',
        controller: 'restaurantLocationCtrl'
      },
      'tab5': {
        templateUrl: 'templates/restaurantLocation.html',
        controller: 'restaurantLocationCtrl'
      }
    }
  })

  .state('tabsController.food', {
    url: '/food',
    views: {
      'tab6': {
        templateUrl: 'templates/food.html',
        controller: 'foodCtrl'
      }
    }
  })

  .state('tabsController.cONTACT', {
    url: '/contact',
    views: {
      'tab5': {
        templateUrl: 'templates/cONTACT.html',
        controller: 'cONTACTCtrl'
      }
    }
  })

  .state('tabsController.cONDITIONS', {
    url: '/conditions',
    views: {
      'tab5': {
        templateUrl: 'templates/cONDITIONS.html',
        controller: 'cONDITIONSCtrl'
      }
    }
  })

   .state('tabsController.eDITPROFILE', {
    url: '/editProfile/:avatar',
    views: {
      'tab5': {
        templateUrl: 'templates/eDITPROFILE.html',
        controller: 'eDITPROFILECtrl'
      }
    }
  })

   .state('tabsController.uploadPhoto', {
    url: '/uploadPhoto',
    views: {
      'tab5': {
        templateUrl: 'templates/uploadPhoto.html',
        controller: 'uploadPhotoCtrl'
      }
    }
  })


$urlRouterProvider.otherwise('/page1/food')

})

.run(function($rootScope,$state,AuthService,$window){
    $rootScope.$on('$stateChangeStart',function(event,next,nextParams,fromState){
        if(!AuthService.isAuthenticated()){
            if(next.name != 'login' && next.name != 'signup' && next.name != 'forgotpass'){
                event.preventDefault();
                $state.go('login');
            };
        }
    });
})