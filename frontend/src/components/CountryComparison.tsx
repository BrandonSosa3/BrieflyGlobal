import React from 'react';

interface CountryComparisonProps {
  country1Data: any;
  country2Data: any;
  onClose: () => void;
}

const CountryComparison: React.FC<CountryComparisonProps> = ({ 
  country1Data, 
  country2Data, 
  onClose 
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatPopulation = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    return num.toFixed(0);
  };

  const formatPercent = (num: number): string => `${num.toFixed(1)}%`;

  const getComparisonColor = (value1: number, value2: number, higherIsBetter: boolean = true) => {
    if (value1 === value2) return '#94a3b8'; // neutral
    const isFirst = higherIsBetter ? value1 > value2 : value1 < value2;
    return isFirst ? '#22c55e' : '#ef4444'; // green if better, red if worse
  };

  const ComparisonMetric: React.FC<{
    label: string;
    icon: string;
    value1: number | undefined;
    value2: number | undefined;
    formatter: (num: number) => string;
    higherIsBetter?: boolean;
    unit?: string;
  }> = ({ label, icon, value1, value2, formatter, higherIsBetter = true, unit = '' }) => {
    if (!value1 || !value2) return null;

    return (
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '15px',
        margin: '10px 0',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          textAlign: 'center',
          color: '#61dafb'
        }}>
          {icon} {label}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Country 1 */}
          <div style={{ 
            textAlign: 'center', 
            flex: 1,
            color: getComparisonColor(value1, value2, higherIsBetter)
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {formatter(value1)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {country1Data.country_code}
            </div>
          </div>

          {/* VS indicator */}
          <div style={{ 
            margin: '0 15px', 
            fontSize: '12px', 
            opacity: 0.6,
            textAlign: 'center'
          }}>
            <div>VS</div>
            {/* Percentage difference */}
            <div style={{ fontSize: '10px', marginTop: '2px' }}>
              {value1 && value2 ? `${Math.abs(((value1 - value2) / value2) * 100).toFixed(0)}%` : ''}
            </div>
          </div>

          {/* Country 2 */}
          <div style={{ 
            textAlign: 'center', 
            flex: 1,
            color: getComparisonColor(value2, value1, higherIsBetter)
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {formatter(value2)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {country2Data.country_code}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NewsComparison: React.FC = () => {
    const getSentimentStats = (articles: any[]) => {
      if (!articles || articles.length === 0) return { positive: 0, negative: 0, neutral: 0 };
      
      const sentiments = articles
        .filter(a => a.ai_analysis?.sentiment)
        .map(a => a.ai_analysis.sentiment.label);
      
      return {
        positive: sentiments.filter(s => s === 'positive').length,
        negative: sentiments.filter(s => s === 'negative').length,
        neutral: sentiments.filter(s => s === 'neutral').length
      };
    };

    const stats1 = getSentimentStats(country1Data.articles);
    const stats2 = getSentimentStats(country2Data.articles);

    return (
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '15px',
        margin: '10px 0',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          marginBottom: '15px',
          textAlign: 'center',
          color: '#61dafb'
        }}>
          📰 News Sentiment Analysis
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Country 1 News */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              {country1Data.country_code}
            </div>
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#22c55e' }}>✓ {stats1.positive} Positive</span><br/>
              <span style={{ color: '#ef4444' }}>✗ {stats1.negative} Negative</span><br/>
              <span style={{ color: '#94a3b8' }}>○ {stats1.neutral} Neutral</span>
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
              {country1Data.articles?.length || 0} total articles
            </div>
          </div>

          <div style={{ margin: '0 15px', fontSize: '12px', opacity: 0.6, alignSelf: 'center' }}>
            VS
          </div>

          {/* Country 2 News */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              {country2Data.country_code}
            </div>
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#22c55e' }}>✓ {stats2.positive} Positive</span><br/>
              <span style={{ color: '#ef4444' }}>✗ {stats2.negative} Negative</span><br/>
              <span style={{ color: '#94a3b8' }}>○ {stats2.neutral} Neutral</span>
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
              {country2Data.articles?.length || 0} total articles
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        border: '2px solid rgba(255,255,255,0.2)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: 'white',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            ⚖️ Country Comparison
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Country Headers */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          padding: '15px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '20px' }}>
              {country1Data.country}
            </h3>
          </div>
          <div style={{ margin: '0 20px', alignSelf: 'center', fontSize: '18px' }}>
            🆚
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '20px' }}>
              {country2Data.country}
            </h3>
          </div>
        </div>

        {/* Economic Comparisons */}
        <ComparisonMetric
          label="Gross Domestic Product"
          icon="💰"
          value1={country1Data.economic_indicators?.GDP?.value}
          value2={country2Data.economic_indicators?.GDP?.value}
          formatter={formatNumber}
        />

        <ComparisonMetric
          label="Population"
          icon="👥"
          value1={country1Data.economic_indicators?.POPULATION?.value}
          value2={country2Data.economic_indicators?.POPULATION?.value}
          formatter={formatPopulation}
        />

        <ComparisonMetric
          label="GDP per Capita"
          icon="💎"
          value1={country1Data.economic_indicators?.GDP_PER_CAPITA?.value}
          value2={country2Data.economic_indicators?.GDP_PER_CAPITA?.value}
          formatter={formatNumber}
        />

        <ComparisonMetric
          label="Unemployment Rate"
          icon="📈"
          value1={country1Data.economic_indicators?.UNEMPLOYMENT?.value}
          value2={country2Data.economic_indicators?.UNEMPLOYMENT?.value}
          formatter={formatPercent}
          higherIsBetter={false}
        />

        <ComparisonMetric
          label="Life Expectancy"
          icon="🏥"
          value1={country1Data.economic_indicators?.LIFE_EXPECTANCY?.value}
          value2={country2Data.economic_indicators?.LIFE_EXPECTANCY?.value}
          formatter={(num) => `${num.toFixed(1)} years`}
        />

        <ComparisonMetric
          label="Internet Users"
          icon="🌐"
          value1={country1Data.economic_indicators?.INTERNET_USERS?.value}
          value2={country2Data.economic_indicators?.INTERNET_USERS?.value}
          formatter={formatPercent}
        />

        {/* News Sentiment Comparison */}
        <NewsComparison />

        {/* Quick Insights */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#61dafb' }}>
            🧠 Quick Insights
          </div>
          <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
            • <strong>Economic size:</strong> {country1Data.country} GDP is {country1Data.economic_indicators?.GDP?.value && country2Data.economic_indicators?.GDP?.value ? 
              `${((country1Data.economic_indicators.GDP.value / country2Data.economic_indicators.GDP.value) * 100).toFixed(0)}%` : 'unknown'} of {country2Data.country}'s<br/>
            • <strong>Population:</strong> {country1Data.country} has {country1Data.economic_indicators?.POPULATION?.value && country2Data.economic_indicators?.POPULATION?.value ?
              `${((country1Data.economic_indicators.POPULATION.value / country2Data.economic_indicators.POPULATION.value) * 100).toFixed(0)}%` : 'unknown'} the population of {country2Data.country}<br/>
            • <strong>News sentiment:</strong> Recent coverage differs between countries
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryComparison;
