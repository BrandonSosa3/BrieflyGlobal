import React, { useState, useEffect } from 'react'
import RealWorldMap from './components/RealWorldMap'
import CountryDashboard from './components/CountryDashboard'
import CountryComparison from './components/CountryComparison'
import { API_ENDPOINTS } from './config/api';
import API_BASE_URL from './config/api';
import './App.css'

interface AIAnalysis {
  summary_tweet: string;
  summary_bullets: string[];
  sentiment: {
    label: string;
    score: number;
  };
  bias: {
    label: string;
    credibility: number;
  };
}

interface NewsArticle {
  title: string;
  source: string;
  published_at: string;
  url: string;
  description: string;
  ai_analysis?: AIAnalysis;
}

interface CountryIntelligence {
  country: string;
  country_code: string;
  articles: NewsArticle[];
  total_articles: number;
  economic_indicators?: any;
  currency_data?: any;
  country_info?: any;
  last_updated?: string;
  data_availability?: {
    news: boolean;
    economic: boolean;
    currency: boolean;
  };
  message?: string;
}

interface Country {
  code: string;
  name: string;
  coords: [number, number];
  currency?: string;
}


const App: React.FC = () => {
  const [countryData, setCountryData] = useState<CountryIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('USA');
  
  // Available countries from backend
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  
  // Comparison state
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonCountry, setComparisonCountry] = useState('GBR');
  const [comparisonData, setComparisonData] = useState<CountryIntelligence | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  const [loadingStage, setLoadingStage] = useState<string>('');
  const [showColdStartWarning, setShowColdStartWarning] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Load available countries from backend
  useEffect(() => {
    const fetchAvailableCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await fetch(API_ENDPOINTS.countries);
        const data = await response.json();
        
        if (response.ok) {
          setAvailableCountries(data.countries || data);
          console.log(`Loaded ${data.countries?.length || data.length} countries from backend`);
        } else {
          throw new Error(data.detail || 'Failed to fetch countries');
        }
      } catch (err) {
        console.error('Failed to load countries:', err);
        // Fallback to original 5 countries if backend fails
        setAvailableCountries([
          { code: 'USA', name: 'United States', coords: [-95.7129, 37.0902] },
          { code: 'GBR', name: 'United Kingdom', coords: [-3.4360, 55.3781] },
          { code: 'JPN', name: 'Japan', coords: [138.2529, 36.2048] },
          { code: 'DEU', name: 'Germany', coords: [10.4515, 51.1657] },
          { code: 'CHN', name: 'China', coords: [104.1954, 35.8617] }
        ]);
        setError('Using limited country set due to backend connection issue');
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchAvailableCountries();
  }, []);

  const fetchCountryData = async (countryCode: string) => {
    console.log('Fetching comprehensive data for:', countryCode);
    
    setLoading(true);
    setError(null);
    setLoadingStage('Connecting to server...');
    setLoadingProgress(10);
    
    // Show cold start warning after 15 seconds
    const coldStartTimer = setTimeout(() => {
      setShowColdStartWarning(true);
      setLoadingStage('Server is starting up (this may take a few minutes)...');
    }, 15000);
    
    // Progress simulation for better UX
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev < 90) return prev + 2;
        return prev;
      });
    }, 2000);
    
    try {
      const startTime = Date.now();
      
      // Try ping first to wake up the service
      setLoadingStage('Waking up backend service...');
      try {
        await fetch(API_ENDPOINTS.ping, { 
          method: 'GET',
          signal: AbortSignal.timeout(120000) // 2 minute timeout
        });
        setLoadingStage('Backend is awake, fetching data...');
        setLoadingProgress(60);
      } catch (pingError) {
        console.log('Ping failed, proceeding with main request...');
      }
      
      // Main data request
      setLoadingStage('Loading country intelligence...');
      const response = await fetch(API_ENDPOINTS.countryIntelligence(countryCode), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(180000) // 3 minute timeout
      });
      
      const loadTime = Date.now() - startTime;
      console.log(`Total load time: ${loadTime}ms`);
      
      if (response.ok) {
        const data = await response.json();
        setCountryData(data);
        setLoadingProgress(100);
        setLoadingStage('Data loaded successfully!');
        
        // Log performance for debugging
        if (loadTime > 60000) {
          console.warn(`Slow load detected: ${loadTime}ms for ${countryCode}`);
        }
      } else {
        setError(`Server error: ${response.status} ${response.statusText}`);
      }
      
    } catch (err: any) {
      if (err.name === 'TimeoutError') {
        setError(`Request timed out. The server may be starting up - please try again in 2-3 minutes.`);
      } else {
        setError('Failed to connect to backend');
      }
      console.error('Fetch error:', err);
    } finally {
      clearTimeout(coldStartTimer);
      clearInterval(progressTimer);
      setLoading(false);
      setShowColdStartWarning(false);
      setLoadingStage('');
      setLoadingProgress(0);
    }
  };
  

  const fetchComparisonData = async (countryCode: string) => {
    setLoadingComparison(true);
    try {
      const response = await fetch(API_ENDPOINTS.countryIntelligence(countryCode));
      const data = await response.json();
      
      if (response.ok) {
        setComparisonData(data);
      }
    } catch (err) {
      console.error('Comparison fetch error:', err);
    } finally {
      setLoadingComparison(false);
    }
  };

  const handleStartComparison = async () => {
    if (!countryData) return;
    
    console.log('Starting comparison:', selectedCountry, 'vs', comparisonCountry);
    await fetchComparisonData(comparisonCountry);
    setShowComparison(true);
  };

  // Auto-load USA data on startup (after countries are loaded)
  useEffect(() => {
    if (availableCountries.length > 0 && !loadingCountries) {
      fetchCountryData('USA');
    }
  }, [availableCountries, loadingCountries]);

  const handleCountryClick = (countryCode: string) => {
    console.log('Country selected:', countryCode);
    setSelectedCountry(countryCode);
    fetchCountryData(countryCode);
  };

  const COLORS = {
    positive: "#2e7d32", // dark green
    negative: "#c62828", // dark red
    neutral: "#757575",  // medium gray
  };
  
  // Bias color function
  const getBiasColor = (bias: string) => {
    switch (bias.toLowerCase()) {
      case "left":
        return COLORS.negative;
      case "right":
        return COLORS.positive;
      case "center":
      default:
        return COLORS.neutral;
    }
  };
  
  // Sentiment color function
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return COLORS.positive;
      case "negative":
        return COLORS.negative;
      case "neutral":
      default:
        return COLORS.neutral;
    }
  };
  

  const ColdStartLoadingComponent = () => (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)",
        padding: "30px",
        borderRadius: "12px",
        margin: "20px 0",
        maxWidth: "800px",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle animated shimmer effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          animation: "shimmer 2s infinite",
          transform: "translateX(-100%)",
        }}
      />
  
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "20px", marginBottom: "15px", fontWeight: 500 }}>
          Loading {selectedCountry} Intelligence
        </div>
  
        <div style={{ fontSize: "15px", marginBottom: "20px", color: "#aaa" }}>
          {loadingStage}
        </div>
  
        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "4px",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${loadingProgress}%`,
              height: "100%",
              backgroundColor: "#2e7d32", // dark green for progress
              borderRadius: "4px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
  
        {showColdStartWarning ? (
          <div
            style={{
              background: "rgba(117, 117, 117, 0.15)",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(117, 117, 117, 0.3)",
              textAlign: "left",
            }}
          >
            {/* Pulsing server text */}
            <div
              style={{
                fontSize: "16px",
                marginBottom: "10px",
                color: "#c62828",
                animation: "pulse 2s infinite",
              }}
            >
              Server is Waking Up
            </div>
  
            <div style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "15px", color: "#ccc" }}>
              <strong>For Recruiters:</strong> The backend is hosted on free tier infrastructure.  
              The first request may take <strong>3–7 minutes</strong> to spin up due to heavy ML dependencies.  
              After that, responses are fast and seamless.
            </div>
  
            <div style={{ fontSize: "13px", opacity: 0.8, color: "#999" }}>
              <strong>Tech Note:</strong> In production, we’d use dedicated hosting for instant cold starts.  
              This delay is purely a limitation of free-tier hosting.
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "13px", opacity: 0.7, color: "#999" }}>
            Fetching data sources (economic indicators, news, market data)
          </div>
        )}
      </div>
  
      {/* CSS animations */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
  
  

  // Get popular countries for comparison dropdown
  const popularCountries = availableCountries.slice(0, 20);

  return (
    <div className="App" style={{ backgroundColor: '#0f111a', color: '#e5e7eb', minHeight: '100vh', padding: '20px' }}>
      <header className="App-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {loading && <ColdStartLoadingComponent />}
  
        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>World Intelligence Platform</h1>
        <p style={{ fontSize: '16px', marginBottom: '20px', color: '#9ca3af' }}>
          Comprehensive Country Analysis with Real-Time Data
        </p>
  
        {/* Loading Countries State */}
        {loadingCountries && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '15px',
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '800px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '16px', marginBottom: '8px', color: '#f59e0b' }}>
              Loading world countries...
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7, color: '#9ca3af' }}>
              Fetching complete country database from backend
            </div>
          </div>
        )}
  
        {/* Interactive Map */}
        {!loadingCountries && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '20px',
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '900px',
            width: '100%',
          }}>
            <h3 style={{ marginBottom: '10px' }}>Interactive World Map</h3>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '15px' }}>
              Click any country to view comprehensive intelligence report
            </p>
  
            <RealWorldMap 
              onCountryClick={handleCountryClick}
              selectedCountry={selectedCountry}
            />
  
            <div style={{
              marginTop: '15px',
              fontSize: '14px',
              opacity: 0.8,
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              Selected: {availableCountries.find(c => c.code === selectedCountry)?.name || selectedCountry} |
              {loading && ' Loading comprehensive data...'} |
              {countryData?.data_availability && (
                ` Available: ${Object.entries(countryData.data_availability)
                  .filter(([_, available]) => available)
                  .map(([type]) => type)
                  .join(', ')}`
              )}
            </div>
  
            {/* Comparison Controls */}
            {countryData && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#a3e635' }}>
                  Compare Countries:
                </span>
                
                <span style={{ fontSize: '14px', color: '#e5e7eb' }}>
                  {countryData.country} vs
                </span>
  
                <select
                  value={comparisonCountry}
                  onChange={(e) => setComparisonCountry(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    maxWidth: '200px'
                  }}
                >
                  {popularCountries.filter(c => c.code !== selectedCountry)
                    .map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))
                  }
                </select>
  
                <button
                  onClick={handleStartComparison}
                  disabled={loadingComparison}
                  style={{
                    padding: '8px 15px',
                    fontSize: '14px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#a3e635',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loadingComparison ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {loadingComparison ? 'Loading...' : 'Compare'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            background: 'rgba(198, 57, 57, 0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            margin: '20px 0',
            color: '#ff6b6b',
            maxWidth: '800px'
          }}>
            Error: {error}
          </div>
        )}
  
        {/* Country Dashboard */}
        {countryData && (
          <div style={{ maxWidth: '900px', width: '100%' }}>
            <CountryDashboard countryData={countryData} />
            
          </div>
        )}
  
        {/* News Articles */}
        {countryData && Array.isArray(countryData.articles) && countryData.articles.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '20px',
              borderRadius: '10px',
              margin: '20px 0',
              maxWidth: '900px',
              width: '100%',
              textAlign: 'left',
            }}>
            <h4 style={{ marginBottom: '10px' }}>Latest News & AI Analysis</h4>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '15px' }}>
              Recent articles with sentiment and bias analysis
            </p>
  
            {countryData?.articles?.map((article, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '15px',
                borderRadius: '8px',
                margin: '15px 0',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#a3e635' }}>
                  {article.title}
                </h5>
  
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px', color: '#9ca3af' }}>
                  {article.source} • {new Date(article.published_at).toLocaleDateString()}
                </div>
  
                <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>
                  {article.description}
                </div>
  
                {article.ai_analysis && (
                  <div style={{ margin: '10px 0' }}>
                    <div style={{ marginBottom: '8px', color: '#e5e7eb' }}>
                      <strong>AI Summary:</strong> {article.ai_analysis.summary_tweet}
                    </div>
  
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getSentimentColor(article.ai_analysis.sentiment.label),
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {article.ai_analysis.sentiment.label}
                      </span>
  
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getBiasColor(article.ai_analysis.bias.label),
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {article.ai_analysis.bias.label}
                      </span>
  
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {Math.round((article.ai_analysis.bias.credibility || 0) * 100)}% credible
                      </span>
                    </div>
                  </div>
                )}
  
                <a href={article.url} target="_blank" rel="noopener noreferrer"
                   style={{ color: '#a3e635', fontSize: '14px' }}>
                  Read Full Article →
                </a>
              </div>
            ))}
          </div>
        )}
  
        {/* No News Message */}
        {countryData?.articles?.length === 0 && (
          <div style={{
            background: 'rgba(156, 163, 175, 0.1)',
            padding: '20px',
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '800px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
              No Recent News Available
            </div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>
              No articles found for {countryData.country}.
            </div>
          </div>
        )}
  
        {/* Comparison Modal */}
        {showComparison && countryData && comparisonData && (
          <CountryComparison
            country1Data={countryData}
            country2Data={comparisonData}
            onClose={() => setShowComparison(false)}
          />
        )}
  
        <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7, color: '#9ca3af' }}>
          Backend API: <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noopener noreferrer" style={{ color: '#a3e635' }}>
            {API_BASE_URL}/docs
          </a> | Countries loaded: {availableCountries.length}
        </p>
      </header>
    </div>
  )
}

export default App
