
// src/config/api.ts - Production ready configuration

const getApiUrl = (): string => {
  // If running on localhost (development)
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000';
  }
  
  // If deployed (production) - use your actual Render backend URL
  return 'https://brieflyglobal-1.onrender.com';
};

const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  countries: `${API_BASE_URL}/api/v1/news/countries`,
  countryIntelligence: (code: string) => `${API_BASE_URL}/api/v1/news/${code}`,
  status: `${API_BASE_URL}/api/v1/news/status`,
  search: (query: string) => `${API_BASE_URL}/api/v1/news/countries/search?q=${query}`,
  ping: `${API_BASE_URL}/api/v1/ping`
};

export default API_BASE_URL;

// Debug: Log the API URL (remove this later)
console.log('🔗 API Base URL:', API_BASE_URL);

