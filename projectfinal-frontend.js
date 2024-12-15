/*
Beimnet Aklilu, Eyosiyas Girma, P. Grey Moran
INST377 - Group Project Final

Project Final Front End JS
*/

const API_KEY = "3cc6b3a28b3e826e3c070cc2ef6a0392";

/**
 * Handles the form submission for fetching weather data based on city and state.
 */
async function handleFormSubmission(cityName, stateCode) {
    const submissionMessage = document.getElementById("submissionMessage");

    if (!cityName || !stateCode) {
        submissionMessage.textContent = "Please enter both city and state initials.";
        return;
    }

    try {
        submissionMessage.textContent = "Fetching data, please wait...";
        console.log(cityName, stateCode)
        console.log(`API URL: http://api.openweathermap.org/geo/1.0/direct?q={${cityName}},{${stateCode}}&appid=3cc6b3a28b3e826e3c070cc2ef6a0392`);

        // Geocoding API call to get latitude and longitude
        const geocodeResponse = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q={${cityName}},{${stateCode}}&appid=3cc6b3a28b3e826e3c070cc2ef6a0392`
        );

        // Parse the JSON response once
        const geocodeData = await geocodeResponse.json();

        // Log the parsed JSON data
        console.log(geocodeData);

        if (geocodeData.length === 0) {
            submissionMessage.textContent = "Location not found. Please check your input.";
            return;
        }

        const { lat, lon } = geocodeData[0];
        console.log("Coordinates:", { lat, lon });

        // Fetch weather data using latitude and longitude
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=3cc6b3a28b3e826e3c070cc2ef6a0392`
        );
        const weatherData = await weatherResponse.json();

        // Display weather data
        displayWeatherData(cityName, stateCode, weatherData);

    } catch (error) {
        console.error("Error fetching data:", error);
        submissionMessage.textContent = "An error occurred. Please try again.";
    }
}

// Attach event listener to the form
document.getElementById("locationForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const cityName = document.getElementById("cityName").value;
    const stateCode = document.getElementById("stateCode").value.toUpperCase();
    handleFormSubmission(cityName, stateCode);
});

document.getElementById("saveLocationButton").addEventListener("click", () => {
    const cityName = document.getElementById("cityName").value;
    const stateCode = document.getElementById("stateCode").value.toUpperCase();
    
    if (!cityName || !stateCode) {
        alert("Please enter both city and state initials before saving.");
        return;
    }

    saveLocation(cityName, stateCode);
});

// Display weather data
function displayWeatherData(cityName, stateCode, weatherData) {
    const { current, hourly, daily } = weatherData;

    const weatherSection = document.getElementById("weatherDisplay");
    weatherSection.innerHTML = `
        <h2>Weather for ${cityName}, ${stateCode}</h2>
        <p><strong>Temperature:</strong> ${(current.temp - 273.15).toFixed(1)} °C</p>
        <p><strong>Wind Speed:</strong> ${current.wind_speed} m/s</p>
        <p><strong>Humidity:</strong> ${current.humidity}%</p>
    `;

    createHourlyChart(hourly);
    createDailyChart(daily);

}

// Global variables to store chart instances
let hourlyChartInstance;
let dailyChartInstance;

// Create a chart for hourly forecast
function createHourlyChart(hourlyData) {
    const labels = hourlyData.slice(0, 12).map((_, index) => `Hour ${index + 1}`);
    const temperatures = hourlyData.slice(0, 12).map((data) => (data.temp - 273.15).toFixed(1));

    const ctx = document.getElementById("hourlyChart").getContext("2d");

    // Destroy existing chart if it exists
    if (hourlyChartInstance) {
        hourlyChartInstance.destroy();
    }

    // Create a new chart
    hourlyChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Hourly Temperature (°C)",
                    data: temperatures,
                    borderColor: "blue",
                    backgroundColor: "rgba(135,206,250,0.5)",
                },
            ],
        },
    });
}

// Create a chart for daily forecast
function createDailyChart(dailyData) {
    const labels = dailyData.slice(0, 7).map((_, index) => `Day ${index + 1}`);
    const temperatures = dailyData.slice(0, 7).map((data) => (data.temp.day - 273.15).toFixed(1));

    const ctx = document.getElementById("dailyChart").getContext("2d");

    // Destroy existing chart if it exists
    if (dailyChartInstance) {
        dailyChartInstance.destroy();
    }

    // Create a new chart
    dailyChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Daily Temperature (°C)",
                    data: temperatures,
                    backgroundColor: "rgba(135,206,250,0.7)",
                    borderColor: "blue",
                },
            ],
        },
    });
}
/**
 * Save the city and state, and display them under "Saved Locations".
 * @param {string} cityName - Name of the city.
 * @param {string} stateCode - State initials.
 */
function saveLocation(cityName, stateCode) {
    const savedLocationsDiv = document.getElementById("savedLocations");

    if (!savedLocationsDiv) {
        console.error("Error: 'savedLocations' div not found in the DOM.");
        return; // Stop execution if the element doesn't exist
    }

    // Create a new h3 element
    const locationElement = document.createElement("h3");
    locationElement.textContent = `${cityName}, ${stateCode}`;

    // Append the new location to the saved locations div
    savedLocationsDiv.appendChild(locationElement);
}
