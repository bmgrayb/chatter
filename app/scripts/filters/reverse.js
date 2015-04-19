'use strict';

angular.module('chatterApp')
  .filter('reverse', function() {
    return function(items, scope) {
    	var filtered = {};
    	var messages = {};
    	angular.isArray(items)? messages = items.slice().reverse() : [];
    	
    	var rads = (Math.PI/180);
    	var j = 0;

		for(var i = 0; i < messages.length; i++){
		//	console.log(messages[i].gps.lat);
			if(typeof messages[i].gps === 'undefined'){
				
			}
			else{
				var R = 6371000; // metres
				var phi1 = messages[i].gps.lat*rads;
				var phi2 = scope.gps.lat*rads;
				var delPhi = (scope.gps.lat-messages[i].gps.lat)*rads;
				var delLam = (scope.gps.lon-messages[i].gps.lon)*rads;

				var a = Math.sin(delPhi/2) * Math.sin(delPhi/2) +
				        Math.cos(phi1) * Math.cos(phi2) *
				        Math.sin(delLam/2) * Math.sin(delLam/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

				var d = R * c; 

				console.log(d);

				if(d < 3200 && j < 10 ){
					j++;
					filtered[i] = messages[i];
				}
			}
			

		}
      return filtered;
    };
  });
