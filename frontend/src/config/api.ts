// src/config/api.ts - Production ready configuration
// this function decides which backend url to use based on local or production mode
const getApiUrl = (): string => {
  // this !== statement ensures this only runs in browser and not on server side
  // window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' → 
  // checks if you are running on your local machine.
  // if we are on local host then we use the localhost URL
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000';
  }
  
  // If deployed (production) - use actual Render backend URL
  return 'https://brieflyglobal-api-production.up.railway.app';
};

// this calls the above function and stores it
// we can use this var to prepend all endpoints
const API_BASE_URL = getApiUrl();

// a centralized object that holds all API endpoints that the frontend will call
// countries endpoint gets all countries
// countries → endpoint to get all countries.
// countryIntelligence(code) → endpoint to get intelligence data for a specific country (code is dynamic).
// search(query) → dynamic endpoint to search countries by query.
// Using this object makes it easy to update backend URLs in one place.

export const API_ENDPOINTS = {
  countries: `${API_BASE_URL}/api/v1/news/countries`,
  // this is an endpoint that takes parameters, so API_ENDPOINTS.countryIntelligence('USA')
  // Returns: http://localhost:8000/api/v1/news/USA
  // Used when you need data for a specific country, e.g., when a user clicks on a country on the map.
  // Makes it easy to reuse the API object without hardcoding URLs.
  countryIntelligence: (code: string) => `${API_BASE_URL}/api/v1/news/${code}`,
  status: `${API_BASE_URL}/api/v1/news/status`,
  search: (query: string) => `${API_BASE_URL}/api/v1/news/countries/search?q=${query}`,
  ping: `${API_BASE_URL}/api/v1/ping`
};

// Exports the base URL separately in case some part of your app just needs the root backend URL instead of full endpoints.
// this allows use to use this var that creates the correct backend url based on production or local dev
export default API_BASE_URL;

// Logs the url to the console
// Helpful to check whether your app is using the local backend or production backend.
console.log('🔗 API Base URL:', API_BASE_URL);

