'use strict';

/**
 * @ngdoc function
 * @name fathomApp.controller:ManageCtrl
 * @description
 * # ManageCtrl
 * Controller of the fathomApp
 */
angular.module('fathomApp')
  .controller('ManageCtrl', function ($scope, $http, $cookieStore, $route) {

    $scope.goHome = function() {
      $scope.mode = 'show-bills';
      $scope.selectedBill = {};
    };


    // BillS -----------------------------------------------

    $http.get('/api/bills').success(function(res) {
      $scope.bills = res;
    });

    $scope.selectedBill = {};
    $scope.mode = 'show-bills';

    $scope.newBill = function() {
      $scope.mode = 'create-bill';
      $scope.selectedBill = {};
    };

    $scope.editBill = function(tl) {
      $scope.mode = 'edit-bill';
      $scope.selectedBill = tl;
      $scope.getcomments();
    };

    $scope.singleBill = {};
    $scope.createBill = function() {
      $scope.singleBill.creator = $cookieStore.get('userID');
      $http.post('/api/bills', $scope.singleBill).then(
        function(res) {
          var selected = $cookieStore.get('selectedBills');
          if (selected === undefined) {
            $cookieStore.put('selectedBills', res.data);
          } else {
            $cookieStore.put('selectedBills', selected + ',' + res.data);
          }
        },
        function(err) {
          console.log(err);
        }
      );
      $route.reload();
    };

    $scope.updateBill = function() {
      $http.put('/api/bills/' + $scope.selectedBill.id, $scope.selectedBill);
      $route.reload();
    };

    $scope.deleteBill = function() {
      $scope.selectedBill.deletedAt = new Date();
      $http.put('/api/bills/' + $scope.selectedBill.id, $scope.selectedBill);
      $route.reload();
    };


    // commentS --------------------------------------------------

    $scope.getcomments = function() {
      $http.get('/api/correlations/bills/' + $scope.selectedBill.id).success(
        function(res) {
          $scope.comments = res;
        }
      );
    };

    $scope.editcomment = function(ev) {
      $scope.mode = 'edit-comment';
      $scope.selectedcomment = ev;
      $scope.selectedcomment.date = new Date(ev.date);
    };

    $scope.newcomment = function() {
      $scope.mode = 'create-comment';
      $scope.selectedcomment = {};
    };

    $scope.singlecomment = {};
    $scope.singleCorrelation = {};
    $scope.createcomment = function() {
      $scope.singlecomment.creator = $cookieStore.get('userID');
      $scope.singleCorrelation.bill = $scope.selectedBill.id;
      $scope.singleCorrelation.creator = $cookieStore.get('userID');
      $http.post('/api/comments', $scope.singlecomment).then(
        function(res) {
          $scope.singleCorrelation.comment = res.data;
          $http.post('/api/correlations', $scope.singleCorrelation).then(
            function(res) {
              return res;
            },
            function(err) {
              console.log(err);
            }
          );
        },
        function(err) {
          console.log(err);
        }
      );
      $route.reload();
    };

    $scope.updatecomment = function() {
      $http.put('/api/comments/' + $scope.selectedcomment.id, $scope.selectedcomment);
      $route.reload();
    };

    $scope.deletecomment = function() {
      $scope.selectedcomment.deletedAt = new Date();
      $http.put('/api/comments/' + $scope.selectedcomment.id, $scope.selectedcomment);
      $route.reload();
    };

  });
