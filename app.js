var app = angular.module('leaflet',[]);

app.factory('mapFactory', function(API_KEY,ATTRIBUTION){
	
	var mapFactory = {};
	mapFactory.generateMap = function(view, zoom, tipo){
		var mymap = L.map('map').setView(view, zoom);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		    attribution: ATTRIBUTION,
		    maxZoom: 18,
		    id: 'mapbox.streets',
		    accessToken: API_KEY
		}).addTo(mymap);

		return mymap;
	}

	return mapFactory;
});

app.directive('map', ['mapFactory', function(mapFactory){
	return{
		restrict: 'E',
		transclude:true,
		template: '<div id="map" style="height:400px;width:500px"><ng-transclude></ng-transclude></div>',
		scope: {
			view: '=',
			zoom: '=',
			markers: '='
		},
		controller: function($scope){
			this.map = mapFactory.generateMap($scope.view, $scope.zoom);
			var markers = L.layerGroup().addTo(this.map);
			
			this.addMarker = function addMarker(marker, info){
				marker.bindPopup(info).openPopup().addTo(markers);
			}

			this.addPolyline = function addMarker(polyline){
				polyline.addTo(this.map);
				this.map.fitBounds(polyline.getBounds());
			}

			this.addPolygon = function addMarker(polygon){
				polygon.addTo(this.map);
				this.map.fitBounds(polygon.getBounds());
			}

			this.addRectangle = function addRectangle(rectangle){
				rectangle.addTo(this.map);
				this.map.fitBounds(rectangle.getBounds());
			}

			this.addCircle = function addRectangle(circle){
				circle.addTo(this.map);
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
			position: '=',
			info: '='
		},
		link: function($scope, $element, $attrs, $ctrl){
			$scope.marker = L.marker($scope.position);
			$ctrl.addMarker($scope.marker, $scope.info);
		}
	};
});

app.directive('polyline',function(){
	return{
		restrict: 'E',
		require: '^map',
		scope: {
			pontos: '=',
			cor: '@'
		},
		link: function($scope, $element, $attrs, $ctrl){
			var pontos = $scope.pontos;
			var cor = $scope.cor;

			$scope.polyline = L.polyline(pontos, {color: cor});
			$ctrl.addPolyline($scope.polyline);
		}
	};
});

app.directive('polygon',function(){
	return{
		restrict: 'E',
		require: '^map',
		scope: {
			pontos: '=',
			cor: '@'
		},
		link: function($scope, $element, $attrs, $ctrl){
			var pontos = $scope.pontos;
			var cor = $scope.cor;
			
			$scope.polygon = L.polygon(pontos, {color: cor});
			$ctrl.addPolygon($scope.polygon);
		}
	};
});

app.directive('rectangle',function(){
	return{
		restrict: 'E',
		require: '^map',
		scope: {
			bounds: '=',
			cor: '@',
			weight: '='
		},
		link: function($scope, $element, $attrs, $ctrl){
			var bounds = $scope.bounds;
			var cor = $scope.cor;
			var weight = $scope.weight;

			$scope.rectangle = L.rectangle(bounds, {color: cor, weight: weight});
			$ctrl.addRectangle($scope.rectangle);
		}
	};
});

app.directive('circle',function(){
	return{
		restrict: 'E',
		require: '^map',
		scope: {
			ponto: '=',
			radius: '='
		},
		link: function($scope, $element, $attrs, $ctrl){
			var ponto = $scope.ponto;
			var radius = $scope.radius;

			$scope.circle = L.rectangle(ponto, {radius: radius});
			$ctrl.addCircle($scope.circle);
		}
	};
});


app.constant('API_KEY', 'pk.eyJ1IjoiYnJ1bm9iYXJyZXRvZnJlaXRhcyIsImEiOiJjajRqMG9ueDEwMnZ1Mndxc3ozbWVqZXI4In0.Bl4kGL3a4uiBfr5aPMHLzg');
app.constant('ATTRIBUTION', 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>');
