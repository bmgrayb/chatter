'use strict';
/**
 * @ngdoc function
 * @name chatterApp.controller:MapCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('chatterApp')
  .controller('MapCtrl', function ($scope, Ref, $firebaseArray, $timeout) {

    var coords = {};
    $scope.messages = null;


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

          var latlng = new google.maps.LatLng(coords.lat, coords.lon);
          var myOptions = {
            zoom: 13,
            center: latlng,
            mapTypeControl: false,
            navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
          
          
          var marker = new google.maps.Marker({
              position: latlng, 
              map: map, 
              title: newMessage
          });

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

      coords['lat'] = position.coords.latitude;
      coords['lon'] = position.coords.longitude;
      $scope.gps = coords;
  
      $scope.messages = $firebaseArray(Ref.child('messages'));
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
      
      
      var marker = new google.maps.Marker({
          position: latlng, 
          map: map, 
          title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
      });


      $scope.$watch('messages', function () {
        
        var currMarker;

        $scope.messages.forEach(function (message) {
        
          if(typeof message.gps === 'undefined'){
        
          }
          else{
            var ll = new google.maps.LatLng(message.gps.lat, message.gps.lon);

            currMarker = new google.maps.Marker({
                position: ll, 
                map: map, 
                title:message.text
            });
          }

        });
        
      }, true);

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