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

    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIKey;

    // We then created an AJAX call
    $("#submit").on("click", function(){
      var cityName = $("#startLocation").val().trim();
      var latitude = $("#startLat").val().trim();
      var longitude = $("#startLon").val().trim();
      console.log(cityName);
      var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIKey + 
        "&lat=" + latitude + "&lon=" + longitude;
      if ($("#startLocation").val().length > 0 || $("#startLat").val() > 0){
        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {
          cityName = "";
          console.log("City name (should be null): " + cityName)

          // Create CODE HERE to Log the queryURL
          console.log(queryURL)
          // Create CODE HERE to log the resulting object
          console.log(response)
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

          // Create CODE HERE to calculate the temperature (converted from Kelvin)
          // Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
          // Create CODE HERE to dump the temperature content into HTML
        });
      };
    });
    
