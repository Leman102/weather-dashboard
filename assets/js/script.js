var formContainer = document.querySelector("#form-container");
var cityNameEl = document.querySelector("#city");
var currentDayEl = document.querySelector(".current-day-items")
var currentDayCity = document.querySelector(".current-day");
var nextDaysEl = document.querySelector("#next-days-items");
var apiKey = "22d3f6c56f2b5cf1676d0b22d1f6dcfc";
//"6d750af26a3614ad0451a5f3ef06d42b" //

var today = moment().format ("Do MMMM, YYYY")

console.log(moment(1655053200, 'X').format('lll'))

//get city lat and lon
var getCity = function (city){
    //weather includes city + API key
    var cityApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
    console.log(cityApi)
    fetch(cityApi).then(function(response){  
        response.json().then(function(data){
            getWeather(data.coord.lon, data.coord.lat)
        });
        console.log(response);
    })
}

//get the API for weather components
var getWeather = function (lon , lat){
    var weatherApi =  `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(weatherApi).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data)
                showCurrentWeather(data);
                showNextDaysWeather(data);
            });    
        }
    });
}

//get weather components
var showCurrentWeather = function(response){
    console.log(response.current);
    currentDayEl.innerHTML = `<div class="col">
                <p>Temp: ${response.current.temp} °C</p>
                <p>Wind: ${response.current.wind_speed} km/h</p>
                <p>Humidity: ${response.current.humidity}%</p>
                <p>UV Index: ${response.current.uvi}</p>
                </div>
                <div><img
                     src="http://openweathermap.org/img/wn/${
                        response.current.weather[0].icon
                     }@4x.png"
                     class="card-img "
                     alt="${response.current.weather[0].description}"
                   />
                </div> `
}


// get next 5 days weather
var showNextDaysWeather = function(response){
    console.log(response.daily);
    nextDaysEl.innerHTML = response.daily.map(function(day,idx){
        if(idx >= 1 && idx <= 5){
            return `<div class="col">
                    <div class="card">
                    <h3 class="card-title p-2">${moment(day.dt, 'X').format('Do MMMM, YYYY')}</h3>
                    </div>
                    </div>`
        }
    }).join(" ");
};
        
        // nextDaysEl.innerHTML = `<div class="col-6">
        //         <p>Temp: ${response.daily.temp[i]} °C</p>
        //         <p>Wind: ${response.daily.wind_speed[i]} km/h</p>
        //         <p>Humidity: ${response.daily.humidity[i]}%</p>
        //         <p>UV Index: ${response.daily.uvi[i]}</p>
        //         </div>
        //         <div><img
        //              src="http://openweathermap.org/img/wn/${
        //                 response.daily.weather[i].icon
        //              }@4x.png"
        //              class="card-img "
        //              alt="${response.daily.weather[[i]].description}"
        //            />
        //         </div> `
    


var formSubmitHandler = function(event){
    event.preventDefault();
    var city = cityNameEl.value.trim();
    if(!city){
        alert("Enter valid city")
    } else{
        console.log(city + today)

        city = titleCase(city);

        currentDayCity.textContent= city + " (" + today +")";

        getCity(city);
        //clean value
        cityNameEl.value = "";
    }
}

var titleCase = function(str) {
    //split the words within the string
    var array = str.toLowerCase().split(" ");
    var result = array.map(function(val){
        return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
    });
    return result.join(" ");
};

formContainer.addEventListener("submit", formSubmitHandler)

