var doweather = function () { //This function should be used to build your weather information in the content element
    const content = $('#content');
    content.empty();
    content.html(`<div class="jumbotron jumbotron-fluid cent" id="logo">
        <img src = "img/turtlelogo.png" id = "logoimg">
                        <h1>Turtle Weather</h1>
                        <p class="lead">Get local weather by ZIP, City, or GPS</p>
                    </div >
    <div class="container-fluid">
        <div class="row">
            <div id="weather" class="col-lg-12 col-lg-offset-12 cent">
            </div>
        </div>      
        <div class="row">
            <div class="col-lg-12 col-lg-offset-12 cent">
                <input placeholder="Enter ZIP code or City..." class="form-control" id="textbox"></input>
                <button id="gobutton" class="btn btn-info">Search</button>
                            </div>
            </div>
        </div>`);
    $(document).ready(function () {
        console.log('started');
        //Add event listeners for buttons
        document.getElementById("gobutton").onclick = onGoButtonClick;
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

            resetWeatherContent();
            screenchg();
            $('#gobutton').text('Search');


        } else {
            //find the element
            var val = document.getElementById("textbox").value
            if (val === "") { //Check for empty string, if empty provide error message
                var e = $('#weather');
                e.text("Can't search for empty string");
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
    function addWeatherContent(header, info) {
        const th = $("<th></th>").text(header);
        const td = $("<td></td>").text(info);
        const tr = $("<tr></tr>").append(th, td);
        $("#weather").append(tr);

       
    }



    function resetWeatherContent() {
        $("#weather").empty();

        
    }

    function screenchg() {
        $('#textbox').toggle();

        $('#head').remove();

        $('#gobutton').text('Search Again');



    }

    //This function is called when the location button is pushed.
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
        resetWeatherContent();
        screenchg();

        const table = "<table></table>";
        const tableEle = $("#weather");
        tableEle.append(table);

        

        console.log($('#weather').html());
        tableEle.addClass("table table-striped table-bordered");

        var celsius = (data.main.temp) - 273.15;
        celsius = celsius.toFixed(2);

        var sunrise = new Date(data.sys.sunrise * 1000);
        var sunset = new Date(data.sys.sunset * 1000);

        var sunsetHR = sunset.getHours();

        if (sunsetHR > 12) {
            sunsetHR = sunsetHR - 12;

            console.log(sunsetHR);
        }


        console.log(sunrise.getHours() + ":" + sunrise.getMinutes());

      

        var head = $('<div></div>');
        head.attr('id', 'head');
        head.html(`<h2>Weather for ${data.name}, ${data.sys.country}</h2>`);
        console.log(head.html());

        var img = $('<img id="icon" src=""  alt="Weather icon">');
        var iconCode = data.weather[0].icon
        var icon = 'https://openweathermap.org/img/w/' + iconCode + '.png';

        img.attr('src', icon);


        head.append(celsius + "C", img, data.weather[0].description);

        $('#logo').append(head);

        console.log(head.html());




        addWeatherContent("Temperature ", celsius + "C");


        addWeatherContent("Pressure ", data.main.pressure);

        addWeatherContent("Humidity ", data.main.humidity + "%");

        addWeatherContent("Wind ", data.wind.speed + " mph");

        addWeatherContent("Sunrise ", sunrise.getHours() + ":" + sunrise.getMinutes() + "AM");

        addWeatherContent("Sunset ", sunsetHR + ":" + sunset.getMinutes() + "PM");

    }

    function onWeatherFail(status) {
        alert("Failed to get weather on Code " + toString(status));
    }


    function onLocationError(e) {
        alert("Error getting location");



    }
}

