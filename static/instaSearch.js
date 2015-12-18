$(document).ready(function() {

	$('#instaSearch').submit(function(e) {
		e.preventDefault();

		var formData =  $('form').serialize();

		$.ajax({
		    url: '/instagram/search',
		    data: formData,
		    complete : function(response){
		    	console.log(response.responseJSON.data);
		    	// foreach over the data
		    	// create a marker for each lat/long
		    	var images = response.responseJSON.data;
		    	images.forEach(function(markerData) {
					var marker = addMarker(markerData.location.latitude, markerData.location.longitude, markerData.location.name);

					google.maps.event.addListener(marker, 'click', function(e) {
	   					window.location.href = markerData.link;
   					 	console.log('CLICKED IT!')
					});

		    	});
		    }
		});
	})

})