'use strict';

/**
 * @ngdoc overview
 * @name fathomApp
 * @description
 * # fathomApp
 *
 * Main module of the application.
 */
angular
  .module('fathomApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/manage.html',
        controller: 'ManageCtrl',
        controllerAs: 'manage'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function ($rootScope, $location, $window, $cookieStore) {
    $rootScope.$on( '$locationChangeStart', function() {
      var token = $cookieStore.get('token');
      if(token === undefined || token.length < 10){
        $location.path('/login');
      }
    });
});
