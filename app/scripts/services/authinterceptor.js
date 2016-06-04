'use strict';

/**
 * @ngdoc service
 * @name fathomApp.authinterceptor
 * @description
 * # authinterceptor
 * Factory in the fathomApp.
 */
angular.module('fathomApp')
  .factory('authInterceptor', function ($rootScope, $q, $window, $cookieStore) {
    return {
      request: function (config) {
        if(config.url.substring(0, 5) === '/api/') {
          config.headers = config.headers || {};
          if ($cookieStore.get('token')) {
            config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
          }
        }
        return config;
      },
      response: function (response) {
        var now = new Date();
        var exp = new Date($cookieStore.get('expDate'));
        if (exp <= now) {
          $cookieStore.remove('token');
          $window.location = '/#/login';
        }
        return response || $q.when(response);
      }
    };
  });
