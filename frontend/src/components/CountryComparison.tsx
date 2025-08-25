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
    if (value1 === value2) return '#9ca3af'; // neutral gray
    const isFirst = higherIsBetter ? value1 > value2 : value1 < value2;
    return isFirst ? '#22c55e' : '#ef4444'; // green if better, red if worse
  };

  const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{
      background: '#1e1e1e',
      borderRadius: '8px',
      padding: '15px',
      margin: '12px 0',
      border: '1px solid #2c2c2c'
    }}>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 600, 
        marginBottom: '12px',
        textAlign: 'center',
        color: '#e5e5e5',
        letterSpacing: '0.5px'
      }}>
        {title}
      </div>
      {children}
    </div>
  );

  const ComparisonMetric: React.FC<{
    label: string;
    value1: number | undefined;
    value2: number | undefined;
    formatter: (num: number) => string;
    higherIsBetter?: boolean;
  }> = ({ label, value1, value2, formatter, higherIsBetter = true }) => {
    if (!value1 || !value2) return null;

    return (
      <SectionCard title={label}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Country 1 */}
          <div style={{ 
            textAlign: 'center', 
            flex: 1,
            color: getComparisonColor(value1, value2, higherIsBetter)
          }}>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>
              {formatter(value1)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {country1Data.country_code}
            </div>
          </div>

          {/* VS indicator */}
          <div style={{ margin: '0 15px', fontSize: '12px', opacity: 0.6, textAlign: 'center' }}>
            <div>vs</div>
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
            <div style={{ fontSize: '18px', fontWeight: 600 }}>
              {formatter(value2)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {country2Data.country_code}
            </div>
          </div>
        </div>
      </SectionCard>
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
      <SectionCard title="News Sentiment Analysis">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Country 1 News */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              {country1Data.country_code}
            </div>
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#22c55e' }}>{stats1.positive} Positive</span><br/>
              <span style={{ color: '#ef4444' }}>{stats1.negative} Negative</span><br/>
              <span style={{ color: '#9ca3af' }}>{stats1.neutral} Neutral</span>
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
              {country1Data.articles?.length || 0} total articles
            </div>
          </div>

          <div style={{ margin: '0 15px', fontSize: '12px', opacity: 0.6, alignSelf: 'center' }}>
            vs
          </div>

          {/* Country 2 News */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              {country2Data.country_code}
            </div>
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#22c55e' }}>{stats2.positive} Positive</span><br/>
              <span style={{ color: '#ef4444' }}>{stats2.negative} Negative</span><br/>
              <span style={{ color: '#9ca3af' }}>{stats2.neutral} Neutral</span>
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
              {country2Data.articles?.length || 0} total articles
            </div>
          </div>
        </div>
      </SectionCard>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#121212',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #2c2c2c'
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
            color: '#f5f5f5',
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}>
            Country Comparison
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#2c2c2c',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#f5f5f5',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Close
          </button>
        </div>

        {/* Country Headers */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          padding: '12px',
          background: '#1e1e1e',
          borderRadius: '8px',
          border: '1px solid #2c2c2c'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h3 style={{ margin: 0, color: '#e5e5e5', fontSize: '18px' }}>
              {country1Data.country}
            </h3>
          </div>
          <div style={{ margin: '0 20px', alignSelf: 'center', fontSize: '16px', opacity: 0.6 }}>
            vs
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h3 style={{ margin: 0, color: '#e5e5e5', fontSize: '18px' }}>
              {country2Data.country}
            </h3>
          </div>
        </div>

        {/* Economic Comparisons */}
        <ComparisonMetric
          label="Gross Domestic Product"
          value1={country1Data.economic_indicators?.GDP?.value}
          value2={country2Data.economic_indicators?.GDP?.value}
          formatter={formatNumber}
        />

        <ComparisonMetric
          label="Population"
          value1={country1Data.economic_indicators?.POPULATION?.value}
          value2={country2Data.economic_indicators?.POPULATION?.value}
          formatter={formatPopulation}
        />

        <ComparisonMetric
          label="GDP per Capita"
          value1={country1Data.economic_indicators?.GDP_PER_CAPITA?.value}
          value2={country2Data.economic_indicators?.GDP_PER_CAPITA?.value}
          formatter={formatNumber}
        />

        <ComparisonMetric
          label="Unemployment Rate"
          value1={country1Data.economic_indicators?.UNEMPLOYMENT?.value}
          value2={country2Data.economic_indicators?.UNEMPLOYMENT?.value}
          formatter={formatPercent}
          higherIsBetter={false}
        />

        <ComparisonMetric
          label="Life Expectancy"
          value1={country1Data.economic_indicators?.LIFE_EXPECTANCY?.value}
          value2={country2Data.economic_indicators?.LIFE_EXPECTANCY?.value}
          formatter={(num) => `${num.toFixed(1)} years`}
        />

        <ComparisonMetric
          label="Internet Users"
          value1={country1Data.economic_indicators?.INTERNET_USERS?.value}
          value2={country2Data.economic_indicators?.INTERNET_USERS?.value}
          formatter={formatPercent}
        />

        {/* News Sentiment Comparison */}
        <NewsComparison />

        {/* Quick Insights */}
        <SectionCard title="Quick Insights">
          <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#d1d5db' }}>
            • <strong>Economic size:</strong> {country1Data.country} GDP is {country1Data.economic_indicators?.GDP?.value && country2Data.economic_indicators?.GDP?.value ? 
              `${((country1Data.economic_indicators.GDP.value / country2Data.economic_indicators.GDP.value) * 100).toFixed(0)}%` : 'unknown'} of {country2Data.country}'s<br/>
            • <strong>Population:</strong> {country1Data.country} has {country1Data.economic_indicators?.POPULATION?.value && country2Data.economic_indicators?.POPULATION?.value ?
              `${((country1Data.economic_indicators.POPULATION.value / country2Data.economic_indicators.POPULATION.value) * 100).toFixed(0)}%` : 'unknown'} the population of {country2Data.country}<br/>
            • <strong>News sentiment:</strong> Recent coverage differs between countries
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default CountryComparison;

