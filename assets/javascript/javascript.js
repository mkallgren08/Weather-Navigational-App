//-----------------Variables------------------------

// Global variables for our start and finish locations
var startLocation = "";
var finishLocation = "";

//-----------------Functions-----------------------

//Function for retrieving ajax data from google directions map api based on user input for start and finish locations
function googleDirectionApiCall () {
	var queryURLDirections = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startLocation + "&destination=" +
				 finishLocation + "&key=AIzaSyCI-Q45nsEkZDVBrp2I8NB2cTTqK_hhgrg";
	$.ajax({
		url: queryURLDirections,
		method: "GET"
	}).done(function(response) {
	console.log(response)
	})
}

function googleMapEmbedCall () {
	var queryURLMaps = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyCI-Q45nsEkZDVBrp2I8NB2cTTqK_hhgrg&origin=" + startLocation
					+ "&destination=" + finishLocation
	$.ajax( {
		url: queryURLMaps,
		method: "GET"
	}).done(function(response) {
		console.log(response)
		console.log(queryURLMaps)
		$("#mapLocation").attr("src", queryURLMaps)
	})
	
}

//On click event for startpages launch function which will log the start location and finish location as variables. 
$("#launch").on("click", function() {
	startLocation = $("#startLocation").val().trim()
	console.log("start Location: " + startLocation)
	finishLocation = $("#finishLocation").val().trim()
	
	//running ajax command for retrieval of google direction maps api after user input variables have been saved.
	googleDirectionApiCall()


	//running ajax command for retreival of google maps embed map
	googleMapEmbedCall()


})