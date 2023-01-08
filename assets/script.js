const apiKey = "9f22897565b785c5e1809cff5dde2ef9";
//const onecallLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//const geocodeLink = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
var cities = document.getElementById("city-input");
var worldCities = [];

function searchCity(event) {
    event.preventDefault();
    const towns = cities.value;
    if (worldCities.includes(towns) === false ) {
        worldCities.push(towns);
        localStorage.setItem("history",JSON.stringify(worldCities));

        displayCities();
    }
 
    getCoords(towns);   
    
}

var searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", searchCity)

function getCoords(city) {
    const geoLink = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    fetch(geoLink).then((response) => {
        if (!response.ok) {
            console.log("Uh oh! Something went wrong fetching the city coordinates");
        }
        response.json().then((data) => {
            const lat = data[0].lat;
            const lon = data[0].lon;

            getForecast(city, lat, lon);
        });
    });
}

function getForecast(city, lat, lon) {
    const apiLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(apiLink).then((response) => {
        if (!response.ok) {
            console.log("Uh oh! Something went wrong fetching the forecast");
        }
        response.json().then((data) => {
            const current = data.current;
            const daily = [];

            for (let i = 0; i < 5; i++) {
                daily.push(data.daily[i])
            }

            htmlCreater(city, current, daily);
        });
    });


}

var presentBox = document.getElementById("current");
var foreCastBox = document.getElementById("cards");

function htmlCreater(city, current, daily) {

    //current
    presentBox.replaceChildren();

    const presentDate = unixToDate(current.dt);
    const presentIcon = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
    console.log(city, current, daily);

    // h2-cityname-date-icon
    let cityName = document.createElement("h2");
    cityName.innerHTML = `${city} (${presentDate}) <img src = ${presentIcon} />`;

    //temp
    const presentTemp = document.createElement("p");
    presentTemp.textContent = `Temp: ${kelvToFahr(current.temp)}°F`
    
    //wind
    const presentWind = document.createElement("p");
    presentWind.textContent = `Wind: ${current.wind_speed} MPH`;

    //humidity
    const presentHumidity = document.createElement("p");
    presentHumidity.textContent = `Humidity: ${current.humidity}%`

    presentBox.appendChild(cityName);
    presentBox.appendChild(presentTemp);
    presentBox.appendChild(presentWind);
    presentBox.appendChild(presentHumidity);

    //5-day forecast card
    foreCastBox.replaceChildren();
    for (let i = 0; i < daily.length; i++) {
        const day =daily[i];

        //card
        const dayCard = document.createElement("div");
        dayCard.className = "card";
        dayCard.innerHTML = `
        <h2>${unixToDate(day.dt)}</h2>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
        <p>Temp: ${kelvToFahr(day.temp.day)}°F</p>
        <p>Wind: ${day.wind_speed} MPH</p>
        <p>Humidity: ${day.humidity}%</p>
        `;
        foreCastBox.appendChild(dayCard);

        //date
        //icon
        //temp
        //wind
        //humidity

    }
   
}
function unixToDate(unix) {
    const date = new Date(unix * 1000);
    const month = date.getMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`

}
function kelvToFahr(K) {
    let F = 1.8 * (K-273) + 32;

    return F.toFixed(2);
}

function displayCities() {
    const localData = JSON.parse(localStorage.getItem("history"));
    if (localData) {
        worldCities = localData;
        var record = document.getElementById("record");
        record.innerHTML = "";

        for ( let i = 0; i < worldCities.length; i++){
            record.innerHTML += `<button class="btn btn-secondary text-dark directButton" >${worldCities[i]}</button>`
        }
        var directButton = document.querySelectorAll(".directButton");
        for (let i = 0; i < directButton.length; i++){
            directButton[i].addEventListener("click",function(){
                let city = this.textContent;
                getCoords(city);
            })
        }
    }


}

displayCities();

getCoords(worldCities[worldCities.length - 1])


//var cities = document.getElementById("city-input");
//var history = document.getElementById("record");
//var weatherDisplay = document.getElementById("weather-display");
//var present = document.getElementById("current");
//var foreCast= document.getElementById("forecast");
//var cards= document.getElementById("cards");
//var searchButton = document.getElementById("search-btn");

//searchButton.addEventListener("click",function(event){
 //   event.preventDefault();
  //  var towns = cities.value
  //  checkWeather(towns);
//})

//function checkWeather(cityname){
 //   const requestedUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=6cae72ceffa8ab3592c297eac91ff1b1&units=imperial`

//fetch(requestedUrl)
//.then(function(response){
  //  return response.json();
//})
//.then(function(currentweather){
  //  console.log(currentweather);
   // const futureWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=6cae72ceffa8ab3592c297eac91ff1b1&units=imperial`
    //fetch(futureWeather)
 //   .then (function(response){
 //       return response.json();

 //   })
 //   .then(function(futureWeather){
 //       console.log(futureWeather);
 //   })

//})



