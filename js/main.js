let search = document.getElementById("search");
let loading = document.getElementById("loading");

search.addEventListener("input", () => {
  let loc = search.value;
  getWeather(loc);
});

async function getWeather(loc) {
  try {
    loading.classList.replace("d-none", "d-flex");
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=7a61b4c9f02842308b0214110240712&q=${loc}&days=3&aqi=no&alerts=no`
    );
    if (response.ok) {
      let result = await response.json();
      displayDay(result);
      displayFuture(result);
    }
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    loading.classList.replace("d-flex", "d-none");
  }
}

function dataToString(da) {
  let date = new Date(da);

  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    dayName: daysOfWeek[date.getDay()],
    monthName: monthsOfYear[date.getMonth()],
  };
}

function displayDay(result) {
  let dayAndMonth = dataToString(result.forecast.forecastday[0].date);
  document.getElementById("row").innerHTML = `          
          <div class="col-md-4 p-0  ">
            <div id="weather-card" class="weather-card">
              <div class="weather-header  p-2 d-flex justify-content-between" id="">
                <p class="m-0 ms-2  ">${dayAndMonth.dayName}</p>
                <p class="m-0 me-2 ">${dayAndMonth.monthName}</p>
              </div>
              <div class="weather-content" id="">
                <p class="fs-5  location">${result.location.name}</p>
                <div class="weather-degree">
                  <p class="display-1 text-white m-0 fw-bold">${result.current.temp_c}<sup>o</sup>C</p>
                </div>
                <div class="weather-icon">
                  <img src="https:${result.current.condition.icon}" >
                </div>
                <p class="clear">${result.current.condition.text}</p>
                <div class="d-flex justify-content-between">
                  <span><img class="me-2" src="img/icon-umberella.png" alt="">${result.current.humidity}%</span>
                  <span><img class="me-2" src="img/icon-wind.png" alt="">${result.current.wind_kph}km/h</span>
                  <span><img class="me-2" src="img/icon-compass.png" alt="">${result.current.wind_dir}</span>
                </div>
              </div>
            </div>
          </div>`;
}

function displayFuture(result) {
  let temp = "";
  for (let i = 1; i < result.forecast.forecastday.length; i++) {
    temp += `
          <div class="col-md-4 p-0  ">
            <div class="weather-card weather-spc">
              <div class="weather-header  p-2 d-flex justify-content-center" id="">
                <p class="m-0 ms-2  ">${
                  dataToString(result.forecast.forecastday[i].date).dayName
                }</p>
              </div>
              <div class="weather-content text-center" id="">
                <div class=" mx-auto ">
                  <img  src="https:${
                    result.forecast.forecastday[i].day.condition.icon
                  }" >
                </div>
                <div class="weather-degree">
                  <p class="fw-semibold  m-0 text-white fs-3">${
                    result.forecast.forecastday[i].day.maxtemp_c
                  }<sup>o</sup>C</p>
                  <p class="fw-semibold fs-5 m-0">${
                    result.forecast.forecastday[i].day.mintemp_c
                  }<sup>o</sup>C</p>
                </div>
                <p class="clear">${
                  result.forecast.forecastday[i].day.condition.text
                }</p>
              </div>
            </div>
          </div>
  `;
  }
  document.getElementById("row").innerHTML += temp;
}

navigator.geolocation.getCurrentPosition(function (position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var all = `${latitude},${longitude}`;
  getWeather(all);
});
