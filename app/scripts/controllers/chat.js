'use strict';
/**
 * @ngdoc function
 * @name chatterApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('chatterApp')
  .controller('ChatCtrl', function ($scope, Ref, $firebaseArray, $timeout) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var coords = {};
    $scope.messages = null;

    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    //$scope.messages = $firebaseArray(Ref.child('messages').limitToLast(10));

    // display any errors
    //$scope.messages.$loaded().catch(alert);

    // provide a method for adding a message
    $scope.addMessage = function(newMessage) {
      if( newMessage ) {
        if(coords.length ===0){
          alert("GPS Coords Not Captured!");
          return;
        }
        // push a message to the end of the array
        $scope.messages.$add({text: newMessage, gps: coords})
          // display any errors
          .catch(alert);
      }     

    };

    $scope.getLocation = function(){
        navigator.geolocation.getCurrentPosition(success, error);
      }

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }


    function success(position) {

      //coords['lat'] = position.coords.latitude;
      //coords['lon'] = position.coords.longitude;

      $scope.messages = $firebaseArray(Ref.child('messages').limitToLast(10));
      $scope.messages.$loaded().catch(alert);

      var s = document.querySelector('#status');
      
      if (s.className == 'success') {
        // not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back    
        return;
      }
      
      s.innerHTML = "";
      s.className = 'success';
      
      var mapcanvas = document.createElement('div');
      mapcanvas.id = 'mapcanvas';
      mapcanvas.style.height = '400px';
      mapcanvas.style.width = '700px';
        
      document.querySelector('article').appendChild(mapcanvas);
      
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var myOptions = {
        zoom: 13,
        center: latlng,
        mapTypeControl: false,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
      
      /*
      var marker = new google.maps.Marker({
          position: latlng, 
          map: map, 
          title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
      });
    */
      var populationOptions = {
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: latlng,
          radius: 1600
        };
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle(populationOptions);

    }

    function error(msg) {
      var s = document.querySelector('#status');
      s.innerHTML = typeof msg == 'string' ? msg : "failed";
      s.className = 'fail';
      
      // console.log(arguments);
    }

    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      error('not supported');
    }
  


});
