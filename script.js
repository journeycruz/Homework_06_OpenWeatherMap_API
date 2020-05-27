var currentDay = moment().format('(MM/DD/YY)');
var apikey = "3ba04439f0de5f224e32e47815249bc9";
var queryType = "";
// get all inputs
var allInputs = JSON.parse(localStorage.getItem("allInputs") || "[]");
 
// if search history exists in local storage, get last search url and get weather
if (!Array.isArray(allInputs) || !allInputs.length) {
   // array does not exist, is not an array, or is empty - do not process
} else {
   var lastInput = allInputs[allInputs.length - 1]
   var weatherQueryURL = lastInput.url;
   getWeather(weatherQueryURL);
}
 
// on search button click
$("#searchBtn").on("click ", function() {
   queryType = "search";
   var q = document.getElementById("search").value;
   var weatherQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + q + "&units=imperial" + "&apikey=" + apikey;
   getWeather(weatherQueryURL);
});
// on city button click
$(".cityBtn").on("click ", function() {
   queryType = "city button";
   var cityId = this.id;
   var weatherQueryURL = "http://api.openweathermap.org/data/2.5/weather?id=" + cityId + "&units=imperial" + "&apikey=" + apikey;
   getWeather(weatherQueryURL);
});
 
// current weather function
function getWeather(weatherQueryURL) {
   $.ajax({
       url: weatherQueryURL,
       method: "GET"
   }).then(function(response) {
       var cityId = response.id;
       var cityName = response.name;
       $("#city").text(cityName + " " + currentDay);
       // get icon and set url
       var icon = response.weather[0].icon;
       var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png ";
       var cardImg = document.getElementById("weatherIcon");
       cardImg.setAttribute("src", iconURL);
       var temp = response.main.temp;
       $("#temperature").text(temp + " F");
       var humidity = response.main.humidity;
       $("#humidity").text(humidity + " %");
       var windspeed = response.wind.speed;
       $("#windspeed").text(windspeed + " MPH");
 
       // get lon and lat values to use for uv and forecast urls
       var lon = response.coord.lon;
       var lat = response.coord.lat;
       // build UV query url and call getUV function
       var UVQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apikey + "&lat=" + lat + "&lon=" + lon;
       getUV(UVQueryURL);
       // build forecast query url and call getUV function
       var forecastQueryURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + apikey;
       getForecast(forecastQueryURL);
 
       // add to local storage if queryType is search
       if (queryType == "search") {
           // create current object of city id, name, url
           var currentInput = {
               id: cityId,
               val: cityName,
               url: weatherQueryURL
           };
           // add object to arary of all inputs and save to local storage array
           allInputs.push(currentInput);
           localStorage.setItem("allInputs", JSON.stringify(allInputs));
       }
   });
}
 
// uv function
function getUV(UVQueryURL) {
   // Creating an AJAX call for the specific city button being clicked
   $.ajax({
       url: UVQueryURL,
       method: "GET"
   }).then(function(response) {
       // get uv index value and set
       var uvindex = response.value;
       $("#uvindex").text(uvindex);
       // get uv span element and set background color class based on uv index scale
       var uvElement = document.getElementById("uvindex");
       if (uvindex > 0 && uvindex < 2) {
           uvElement.setAttribute("class", "low btn");
       }
       if (uvindex > 2 && uvindex < 6) {
           uvElement.setAttribute("class", "moderate btn");
       }
       if (uvindex > 6 && uvindex < 8) {
           uvElement.setAttribute("class", "high btn");
       }
       if (uvindex > 8 && uvindex < 11) {
           uvElement.setAttribute("class", "veryhigh btn");
       }
       if (uvindex > 11) {
           uvElement.setAttribute("class", "extreme btn");
       }
   });
}
 
// forecast function
function getForecast(forecastQueryURL) {
   $.ajax({
       url: forecastQueryURL,
       method: "GET"
   }).then(function(response) {
       var daily = response.daily;
       for (let i = 0; i < daily.length; i++) {
           // for next 5 days only - skip first and last day of 7 day response
           if (i > 0 && i < 6) {
               var cardID = "card" + i;
               // get date
               var currentDay = daily[i];
               // convert unix timestamp to date and format
               var date = new Date(currentDay.dt * 1000).toLocaleDateString("en-US");
               $("#" + cardID + "date").text(date);
               // get icon and set url
               var icon = currentDay.weather[0].icon;
               var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png ";
               var cardImg = document.getElementById(cardID + "img");
               cardImg.setAttribute("src", iconURL);
               // get temp
               var temp = daily[i].temp.day;
               $("#" + cardID + "temp").text(temp + " F");
               // get humidity
               var humidity = daily[i].humidity;
               $("#" + cardID + "humidity").text(humidity + " %");
           };
       };
   });
}
