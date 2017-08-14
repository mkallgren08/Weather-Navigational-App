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

var APIKey = "f29cdafe21624061235bd7d34ec68e05"; // Openweathermap API key

var database = firebase.database();

var cityName= "";

var latitude = "";

var longitude = "";

var stepDistances = []

var stepLength = ""

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

function getSum(total, num) {
    return total + num;
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
	console.log(response);
      startLat = response.routes[0].legs[0].start_location.lat;
      console.log("Start Lat: "+ startLat);
      startLon = response.routes[0].legs[0].start_location.lng;
      console.log("Start Lon: "+ startLon);
      finishLat = response.routes[0].legs[0].end_location.lat;
      console.log("Finish Lat: "+ finishLat);
      finishLon = response.routes[0].legs[0].end_location.lng;
      console.log("Finish Lon: "+ finishLon);
      weatherMapsAPICall(startLat, startLon);
      weatherMapsAPICall(finishLat, finishLon);
      var tripSteps = Object.keys(response.routes[0].legs[0].steps)
      console.log(tripSteps);
      for ( var i = 0; i < tripSteps.length-1; i++){
          if (response.routes[0].legs[0].steps[i].distance.value >= 8000 /*~5 miles*/){
            //clears the distance array of value:
            stepDistances = []
            // Pulls the step-endpoint's latitude and longitude
            var stepLat = response.routes[0].legs[0].steps[i].end_location.lat;
            var stepLon = response.routes[0].legs[0].steps[i].end_location.lng;
            console.log("step distance: " + response.routes[0].legs[0].steps[i].distance.value)
            weatherMapsAPICall(stepLat, stepLon)
            // This creates an array to calculate the cumulative distance up to this point
                for (var k = i; k > -1; k--){
                  stepLengthkm = response.routes[0].legs[0].steps[k].distance.value
                  var stepLengthmiles = Math.round(stepLengthkm/1609.344)
                  stepDistances.push(stepLengthmiles) 
                }
            console.log("Array of step distances: " + stepDistances)
            //This returns miles
            cumulativeDistance = stepDistances.reduce(getSum, 0)
            //cumulativeDistance = (parseInt(cumulativeDistance)/1609.344)
            console.log("Cumulative distance at this step: " + cumulativeDistance)
          }

      }
	})
}

//Function for embeding map on index.html using the users entered data
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

//Function for embeding secondary map which will contain data for weather collected along route
function initMap() {

    var position1 = {lat: 39.9582118, lng: -82.98304879999999};
    var position2 = {lat: 39.0, lng: -82.58304879999999};
    var map = new google.maps.Map(document.getElementById('secondaryMap'), {
      zoom: 8,
      center: position1
    });
    var marker = new google.maps.Marker({
      position: position1,
      map: map,
      icon: "assets/images/Avatars/Sunny-Day-Avatars/test.jpg"
    });
    var marker2 = new google.maps.Marker({
      position: position2,
      map: map
    });    
}

//===================================================================================================
                    //                  OPENWEATHERMAPS                        //
//===================================================================================================


  function weatherMapsAPICall(latitude, longitude/*, distance*/){
    //var cityName = $("#startLocation").val().trim();
    // var latitude = $("#startLat").val().trim();
    // var longitude = $("#startLon").val().trim();
    console.log(cityName);
    var queryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIKey + 
      "&lat=" + latitude + "&lon=" + longitude;
      $.ajax({
        url: queryWeatherURL,
        method: "GET"
      }).done(function(response) {
        weatherMapsAPIResults(response/*, distance*/);
      });
  };

  // function getWeatherIcon(response){
  // 	var weatherIconCode
  // 	return weather
  // };

  function weatherMapsAPIResults(response/*, /distance*/){
          cityName = "";
          console.log("City name (should be null): " + cityName)
          // Create CODE HERE to log the resulting object
          console.log(response);
          // Create CODE HERE to transfer content to HTML

          // make a new block for a city's data-chunk
          var outputBlock = $("<div>")
          outputBlock.addClass("outputBlock")
          outputBlock.attr("style = 'border: 1px solid black'")

          var blockDivider = $("<p>")
          blockDivider.text("=====================================================")
          outputBlock.append(blockDivider);

          // write the city data
          var city = $("<p>")
          city.text("City: " + response.name)
          outputBlock.append(city)

          // Write the distance from last step
          // var cumulativeDist = $("<p>")
          // cumulativeDist.text("Distance from start: " + distance)
          // outputBlock.append(cumulativeDist)       


          // Pull the icon from Open Weather API
          var weatherIcon = $("<img>")
          //var iconID = getWeatherIcon
          //var iconURL = "http://openweathermap.org/img/w/"+ iconID +".png"
          var iconURL = "https://openweathermap.org/img/w/10d.png"
          weatherIcon.attr("src", iconURL)
          outputBlock.append(weatherIcon)

          // write the wind data
          var wind = $("<p>");
          wind.text("Windspeed (km/h): "+ response.wind.speed)
          outputBlock.append(wind);

          //write the humidity data
          var humidity = $("<p>")
          humidity.text("Humidity: "+ response.main.humidity + "%")
          outputBlock.append(humidity);

          // Write the temp data
          // var degreeK = response.main.temp
          // var degreeC = (response.main.temp)- 273
          var degreeF = Math.round(((response.main.temp)-273)*1.8 + 32);

          var temperature = $("<div>")
          // temperature.append("<p>" + "Temperature: " + degreeK + "K" + "</p>");
          // temperature.append("<p>" + "Temperature: " + degreeC + "C" + "</p>");
          temperature.append("<p>" + "Temperature: " + degreeF + "F" + "</p>");
          outputBlock.append(temperature);

          $("#dataOutput").append(outputBlock);
    }

	function launch() {
		$(".mainContainerDone").hide();
		$(".mainContainer").show();
	}

//On click event for startpages launch function which will log the start location and finish location as variables. 
$("#launch").on("click", function() {
	alert("test")
	startCity = $("#startCity").val().trim();
	startState = $("#startState").val().trim();
	endCity = $("#endCity").val().trim();
	endState = $("#endState").val().trim();
	
	//running ajax command for retrieval of google direction maps api after user input variables have been saved.
	googleDirectionApiCall();

	launch();

	//running ajax command for retreival of google maps embed map
	googleMapEmbedCall();

	//running firebase log to push user data to firebase
	fireBaseLog();

	$("body").append("<script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyDDopEOP1NAJOEi6wHEHABa_qz8Z6Npe_E&callback=initMap'></script>")

})