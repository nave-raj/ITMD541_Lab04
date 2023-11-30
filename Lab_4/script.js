const getCurrentLocation = () => {
    const startElement = document.getElementById('start-message');
    document.getElementById("location").value = "";
    startElement.classList.add("hidden");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        const message = "Geolocation is not supported by this browser.";
        displayErrorMessage(message);
    }
}

const showPosition = (position) => {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    document.getElementById("location-name").innerHTML = `<strong>Current Location</strong>`;
    getSunriseSunsetTimings(latitude, longitude, "today");
    getSunriseSunsetTimings(latitude, longitude, "tomorrow");
}

const showError = (error) => {
    let message = "Something went wrong";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "User denied the request for Geolocation";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable";
            break;
        case error.TIMEOUT:
            message = "The request to get user location timed out";
            break;
        case error.UNKNOWN_ERROR:
            message = "An unknown error occurred";
            break;
    }
    displayErrorMessage(message);
}

const getLatituteAndLongitude = async () => {
    try {
        const searchTerm = document.getElementById('location').value;
        const startElement = document.getElementById('start-message');
        startElement.classList.add("hidden");
        if (searchTerm && searchTerm.length > 0) {
            const geoUrl = `https://geocode.maps.co/search?q={${searchTerm}}`;
            console.log(searchTerm);
            const response = await fetch(geoUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const firstMatch = data[0];
            const location = firstMatch.display_name;
            const latitude = firstMatch.lat;
            const longitude = firstMatch.lon;
            document.getElementById("location-name").innerHTML = `<strong>${location}</strong>`;
            getSunriseSunsetTimings(latitude, longitude, "today");
            getSunriseSunsetTimings(latitude, longitude, "tomorrow");
        } else {
            displayErrorMessage("Please Enter a search location");
        }
    } catch (error) {
        console.log(error);
        displayErrorMessage("Please enter a valid location");
    }
};


const getSunriseSunsetTimings = (latitude, longitude, date) => {
    try{
        const errorData = document.getElementById("error-message");
        errorData.classList.add("hidden");
        const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`;
        const promiseObj = fetch(url);
        promiseObj.then(response => response.json()).then(data => {
            console.log(data);
            const weatherData = document.getElementById("weather-details");
            weatherData.classList.remove("hidden");
            if(date === "today"){
                document.getElementById("location-timezone").innerHTML = `<strong>Timezone: ${data.results['timezone']}</strong>`;
                document.getElementById('sunrise-time-today').innerHTML = `<strong>Sunrise Time</strong> : ${data.results['sunrise']}`;
                document.getElementById('sunset-time-today').innerHTML = `<strong>Sunset Time</strong> : ${data.results['sunset']}`;
                document.getElementById('dawn-today').innerHTML = `<strong>Dawn</strong> : ${data.results['dawn']}`;
                document.getElementById('dusk-today').innerHTML = `<strong>Dusk</strong> : ${data.results['dusk']}`;
                document.getElementById('solar-noon-today').innerHTML = `<strong>Solar Noon</strong> : ${data.results['solar_noon']}`;
                document.getElementById('day-length-today').innerHTML = `<strong>Day Length</strong> : ${data.results['day_length']}`;

            } else if(date === "tomorrow"){
                document.getElementById("location-timezone").innerHTML = `<strong>Timezone: ${data.results['timezone']}</strong>`;
                document.getElementById('sunrise-time-tomorrow').innerHTML = `<strong>Sunrise Time</strong> : ${data.results['sunrise']}`;
                document.getElementById('sunset-time-tomorrow').innerHTML = `<strong>Sunset Time</strong> : ${data.results['sunset']}`;
                document.getElementById('dawn-tomorrow').innerHTML = `<strong>Dawn</strong> : ${data.results['dawn']}`;
                document.getElementById('dusk-tomorrow').innerHTML = `<strong>Dusk</strong> : ${data.results['dusk']}`;
                document.getElementById('solar-noon-tomorrow').innerHTML = `<strong>Solar Noon</strong> : ${data.results['solar_noon']}`;
                document.getElementById('day-length-tomorrow').innerHTML = `<strong>Day Length</strong> : ${data.results['day_length']}`;
            }
        }).catch((error )=> 
            console.error('Error:', error));
    } catch(err) {
        console.log(err);
    }
};

const displayErrorMessage = (message) => {
    const weatherData = document.getElementById("weather-details");
    weatherData.classList.add("hidden");
    const errorData = document.getElementById("error-message");
    errorData.innerHTML = message;
    errorData.classList.remove("hidden");
}

