import React, { useState, useCallback, useEffect } from 'react';
import Map, { ViewState } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { API_ENDPOINTS } from '../config/api';

interface RealWorldMapProps {
  onCountryClick: (countryCode: string) => void;
  selectedCountry?: string;
}

const RealWorldMap: React.FC<RealWorldMapProps> = ({ onCountryClick, selectedCountry }) => {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 0,
    latitude: 20,
    zoom: 2,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  
  const [availableCountries, setAvailableCountries] = useState<Array<{code: string, name: string, coords: [number, number]}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available countries from backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        console.log('🔍 Fetching countries from backend...');
        
        // Add a small delay and retry logic
        let retries = 3;
        let lastError;
        
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(API_ENDPOINTS.countries, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log('✅ Countries data:', data);
              
              const countries = data.countries || data;
              setAvailableCountries(countries.map((country: any) => ({
                code: country.code,
                name: country.name,
                coords: country.coords as [number, number]
              })));
              console.log(`✅ Loaded ${countries.length} countries`);
              setError(null); // Clear any previous errors
              return; // Success, exit the retry loop
            } else {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
          } catch (err) {
            lastError = err;
            console.log(`❌ Attempt ${i + 1} failed:`, err);
            
            if (i < retries - 1) {
              console.log(`⏳ Retrying in ${(i + 1) * 1000}ms...`);
              await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
            }
          }
        }
        
        // All retries failed
        throw lastError;
        
      } catch (error) {
        console.error('❌ All attempts failed to fetch countries:', error);
        setError(error instanceof Error ? error.message : 'Connection failed');
        
        // Fallback to original 5 countries
        setAvailableCountries([
          { code: 'USA', name: 'United States', coords: [-95.7129, 37.0902] },
          { code: 'GBR', name: 'United Kingdom', coords: [-3.4360, 55.3781] },
          { code: 'JPN', name: 'Japan', coords: [138.2529, 36.2048] },
          { code: 'DEU', name: 'Germany', coords: [10.4515, 51.1657] },
          { code: 'CHN', name: 'China', coords: [104.1954, 35.8617] }
        ]);
        console.log('🔄 Using fallback countries');
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay before starting to give backend time to start
    setTimeout(fetchCountries, 1000);
  }, []);

  const handleMapMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
  }, []);

  const handleCountryClick = (countryCode: string) => {
    console.log('🗺️ Map: Country clicked:', countryCode);
    onCountryClick(countryCode);
    
    // Zoom to country
    const country = availableCountries.find(c => c.code === countryCode);
    if (country) {
      setViewState({
        ...viewState,
        longitude: country.coords[0],
        latitude: country.coords[1],
        zoom: 4
      });
    }
  };

  const handleMapClick = useCallback((event: any) => {
    console.log('🗺️ Map clicked at:', event.lngLat);
    
    const { lng, lat } = event.lngLat;
    
    // Find the closest country to the clicked coordinates
    let closestCountry = null;
    let shortestDistance = Infinity;
    
    for (const country of availableCountries) {
      const [countryLng, countryLat] = country.coords;
      
      // Calculate distance using Haversine-like formula (simplified)
      const dlat = lat - countryLat;
      const dlng = lng - countryLng;
      const distance = Math.sqrt(dlat * dlat + dlng * dlng);
      
      // Define different thresholds for different regions to account for country sizes
      let threshold = 10; // Default threshold
      
      // Larger thresholds for larger countries
      if (country.code === 'RUS' || country.code === 'CAN' || country.code === 'USA' || country.code === 'CHN' || country.code === 'BRA' || country.code === 'AUS') {
        threshold = 25; // Larger countries
      } else if (country.code === 'IND' || country.code === 'ARG' || country.code === 'KAZ' || country.code === 'DZA' || country.code === 'SAU') {
        threshold = 20; // Medium-large countries
      } else if (['SGP', 'BHR', 'MLT', 'MUS', 'MDV'].includes(country.code)) {
        threshold = 5; // Very small countries/city-states
      }
      
      if (distance < threshold && distance < shortestDistance) {
        shortestDistance = distance;
        closestCountry = country;
      }
    }
    
    if (closestCountry) {
      console.log(`🎯 Country detected: ${closestCountry.name} (${closestCountry.code}) - Distance: ${shortestDistance.toFixed(2)}`);
      handleCountryClick(closestCountry.code);
    } else {
      console.log(`🗺️ No country found near coordinates [${lng.toFixed(2)}, ${lat.toFixed(2)}]. Available countries: ${availableCountries.length}`);
      
      // Show the closest 3 countries for debugging
      const sorted = availableCountries
        .map(country => {
          const [countryLng, countryLat] = country.coords;
          const dlat = lat - countryLat;
          const dlng = lng - countryLng;
          const distance = Math.sqrt(dlat * dlat + dlng * dlng);
          return { ...country, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      
      console.log('🔍 Closest countries:', sorted.map(c => `${c.name} (${c.distance.toFixed(2)})`));
    }
  }, [availableCountries, handleCountryClick]);

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        height: '400px', 
        width: '100%', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px'
      }}>
        <div style={{ color: 'white', fontSize: '16px' }}>
          🔄 Loading countries...
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ 
        height: '400px', 
        width: '100%', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,0,0,0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(255,0,0,0.3)'
      }}>
        <div style={{ color: 'white', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
          ❌ Error loading countries: {error}
          <br />
          <small>Using fallback countries</small>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '400px', 
      width: '100%', 
      borderRadius: '10px', 
      overflow: 'hidden',
      position: 'relative',
      border: '2px solid rgba(255,255,255,0.2)'
    }}>
      <Map
        {...viewState}
        onMove={handleMapMove}
        onClick={handleMapClick}
        mapStyle="https://demotiles.maplibre.org/style.json"
        style={{ width: '100%', height: '100%' }}
        cursor="pointer"
      />
      
      {/* Country buttons overlay */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap',
        zIndex: 1000,
        maxWidth: 'calc(100% - 20px)'
      }}>
        {availableCountries.slice(0, 12).map(country => (
          <button
            key={country.code}
            onClick={() => handleCountryClick(country.code)}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              backgroundColor: selectedCountry === country.code ? '#f59e0b' : 'rgba(255,255,255,0.9)',
              color: selectedCountry === country.code ? 'white' : '#333',
              border: selectedCountry === country.code ? '2px solid #fbbf24' : '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            title={country.name}
          >
            {country.code}
          </button>
        ))}
        
        <div style={{
          padding: '4px 8px',
          fontSize: '10px',
          backgroundColor: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {availableCountries.length} total
        </div>
      </div>

      {/* Map info */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        🌍 Click anywhere on map - {availableCountries.length} countries available
      </div>

      {/* Selected country indicator */}
      {selectedCountry && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '10px',
          background: 'rgba(245, 158, 11, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 1000
        }}>
          📍 {availableCountries.find(c => c.code === selectedCountry)?.name || selectedCountry}
        </div>
      )}
    </div>
  );
};

export default RealWorldMap;
