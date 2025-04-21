const axios = require('axios');

const geocodeAddress = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const response = await axios.get(url);
  return response.data.results[0]?.geometry?.location || null;
};

module.exports = { geocodeAddress };
