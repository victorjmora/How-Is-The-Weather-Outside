// API key for OpenWeatherMap API
var API_KEY = '66e72c1c25d39f1f6a1cdad30c8547f8';

// Elements to be used for searching and displaying data
var searchBtnEl = document.getElementById('searchBtn');
var searchVal = document.getElementById('nameInput');
var mainQueryName = document.getElementById('searchName');
var mainDateQuery = document.getElementById('dateMainQuery');

// Event listener for search button click
searchBtnEl.addEventListener('click', async function () {
    var cityName = searchVal.value;
    var { name, lat, lon } = await fetchGeoData(cityName);
    mainQueryName.textContent = name;
    var weatherInfo = await fetchWeatherInfo(lat, lon);
    getRequiredItems(weatherInfo);
    var forecastWeatherInfo = await fetchForecastInfo(lat, lon);
    getForecastItems(forecastWeatherInfo);  
    historyAdd(cityName); // Add searched city to history
});

// Function to add searched city to history
async function historyAdd(cityName) {
    // Get geographic data for city
    var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    var response = await fetch(geoUrl);
    var [data] = await response.json();
    var { name } = data;

    var historyEl = document.querySelector('#historyID ul');
    var buttonEl = document.createElement('button');
    buttonEl.textContent = name;
    historyEl.appendChild(buttonEl);
