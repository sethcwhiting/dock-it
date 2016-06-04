'use strict';

/**
 * @ngdoc service
 * @name historimateApp.locations
 * @description
 * # locations
 * Factory in the historimateApp.
 */
angular.module('historimateApp')
  .factory('locations', ['$http', function ($http) {
    return {
      getLocations: function (loc) {
        return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + loc + '&key=AIzaSyDf_EG683HO6g3pOdixZ8kY6xYfbdICq3w')
            .success(function(res) {
              return res;
            }).error(function(err) {
              return err;
            });
      }
    };
  }]);
