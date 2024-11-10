document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("search");

  const getWeather = document.getElementById("getWeather");

  const weatherInfo = document.getElementById("weather-info");
  const city = document.getElementById("city");
  const temperature = document.getElementById("temperature");
  const condition = document.getElementById("condition");
  const errorMsg = document.getElementById("error-message");

  const API_KEY = "9bf4ad7a9a83fbc4f06283f7066a8f4a";

  getWeather.addEventListener("click", async () => {
    const searchValue = input.value.trim();
    if (!searchValue) return;

    try {
      let weatherData = await fetchWeatherData(searchValue);

      if (weatherData) {
        displayWeatherData(weatherData);
      } else {
        showError();
      }
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    try {
      const { lat, lon } = await getCoordinates(city);
      const oneCallUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const weatherResponse = await fetch(oneCallUrl);
      const weatherData = await weatherResponse.json();

      if (weatherData.cod !== 200) {
        throw new Error("City nor found");
      }
      return weatherData;
    } catch (error) {
      return null;
    }
  }

  async function getCoordinates(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod !== 200) throw new Error("City Not found");

    const { lat, lon } = data.coord;
    return { lat, lon };
  }

  function displayWeatherData(data) {
    if (!city || !temperature || !condition) {
      console.error("One or more dom elements are missing");
      return;
    }
    console.log(data);
    weatherInfo.classList.remove("hidden");

    errorMsg.classList.add("hidden");
    city.innerHTML = data.name;
    temperature.innerHTML = `${data.main.temp} °C`;
    condition.innerHTML = data.weather[0].description;
  }

  function showError() {
    weatherInfo.classList.add("hidden");
    errorMsg.classList.remove("hidden");
  }
});
