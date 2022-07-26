let searchfield = $("#search-target");
let searchButton = $("#searchBtn-target")
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



function ApiConnect(searchArg){
    let LatLongConnect = "https://api.openweathermap.org/data/2.5/weather?q=" + searchArg + "&units=metric&appid="+ searchElements.element
    fetch(LatLongConnect)
        .then(function(response){
            if(response.ok){
                response.json.then(function(data){
                    let lat = data.coord.lat
                    let lon = data.coord.lon
                    //add hisotry logic for later
                })
            }
            else{
                alert("Unable to find that city")
            }
        })
        .catch(function(error){
            alert("Unable to fetch weather data / connection failed")
        })
}

searchButton.on("click",function(){
    let searchterms = searchfield.val()
    searchButton.addClass('is-loading')
    ApiConnect(searchterms)
    

})