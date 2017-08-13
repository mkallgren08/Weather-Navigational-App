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

    // This is our API key. Add your own API key between the ""
    var APIKey = "f29cdafe21624061235bd7d34ec68e05";

    var cityName= "";

    var latitude = "";

    var longitude = "";

    var stepDistances = []

    var stepLength = ""
//===================================================================================================
                    //                  GOOGLE MAPS                         //
//===================================================================================================
var startLocation = "";
var finishLocation = "";
var startLat = "";
var startLon = "";
var finishLat = "";
var finishLon = "";
var i = "";

function getSum(total, num) {
    return total + num;
}

function googleDirectionApiCall () {
  var queryURLDirections = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startLocation + "&destination=" +
         finishLocation + "&key=AIzaSyCI-Q45nsEkZDVBrp2I8NB2cTTqK_hhgrg";
  $.ajax({
    url: queryURLDirections,
    method: "GET"
  }).done(function(response) {
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
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIKey + 
      "&lat=" + latitude + "&lon=" + longitude;
      $.ajax({
        url: queryURL,
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
          var iconURL = "http://openweathermap.org/img/w/10d.png"
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

    $("#submit").on("click", function(){
        startLocation = $("#startLocation").val().trim();
        console.log("start Location: " + startLocation);
        finishLocation = $("#finishLocation").val().trim();
        console.log("finish Location: " + finishLocation);
      if ($("#startLocation").val().length > 0 || $("#startLat").val() > 0){
            //weatherMapsAPICall();
            googleDirectionApiCall();

      }
    });
   
    
