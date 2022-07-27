//declare variables
let searchfield = $("#search-target");
let searchButton = $("#searchBtn-target")
let clearButton = $("#clearBtn-target")
let ClearHistoryBtn = $("#ClearHistory")
let historyTarget = $("#history-target")
let historyData = []
let searchterms
let weatherContents = {}
let searchElements = {
    element: "7f131d38f4522306e0a68bfbf8394fcd"
}

function load(){
    historyData = JSON.parse(localStorage.getItem("historyDataArchive"))
    if(!historyData){
        historyData = []
    }
    else{
        createHistoryCard()
    }
    
}

function clearHistory(array){

    for (let i = 0; i < array.length; i++) { 
        let cardtoRM = historyTarget.find("#cityCard"+i)
        cardtoRM.remove()
    }


}

function createHistoryCard(){

    let reversedHistory = historyData.reverse()

    clearHistory(reversedHistory)

    for (let i = 0; i < reversedHistory.length; i++) { 
        let iconbit = $("<i>").addClass("fa fa-clock-o")
        let iconholder = $("<td>").attr("width","5%")
        let content = $("<td>").html(reversedHistory[i]).attr("id","content"+i)
        let buttonBit = $("<a>").addClass("button is-small is-primary").html("Search Again")
        buttonBit.attr("id","historyButton"+i)
        let buttonHolder = $("<td>").addClass("level-right")
        let historyCard = $("<tbody>").attr("id","cityCard"+i)
        let container = $("<tr>")
        iconholder.append(iconbit)
        buttonHolder.append(buttonBit)
        container.append(iconholder)
        container.append(content)
        container.append(buttonHolder)
        historyCard.append(container)
        historyTarget.append(historyCard)
    }   
    revertReverse = historyData.reverse()
    localStorage.removeItem("historyDataArchive")
    localStorage.setItem("historyDataArchive",JSON.stringify(revertReverse))

        
}
//Declare Functions
function displayWeather(weatherObj){

    //display today's weather
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
        let dayIconTarget = $("#day"+i+"-icon-target")
        let dayTempTarget = $("#5day-Temp"+i)
        let dayWindTarget = $("#5day-Wind"+i)
        let dayHumTarget = $("#5day-Hum"+i)

        dayTarget.html(weatherObj.daily[i].date)
        dayIconTarget.html(weatherObj.daily[i].iconURL)
        dayTempTarget.html(weatherObj.daily[i].temp)
        dayWindTarget.html(weatherObj.daily[i].wind)
        dayHumTarget.html(weatherObj.daily[i].humidity)
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
                response.json().then(function(data){
                    weatherObj.UVI = data.current.uvi
                    weatherObj.daily = data.daily
                    
                    let add =  true

                    if(historyData.length > 0){
                        for (let i = 0; i < historyData.length; i++) {
                            if(historyData[i] == searchArg){
                                add = false
                            }
                        }
                    }
                    
                    if(add){
                        if(historyData.length == 5){
                            historyData.shift()
                            historyData.push(searchArg) 
                            createHistoryCard(searchArg)
                        }
                        else{
                            historyData.push(searchArg)
                            createHistoryCard(searchArg)
                        }

                    }
                    

                    for (let i = 1; i < data.daily.length; i++) {
                        weatherObj.daily[0] = ""
                        weatherObj.daily[i].date = moment.unix(data.daily[i].dt).format("MM/DD/YYYY")
                        weatherObj.daily[i].temp = data.daily[i].temp.day
                        weatherObj.daily[i].wind = data.daily[i].wind_speed + " km/h"
                        weatherObj.daily[i].humidity = data.daily[i].humidity + " %"
                        weatherObj.daily[i].iconCode = data.daily[i].weather[0].icon
                        weatherObj.daily[i].status = data.daily[i].weather[0].main
                        weatherObj.daily[i].iconURL = "<img src='https://openweathermap.org/img/wn/"+ weatherObj.daily[i].iconCode + ".png'> ("+weatherObj.daily[i].status+")"
                    
                      }

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
                     dataToUse.status = data.weather[0].main
                     dataToUse.iconURL = "<img src='https://openweathermap.org/img/wn/"+ dataToUse.iconCode + ".png'> ("+dataToUse.status+")"
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

load()
// Execute
searchButton.on("click",function(){
    searchterms = searchfield.val()
    searchButton.addClass('is-loading')
    ApiConnect(searchterms)

})
clearButton.on("click",function(){

    searchfield.val("")
})

ClearHistoryBtn.on("click", function(){
    clearHistory(historyData)
    historyData = []
    localStorage.removeItem("historyDataArchive")
})

historyTarget.on("click",function(event,target){
    // debugger
    let targetEl = event.target
    
    if(targetEl.matches(".button")){
        let idIndex = targetEl.id.replace("historyButton","")
        let content = $("#content"+idIndex)
        searchterms = content.html()
        searchfield.val(searchterms)
        ApiConnect(searchterms)
    }
   

})