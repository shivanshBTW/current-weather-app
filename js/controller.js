window.addEventListener('load', init);
var mymap;
function init() {
  bindEvents();
  fillDefault();
  callAPI();
  dropdownChecker();
  // geoLocation();
  mymap = L.map('mapid').setView([28.6139, 77.209], 13);
}

function bindEvents() {
  document.querySelector('#searchButton').addEventListener('click', callAPI);
  document.querySelector('#searchButtonLatLon').addEventListener('click', LatLonCaller);
  document.querySelector('#currentLocationLatLon').addEventListener('click', GPSCaller);  
  document.querySelector('#main-dropdown').addEventListener('change', dropdownChecker);
}

function LatLonCaller(){
  var latitude_1 = document.querySelector('#latitude').value;
  var longitude_1 = document.querySelector('#longitude').value;
  callAPILatLon(latitude_1,longitude_1);

}

function GPSCaller(){
  geoLocation();
}

function dropdownChecker() {
  var dropdownValue = document.querySelector('#main-dropdown').value;
  document.querySelectorAll('.hidethese').forEach(elem => {
    elem.className = 'form-inline hidethese hideit';
    // console.log(elem)
  });

  if(dropdownValue==1){
    document.querySelector('#searchByName').className = 'form-inline hidethese';
  } else if(dropdownValue==2){
    document.querySelector('#searchByLatLon').className = 'form-inline hidethese';
  } else if(dropdownValue==3){
    document.querySelector('#searchByGPS').className = 'form-inline hidethese';
  }

  // console.log(document.querySelectorAll('#hidethese'));
}

function geoLocation() {
  var x = document.getElementById('compatibilityDisplay');
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = 'Geolocation is not supported by this browser.';
    }
  }
  function showPosition(position) {
    callAPILatLon(position.coords.latitude, position.coords.longitude)
  }
  getLocation();
}

function fillDefault() {
  document.querySelector('#cityName').value = 'Delhi';
}

function callAPI() {
  var city = document.querySelector('#cityName').value;
  var url =
    'http://api.openweathermap.org/data/2.5/weather?q=' +
    city +
    '&appid=097cae123862b91724e8f4f5e69d7050';
  // console.log(url);
  fetch(url)
    .then(received => {
      // console.log('recieved is ', received);
      received
        .json()
        .then(data => {
          // console.log('data is : ', data);
          printWeather(data);
        })
        .catch(err => {
          console.log('error in data is ', err);
        });
    })
    .catch(err => {
      console.log('err in received is ', err);
    });
}

function callAPILatLon(lati,longi) {
  var url =
    `http://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=097cae123862b91724e8f4f5e69d7050`;
  // console.log(url);
  fetch(url)
    .then(received => {
      // console.log('recieved is ', received);
      received
        .json()
        .then(data => {
          // console.log('data is : ', data);
          printWeather(data);
        })
        .catch(err => {
          console.log('error in data is ', err);
        });
    })
    .catch(err => {
      console.log('err in received is ', err);
    });
}

function printWeather(data) {
  if (data.cod != 404) {
    document.querySelector('#minTemp').innerText = data.main.temp_min - 273.15;
    document.querySelector('#maxTemp').innerText = data.main.temp_max - 273.15;
    document.querySelector('#avgTemp').innerText =
      (parseInt(document.querySelector('#minTemp').innerText) +
        parseInt(document.querySelector('#maxTemp').innerText)) /
      2;
    document.querySelector('#clouds').innerText = data.clouds.all + '%';
    document.querySelector('#humidity').innerText = data.main.humidity + '%';
    document.querySelector('#weather').innerText = data.weather[0].main;
    document.querySelector('#windSpeed').innerText = data.wind.speed + ' m/s';
    // document.querySelector('#gustSpeed').innerText = data.wind.gust + " m/s";
    var dirDegree = data.wind.deg / 22.5;
    var direction;
    // console.log(dirDegree);
    if (dirDegree >= 2 && dirDegree < 4) {
      direction = 'North-East';
    } else if (dirDegree >= 4 && dirDegree < 6) {
      direction = 'East';
    } else if (dirDegree >= 6 && dirDegree < 8) {
      direction = 'South-East';
    } else if (dirDegree >= 8 && dirDegree < 10) {
      direction = 'South';
    } else if (dirDegree >= 10 && dirDegree < 12) {
      direction = 'South-West';
    } else if (dirDegree >= 12 && dirDegree < 14) {
      direction = 'West';
    } else if (dirDegree >= 4 && dirDegree < 6) {
      direction = 'North-West';
    } else if (dirDegree >= 17 || dirDegree < 2) {
      direction = 'North';
    }
    document.querySelector('#direction').innerText = direction;
    initMap(data.coord.lat, data.coord.lon);
  } else {
    window.alert("That's not a real city");
  }
}

// function initMap(lat, lon) {

//     var map = new MapmyIndia.Map("map", {
//         center: [lat, lon],
//         zoomControl: true,
//         hybrid: true,
//         search: true,
//         location: true
//       });

//      var marker = L.marker([lat,lon]).addTo(map);
//     // console.log(map);

//     document.querySelector('#map');
//     // marker.bindPopup("<b>Hey There!</b><br>This is the place u searched for.").openPopup();
// }

function initMap(lat, lon) {
  mymap.setView([lat, lon], 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  L.marker([lat, lon])
    .addTo(mymap)
    .bindPopup(
      '<b>Hello There!</b><br />This is ' + document.querySelector('#cityName').value + '.'
    )
    .openPopup();

  var popup = L.popup();

  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent('You clicked the map at ' + e.latlng.toString())
      .openOn(mymap);
  }

  mymap.on('click', onMapClick);
}
