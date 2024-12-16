# INST377 Group Project Final
Beimnet Aklilu, Eyosiyas Girma, Grey Moran

# README
# OpenWeatherApp
Website link: https://inst-377-group-project-final-2.vercel.app/
OpenWeatherApp is a user-friendly weather application designed to help you stay informed about the weather conditions in any location. Users are able to search for a city or region and get detailed weather forecasts for both the day and the week ahead. OpenWeatherApp provides reliable and up-to-date information right at your fingertips. 

Our target browsers would be desktop users who could be traveling, looking for outdoor activites, commuters, or general users. 

Scroll down to read the Developer Manual

# Developer Manual
Installing the application and all dependencies and running on a server:
- First clone the repository from github
- Next locate any file in the project directory and open it any web browser
- To run the app install the live server through VSCode

How to run any tests you have written for your software:
- To run tests you use console.log or console.error statements in the javascript files to verify the logic and outputs during runtime

The API for your server application - all GET, POST, PATCH, etc endpoints, and what they each do:
    The API we will be using for our server application is OpenWeatherMap
- POST endpoint: /api/weather/save, allows the frontend to save a location by the city and state to the database.
- GET endpoint: /api/weather, allows the frontend to fetch the weather data of a location using the city and state code

## Ideas for Future Development
- Implementing user authentication to allow users to have their own weather locations
- Adding unit tests for the backend server to make sure of stability and catch issues before being deployed
- Ensure the application can handle more users and data as it keeps growing
