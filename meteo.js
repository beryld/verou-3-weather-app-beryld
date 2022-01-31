import { data } from "./config.js";
const {
  searchButton,
  cityInput,
  dayNames,
  cityName,
  today,
  daysOfWeek,
  temperat,
  icons,
  daypops,
  bodyback,
  feet,
} = consts();
var { lat, lon, nameCity, currentDate, days } = vars();

//TODO: Format onclick inside a function that is call - able

cityInput.value = "Taiwan";

const KeyPressed = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
};

const fetchCoordinates = () => {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInput.value + "&limit=1&appid=" + data.key
    )
    .then(function (responseLat) {
      if (!responseLat.ok) {
        throw new Error(" Biiiiiiiiip " + response.status);
      }
      return responseLat.json();
    })
    .then(function (responseLat) {
      lat = responseLat[0].lat;
      lon = responseLat[0].lon;
      nameCity = responseLat[0].name;
      fetchMeteo();
      imgFishing();
    });
};

const fetchMeteo = () => {
  fetch( "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&exclude=minutely,alerts&mode=json&appid=" + data.key )
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! Biiiiiiiip status: ${response.status}`);
      }
      return response.json();
    })
    .then(function (response) {
      const hideIt = document.getElementById("container-results");
      cityName.textContent = nameCity;
      today.textContent = parseInt(response.current.temp) + "";
      fetchNameAndTemperature(response);
      fetchIcons(response);
      fetchPrecip(response);
      document.getElementById('container-results').style.visibility="visible"
      // hideIt.style.visibility = "visible";
          });
};

const fetchPrecip = (response) => {
  for (let index = 0; index < 4; index++) {
    daypops[index].textContent = parseInt(response.daily[index + 1].pop * 100) + " %";
  }
};

const fetchIcons = (response) => {
  for (let i = 0; i < 4; i++) {
  icons[i].src = "https://openweathermap.org/img/wn/" + response.daily[i + 1].weather[0].icon + "@2x.png";
  if (response.daily[i + 1].weather[0].icon == "13d") {
    icons[i].style.filter = " invert(100%)";
   }
  }
};

const imgFishing = () => {
  fetch("https://api.unsplash.com/search/photos?query=" + cityInput.value + "&per_page=20&client_id=" + data.unsplkey )
    .then(function (unsplashResponse) {
      if (!unsplashResponse.ok) {
        throw new Error( `HTTP error! Biiiiiiiiiiiip status: ${unsplashResponse.status}`
        );
      }
      return unsplashResponse.json();
    })
    //If style not backgroundimage but just background the cover property wont work !!!!
    .then(function (unsplashResponse) {
      const imgArraySize = unsplashResponse.results.length;
      const choise = Math.floor(Math.random() * imgArraySize);
      bodyback.style.backgroundImage = "linear-gradient(rgba(255, 255, 255, .7), rgba(255,255,255,0.5)), " + "url('" + unsplashResponse.results[choise - 1].urls.small + ")";
      feet.textContent = "Unsplash  license : " + unsplashResponse.results[choise - 1].user.name + "\n" + unsplashResponse.results[choise - 1].user.links.html; });
};

const fetchNameAndTemperature = (response) => {for (let i = 0; i < 4; i++) {
  let dayMax = days - 1 + i;
  if (dayMax >= 7) {
      dayMax = dayMax - 7;
  }
  dayNames[i].textContent = daysOfWeek[dayMax];
  temperat[i].textContent = parseInt(response.daily[i + 1].temp.day) + "°";
}

};
// window.onload = function () {
//   searchButton.click();
// };
window.onload = fetchCoordinates()
cityInput.addEventListener("keyup", KeyPressed);
searchButton.addEventListener("click", fetchCoordinates);

//TODO: fetch unix time stamp from API to display current time of city researched
function vars() {
  var todayla = new Date();
  var days = todayla.getDay() + 1;
  let lat;
  let lon;
  let nameCity;
  return { lat, lon, nameCity, currentDate, days };
}

function consts() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const cityInput = document.getElementById("city");
  const searchButton = document.getElementById("cityButt");
  const today = document.getElementById("current");
  const cityName = document.getElementById("name-city");
  const daypops = document.querySelectorAll(".popic");
  const bodyback = document.getElementById("bodybackA");
  
  const dayNames = document.querySelectorAll(".day-name");
  const temperat = document.querySelectorAll(".temperature");
  const icons = document.querySelectorAll(".ic");
  const feet = document.getElementById("foot");
  return {
    daysOfWeek,
    cityInput,
    searchButton,
    today,
    cityName,
    daypops,
    bodyback,
    
    dayNames,
    temperat,
    icons,
    feet,
  };
}


