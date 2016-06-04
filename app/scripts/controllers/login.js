'use strict';

/**
 * @ngdoc function
 * @name fathomApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the fathomApp
 */
angular.module('fathomApp')
  .controller('LoginCtrl', function ($scope, $http, $window, $cookieStore) {

    if($cookieStore.token === undefined || $cookieStore.token.length < 10){
      $scope.noToken = true;
    }else{
      $scope.noToken = false;
    }

    $scope.singleUser = {};
    $scope.createUser = function() {
      $http.post('/users', $scope.singleUser).then(
        function(res) {
          return res;
        },
        function(err) {
          console.log(err);
        }
      );
      $scope.singleUser = {};
    };

    $scope.potentialUser = {};
    $scope.authenticateUser = function() {
      $http.post('/authenticate', $scope.potentialUser)
        .success(function(data) {
          $cookieStore.put('token', data.token);
          $cookieStore.put('userID', data.user.id);
          $cookieStore.put('userName', data.user.userName);
          $cookieStore.put('expDate', data.expDate);
          $window.location = '/';
        })
        .error(function() {
          $cookieStore.remove('token');
          $scope.message = 'Error: Invalid user or password';
          console.log($scope.message);
      });
      $scope.potentialUser = {};
    };

    $scope.logout = function () {
      $cookieStore.remove('token');
      $window.location = '/#/login';
    };

  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
