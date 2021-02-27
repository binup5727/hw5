var domap = function() { //This function should be used to build the map in the content element
    let workspace = document.getElementById("content");
    workspace.innerHTML = `<div class="jumbotron jumbotron-fluid cent" id="logo">
                <h1>Binup Mathai Z23283452</h1>

        <p class="lead">Get location by ZIP, City, or GPS</p>
    </div>
    <div class="container-fluid">
              
        <div class="row">
            <div class="col-lg-12 col-lg-offset-12 cent" id="mapdata"> 
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 col-lg-offset-12 cent">
                <input placeholder="Enter ZIP code or City..." class="form-control" id="textbox"></input>
                <button id = "gobutton" class= "btn btn-info">Search</button>
                <input type="image" src="./res/button.png" alt="Submit" width="50" height="50" id="locbutton">
            </div>
        </div>
    </div>`;

    $(document).ready(function () {
        console.log('started');
        //Add event listeners for buttons
        document.getElementById("gobutton").onclick = onGoButtonClick;
        document.getElementById("locbutton").onclick = onLocationClick;
        $('#textbox').keypress(function (e) {
            if (e.which == 13) {
                onGoButtonClick();
            }
        });
    });


    //Weather API KEY
    const WEATHER_API_KEY = "fe009205a0853e0137148bfffee0bcb9"

    //reads input from input box, called when the go button is pushed.
    function onGoButtonClick() {
        //from results screen
        if ($('#gobutton').text() === "Search Again") {

            resetMapContent();
            screenchg();
            $('#gobutton').text('Search');


        } else {
            //find the element
            var val = document.getElementById("textbox").value
            if (val === "") { //Check for empty string, if empty provide error message
                var e = document.createElement('p');
                e.innerHTML = "Can't search for empty string";
                resetMapContent();
                addMapContent(e);
                return;

            }
            if (isNaN(val)) { //If value is not a number, call weather API by CITY
                console.log("CITY Detected");
                var url = "https://api.openweathermap.org/data/2.5/weather?q=" + val + "&appid=" + WEATHER_API_KEY;
                xmlRequest(url, onWeatherSuccess, onWeatherFail);

            }
            else { //ELSE CALL BY ZIP CODE
                console.log("ZIP Detected");
                var url = "https://api.openweathermap.org/data/2.5/weather?zip=" + val + "&appid=" + WEATHER_API_KEY;
                xmlRequest(url, onWeatherSuccess, onWeatherFail);
            }
        }

    }

    //Some helpers to aid in repeated tasks
    function resetMapContent() {
        var r = document.getElementById("mapdata");
        r.innerHTML = "";
    }

    function addMapContent(element) {
        var r = document.getElementById("mapdata");
        r.appendChild(element);

    }

    function screenchg() {
        $('#textbox, #locbutton').toggle();

        $('#head').remove();

        $('#gobutton').text('Search Again');



    }

    //This function is called when the location button is pushed.
    function onLocationClick() {
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, {
            enableHighAccuracy: true,
            timeout: 30000
        }


        );
    }


    function xmlRequest(url, onSuccess, onFailure) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                onSuccess(JSON.parse(this.responseText));
            }
            else if (this.readyState == 4) {
                onFailure(this.status);
            }
        };

        request.open("GET", url, true);
        request.send();



    }

    function onWeatherSuccess(data) {
        
        screenchg();

        resetMapContent();
        var mapp = new Gmap(data.coord.lat, data.coord.lon, 12, 300, 300);
        addMapContent(mapp);

    }

    function onWeatherFail(status) {
        alert("Failed to get weather on Code " + toString(status));
    }


    //Getting location was successful, make a new Gmap element and add it to the content after resetting the content.
    function onLocationSuccess(p) {
        resetMapContent();
        addMapContent(new Gmap(p.coords.latitude, p.coords.longitude, 14, 300, 300));
        var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + p.coords.latitude.toString() +
            "&lon=" + p.coords.longitude.toString() + "&appid=" + WEATHER_API_KEY;
        xmlRequest(url, onWeatherSuccessNoMap, onWeatherFail);

    };

    function onLocationError(e) {
        alert("Error getting location");
    }




    //TODO : ADD MAP CONTENT
}