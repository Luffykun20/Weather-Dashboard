const apiKey = "6cae72ceffa8ab3592c297eac91ff1b1";
var cities = document.getElementById("cities");
var history = document.getElementById("record");
var weatherDisplay = document.getElementById("weather-display");
var present = document.getElementById("current");
var foreCast= document.getElementById("forecast");
var cards= document.getElementById("cards");
var searchButton = document.getElementById("search-btn");

searchButton.addEventListener("click",function(event){
    event.preventDefault();
    var towns = cities.value
    checkWeather(towns);
})

function checkWeather(cityname){
    const requestedUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=6cae72ceffa8ab3592c297eac91ff1b1&units=imperial`

fetch(requestedUrl)
.then(function(response){
    return response.json();
})
.then(function(currentweather){
    console.log(currentweather);
    const futureWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=6cae72ceffa8ab3592c297eac91ff1b1&units=imperial`
    fetch(futureWeather)
    .then (function(response){
        return response.json();
    
    })
    .then(function(futureWeather){
        console.log(futureWeather);
    })

})

    
    
    
}