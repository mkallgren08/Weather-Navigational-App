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
//===================================================================================================
                    //                  GOOGLE MAPS                         //
//===================================================================================================
var startLocation = "";
var finishLocation = "";


function ajaxTest () {
  var myGoogleAPIKey = "AIzaSyCVEgY0L4T1AtT6hvhafqj9BWIb_dgb_vI"
  startLocation = $("#startLocation").val().trim();
  console.log("start Location: " + startLocation);
  finishLocation = $("#finishLocation").val().trim();
  console.log("finish Location: " + finishLocation);

  var queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startLocation + 
              "&destination=" + finishLocation + "&key=AIzaSyCVEgY0L4T1AtT6hvhafqj9BWIb_dgb_vI";
  console.log(queryURL)
  $.ajax({
    url: queryURL,
    method: "GET",
    dataType: 'jsonp',
    cache: false,
  }).done(function(response) {
  console.log(response)
  });

};

// $("#launch").on("click", function() {
   
// })

//===================================================================================================
                    //                  OPENWEATHERMAPS                        //
//===================================================================================================


  function weatherMapsAPICall(latitude, longitude){
    var cityName = $("#startLocation").val().trim();
    // var latitude = $("#startLat").val().trim();
    // var longitude = $("#startLon").val().trim();
    console.log(cityName);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIKey + 
      "&lat=" + latitude + "&lon=" + longitude;
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(response) {
        weatherMapsAPIResults(response);
      });
};

    function weatherMapsAPIResults(response){
          cityName = "";
          console.log("City name (should be null): " + cityName)
          // Create CODE HERE to log the resulting object
          console.log(response);
          // Create CODE HERE to transfer content to HTML
          $(".city").text("City: " + response.name)
          $(".wind").text("Windspeed (km/h): "+ response.wind.speed)
          $(".humidity").text("Humidity: "+ response.main.humidity + "%")
          var degreeK = response.main.temp
          var degreeC = (response.main.temp)- 273
          var degreeF = ((response.main.temp)-273)*1.8 + 32
          $(".tempK").text("Temperature: " + degreeK + "K")
          $(".tempC").text("Temperature: " + degreeC + "C")
          $(".tempF").text("Temperature: " + degreeF + "F")
    }

    $("#submit").on("click", function(){
      if ($("#startLocation").val().length > 0 || $("#startLat").val() > 0){
            //weatherMapsAPICall();
            ajaxTest();
      }
    });
   
    
