define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('CreateAnnotationEventCtrl', function($scope, $rootScope, datasourceSrv) {

    $scope.init = function() {
    };

    function sendEventToServer() {
      var data = {};
      data.what = $scope.newEventModel.what;
      data.tags = $scope.newEventModel.tags;
      data.data = $scope.newEventModel.data;
      data.when = $scope.dashboard.parseDate($scope.newEventModel.when);
      if (data.when === undefined) {
        $scope.appEvent('alert-error', ['invalid timestamp: ' + $scope.newEventModel.when]);
        $scope.dismiss();
      } else {
        datasourceSrv.get($scope.datasource.name).then(function(datasource) {
            datasource.addEvent(data);
          }).then(function() {
            $scope.appEvent('alert-success', ['Event saved']);
            $scope.dismiss();
            $rootScope.$broadcast('refresh');
          }, function(err) {
            $scope.appEvent('alert-error', ['failure: ' + err]);
            $scope.dismiss();
          });
      }
    }

    $scope.keyDown = function (evt) {
      if (evt.keyCode === 13) {
        $scope.newEvent();
      }
    };

    $scope.saveEvent = function() {
      sendEventToServer();
    };
  });

});
