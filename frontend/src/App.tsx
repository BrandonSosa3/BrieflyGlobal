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

  // Load available countries from backend
  useEffect(() => {
    const fetchAvailableCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await fetch(API_ENDPOINTS.countries);
        const data = await response.json();
        
        if (response.ok) {
          setAvailableCountries(data.countries || data);
          console.log(`✅ Loaded ${data.countries?.length || data.length} countries from backend`);
        } else {
          throw new Error(data.detail || 'Failed to fetch countries');
        }
      } catch (err) {
        console.error('❌ Failed to load countries:', err);
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
    console.log('🔍 Fetching comprehensive data for:', countryCode);
    console.log('🔗 API URL:', API_ENDPOINTS.countryIntelligence(countryCode));
    
    setLoading(true);
    setError(null);
    
    try {
      // Make sure we're calling the individual country endpoint, not the countries list
      const response = await fetch(API_ENDPOINTS.countryIntelligence(countryCode), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response URL: ${response.url}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw API response:', data);
        
        // Check if we got the right data structure
        if (data.countries) {
          console.error('❌ Got countries list instead of individual country data!');
          console.error('This means the wrong endpoint was called.');
          setError('Wrong API endpoint called - got countries list instead of country data');
          return;
        }
        
        // Verify we have the correct structure
        if (data.country && data.country_code) {
          console.log('✅ Correct country data structure received');
          console.log('📰 Articles count:', data.articles?.length || 0);
          console.log('💰 Economic data:', !!data.economic_indicators);
          console.log('💱 Currency data:', !!data.currency_data);
          setCountryData(data);
        } else {
          console.error('❌ Unexpected data structure:', data);
          setError('Unexpected data format received from API');
        }
        
      } else {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        setError(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
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
      console.error('❌ Comparison fetch error:', err);
    } finally {
      setLoadingComparison(false);
    }
  };

  const handleStartComparison = async () => {
    if (!countryData) return;
    
    console.log('🆚 Starting comparison:', selectedCountry, 'vs', comparisonCountry);
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
    console.log('🎯 Country selected:', countryCode);
    setSelectedCountry(countryCode);
    fetchCountryData(countryCode);
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return '#4ade80';
      case 'negative': return '#f87171';
      default: return '#94a3b8';
    }
  };

  const getBiasColor = (label: string) => {
    switch (label) {
      case 'neutral': return '#10b981';
      case 'liberal': return '#3b82f6';
      case 'conservative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get popular countries for comparison dropdown
  const popularCountries = availableCountries.slice(0, 20);

  return (    
    <div className="App">
      <header className="App-header">
        <h1>🌍 World Intelligence Platform</h1>
        <p>Comprehensive Country Analysis with Real-Time Data</p>
        {/* Loading Countries State */}
        {loadingCountries && (
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            padding: '15px', 
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '800px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              🔄 Loading world countries...
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              Fetching complete country database from backend
            </div>
          </div>
        )}
        
        {/* Interactive Map */}
        {!loadingCountries && (
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '900px',
            width: '100%'
          }}>
            <h3>🗺️ Interactive World Map</h3>
            <p>Click any country to view comprehensive intelligence report (100+ countries available)</p>
            
            <RealWorldMap 
              onCountryClick={handleCountryClick}
              selectedCountry={selectedCountry}
            />
            
            <div style={{ 
              marginTop: '15px',
              fontSize: '14px',
              opacity: 0.8,
              textAlign: 'center'
            }}>
              Selected: {availableCountries.find(c => c.code === selectedCountry)?.name || selectedCountry} | 
              {loading && ' 🔄 Loading comprehensive data...'} |
              {countryData && countryData.data_availability && (
                ` Available: ${Object.entries(countryData.data_availability)
                  .filter(([_, available]) => available)
                  .map(([type, _]) => type)
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
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  ⚖️ Compare Countries:
                </span>
                
                <span style={{ fontSize: '14px' }}>
                  {countryData.country} vs
                </span>

                <select
                  value={comparisonCountry}
                  onChange={(e) => setComparisonCountry(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'rgba(255,255,255,0.9)',
                    fontSize: '14px',
                    maxWidth: '200px'
                  }}
                >
                  {popularCountries
                    .filter(c => c.code !== selectedCountry)
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
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loadingComparison ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {loadingComparison ? '🔄 Loading...' : '🆚 Compare'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ 
            background: 'rgba(97, 218, 251, 0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '800px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
              🔄 Loading comprehensive intelligence for {selectedCountry}...
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              Fetching news, economic indicators, currency data, and country metrics
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            background: 'rgba(255, 107, 107, 0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            margin: '20px 0',
            color: '#ff6b6b',
            maxWidth: '800px'
          }}>
            ❌ Error: {error}
          </div>
        )}

        {/* Data Availability Notice */}
        {countryData && countryData.message && (
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            padding: '15px', 
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '800px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              ℹ️ Data Availability Notice
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {countryData.message}
            </div>
          </div>
        )}

        {/* Country Dashboard */}
        {countryData && (
          <div style={{ maxWidth: '900px', width: '100%' }}>
            <CountryDashboard countryData={countryData} />
          </div>
        )}

        {/* News Analysis Results */}
        {countryData && countryData.articles && countryData.articles.length > 0 && (
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '900px',
            width: '100%',
            textAlign: 'left'
          }}>
            <h4>📰 Latest News & AI Analysis</h4>
            <p>Recent articles from {countryData.country} with sentiment and bias analysis</p>
            
            {countryData.articles.map((article, index) => (
              <div key={index} style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '15px', 
                borderRadius: '8px',
                margin: '15px 0',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#61dafb' }}>
                  {article.title}
                </h5>
                
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>
                  📰 {article.source} • 📅 {new Date(article.published_at).toLocaleDateString()}
                </div>

                <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>
                  {article.description}
                </div>
                
                {article.ai_analysis && (
                  <div style={{ margin: '10px 0' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>🤖 AI Summary:</strong> {article.ai_analysis.summary_tweet}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: getSentimentColor(article.ai_analysis.sentiment.label),
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        😊 {article.ai_analysis.sentiment.label}
                      </span>
                      
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: getBiasColor(article.ai_analysis.bias.label),
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        ⚖️ {article.ai_analysis.bias.label}
                      </span>
                      
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: '#6366f1',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        🔒 {Math.round((article.ai_analysis.bias.credibility || 0) * 100)}% credible
                      </span>
                    </div>
                  </div>
                )}
                
                <a href={article.url} target="_blank" rel="noopener noreferrer" 
                   style={{ color: '#61dafb', fontSize: '14px' }}>
                  Read Full Article →
                </a>
              </div>
            ))}
          </div>
        )}

        {/* No News Available Message */}
        {countryData && countryData.articles && countryData.articles.length === 0 && (
          <div style={{ 
            background: 'rgba(156, 163, 175, 0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            margin: '20px 0',
            maxWidth: '800px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
              📰 No Recent News Available
            </div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>
              No recent news articles found for {countryData.country}. This could be due to:
            </div>
            <ul style={{ fontSize: '13px', opacity: 0.7, textAlign: 'left', marginTop: '10px' }}>
              <li>Limited English-language news coverage</li>
              <li>API rate limiting or availability</li>
              <li>Recent events not yet indexed</li>
            </ul>
            <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '10px' }}>
              Economic and currency data may still be available above
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
        <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
          Backend API: <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noopener noreferrer">
            {API_BASE_URL}/docs
          </a> | 
          Countries loaded: {availableCountries.length}
        </p>
      </header>
    </div>
  )
}

export default App
