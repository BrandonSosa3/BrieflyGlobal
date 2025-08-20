import React, { useState, useEffect } from 'react'
import RealWorldMap from './components/RealWorldMap'
import CountryDashboard from './components/CountryDashboard'
import CountryComparison from './components/CountryComparison'
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
}

const App: React.FC = () => {
  const [countryData, setCountryData] = useState<CountryIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('USA');
  
  // Comparison state
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonCountry, setComparisonCountry] = useState('GBR');
  const [comparisonData, setComparisonData] = useState<CountryIntelligence | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  const countries = [
    { code: 'USA', name: '🇺🇸 United States' },
    { code: 'GBR', name: '🇬🇧 United Kingdom' },
    { code: 'JPN', name: '🇯🇵 Japan' },
    { code: 'DEU', name: '🇩🇪 Germany' },
    { code: 'CHN', name: '🇨🇳 China' }
  ];

  const fetchCountryData = async (countryCode: string) => {
    console.log('🔍 Fetching comprehensive data for:', countryCode);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/news/${countryCode}`);
      const data = await response.json();
      
      if (response.ok) {
        setCountryData(data);
      } else {
        setError(data.detail || 'Failed to fetch country data');
      }
    } catch (err) {
      setError('Failed to connect to backend');
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComparisonData = async (countryCode: string) => {
    setLoadingComparison(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/news/${countryCode}`);
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

  // Auto-load USA data on startup
  useEffect(() => {
    fetchCountryData('USA');
  }, []);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>�� World Intelligence Platform</h1>
        <p>Comprehensive Country Analysis with Real-Time Data</p>
        
        {/* Interactive Map */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          margin: '20px 0',
          maxWidth: '900px',
          width: '100%'
        }}>
          <h3>🗺️ Interactive World Map</h3>
          <p>Select a country to view comprehensive intelligence report</p>
          
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
            Selected: {countries.find(c => c.code === selectedCountry)?.name} | 
            {loading && ' 🔄 Loading comprehensive data...'} |
            {countryData && ` Found ${countryData.total_articles} articles + economic data`}
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
                  fontSize: '14px'
                }}
              >
                {countries
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

        {/* Comparison Modal */}
        {showComparison && countryData && comparisonData && (
          <CountryComparison
            country1Data={countryData}
            country2Data={comparisonData}
            onClose={() => setShowComparison(false)}
          />
        )}

        <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
          Backend API: <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
            http://localhost:8000/docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
