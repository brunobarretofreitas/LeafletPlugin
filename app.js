var app = angular.module('leaflet',[]);

app.factory('mapFactory', function(){
	
	var mapFactory = {};
	mapFactory.generateMap = function(view, zoom){
		var mymap = L.map('map').setView(view, zoom);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		    maxZoom: 18,
		    id: 'mapbox.streets',
		    accessToken: 'pk.eyJ1IjoiYnJ1bm9iYXJyZXRvZnJlaXRhcyIsImEiOiJjajRqMG9ueDEwMnZ1Mndxc3ozbWVqZXI4In0.Bl4kGL3a4uiBfr5aPMHLzg'
		}).addTo(mymap);

		return mymap;
	}

	return mapFactory;
});

app.directive('map', ['mapFactory', function(mapFactory){
	return{
		restrict: 'E',
		transclude:true,
		template: '<div id="map" style="height:50%;width:40%"><ng-transclude></ng-transclude></div>',
		scope: {
			view: '=',
			zoom: '=',
			markers: '='
		},
		controller: function($scope){
			this.map = mapFactory.generateMap($scope.view, $scope.zoom);
			
			this.map.on('click', onMapClick);

			var marker;
			var markers = L.layerGroup().addTo(this.map);

			function onMapClick(e){	
				marker = L.marker(e.latlng).addTo(markers);
				$scope.markers.push('{"latitude": ' + e.latlng.lat + ', "longitude": ' + e.latlng.lng + '}');
			}

			
			this.addMarker = function addMarker(marker){
				marker.addTo(markers);
			}

		},
		controllerAs: 'mapController'
	};
}]);

app.directive('marker',function(){
	return{
		restrict: 'E',
		require: '^map',
		scope: {
			position: '='
		},
		link: function($scope, $element, $attrs, $ctrl){
			$scope.marker = L.marker($scope.position);
			$ctrl.addMarker($scope.marker);
		}
	};
});