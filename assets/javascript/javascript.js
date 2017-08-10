var startLocation = "";
var finishLocation = "";


function ajaxTest () {
var queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startLocation + "&destination=" +
				 finishLocation + "&key=AIzaSyCI-Q45nsEkZDVBrp2I8NB2cTTqK_hhgrg";
console.log(queryURL)
$.ajax({
	url: queryURL,
	method: "GET"
}).done(function(response) {
console.log(response)
})

}

$("#launch").on("click", function() {
	startLocation = $("#startLocation").val().trim()
	console.log("start Location: " + startLocation)
	finishLocation = $("#finishLocation").val().trim()
	ajaxTest()
})