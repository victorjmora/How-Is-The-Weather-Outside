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

    // Add event listener to the newly created button
    buttonEl.addEventListener('click', async function () {
        var { name, lat, lon } = await fetchGeoData(cityName);
        mainQueryName.textContent = name;
        var weatherInfo = await fetchWeatherInfo(lat, lon);
        getRequiredItems(weatherInfo);
        var forecastWeatherInfo = await fetchForecastInfo(lat, lon);
        getForecastItems(forecastWeatherInfo);
    });
}

// Fetches the weather information for a given latitude and longitude
async function fetchWeatherInfo(lat, lon) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    var response = await fetch(weatherUrl);
    var data = await response.json();
    return data;
  }

  // Fetches the geolocation data for a given city name
  async function fetchGeoData(cityName) {
    var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    var response = await fetch(geoUrl);
    var [data] = await response.json();
    var { name, lat, lon } = data;
    localStorage.setItem('Name', name);
    localStorage.setItem(`${name} lat`, lat);
    localStorage.setItem(`${name} lon`, lon);
    return { name, lat, lon };
  }
  
  // Fetches the forecast information for a given latitude and longitude
  async function fetchForecastInfo(lat, lon) {
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    var response = await fetch(forecastUrl);
    var data = await response.json();
    return data;
  }

  // function to update the forecast items in the UI
function getForecastItems(dataEl) {
    // set initial numberTest to -1
    var numberTest = -1;
    // loop through 5 times to get the forecast items
    for (var i = 0; i < 5; i++) {
        // increase numberTest by 8 to get the forecast data for every 24 hours
        numberTest += 8;
        // get the forecast date, icon, temperature, humidity, and wind speed for the current numberTest
        var forecastDate = dataEl.list[numberTest].dt_txt;
        var forecastIcon = dataEl.list[numberTest].weather[0].icon;
        var forecastTemp = dataEl.list[numberTest].main.temp;
        var forecastHumidity = dataEl.list[numberTest].main.humidity;
        var forecastWindSpeed = dataEl.list[numberTest].wind.speed;
        // update the UI with the forecast items
        document.getElementById('date'+ numberTest).textContent = forecastDate;
        document.getElementById('temp'+ numberTest).textContent = forecastTemp;
        document.getElementById('wind'+ numberTest).textContent = forecastWindSpeed;
        document.getElementById('humidity'+ numberTest).textContent = forecastHumidity;

        // update the icon image source and display it inline
        var iconEl = document.getElementById('icon'+ numberTest);
        iconEl.setAttribute('src', 'http://openweathermap.org/img/w/' + forecastIcon + '.png');
        iconEl.style.display = 'inline';
    }
}

// function to get the required weather items
function getRequiredItems(dataEl) {
    // get the humidity, temperature, and wind speed from the API data for the current location
    var humidity = dataEl.list[0].main.humidity
    var temp = dataEl.list[0].main.temp
    var wind = dataEl.list[0].wind.speed
    // store the weather items in localStorage
    localStorage.setItem('Humidity', humidity)
    localStorage.setItem('Temperature', temp)
    localStorage.setItem('Wind Speed', wind)
    // update the UI with the latest temperature, wind speed, and humidity from localStorage
    document.getElementById('latestQTemp').textContent = localStorage.getItem('Temperature', temp) + ' Kelvin';
    document.getElementById('latestQWindSpeed').textContent = localStorage.getItem('Wind Speed', wind) + ' MPH';
    document.getElementById('latestQHumidity').textContent = localStorage.getItem('Humidity', humidity) + ' %';
}

// get the current date and set it in the UI
var timeNow = dayjs().format('MM/DD/YYYY');
mainDateQuery.textContent = timeNow;
