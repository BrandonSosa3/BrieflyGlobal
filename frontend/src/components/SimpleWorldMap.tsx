import React from 'react';

interface SimpleWorldMapProps {
  onCountryClick: (countryCode: string) => void;
  selectedCountry?: string;
}

const SimpleWorldMap: React.FC<SimpleWorldMapProps> = ({ onCountryClick, selectedCountry }) => {
  const countries = [
    { code: 'USA', name: '🇺🇸 United States', coords: { x: 25, y: 45 } },
    { code: 'GBR', name: '🇬🇧 United Kingdom', coords: { x: 50, y: 35 } },
    { code: 'JPN', name: '🇯🇵 Japan', coords: { x: 85, y: 40 } },
    { code: 'DEU', name: '🇩🇪 Germany', coords: { x: 55, y: 30 } },
    { code: 'CHN', name: '🇨🇳 China', coords: { x: 75, y: 35 } }
  ];

  const handleClick = (countryCode: string) => {
    console.log('SimpleWorldMap: Country clicked:', countryCode);
    onCountryClick(countryCode);
  };

  return (
    <div style={{ 
      height: '400px', 
      width: '100%', 
      borderRadius: '10px', 
      overflow: 'hidden',
      position: 'relative',
      background: '#2563eb',
      border: '2px solid rgba(255,255,255,0.2)',
      marginBottom: '20px'
    }}>
      {/* World Map SVG Background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '80%',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath d='M150,200 L180,180 L220,190 L250,170 L280,180 L250,210 L220,220 L180,210 Z' fill='%2334d399' opacity='0.8'/%3E%3Cpath d='M300,150 L350,140 L400,160 L450,150 L400,180 L350,170 L300,180 Z' fill='%2334d399' opacity='0.8'/%3E%3Cpath d='M500,140 L580,130 L620,150 L580,170 L520,180 L500,160 Z' fill='%2334d399' opacity='0.8'/%3E%3Cpath d='M650,160 L720,150 L750,170 L720,190 L680,180 L650,180 Z' fill='%2334d399' opacity='0.8'/%3E%3Cpath d='M100,250 L200,240 L300,260 L200,280 L100,270 Z' fill='%2334d399' opacity='0.8'/%3E%3Cpath d='M350,240 L450,230 L500,250 L450,270 L350,260 Z' fill='%2334d399' opacity='0.8'/%3E%3Cpath d='M550,250 L650,240 L700,260 L650,280 L550,270 Z' fill='%2334d399' opacity='0.8'/%3E%3Cpath d='M150,300 L250,290 L300,310 L250,330 L150,320 Z' fill='%2334d399' opacity='0.8'/%3E%3Cpath d='M400,310 L500,300 L550,320 L500,340 L400,330 Z' fill='%2334d399' opacity='0.8'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pointerEvents: 'none'
      }} />

      {/* Better World Map using CSS shapes */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          /* North America */
          radial-gradient(ellipse 120px 80px at 20% 40%, #34d399 30%, transparent 32%),
          /* Europe */
          radial-gradient(ellipse 80px 60px at 52% 30%, #34d399 30%, transparent 32%),
          /* Asia */
          radial-gradient(ellipse 200px 100px at 75% 35%, #34d399 30%, transparent 32%),
          /* South America */
          radial-gradient(ellipse 60px 120px at 28% 65%, #34d399 30%, transparent 32%),
          /* Africa */
          radial-gradient(ellipse 90px 140px at 48% 55%, #34d399 30%, transparent 32%),
          /* Australia */
          radial-gradient(ellipse 70px 40px at 82% 75%, #34d399 30%, transparent 32%),
          /* Ocean background */
          linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)
        `,
        pointerEvents: 'none'
      }} />
      
      {/* Clickable country markers */}
      {countries.map(country => (
        <div
          key={`area-${country.code}`}
          onClick={() => handleClick(country.code)}
          style={{
            position: 'absolute',
            left: `${country.coords.x - 8}%`,
            top: `${country.coords.y - 8}%`,
            width: '16%',
            height: '16%',
            cursor: 'pointer',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            // Uncomment to see clickable areas:
            // background: 'rgba(255,0,0,0.3)',
            // border: '2px solid red',
          }}
        >
          {/* Animated marker */}
          <div style={{
            padding: '8px 12px',
            fontSize: '12px',
            backgroundColor: selectedCountry === country.code ? '#f59e0b' : 'rgba(255,255,255,0.95)',
            color: selectedCountry === country.code ? 'white' : '#1f2937',
            border: selectedCountry === country.code ? '3px solid #fbbf24' : '2px solid rgba(255,255,255,0.8)',
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: selectedCountry === country.code 
              ? '0 0 20px rgba(245, 158, 11, 0.6), 0 4px 12px rgba(0,0,0,0.4)' 
              : '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
            transform: selectedCountry === country.code ? 'scale(1.1)' : 'scale(1)',
            animation: selectedCountry === country.code ? 'pulse 2s infinite' : 'none'
          }}>
            📍 {country.code}
          </div>
        </div>
      ))}

      {/* Map title */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 50
      }}>
        🌍 World Map - Click any country marker
      </div>

      {/* Selected country info */}
      {selectedCountry && (
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(245, 158, 11, 0.95)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 50,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          ✅ Analyzing: {countries.find(c => c.code === selectedCountry)?.name}
        </div>
      )}

      {/* Add CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default SimpleWorldMap;
