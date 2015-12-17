$(document).ready(

	navigator.geolocation.getCurrentPosition(function(location){
		
		 
		$('#latitude').val(location.coords.latitude)
		$('#longitude').val(location.coords.longitude)
	})

)