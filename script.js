function weatherGeolocation() {
  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
      const KEY = "1ab169792d0060c67103adb8adfbfd98";
      console.log(position);
      const LAT = position.coords.latitude;
      const LNG = position.coords.longitude;
      let url = `http://api.positionstack.com/v1/reverse?access_key=${KEY}&query=${LAT},${LNG}`;
      fetch(url)
          .then((response) => response.json())
          .then((data) => {
              console.log(data);
              if (data.data[0].locality) {
                  getWeather(data.data[0].locality);
              }
          })
          .catch((err) => console.warn(err.message));
  }
  const container = document.querySelector(".weather-container");

  function error() {
      container.innerHTML = "<div class='error-info-geocode'>Unable to retrieve your location</div>";
  }

  container.innerHTML = `<div class="loading_container">
<svg xmlns="http://www.w3.org/2000/svg" id="motasl_logo" class="center" width="440.88" height="434" viewBox="0 0 440.88 434">
<mask id="archMask">
<path id="mask" d="M366.5,100.5s-122-2-161,9-88,50-94,58-27.78,36.63-29,83c-1,38-5,63,19,108s81,69,98,75,61,12,99,4,76-56,88-67,29-40,36-83c7.43-45.67,7-52,7-52" transform="translate(-35.13 -53.86)" ></path>
</mask>
<path id="arch" mask="url(#archMask)" d="M378.22,271.83A128.52,128.52,0,1,1,187,159.59c39.95-22.38,89.07-16.06,133-16.29,8.25,0,34.31-.05,39.15-.05V82.1q0-11.75,0-23.5c0-1.12-110.23.68-119.9,1.18-18.84,1-37.17,3-55.17,8.94a214,214,0,0,0-147,186.73q-.63,8.18-.63,16.38C36.49,389.38,132.11,485,249.67,485s213.17-95.62,213.17-213.17Z" transform="translate(-35.13 -53.86)" style="fill: #161c2c"></path>

<circle id="downdot" cx="385.00" cy="156.0" r="37.34" style="fill: #df301b"></circle>
<circle id="updot" cx="385.00" cy="47.00" r="37.34" style="fill: #df301b"></circle>
</svg>
</div>`;
}

let temp = 0;

async function getWeather(city) {
  const container = document.querySelector(".weather-container");
  await fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=74a665a048c561f4915b972e7e62bde4&units=metric`
      )
      .then((response) => response.json())
      .then((json) => {
          console.log(json);
          temp = json.main?.temp;
          container.innerHTML = ` 
          <h1>Weather</h1>
          <div class="weater-day">
              <div class="weather-info"><span class="weather-city">City:</span><p>${json.name}</p></div> 
              <div class="weather-info"><span class="weather-temperature">Temperature:</span><p><span class="temperature-value">${temp}</span>  <select class="temperature-select" id="select-temeprature">
              <option value="Celsius" checked>C &deg</option>
              <option value="Fahrenheit">F &deg</option>
                                                                                                        
                                                                                                              </select></p></div>
            <div class="weather-info"><span class="weather-description">Description:</span> <p>${json.weather[0].description}</p></div> 
            <div class="weather-info"><span class="weather-icon">Icon:</span> <p><img src ="icons/${json.weather[0].icon}.png" class= "weather-icon-id"></p></div>
            
            </div>  
`;
      });
  document.getElementById("select-temeprature").onchange = handleChange;

  function handleChange(evt) {
      const TEMPERATURES = {
          C: "Celsius",
          F: "Fahrenheit"
      };

      let value = evt.target.value;
      console.log(value);
      let valueOfTemperature = document.querySelector(
          ".temperature-value"
      );
      if (value === TEMPERATURES.F) {
          temp = (temp * 9) / 5 + 32;
          valueOfTemperature.innerText = temp;
      } else {
          temp = ((temp - 32) * 5) / 9;
          valueOfTemperature.innerText = Math.floor(temp);
      }
  }
}

let time = null;
const checkbox = document.querySelector(".check_update_temp");
checkbox.addEventListener("change", function() {
  console.log(checkbox.checked);

  if (checkbox.checked) {
      time = setInterval(() => {
          weatherGeolocation();
      }, 60000);
  } else {
      clearInterval(time);
  }

  if (checkbox.checked) {
      return (checkbox.checked = true);
  } else {
      return (checkbox.checked = false);
  }
});

function getWeaterDay() {
  let weatherContainer = document.querySelector(".weather-container");
  let checkbox = document.querySelector(".check_update_temp");
  let checkText = document.querySelector(".check-text");

  if (weatherContainer.style.display === "" || weatherContainer.style.display === "none") {
      weatherContainer.style.display = "block";
      checkbox.style.display = "block";
      checkText.style.color = "black";
  } else {
      weatherContainer.style.display = "none";
      checkbox.style.display = "none";
      checkText.style.color = "#12D3E5";
  }
  weatherGeolocation();
}