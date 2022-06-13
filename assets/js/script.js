var formContainer = document.querySelector("#form-container");
var cityNameEl = document.querySelector("#city");
var currentDayEl = document.querySelector(".current-day-items")
var currentDayCity = document.querySelector(".current-day");
var nextDaysEl = document.querySelector("#next-days-items");
var cityListEl = document.querySelector(".list-group")
var apiKey = "22d3f6c56f2b5cf1676d0b22d1f6dcfc";
var mostRecentCity = localStorage.getItem("mostRecentCity");
var listCitiesEl = document.querySelector(".city-list-containe")
//"6d750af26a3614ad0451a5f3ef06d42b" //
var cityVal = "";

var searchCity = [];

var today = moment().format ("Do MMMM, YYYY");


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
    var weatherApi =  `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
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
    var uvLevel = ''
    if(response.current.uvi < 2.1){
        uvLevel='<span id="uv-favorable" class="px-2">'
    }
    else if(response.current.uvi < 6){
        uvLevel='<span id="uv-moderate" class="px-2">';
    }else{
        uvLevel='<span id="uv-severe" class="px-2">';
    }
    currentDayEl.innerHTML = `<div class="col-5">
                <p>Temp: <b> ${response.current.temp} °C</b></p>
                <p>Wind: ${response.current.wind_speed} km/h</p>
                <p>Humidity: ${response.current.humidity}%</p>
                <p>UV Index: `+ uvLevel +`${response.current.uvi}  </span></p>
                </div>
                <div class="col-7  justify-content-start align-items-center">
                    <img src="http://openweathermap.org/img/wn/${
                        response.current.weather[0].icon}@4x.png"
                     height="150px"
                     alt="${response.current.weather[0].description}"
                   />
                </div>`;
}


// get next 5 days weather
var showNextDaysWeather = function(response){
    console.log(response.daily);
    nextDaysEl.innerHTML = response.daily.map(function(day,idx){
        if(idx >= 1 && idx <= 5){
            var uvLevel = '';
            if(day.uvi < 2.1){
                uvLevel='<span id="uv-favorable" class="px-2">'
            }
            else if(day.uvi < 6){
                uvLevel='<span id="uv-moderate" class="px-2">';
            }else{
                uvLevel='<span id="uv-severe" class="px-2">';
            }
            return `<div class="next-day-container col-12 p-1 col-sm-2">
                        <h3 class="card-content">${moment(day.dt, 'X').format('DD/MM/YYYY')}</h3>
                        <img
                            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
                            height="50px"                        
                            alt="${day.weather[0].description}"
                        /> 
                        <p class="card-content">Temp:<b> ${day.temp.day} °C</b></p>
                        <p class="card-content">Wind: ${day.wind_speed} km/h</p>
                        <p class="card-content">Humidity: ${day.humidity}%</p>
                        <p class="card-content">UV Index: `+ uvLevel +`${day.uvi}  </span></p>
                    </div>`
        }
    }).join(" ");
};  

var formSubmitHandler = function(event){
    event.preventDefault();
    var city = cityNameEl.value.trim();
    if(!city){
        alert("Enter valid city")
    } else{
        console.log(city + today)
        
        //Adjust the input to display first letter of each world in caps 
        city = titleCase(city);
        
        //Save city in localStorage
        saveCity(city);

        //Define header of current day
        currentDayCity.textContent = city + " (" + today +")";
        getCity(city);

        //clean value
        cityNameEl.value = "";
    }
}

var saveCity = function(cityVal){
    // debugger
    // console.log(cityVal)
    //if empty value reject input
    if(!cityVal){
        return
    }
    //extract object from local storage
    var searchCity = JSON.parse(localStorage.getItem("cityNames"));

    //define most recent city
    localStorage.setItem('mostRecentCity',cityVal);

    //if no objects send 1st city
    if (searchCity === null){
        searchCity = [];
        searchCity.push(cityVal);
        localStorage.setItem("cityNames",JSON.stringify(searchCity));
        // createCity(cityVal);
        createCityList(cityVal);
        //reload the page to update the list of cities in real time
        location.reload();
    }
    else {
        if(findCity(cityVal) > 0){
            
            searchCity.push(cityVal);
            localStorage.setItem("cityNames", JSON.stringify(searchCity));
            // createCity(cityVal);
            createCityList(cityVal);
            //reload the page to update the list of cities in real time
            location.reload();
        }          
    }        
};

//avoid duplicates from localstorage
var findCity = function (c){
    var searchCity = JSON.parse(localStorage.getItem("cityNames"))
    for (var i=0; i < searchCity.length; i++){
        if(c === searchCity[i]){
            return -1;
        }
    }
    return 1;
}
//create list of cites saved in localStorage
function createCityList(element){
    
    if(element = "" || element){
        return element = searchCity;
    }
    var searchCity = JSON.parse(localStorage.getItem("cityNames"));
    console.log(searchCity)
    if(searchCity !== null){
        for(var i = 0; i < searchCity.length;i++){
            console.log(searchCity[i])
            cityListEl.innerHTML += `<button id="btn-city" class="btn col-12 btn my-1 p-0 text-center text-light" data-id=${[i]}>
                            ${searchCity[i]}</button>`
        }
    }
    if(!mostRecentCity){   
        return;        
    }
    currentDayCity.textContent = mostRecentCity + " (" + today +")";
    console.log(mostRecentCity + "here");
    //if the page refreshes the weather from the last city is reflected
    getCity(mostRecentCity);
}

//if click on one of the cities from the list display the weather 
var cityBtn = function(event){ 
    event.preventDefault();

    var optionBtn = event.target;
    
    console.log(optionBtn.textContent.trim())

    currentDayCity.textContent = optionBtn.textContent.trim() + " (" + today +")";
    
    getCity(optionBtn.textContent.trim())
};

//1st letter in Upper case
var titleCase = function(str) {
    //split the words within the string
    var array = str.toLowerCase().split(" ");
    var result = array.map(function(val){
        return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
    });
    return result.join(" ");
};

cityListEl.addEventListener("click", cityBtn)
formContainer.addEventListener("submit", formSubmitHandler)

saveCity();
createCityList();


