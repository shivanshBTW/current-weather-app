var map = null;
window.addEventListener("load", init);
let mapMade = false;
function init() {
  bindEvents();
  fillDefault();
  map = new MapmyIndia.Map("map", {
    center: [28.7041, 77.1025],
    zoomControl: true,
    hybrid: true,
    search: true,
    location: true
  });
}

function bindEvents() {
  document.querySelector("#searchButton").addEventListener("click", callAPI);
}

function fillDefault() {
  document.querySelector("#cityName").value = "Delhi";
}

function callAPI() {
  var city = document.querySelector("#cityName").value;
  var url =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=097cae123862b91724e8f4f5e69d7050";
  console.log(url);
  fetch(url)
    .then(received => {
      console.log("recieved is ", received);
      received
        .json()
        .then(data => {
          console.log("data is : ", data);
          printWeather(data);
        })
        .catch(err => {
          console.log("error in data is ", err);
        });
    })
    .catch(err => {
      console.log("err in received is ", err);
    });
}

function printImage(data) {
  console.log("here");
}

function printWeather(data) {
  if (data.cod != 404) {
    document.querySelector("#minTemp").innerText = data.main.temp_min - 273.15;
    document.querySelector("#maxTemp").innerText = data.main.temp_max - 273.15;
    document.querySelector("#avgTemp").innerText =
      (parseInt(document.querySelector("#minTemp").innerText) +
        parseInt(document.querySelector("#maxTemp").innerText)) /
      2;
    document.querySelector("#clouds").innerText = data.clouds.all + "%";
    document.querySelector("#humidity").innerText = data.main.humidity + "%";
    document.querySelector("#weather").innerText = data.weather[0].main;
    document.querySelector("#windSpeed").innerText = data.wind.speed + " m/s";
    // document.querySelector('#gustSpeed').innerText = data.wind.gust + " m/s";
    var dirDegree = data.wind.deg / 22.5;
    var direction;
    console.log(dirDegree);
    if (dirDegree >= 2 && dirDegree < 4) {
      direction = "North-East";
    } else if (dirDegree >= 4 && dirDegree < 6) {
      direction = "East";
    } else if (dirDegree >= 6 && dirDegree < 8) {
      direction = "South-East";
    } else if (dirDegree >= 8 && dirDegree < 10) {
      direction = "South";
    } else if (dirDegree >= 10 && dirDegree < 12) {
      direction = "South-West";
    } else if (dirDegree >= 12 && dirDegree < 14) {
      direction = "West";
    } else if (dirDegree >= 4 && dirDegree < 6) {
      direction = "North-West";
    } else if (dirDegree >= 17 || dirDegree < 2) {
      direction = "North";
    }
    document.querySelector("#direction").innerText = direction;
    initMap(data.coord.lat, data.coord.lon);
  } else {
    window.alert("That's not a real city");
  }
}

function initMap(lat, lon) {
  var pt = new L.LatLng(lat, lon);
  map.setView(pt);
  var marker = L.marker([lat, lon]).addTo(map);

  //   document.querySelector("#map");
  // marker.bindPopup("<b>Hey There!</b><br>This is the place u searched for.").openPopup();
}
