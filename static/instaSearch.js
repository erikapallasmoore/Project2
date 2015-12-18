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

		    	response.responseJSON.data.forEach(function(markerData) {
					addMarker(markerData.location.latitude, markerData.location.longitude, markerData.location.name)
		    	});
		    }
		});
	})

})