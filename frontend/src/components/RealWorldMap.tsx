// useState allows the component to have state variables
// useEffect 
// useCallback → memoizes functions so they don’t get recreated on every render (optimization).
// Map is the maplibre component that renders the interactive map
// ViewState TypeScript type defining the map’s camera (longitude, latitude, zoom, bearing, pitch). 
import React, { useState, useCallback, useEffect } from 'react';
import Map, { ViewState } from 'react-map-gl/maplibre';
// default maplibre styles
import 'maplibre-gl/dist/maplibre-gl.css';
// this is our object containing backend URLs, e.g., for fetching country data.
import { API_ENDPOINTS } from '../config/api';

// Typescript interface
// In TypeScript, an interface is a way to define the shape of an object. It tells TypeScript:
// What properties an object should have
// What types those properties are
// Which properties are optional
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

  // Fetch countries from backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        let retries = 3;
        let lastError;
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(API_ENDPOINTS.countries, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
              const data = await response.json();
              const countries = data.countries || data;
              setAvailableCountries(countries.map((c: any) => ({
                code: c.code,
                name: c.name,
                coords: c.coords as [number, number]
              })));
              setError(null);
              return;
            } else {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
          } catch (err) {
            lastError = err;
            await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
          }
        }
        throw lastError;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Connection failed');
        setAvailableCountries([
          { code: 'USA', name: 'United States', coords: [-95.7129, 37.0902] },
          { code: 'GBR', name: 'United Kingdom', coords: [-3.4360, 55.3781] },
          { code: 'JPN', name: 'Japan', coords: [138.2529, 36.2048] },
          { code: 'DEU', name: 'Germany', coords: [10.4515, 51.1657] },
          { code: 'CHN', name: 'China', coords: [104.1954, 35.8617] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchCountries, 1000);
  }, []);

  const handleMapMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
  }, []);

  const handleCountryClick = (countryCode: string) => {
    onCountryClick(countryCode);
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
    const { lng, lat } = event.lngLat;
    let closestCountry = null;
    let shortestDistance = Infinity;

    for (const country of availableCountries) {
      const [countryLng, countryLat] = country.coords;
      const dlat = lat - countryLat;
      const dlng = lng - countryLng;
      const distance = Math.sqrt(dlat * dlat + dlng * dlng);
      let threshold = 10;
      if (['RUS', 'CAN', 'USA', 'CHN', 'BRA', 'AUS'].includes(country.code)) threshold = 25;
      else if (['IND', 'ARG', 'KAZ', 'DZA', 'SAU'].includes(country.code)) threshold = 20;
      else if (['SGP', 'BHR', 'MLT', 'MUS', 'MDV'].includes(country.code)) threshold = 5;
      if (distance < threshold && distance < shortestDistance) {
        shortestDistance = distance;
        closestCountry = country;
      }
    }
    if (closestCountry) handleCountryClick(closestCountry.code);
  }, [availableCountries, handleCountryClick]);

  if (loading) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '10px',
        color: '#e5e5e5',
        fontSize: '14px'
      }}>
        Loading countries...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(30,30,30,0.8)',
        border: '1px solid rgba(255,0,0,0.4)',
        borderRadius: '10px',
        color: '#ff6b6b',
        fontSize: '13px',
        padding: '20px',
        textAlign: 'center'
      }}>
        Error loading countries: {error}
        <br />
        <span style={{ fontSize: '11px', color: '#aaa' }}>Using fallback countries</span>
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
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Map
        {...viewState}
        onMove={handleMapMove}
        onClick={handleMapClick}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
        cursor="pointer"
      />

      {/* Country buttons */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        zIndex: 1000
      }}>
        {availableCountries.slice(0, 12).map(country => (
          <button
            key={country.code}
            onClick={() => handleCountryClick(country.code)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: selectedCountry === country.code ? '#facc15' : 'rgba(255,255,255,0.05)',
              color: selectedCountry === country.code ? '#111' : '#e5e5e5',
              border: selectedCountry === country.code ? '1px solid #facc15' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            title={country.name}
          >
            {country.code}
          </button>
        ))}
      </div>

      {/* Map info */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.6)',
        color: '#e5e5e5',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        backdropFilter: 'blur(6px)'
      }}>
        Click anywhere on map – {availableCountries.length} countries available
      </div>

      {/* Selected country */}
      {selectedCountry && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '10px',
          background: 'rgba(250,204,21,0.9)',
          color: '#111',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {availableCountries.find(c => c.code === selectedCountry)?.name || selectedCountry}
        </div>
      )}
    </div>
  );
};

export default RealWorldMap;

