//declare variables
let searchfield = $("#search-target");
let searchButton = $("#searchBtn-target")
let clearButton = $("#clearBtn-target")
let weatherContents = {}
let searchElements = {
    element: "7f131d38f4522306e0a68bfbf8394fcd"
}
let historyData = {
    history1: [],
    history2: [],
    history3: [],
    history4: [],
    history5: []
}

//Declare Functions
function displayWeather(weatherObj){

    //display today's weather
    console.log("full data",weatherObj)
    let dateTarget     = $("#date-target")
    let cityTarget     = $("#city-target")
    let tempTarget     = $("#temp-target")
    let windTarget     = $("#wind-target")
    let humidityTarget = $("#humidity-target")
    let UVITarget      = $("#UVI-target")
    let CityHTML = weatherObj.city +" "+ weatherObj.spanHTML

    dateTarget.html(weatherObj.Date)
    cityTarget.html(CityHTML)
    tempTarget.html(weatherObj.CurrentTemp)
    windTarget.html(weatherObj.CurrentWind)
    humidityTarget.html(weatherObj.CurrentHum)

    if(weatherObj.UVI <= 2){
        UVITarget.removeClass("is-primary")
        UVITarget.removeClass("is-warning")
        UVITarget.removeClass("is-danger")
        UVITarget.addClass("is-primary")
        UVITarget.html(weatherObj.UVI)
    }
    if(weatherObj.UVI >= 3){
        UVITarget.removeClass("is-primary")
        UVITarget.removeClass("is-warning")
        UVITarget.removeClass("is-danger")
        UVITarget.addClass("is-warning")
        UVITarget.html(weatherObj.UVI)
    }
    if(weatherObj.UVI >= 6){
        UVITarget.removeClass("is-primary")
        UVITarget.removeClass("is-warning")
        UVITarget.removeClass("is-danger")
        UVITarget.addClass("is-danger")
        UVITarget.html(weatherObj.UVI)
    }
    
    //5-day
    
    for (let i = 1; i < weatherObj.daily.length; i++) {
        let dayTarget = $("#date-"+i)
        
      }


    

}

function ApiConnect(searchArg){

    //function declarations for API Calls
    function UVConnect(weatherObj){
        lat = weatherObj.lat
        lon = weatherObj.lon
        let WeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&exclude=minutely,hourly&units=metric&appid=" + searchElements.element
        fetch(WeatherURL)
        .then(function(response){
            if(response.ok){
                // console.log(response)
                response.json().then(function(data){
                    console.log(data)
                    weatherObj.UVI = data.current.uvi
                    weatherObj.daily = data.daily

                    searchButton.removeClass('is-loading')

                    displayWeather(weatherObj)

                })
            }
            else{
                alert("Unable to find that city")
                searchButton.removeClass('is-loading')
            }
        })
        .catch(function(error){
            alert("Unable to fetch weather data / connection failed")
            searchButton.removeClass('is-loading')
        })
    }
    function weatherConnect(){
        let latLongURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchArg + "&units=metric&appid="+ searchElements.element
    fetch(latLongURL)
        .then(function(response){
            if(response.ok){
                // console.log(response)
                response.json().then(function(data){
                    let dataToUse = {}
                     dataToUse.lat = data.coord.lat
                     dataToUse.lon = data.coord.lon
                     dataToUse.city = data.name
                     dataToUse.CurrentTemp = data.main.temp + " °C"
                     dataToUse.CurrentWind = data.wind.speed + " km/h"
                     dataToUse.CurrentHum = data.main.humidity + " %"
                     dataToUse.Date = moment.unix(data.dt).format("MM/DD/YYYY")
                     dataToUse.iconCode = data.weather[0].icon
                     dataToUse.iconURL = "<img src='https://openweathermap.org/img/wn/"+ data.weather[0].icon + ".png'>"
                     dataToUse.spanHTML = "<span class= 'tag is-large is-info mb-3' id='icon-target'>"+dataToUse.iconURL+"</span>"
                    return UVConnect(dataToUse)
                    // return dataToUse
                    
                    //add hisotry logic for later
                })
            }
            else{
                alert("Unable to find that city")
                searchButton.removeClass('is-loading')
            }
        })
        .catch(function(error){
            alert("Unable to fetch weather data / connection failed")
            searchButton.removeClass('is-loading')
        })
    }
    // let weatherConnect = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=" + searchElements.element

    weatherConnect();
}






// Execute
searchButton.on("click",function(){
    let searchterms = searchfield.val()
    searchButton.addClass('is-loading')
    ApiConnect(searchterms)

})
clearButton.on("click",function(){
    searchfield.val("")
})