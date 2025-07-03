// Weather API Configuration
const weatherApi = {
  key: '4eb3703790b356562054106543b748b2',
  baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

// DOM Elements
const searchInputBox = document.getElementById('input-box');
const weatherBody = document.getElementById('weather-body');
const parent = document.getElementById('parent');

// Event Listener - Trigger on Enter Key Press
searchInputBox.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const city = searchInputBox.value.trim();
    if (city !== '') {
      getWeatherReport(city);
    } else {
      swal("Empty Input", "Please enter a city name.", "error");
    }
  }
});

// Fetch Weather Report
function getWeatherReport(city) {
  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then(response => response.json())
    .then(data => showWeatherReport(data))
    .catch(err => {
      swal("Network Error", "Something went wrong. Please try again.", "error");
      reset();
    });
}

// Show Weather Report
function showWeatherReport(weather) {
  if (weather.cod === '404') {
    swal("City Not Found", "Please enter a valid city name.", "warning");
    reset();
    return;
  }

  // Display weather container
  weatherBody.style.display = 'block';

  const todayDate = new Date();

  weatherBody.innerHTML = `
    <div class="location-deatils">
      <div class="city">${weather.name}, ${weather.sys.country}</div>
      <div class="date">${formatDate(todayDate)}</div>
    </div>

    <div class="weather-status">
      <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>
      <div class="weather">${weather.weather[0].main} 
        <i class="${getIconClass(weather.weather[0].main)}"></i>
      </div>
      <div class="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / 
        ${Math.ceil(weather.main.temp_max)}&deg;C (max)
      </div>
      <div id="updated_on">Updated as of ${formatTime(todayDate)}</div>
    </div>

    <hr>

    <div class="day-details">
      <div class="basic">
        Feels like ${weather.main.feels_like}&deg;C |
        Humidity ${weather.main.humidity}% <br>
        Pressure ${weather.main.pressure} mb |
        Wind ${weather.wind.speed} KMPH
      </div>
    </div>
  `;

  changeBackground(weather.weather[0].main);
  reset();
}

// Format Time for "Updated as of"
function formatTime(date) {
  const hours = addLeadingZero(date.getHours());
  const minutes = addLeadingZero(date.getMinutes());
  return `${hours}:${minutes}`;
}

// Format Date for Weather Section
function formatDate(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} (${days[date.getDay()]}) , ${date.getFullYear()}`;
}

// Change background based on weather status
function changeBackground(status) {
  const backgrounds = {
    Clouds: 'img/clouds.jpg',
    Rain: 'img/rainy.png',
    Clear: 'img/clear.jpg',
    Snow: 'img/snow.jpg',
    Sunny: 'img/sunny.jpg',
    Thunderstorm: 'img/thunderstrom.jpg',
    Drizzle: 'img/drizzle.jpg',
    Mist: 'img/mist.jpg',
    Haze: 'img/mist.jpg',
    Fog: 'img/mist.jpg'
  };

  document.body.style.backgroundImage = `url(${backgrounds[status] || 'img/bg.jpg'})`;
}

// Get icon class based on weather condition
function getIconClass(condition) {
  const icons = {
    Rain: 'fas fa-cloud-showers-heavy',
    Clouds: 'fas fa-cloud',
    Clear: 'fas fa-cloud-sun',
    Snow: 'fas fa-snowman',
    Sunny: 'fas fa-sun',
    Mist: 'fas fa-smog',
    Haze: 'fas fa-smog',
    Fog: 'fas fa-smog',
    Thunderstorm: 'fas fa-bolt',
    Drizzle: 'fas fa-cloud-rain'
  };

  return icons[condition] || 'fas fa-cloud-sun';
}

// Reset input field
function reset() {
  searchInputBox.value = '';
}

// Add leading zero if number < 10
function addLeadingZero(num) {
  return num < 10 ? '0' + num : num;
}
