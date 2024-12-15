/*
Beimnet Aklilu, Eyosiyas Girma, P. Grey Moran
INST377 - Group Project Final

Project Final Front End JS
*/

// API Key for OpenWeatherMap's Geocoding API (converts city name into latitude and longitude)
const API_KEY = "9e98574caa2668ccb5970aba03cd424c";

// On form submission,
document.getElementById("locationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get the city name 
    const cityName = document.getElementById("cityName").value;
    const submissionMessage = document.getElementById("submissionMessage");

    try {

        // Call Geocoding API to get coordinates for the city
        const geocodeResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
        );

        // Parse the JSON response from Geocoding API
        const geocodeData = await geocodeResponse.json();

        // If the API returned no results, report it and stop execution
        if (geocodeData.length === 0) {
            submissionMessage.textContent = "City not found. Please try again.";
            return;
        }

        // API has results, so extract latitude and longitude from first result
        const { lat, lon } = geocodeData[0];

        // POST coordinates and city name to backend to save location data to Supabase
        const response = await fetch("/api/weather/save",  {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                locationName: cityName,
                lat: lat,
                lon: lon,
            }),
        });

        // Parse JSON response from backend
        const data = await response.json();

        // Report success or failure
        if (response.ok) submissionMessage.textContent = `Location "${cityName}" added successfully!`;
        else submissionMessage.textContent = `Error: ${data.submissionMessage}`;
        
    } catch (error) {
        submissionMessage.textContent = "An error occurred.";
        console.error(error);
    }
})

// Fetch saved locations from backend and display on the page
async function fetchSavedLocations() {
    const locationList = document.getElementById("locationList");
    locationList.innerHTML = ""; //Clears previous results, remove to stop that

    try {
        // Fetch saved locations from backend GET endpoint
        const response = await fetch("/api/weather/locations");
        const savedLocations = await response.json();

        // Add saved locations to page
        savedLocations.forEach((location) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${location.location_name} (Lat: ${location.lat}, Lon: ${location.lon})`;
            locationList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Failed fetching saved locations:", error);
    }
}

window.addEventListener("load", fetchSavedLocations);