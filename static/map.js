var globalGoogleMap;

var initMap = function() {
	console.log("I'm being called!");
	globalGoogleMap = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 12
	});
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

			var initialLoc = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude);
			globalGoogleMap.setCenter(initialLoc);

			markers.forEach(function(marker) {
				addMarker(marker.lat, marker.lng, marker.name)
			});
		});
	}

	console.log("I finished!");
}

var addMarker = function(lat, lng, name) {
	var latLng = new google.maps.LatLng(lat, lng);
	var googleMarker = new google.maps.Marker({
		position: latLng,
		map: globalGoogleMap,
		title: name
	});

	return googleMarker;
};

