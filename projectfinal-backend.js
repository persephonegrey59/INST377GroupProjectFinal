/*
Beimnet Aklilu, Eyosiyas Girma, P. Grey Moran
INST377 - Group Project Final

Project Final Back End JS
*/

// Import required client for Supabase
import { createClient } from '@supabase/supabase-js';

// Create back end server
const express = require("express");

// Allows front end to connect to back end (running on port 3000) 
const cors = require("cors");
const app = express();
const PORT = 3000;

// Allows backend to handle requests from different ports
app.use(cors());

// Parse JSON requests from front end
app.use(express.json());

// Initialize Supabase
const supabaseURL = "https://lxsyyfgqvybvdxazmuvl.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseURL, supabaseKey);

// POST Endpoint to Save the Location
// Receive a location name, latitude, and longitude, validates it, and saves it to locations table.
app.post("/api/weather/save", async (req, res) => {
    const {locationName, lat, lon } = req.body;

    // Validate data
    if (!locationName || !lat || !lon) return res.status(400).json({ message: "Data invalid."});

    try {

        // Save location to Supabase's locations table
        const {data, error } = await supabase.from("locations").insert([
            { location_name: locationName, lat: lat, lon: lon},
        ]);

        if (error) throw error;

        res.status(201).json({ success: true, message: "Location saved successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving the location to database.", error: error.message});
    }
    })

// Start the server on the backend and listens for incoming requests
app.listen(PORT, () => {
    console.log(`Backend is now running at http://localhost:${PORT}`);
    
})