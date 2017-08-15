//-----------------Variables------------------------

var map = "";
var markerArray = [];

//weatherID =response.weather[0].id 

var weatherID = "";


//=======================================================================
// 		RAIN & THUNDERSTORMS
//=======================================================================

// Rain: For everything 
var rainIDArray = [500, 501, 502, 503, 520, 521];

// freezing rain
var freezingRainID = [511];

// rain with hazardous weather
var hazRainArray = [502, 503, 504, 522, 901, 902, 906];

// Thunderstorms (ts avatars)
var thunderIDArray = [200, 201, 210, 211, 221, 230, 231, 232];

// Hazardous Thunderstorms (ts avatars)
var hazthunderArray = [202, 212];

// =====================================================================
//		OVERCAST
// =====================================================================

// overcast day for hazardous reasons (odhw avatars)
var hazOvercastArray = [711, 721, 731, 441, 751, 761, 762, 771, 781, 900, 905];

// general overcast day (od avatars)
var overcastArray = [520, 804, 701];

// =====================================================================
////		SNOW
// =====================================================================

// heavy snow (hs avatar)
var heavySnowArray = [602, 622];

// hazardous heavy snow
//hazHeavySnowArray = [] - nothing for now

// snow (sn avatar)
var snowArray = [600, 601, 611, 612, 620, 621];

// snow with hazards (snhw avatar)
var hazSnowArray = [615, 616];

// =====================================================================
//		CLEAR AND CLOUDY DAYS
// =====================================================================

// clear day

var clearDayArray = [800];
// scattered clouds
var scatteredCloudArray = [801, 802, 803]


// Global variables for our start and finish locations
var startLocation = "";
var finishLocation = "";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAI-jL25Uyj3rF0-402z3aCVMaheImMqQk",
  authDomain: "navigation-weather-app.firebaseapp.com",
  databaseURL: "https://navigation-weather-app.firebaseio.com",
  projectId: "navigation-weather-app",
  storageBucket: "navigation-weather-app.appspot.com",
  messagingSenderId: "268634641082"
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
	database.ref("Trip Data").push({
		startCity: startCity,
		startState: startState,
		endCity: endCity,
		endState: endState
	});
};

database.ref("Trip Data").limitToLast(5).on("child_added", function(childSnapshot) {
    console.log("Child Snapshot: " + childSnapshot.val());
    console.log("Start City: " + childSnapshot.val().startCity);
    console.log("End City: " + childSnapshot.val().endCity);
    console.log("Start State: " + childSnapshot.val().startState);
    console.log("End State: " + childSnapshot.val().endState);
    var searchHistory = $("<tr>");
    var startHistory = $("<td>");
    var endHistory = $("<td>");
    startHistory.append(childSnapshot.val().startCity + ", " + childSnapshot.val().startState);
    endHistory.append(childSnapshot.val().endCity + ", " + childSnapshot.val().endState);
    searchHistory.attr("role", "button");
    searchHistory.attr("class", "navHistoryData")
    searchHistory.append(startHistory);
    searchHistory.append(endHistory);
    $("#navHistoryData").append(searchHistory)

});

function getSum(total, num) {
    return total + num;
}

function weatherMapsAPICallTwo(latitude, longitude/*, distance*/){
var queryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIKey + 
  "&lat=" + latitude + "&lon=" + longitude;
  $.ajax({
    url: queryWeatherURL,
    method: "GET"
  }).done(function(response) {
    weatherMapsAPIIcons(response);
  });
};
var iconArray = [];
function weatherMapsAPIIcons(response){
        iconID = response.weather[0].icon
        var iconURL = "https://openweathermap.org/img/w/"+ iconID +".png"
        iconArray.push(iconURL)
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
      // initMap(startLat, startLon)
      // initMap(finishLat, finishLon)
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
            weatherMapsAPICallTwo(stepLat, stepLon)
            markerMap(response.routes[0].legs[0].steps[i].end_location)
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

function markerMap(coordinates) {
    var position1 = coordinates;
    // var position = "lat: " +  Latitude +", lng: " + Longitude
    // position1.append(position)
    // console.log(position1)
    var marker = {
      position: position1,
      map: map,
    };

    console.log("marker: " + marker.position.lat)
    markerArray.push(marker);
    console.log("marker array: " + markerArray)
};
//Function for embeding secondary map which will contain data for weather collected along route
function initMap() {

    // var position2 = {lat: 39.0, lng: -82.58304879999999};
    var map = new google.maps.Map(document.getElementById('secondaryMap'), {
    center: {lat: 34.397, lng: -90.644},
    zoom: 4
        });

    for (var l = 0; l < markerArray.length; l++) {
	var markerPip = new google.maps.Marker({
		position: markerArray[l].position,
		map: map,
		icon: iconArray[l]
		})}

}
    // var marker2 = new google.maps.Marker({
    //   position: position2,
    //   map: map
    // });    


//===================================================================================================
                    //                  OPENWEATHERMAPS                        //
//===================================================================================================


  function weatherMapsAPICall(latitude, longitude/*, distance*/){
    //var cityName = $("#startLocation").val().trim();
    // var latitude = $("#startLat").val().trim();
    // var longitude = $("#startLon").val().trim();
    //console.log(cityName);
    var queryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIKey + 
      "&lat=" + latitude + "&lon=" + longitude;
      $.ajax({
        url: queryWeatherURL,
        method: "GET"
      }).done(function(response) {
        console.log(response)
        weatherMapsAPIResults(response/*, distance*/);
      });
  };

  // function getWeatherIcon(response){
  // 	var weatherIconCode
  // 	return weather
  // };
function displayAvatar(shorthand, output){
	var avatar = $("<img>")
	var avatarSrc = "./assets/images/Avatars/" + shorthand + ".jpg"
	console.log("Src = " + avatarSrc)
  avatar.addClass("avatarThumb")
	avatar.attr("src", avatarSrc)
  avatar.attr("alt", "Avatar cannot be displayed")
	output.append(avatar)
  return output
}

function pickAvatar(output, response){
	weatherID = response.weather[0].id;
	if (rainIDArray.indexOf(weatherID) !== -1){
			displayAvatar("r", output)
	} else if (freezingRainID.indexOf(weatherID) !== -1){
			displayAvatar("fr", output)
	} else if (hazRainArray.indexOf(weatherID) !== -1){
			displayAvatar("rhw", output)
	} else if (thunderIDArray.indexOf(weatherID) !== -1){
			displayAvatar("ts", output)
	} else if (hazthunderArray.indexOf(weatherID) !== -1){
			displayAvatar("tshw", output)
	} else if (overcastArray.indexOf(weatherID) !== -1){
			displayAvatar("od", output)
	} else if (hazOvercastArray.indexOf(weatherID) !== -1){
			displayAvatar("odhw", output)
	} else if (heavySnowArray.indexOf(weatherID) !== -1){
			displayAvatar("hs", output)
	} else if (hazSnowArray.indexOf(weatherID) !== -1){
			displayAvatar("snhw", output)
	} else if (snowArray.indexOf(weatherID) !== -1){
			displayAvatar("sn", output)
	} else if (clearDayArray.indexOf(weatherID) !== -1){
			displayAvatar("cs",output)
	} else if (scatteredCloudArray.indexOf(weatherID) !== -1){
			displayAvatar("sc", output)
	} else {
		var error = $("<p>")
		error.text("Error!")
		$(".avatar-display").html(error)
	}
};

function callMarkerMap() {
	alert("test");
	$("body").delay(5000).append("<script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyDDopEOP1NAJOEi6wHEHABa_qz8Z6Npe_E&callback=initMap'></script>")
}

  function weatherMapsAPIResults(response/*, /distance*/){
          cityName = "";
          // make a new block for a city's data-chunk
          var outputBlock = $("<tr>")
          // Pull the icon from Open Weather API
          var avatarCell = $("<td>")
          avatarCell.append(pickAvatar(avatarCell, response))
          //avatarCell.text("Eyyyyy!")
          //var avatar = pickAvatar(avatarCell, response)
          outputBlock.append(avatarCell)
          // write the city data
          var city = $("<td>");
          city.text(response.name);
          outputBlock.append(city);
          //write the weather data
          var weather =  $("<td>");
          weather.text(response.weather[0].description);
          outputBlock.append(weather);
          // write the temperature
          var degreeF = Math.round(((response.main.temp)-273)*1.8 + 32);
          var temp =  "<td>" + degreeF + " &deg; </td>";
          outputBlock.append(temp);
          //write the humidity
          var humidityStat = $("<td>");
          humidityStat.text(response.main.humidity + "%");
          outputBlock.append(humidityStat)
          // write the wind data
          var wind = $("<td>");
          wind.text(Math.round((response.wind.speed)*0.62) + "mph")
          outputBlock.append(wind);

          $("#tripWeather").append(outputBlock);
          // Write the distance from last step
          // var cumulativeDist = $("<p>")
          // cumulativeDist.text("Distance from start: " + distance)
          // outputBlock.append(cumulativeDist)       


          // iconID = response.weather[0].icon
          // iconURL = "https://openweathermap.org/img/w/"+ iconID +".png"
          // var iconURL = "https://openweathermap.org/img/w/10d.png"
          // weatherIcon.attr("src", iconURL)
          // outputBlock.append(weatherIcon)


    }

// <<<<<<< HEAD
// =======


// >>>>>>> c99f52d21a5bc1acf63231bc20fffae52216dfdf
//On click event for startpages launch function which will log the start location and finish location as variables. 
$("#launch").on("click", function() {
// <<<<<<< HEAD
// =======
	
// >>>>>>> 636ece38b3d0ee8a7c43e64a125ca3e923b1f485
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

	setTimeout(function(){
		$("body").append("<script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyDDopEOP1NAJOEi6wHEHABa_qz8Z6Npe_E&callback=initMap'></script>")}
		,5000);
	

})