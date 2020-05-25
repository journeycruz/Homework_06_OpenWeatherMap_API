var currentDay = moment().format('MM/DD/YY');
console.log(currentDay);
 
 
var apikey = "3ba04439f0de5f224e32e47815249bc9";
// on search
function displayCityInfo() {
   var movie = $(this).attr("data-name");
   var q = "San Antonio, TX, US";
   var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + q + "&apikey=" + apikey;
   // on click of city nav
   //var queryURL = "http://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&apikey=" + apikey;
   console.log(queryURL);
   // Creating an AJAX call for the specific city button being clicked
   $.ajax({
       url: queryURL,
       method: "GET"
   }).then(function(response) {
       console.log(response);
       var cityName = response.city.name;
       $("#city").text(cityName + " " + currentDay);
       var cityId = response.city.id;
       console.log("name: " + cityName + "id: " + cityId);
 
       /*
 
               // Creating a div to hold the movie
               var movieDiv = $("<div class='movie'>");
 
               // Storing the rating data
               var rating = response.Rated;
 
               // Creating an element to have the rating displayed
               var pOne = $("<p>").text("Rating: " + rating);
 
               // Displaying the rating
               movieDiv.append(pOne);
 
               // Storing the release year
               var released = response.Released;
 
               // Creating an element to hold the release year
               var pTwo = $("<p>").text("Released: " + released);
 
               // Displaying the release year
               movieDiv.append(pTwo);
 
               // Storing the plot
               var plot = response.Plot;
 
               // Creating an element to hold the plot
               var pThree = $("<p>").text("Plot: " + plot);
 
               // Appending the plot
               movieDiv.append(pThree);
 
               // Retrieving the URL for the image
               var imgURL = response.Poster;
 
               // Creating an element to hold the image
               var image = $("<img>").attr("src", imgURL);
 
               // Appending the image
               movieDiv.append(image);
 
               // Putting the entire movie above the previous movies
               $("#movies-view").prepend(movieDiv); */
   });
 
}
 
displayCityInfo();
