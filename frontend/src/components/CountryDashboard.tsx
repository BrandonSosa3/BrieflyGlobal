import React from 'react';


interface EconomicIndicator {
 value: number;
 year: string;
 indicator: string;
}


interface EconomicData {
 GDP?: EconomicIndicator;
 GDP_PER_CAPITA?: EconomicIndicator;
 POPULATION?: EconomicIndicator;
 UNEMPLOYMENT?: EconomicIndicator;
 INFLATION?: EconomicIndicator;
 INTERNET_USERS?: EconomicIndicator;
 LIFE_EXPECTANCY?: EconomicIndicator;
}


interface CurrencyData {
 base_currency: string;
 rates?: {
   USD?: number;
   EUR?: number;
   GBP?: number;
   JPY?: number;
   CNY?: number;
 };
 last_updated?: string;
}


interface CountryInfo {
 name?: string;
 capital?: string;
 region?: string;
 income_level?: string;
}


interface CountryDashboardProps {
 countryData: {
   country: string;
   country_code: string;
   economic_indicators?: EconomicData;
   currency_data?: CurrencyData;
   country_info?: CountryInfo;
   last_updated?: string;
 };
}


const CountryDashboard: React.FC<CountryDashboardProps> = ({ countryData }) => {
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
   if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
   return num.toFixed(0);
 };


 const formatPercent = (num: number): string => {
   return `${num.toFixed(1)}%`;
 };


 const { economic_indicators, currency_data, country_info } = countryData;


 return (
   <div style={{
     background: 'rgba(255,255,255,0.05)',
     borderRadius: '12px',
     padding: '20px',
     margin: '20px 0',
     border: '1px solid rgba(255,255,255,0.1)'
   }}>
     <h3 style={{
       margin: '0 0 20px 0',
       color: '#61dafb',
       display: 'flex',
       alignItems: 'center',
       gap: '10px'
     }}>
       📊 {countryData.country} - Country Overview
     </h3>


     {/* Key Metrics Grid */}
     <div style={{
       display: 'grid',
       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
       gap: '15px',
       marginBottom: '20px'
     }}>
       {/* GDP */}
       {economic_indicators?.GDP && (
         <div style={{
           background: 'rgba(34, 197, 94, 0.1)',
           padding: '15px',
           borderRadius: '8px',
           border: '1px solid rgba(34, 197, 94, 0.3)'
         }}>
           <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
             💰 GDP ({economic_indicators.GDP.year})
           </div>
           <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e' }}>
             {formatNumber(economic_indicators.GDP.value)}
           </div>
         </div>
       )}


       {/* Population */}
       {economic_indicators?.POPULATION && (
         <div style={{
           background: 'rgba(59, 130, 246, 0.1)',
           padding: '15px',
           borderRadius: '8px',
           border: '1px solid rgba(59, 130, 246, 0.3)'
         }}>
           <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
             👥 Population ({economic_indicators.POPULATION.year})
           </div>
           <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
             {formatPopulation(economic_indicators.POPULATION.value)}
           </div>
         </div>
       )}


       {/* GDP Per Capita */}
       {economic_indicators?.GDP_PER_CAPITA && (
         <div style={{
           background: 'rgba(168, 85, 247, 0.1)',
           padding: '15px',
           borderRadius: '8px',
           border: '1px solid rgba(168, 85, 247, 0.3)'
         }}>
           <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
             💎 GDP per Capita ({economic_indicators.GDP_PER_CAPITA.year})
           </div>
           <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#a855f7' }}>
             {formatNumber(economic_indicators.GDP_PER_CAPITA.value)}
           </div>
         </div>
       )}


       {/* Unemployment */}
       {economic_indicators?.UNEMPLOYMENT && (
         <div style={{
           background: 'rgba(245, 158, 11, 0.1)',
           padding: '15px',
           borderRadius: '8px',
           border: '1px solid rgba(245, 158, 11, 0.3)'
         }}>
           <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
             📈 Unemployment ({economic_indicators.UNEMPLOYMENT.year})
           </div>
           <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>
             {formatPercent(economic_indicators.UNEMPLOYMENT.value)}
           </div>
         </div>
       )}
     </div>


     {/* Additional Metrics Row */}
     <div style={{
       display: 'grid',
       gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
       gap: '12px',
       marginBottom: '20px'
     }}>
       {/* Life Expectancy */}
       {economic_indicators?.LIFE_EXPECTANCY && (
         <div style={{
           background: 'rgba(236, 72, 153, 0.1)',
           padding: '12px',
           borderRadius: '6px',
           border: '1px solid rgba(236, 72, 153, 0.3)',
           textAlign: 'center'
         }}>
           <div style={{ fontSize: '11px', opacity: 0.8 }}>🏥 Life Expectancy</div>
           <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ec4899' }}>
             {economic_indicators.LIFE_EXPECTANCY.value.toFixed(1)} years
           </div>
         </div>
       )}


       {/* Internet Users */}
       {economic_indicators?.INTERNET_USERS && (
         <div style={{
           background: 'rgba(6, 182, 212, 0.1)',
           padding: '12px',
           borderRadius: '6px',
           border: '1px solid rgba(6, 182, 212, 0.3)',
           textAlign: 'center'
         }}>
           <div style={{ fontSize: '11px', opacity: 0.8 }}>🌐 Internet Users</div>
           <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#06b6d4' }}>
             {formatPercent(economic_indicators.INTERNET_USERS.value)}
           </div>
         </div>
       )}


       {/* Inflation */}
       {economic_indicators?.INFLATION && (
         <div style={{
           background: 'rgba(239, 68, 68, 0.1)',
           padding: '12px',
           borderRadius: '6px',
           border: '1px solid rgba(239, 68, 68, 0.3)',
           textAlign: 'center'
         }}>
           <div style={{ fontSize: '11px', opacity: 0.8 }}>📊 Inflation Rate</div>
           <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>
             {formatPercent(economic_indicators.INFLATION.value)}
           </div>
         </div>
       )}
     </div>


     {/* Country Info & Currency */}
     <div style={{
       display: 'grid',
       gridTemplateColumns: '1fr 1fr',
       gap: '20px',
       marginTop: '20px'
     }}>
       {/* Country Information */}
       {country_info && (
         <div style={{
           background: 'rgba(255,255,255,0.03)',
           padding: '15px',
           borderRadius: '8px',
           border: '1px solid rgba(255,255,255,0.1)'
         }}>
           <h4 style={{ margin: '0 0 10px 0', color: '#61dafb', fontSize: '14px' }}>
             🏛️ Country Information
           </h4>
           <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
             {country_info.capital && (
               <div><strong>Capital:</strong> {country_info.capital}</div>
             )}
             {country_info.region && (
               <div><strong>Region:</strong> {country_info.region}</div>
             )}
             {country_info.income_level && (
               <div><strong>Income Level:</strong> {country_info.income_level}</div>
             )}
           </div>
         </div>
       )}


       {/* Currency Information */}
       {currency_data && (
         <div style={{
           background: 'rgba(255,255,255,0.03)',
           padding: '15px',
           borderRadius: '8px',
           border: '1px solid rgba(255,255,255,0.1)'
         }}>
           <h4 style={{ margin: '0 0 10px 0', color: '#61dafb', fontSize: '14px' }}>
             💱 Currency Exchange Rates
           </h4>
           <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
             <div><strong>Base:</strong> {currency_data.base_currency}</div>
             {currency_data.rates && (
               <div style={{ marginTop: '8px' }}>
                 {Object.entries(currency_data.rates).slice(0, 4).map(([currency, rate]) => (
                   <div key={currency} style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span>1 {currency_data.base_currency} →</span>
                     <span>{rate?.toFixed(4)} {currency}</span>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </div>
       )}
     </div>


     {/* Last Updated */}
     {countryData.last_updated && (
       <div style={{
         fontSize: '11px',
         opacity: 0.6,
         textAlign: 'center',
         marginTop: '15px'
       }}>
         📅 Economic data last updated: {new Date(countryData.last_updated).toLocaleDateString()}
       </div>
     )}
   </div>
 );
};


export default CountryDashboard;
