

//weatherID =response.weather[0].id 

var weatherID = 500;


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
var overcastArray = [520, 804];

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

function displayAvatar(shorthand){
	var avatar = $("<img>")
	var avatarSrc = "./javascript/Avatars/" + shorthand + ".jpg"
	console.log("Src = " + avatarSrc)
	avatar.attr("src", avatarSrc)
	$(".avatar-display").html(avatar)
}

function pickAvatar(){
	if (rainIDArray.indexOf(weatherID) !== -1){
			displayAvatar("r")
	} else if (freezingRainID.indexOf(weatherID) !== -1){
			displayAvatar("fr")
	} else if (hazRainArray.indexOf(weatherID) !== -1){
			displayAvatar("rhw")
	} else if (thunderIDArray.indexOf(weatherID) !== -1){
			displayAvatar("ts")
	} else if (hazthunderArray.indexOf(weatherID) !== -1){
			displayAvatar("tshw")
	} else if (overcastArray.indexOf(weatherID) !== -1){
			displayAvatar("od")
	} else if (hazOvercastArray.indexOf(weatherID) !== -1){
			displayAvatar("odhw")
	} else if (heavySnowArray.indexOf(weatherID) !== -1){
			displayAvatar("hs")
	} else if (hazSnowArray.indexOf(weatherID) !== -1){
			displayAvatar("snhw")
	} else if (snowArray.indexOf(weatherID) !== -1){
			displayAvatar("sn")
	} else if (clearDayArray.indexOf(weatherID) !== -1){
			displayAvatar("cs")
	} else if (scatteredCloudArray.indexOf(weatherID) !== -1){
			displayAvatar("sc")
	} else {
		var error = $("<p>")
		error.text("Error!")
		$(".avatar-display").html(error)
	}
};