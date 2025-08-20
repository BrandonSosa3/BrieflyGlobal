import React, { useState, useCallback } from 'react';
import Map, { ViewState } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

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

  // Our supported countries with their coordinates for centering
  const countries = [
    { code: 'USA', name: 'United States', coords: [-95.7129, 37.0902] as [number, number] },
    { code: 'GBR', name: 'United Kingdom', coords: [-3.4360, 55.3781] as [number, number] },
    { code: 'JPN', name: 'Japan', coords: [138.2529, 36.2048] as [number, number] },
    { code: 'DEU', name: 'Germany', coords: [10.4515, 51.1657] as [number, number] },
    { code: 'CHN', name: 'China', coords: [104.1954, 35.8617] as [number, number] }
  ];

  const handleMapMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
  }, []);

  const handleCountryClick = (countryCode: string) => {
    console.log('🗺️ Map: Country clicked:', countryCode);
    onCountryClick(countryCode);
    
    // Zoom to country
    const country = countries.find(c => c.code === countryCode);
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
    // For now, we'll detect clicks and map them to our supported countries
    // In a real app, you'd use country boundary data
    
    const { lng, lat } = event.lngLat;
    
    // Simple region detection (rough approximations)
    if (lng >= -130 && lng <= -60 && lat >= 25 && lat <= 50) {
      handleCountryClick('USA');
    } else if (lng >= -10 && lng <= 5 && lat >= 50 && lat <= 60) {
      handleCountryClick('GBR');
    } else if (lng >= 5 && lng <= 15 && lat >= 47 && lat <= 55) {
      handleCountryClick('DEU');
    } else if (lng >= 130 && lng <= 145 && lat >= 30 && lat <= 45) {
      handleCountryClick('JPN');
    } else if (lng >= 70 && lng <= 140 && lat >= 15 && lat <= 50) {
      handleCountryClick('CHN');
    } else {
      console.log('🗺️ Clicked area not supported yet');
    }
  }, [viewState]);

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
      
      {/* Country buttons overlay for easy access */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap',
        zIndex: 1000
      }}>
        {countries.map(country => (
          <button
            key={country.code}
            onClick={() => handleCountryClick(country.code)}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              backgroundColor: selectedCountry === country.code ? '#f59e0b' : 'rgba(255,255,255,0.9)',
              color: selectedCountry === country.code ? 'white' : '#333',
              border: selectedCountry === country.code ? '2px solid #fbbf24' : '1px solid #ccc',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {country.code}
          </button>
        ))}
      </div>

      {/* Map controls info */}
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
        🌍 Drag to explore • Click regions for news
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
          📍 {countries.find(c => c.code === selectedCountry)?.name}
        </div>
      )}
    </div>
  );
};

export default RealWorldMap;
