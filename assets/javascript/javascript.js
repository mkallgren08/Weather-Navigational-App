//-----------------Variables------------------------

// Global variables for our start and finish locations
var startLocation = "";
var finishLocation = "";

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDRNdOncBA9vmpziKZVaw2PDTPdEThxfck",
    authDomain: "navigation-weath-1502375148453.firebaseapp.com",
    databaseURL: "https://navigation-weath-1502375148453.firebaseio.com",
    projectId: "navigation-weath-1502375148453",
    storageBucket: "navigation-weath-1502375148453.appspot.com",
    messagingSenderId: "775877352628"
};
firebase.initializeApp(config);

var database = firebase.database();

//-----------------Functions-----------------------



//Start City, Start State, End City, End State
function fireBaseLog() {
	database.ref().push({
		startCity: startCity,
		startState: startState,
		endCity: endCity,
		endState: endState
	})
}

//Function for retrieving ajax data from google directions map api based on user input for start and finish locations
function googleDirectionApiCall () {
	var queryURLDirections = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startCity + "," + startState+ "&destination=" +
				 endCity + "," + endState + "&key=AIzaSyCI-Q45nsEkZDVBrp2I8NB2cTTqK_hhgrg";
	$.ajax({
		url: queryURLDirections,
		method: "GET"
	}).done(function(response) {
	console.log(response)
	})
}

function googleMapEmbedCall () {
	var queryURLMaps = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyCI-Q45nsEkZDVBrp2I8NB2cTTqK_hhgrg&origin=" + startCity + "," + startState
					+ "&destination=" + endCity + "," + endState
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
	startCity = $("#startCity").val().trim();
	startState = $("#startState").val().trim();
	endCity = $("#endCity").val().trim();
	endState = $("#endState").val().trim();
	
	//running ajax command for retrieval of google direction maps api after user input variables have been saved.
	googleDirectionApiCall();


	//running ajax command for retreival of google maps embed map
	googleMapEmbedCall();

	//running firebase log to push user data to firebase
	fireBaseLog();

})