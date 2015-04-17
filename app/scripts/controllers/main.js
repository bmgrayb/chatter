'use strict';

/**
 * @ngdoc function
 * @name chatterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chatterApp
 */
angular.module('chatterApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
