
function ajaxTest () {
var key = "AIzaSyCI-Q45nsEkZDVBrp2I8NB2cTTqK_hhgrg"
var queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key="

$.ajax({
	url: queryURL + key,
	method: "GET"
}).done(function(response) {
	console.log(response)
})}

ajaxTest();