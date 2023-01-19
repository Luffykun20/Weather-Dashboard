//apikey to have permission to fetch data
const apiKey = "9f22897565b785c5e1809cff5dde2ef9";

var cities = document.getElementById("city-input");
var worldCities = [];

// handles search button form
function searchCity(event) {
    event.preventDefault();
    const towns = cities.value;

    //checks if what we searched already exists
    //If not, then push new search to empty array
        if (worldCities.includes(towns) === false ) {
        worldCities.push(towns);
        //save to local storage
        localStorage.setItem("history",JSON.stringify(worldCities));


        displayCities();
    }
 
    getCoords(towns);   
    
}
// adding click function to search button
var searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", searchCity)

// function to fetch the cities coordinates 
function getCoords(city) {
    const geoLink = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
    fetch(geoLink).then((response) => {
        if (!response.ok) {
            console.log("Uh oh! Something went wrong fetching the city coordinates");
        }
        response.json().then((data) => {
            const lat = data[0].lat;
            const lon = data[0].lon;

            // run trough getForecast function
            getForecast(city, lat, lon);
        });
    });
}

// function to fetch forecast weather (from city coordinates)
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

            // create HTML using given data
            htmlCreater(city, current, daily);
        });
    });


}
// current board
var presentBox = document.getElementById("current");

// 5-day forecast cards
var foreCastBox = document.getElementById("cards");

// function to create HTML
function htmlCreater(city, current, daily) {

    //destroys all children in current board so we can make copies
    presentBox.replaceChildren();

    const presentDate = unixToDate(current.dt);
    const presentIcon = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
    // makes data visible in console application tools
    console.log(city, current, daily);

    // h2-cityname-date-icon
    let cityName = document.createElement("h2");
    cityName.innerHTML = `${city} (${presentDate}) <img src = ${presentIcon} />`;

    //temperature 
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

    //destroys all children in 5-day forecast cards so we can make copies
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

      
    }
   
}

//convert unix to readable data format
function unixToDate(unix) {
    const date = new Date(unix * 1000);
    console.log(date);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}/${day}/${year}`

}
//function to convert Kelvin units to fahrenheit units
function kelvToFahr(K) {
    let F = 1.8 * (K-273) + 32;

    return F.toFixed(2);
}

function displayCities() {
    //get data from local storage
    let localData = JSON.parse(localStorage.getItem("history"));

    // empty array becomes localstorage data
    if (localData) {
        worldCities = localData;
    

        var record = document.getElementById("record");
        record.innerHTML = "";

        //loop through search history and creates buttons for searched cities
        for ( let i = 0; i < worldCities.length; i++){
            record.innerHTML += `<button class="btn btn-secondary text-dark directButton" >${worldCities[i]}</button>`
        }
        var directButton = document.querySelectorAll(".directButton");
        for (let i = 0; i < directButton.length; i++){
            
            // get textcontent and run fetch
            directButton[i].addEventListener("click",function(){
                let city = this.textContent;
                getCoords(city);
            })
        }
    }
}


//load search history on page load
displayCities();

getCoords(worldCities[worldCities.length - 1])

