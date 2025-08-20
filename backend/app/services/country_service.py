"""
Comprehensive country service with all world countries
"""
from typing import Dict, List, Any, Optional

class CountryService:
    def __init__(self):
        # Complete country mapping with ISO codes, names, and coordinates
        self.countries = {
            # Major Powers
            'USA': {'name': 'United States', 'coords': [-95.7129, 37.0902], 'currency': 'USD', 'wb_code': 'US'},
            'CHN': {'name': 'China', 'coords': [104.1954, 35.8617], 'currency': 'CNY', 'wb_code': 'CN'},
            'JPN': {'name': 'Japan', 'coords': [138.2529, 36.2048], 'currency': 'JPY', 'wb_code': 'JP'},
            'DEU': {'name': 'Germany', 'coords': [10.4515, 51.1657], 'currency': 'EUR', 'wb_code': 'DE'},
            'GBR': {'name': 'United Kingdom', 'coords': [-3.4360, 55.3781], 'currency': 'GBP', 'wb_code': 'GB'},
            'FRA': {'name': 'France', 'coords': [2.2137, 46.2276], 'currency': 'EUR', 'wb_code': 'FR'},
            'IND': {'name': 'India', 'coords': [78.9629, 20.5937], 'currency': 'INR', 'wb_code': 'IN'},
            'RUS': {'name': 'Russia', 'coords': [105.3188, 61.5240], 'currency': 'RUB', 'wb_code': 'RU'},
            'BRA': {'name': 'Brazil', 'coords': [-51.9253, -14.2401], 'currency': 'BRL', 'wb_code': 'BR'},
            'CAN': {'name': 'Canada', 'coords': [-106.3468, 56.1304], 'currency': 'CAD', 'wb_code': 'CA'},
            
            # Europe
            'ITA': {'name': 'Italy', 'coords': [12.5674, 41.8719], 'currency': 'EUR', 'wb_code': 'IT'},
            'ESP': {'name': 'Spain', 'coords': [-3.7492, 40.4637], 'currency': 'EUR', 'wb_code': 'ES'},
            'POL': {'name': 'Poland', 'coords': [19.1343, 51.9194], 'currency': 'PLN', 'wb_code': 'PL'},
            'NLD': {'name': 'Netherlands', 'coords': [5.2913, 52.1326], 'currency': 'EUR', 'wb_code': 'NL'},
            'BEL': {'name': 'Belgium', 'coords': [4.4699, 50.5039], 'currency': 'EUR', 'wb_code': 'BE'},
            'CHE': {'name': 'Switzerland', 'coords': [8.2275, 46.8182], 'currency': 'CHF', 'wb_code': 'CH'},
            'AUT': {'name': 'Austria', 'coords': [14.5501, 47.5162], 'currency': 'EUR', 'wb_code': 'AT'},
            'SWE': {'name': 'Sweden', 'coords': [18.6435, 60.1282], 'currency': 'SEK', 'wb_code': 'SE'},
            'NOR': {'name': 'Norway', 'coords': [8.4689, 60.4720], 'currency': 'NOK', 'wb_code': 'NO'},
            'DNK': {'name': 'Denmark', 'coords': [9.5018, 56.2639], 'currency': 'DKK', 'wb_code': 'DK'},
            'FIN': {'name': 'Finland', 'coords': [25.7482, 61.9241], 'currency': 'EUR', 'wb_code': 'FI'},
            'PRT': {'name': 'Portugal', 'coords': [-8.2245, 39.3999], 'currency': 'EUR', 'wb_code': 'PT'},
            'GRC': {'name': 'Greece', 'coords': [21.8243, 39.0742], 'currency': 'EUR', 'wb_code': 'GR'},
            'CZE': {'name': 'Czech Republic', 'coords': [15.4730, 49.8175], 'currency': 'CZK', 'wb_code': 'CZ'},
            'HUN': {'name': 'Hungary', 'coords': [19.5033, 47.1625], 'currency': 'HUF', 'wb_code': 'HU'},
            'ROU': {'name': 'Romania', 'coords': [24.9668, 45.9432], 'currency': 'RON', 'wb_code': 'RO'},
            'BGR': {'name': 'Bulgaria', 'coords': [25.4858, 42.7339], 'currency': 'BGN', 'wb_code': 'BG'},
            'HRV': {'name': 'Croatia', 'coords': [15.2, 45.1], 'currency': 'EUR', 'wb_code': 'HR'},
            'SVN': {'name': 'Slovenia', 'coords': [14.9955, 46.1512], 'currency': 'EUR', 'wb_code': 'SI'},
            'SVK': {'name': 'Slovakia', 'coords': [19.699, 48.669], 'currency': 'EUR', 'wb_code': 'SK'},
            'EST': {'name': 'Estonia', 'coords': [25.0136, 58.5953], 'currency': 'EUR', 'wb_code': 'EE'},
            'LVA': {'name': 'Latvia', 'coords': [24.6032, 56.8796], 'currency': 'EUR', 'wb_code': 'LV'},
            'LTU': {'name': 'Lithuania', 'coords': [23.8813, 55.1694], 'currency': 'EUR', 'wb_code': 'LT'},
            'IRL': {'name': 'Ireland', 'coords': [-8.2439, 53.4129], 'currency': 'EUR', 'wb_code': 'IE'},
            'ISL': {'name': 'Iceland', 'coords': [-19.0208, 64.9631], 'currency': 'ISK', 'wb_code': 'IS'},
            
            # Asia-Pacific
            'KOR': {'name': 'South Korea', 'coords': [127.7669, 35.9078], 'currency': 'KRW', 'wb_code': 'KR'},
            'AUS': {'name': 'Australia', 'coords': [133.7751, -25.2744], 'currency': 'AUD', 'wb_code': 'AU'},
            'NZL': {'name': 'New Zealand', 'coords': [174.8860, -40.9006], 'currency': 'NZD', 'wb_code': 'NZ'},
            'SGP': {'name': 'Singapore', 'coords': [103.8198, 1.3521], 'currency': 'SGD', 'wb_code': 'SG'},
            'MYS': {'name': 'Malaysia', 'coords': [101.9758, 4.2105], 'currency': 'MYR', 'wb_code': 'MY'},
            'THA': {'name': 'Thailand', 'coords': [100.9925, 15.8700], 'currency': 'THB', 'wb_code': 'TH'},
            'IDN': {'name': 'Indonesia', 'coords': [113.9213, -0.7893], 'currency': 'IDR', 'wb_code': 'ID'},
            'PHL': {'name': 'Philippines', 'coords': [121.7740, 12.8797], 'currency': 'PHP', 'wb_code': 'PH'},
            'VNM': {'name': 'Vietnam', 'coords': [108.2772, 14.0583], 'currency': 'VND', 'wb_code': 'VN'},
            'TWN': {'name': 'Taiwan', 'coords': [120.9605, 23.6978], 'currency': 'TWD', 'wb_code': 'TW'},
            'HKG': {'name': 'Hong Kong', 'coords': [114.1694, 22.3193], 'currency': 'HKD', 'wb_code': 'HK'},
            'PAK': {'name': 'Pakistan', 'coords': [69.3451, 30.3753], 'currency': 'PKR', 'wb_code': 'PK'},
            'BGD': {'name': 'Bangladesh', 'coords': [90.3563, 23.6850], 'currency': 'BDT', 'wb_code': 'BD'},
            'LKA': {'name': 'Sri Lanka', 'coords': [80.7718, 7.8731], 'currency': 'LKR', 'wb_code': 'LK'},
            'NPL': {'name': 'Nepal', 'coords': [84.1240, 28.3949], 'currency': 'NPR', 'wb_code': 'NP'},
            
            # Middle East
            'SAU': {'name': 'Saudi Arabia', 'coords': [45.0792, 23.8859], 'currency': 'SAR', 'wb_code': 'SA'},
            'ARE': {'name': 'United Arab Emirates', 'coords': [53.8478, 23.4241], 'currency': 'AED', 'wb_code': 'AE'},
            'ISR': {'name': 'Israel', 'coords': [34.8516, 32.4279], 'currency': 'ILS', 'wb_code': 'IL'},
            'TUR': {'name': 'Turkey', 'coords': [35.2433, 38.9637], 'currency': 'TRY', 'wb_code': 'TR'},
            'IRN': {'name': 'Iran', 'coords': [53.6880, 32.4279], 'currency': 'IRR', 'wb_code': 'IR'},
            'IRQ': {'name': 'Iraq', 'coords': [43.6793, 33.2232], 'currency': 'IQD', 'wb_code': 'IQ'},
            'KWT': {'name': 'Kuwait', 'coords': [47.4818, 29.3117], 'currency': 'KWD', 'wb_code': 'KW'},
            'QAT': {'name': 'Qatar', 'coords': [51.1839, 25.3548], 'currency': 'QAR', 'wb_code': 'QA'},
            'BHR': {'name': 'Bahrain', 'coords': [50.6344, 26.0667], 'currency': 'BHD', 'wb_code': 'BH'},
            'OMN': {'name': 'Oman', 'coords': [55.9754, 21.4735], 'currency': 'OMR', 'wb_code': 'OM'},
            'JOR': {'name': 'Jordan', 'coords': [36.2384, 30.5852], 'currency': 'JOD', 'wb_code': 'JO'},
            'LBN': {'name': 'Lebanon', 'coords': [35.8623, 33.8547], 'currency': 'LBP', 'wb_code': 'LB'},
            'SYR': {'name': 'Syria', 'coords': [38.9968, 34.8021], 'currency': 'SYP', 'wb_code': 'SY'},
            'YEM': {'name': 'Yemen', 'coords': [48.5164, 15.5527], 'currency': 'YER', 'wb_code': 'YE'},
            
            # Africa
            'ZAF': {'name': 'South Africa', 'coords': [22.9375, -30.5595], 'currency': 'ZAR', 'wb_code': 'ZA'},
            'NGA': {'name': 'Nigeria', 'coords': [8.6753, 9.0820], 'currency': 'NGN', 'wb_code': 'NG'},
            'EGY': {'name': 'Egypt', 'coords': [30.8025, 26.8206], 'currency': 'EGP', 'wb_code': 'EG'},
            'KEN': {'name': 'Kenya', 'coords': [37.9062, -0.0236], 'currency': 'KES', 'wb_code': 'KE'},
            'ETH': {'name': 'Ethiopia', 'coords': [40.4897, 9.1450], 'currency': 'ETB', 'wb_code': 'ET'},
            'GHA': {'name': 'Ghana', 'coords': [-1.0232, 7.9465], 'currency': 'GHS', 'wb_code': 'GH'},
            'MAR': {'name': 'Morocco', 'coords': [-7.0926, 31.7917], 'currency': 'MAD', 'wb_code': 'MA'},
            'TUN': {'name': 'Tunisia', 'coords': [9.5375, 33.8869], 'currency': 'TND', 'wb_code': 'TN'},
            'DZA': {'name': 'Algeria', 'coords': [1.6596, 28.0339], 'currency': 'DZD', 'wb_code': 'DZ'},
            'LBY': {'name': 'Libya', 'coords': [17.2283, 26.3351], 'currency': 'LYD', 'wb_code': 'LY'},
            'SEN': {'name': 'Senegal', 'coords': [-14.4524, 14.4974], 'currency': 'XOF', 'wb_code': 'SN'},
            'CMR': {'name': 'Cameroon', 'coords': [12.3547, 7.3697], 'currency': 'XAF', 'wb_code': 'CM'},
            'UGA': {'name': 'Uganda', 'coords': [32.2903, 1.3733], 'currency': 'UGX', 'wb_code': 'UG'},
            'TZA': {'name': 'Tanzania', 'coords': [34.8888, -6.3690], 'currency': 'TZS', 'wb_code': 'TZ'},
            'ZWE': {'name': 'Zimbabwe', 'coords': [29.1549, -19.0154], 'currency': 'ZWL', 'wb_code': 'ZW'},
            'ZMB': {'name': 'Zambia', 'coords': [27.8546, -13.1339], 'currency': 'ZMW', 'wb_code': 'ZM'},
            'BWA': {'name': 'Botswana', 'coords': [24.6849, -22.3285], 'currency': 'BWP', 'wb_code': 'BW'},
            'NAM': {'name': 'Namibia', 'coords': [18.4241, -22.9576], 'currency': 'NAD', 'wb_code': 'NA'},
            'MDG': {'name': 'Madagascar', 'coords': [46.8691, -18.7669], 'currency': 'MGA', 'wb_code': 'MG'},
            'MUS': {'name': 'Mauritius', 'coords': [57.5522, -20.3484], 'currency': 'MUR', 'wb_code': 'MU'},
            
            # Latin America
            'MEX': {'name': 'Mexico', 'coords': [-102.5528, 23.6345], 'currency': 'MXN', 'wb_code': 'MX'},
            'ARG': {'name': 'Argentina', 'coords': [-63.6167, -38.4161], 'currency': 'ARS', 'wb_code': 'AR'},
            'CHL': {'name': 'Chile', 'coords': [-71.5430, -35.6751], 'currency': 'CLP', 'wb_code': 'CL'},
            'COL': {'name': 'Colombia', 'coords': [-74.2973, 4.5709], 'currency': 'COP', 'wb_code': 'CO'},
            'PER': {'name': 'Peru', 'coords': [-75.0152, -9.1900], 'currency': 'PEN', 'wb_code': 'PE'},
            'VEN': {'name': 'Venezuela', 'coords': [-66.5897, 6.4238], 'currency': 'VES', 'wb_code': 'VE'},
            'ECU': {'name': 'Ecuador', 'coords': [-78.1834, -1.8312], 'currency': 'USD', 'wb_code': 'EC'},
            'URY': {'name': 'Uruguay', 'coords': [-55.7658, -32.5228], 'currency': 'UYU', 'wb_code': 'UY'},
            'PRY': {'name': 'Paraguay', 'coords': [-58.4438, -23.4425], 'currency': 'PYG', 'wb_code': 'PY'},
            'BOL': {'name': 'Bolivia', 'coords': [-63.5887, -16.2902], 'currency': 'BOB', 'wb_code': 'BO'},
            'CRI': {'name': 'Costa Rica', 'coords': [-83.7534, 9.7489], 'currency': 'CRC', 'wb_code': 'CR'},
            'PAN': {'name': 'Panama', 'coords': [-80.7821, 8.5380], 'currency': 'PAB', 'wb_code': 'PA'},
            'GTM': {'name': 'Guatemala', 'coords': [-90.2308, 15.7835], 'currency': 'GTQ', 'wb_code': 'GT'},
            'HND': {'name': 'Honduras', 'coords': [-86.2419, 15.2000], 'currency': 'HNL', 'wb_code': 'HN'},
            'SLV': {'name': 'El Salvador', 'coords': [-88.8965, 13.7942], 'currency': 'USD', 'wb_code': 'SV'},
            'NIC': {'name': 'Nicaragua', 'coords': [-85.2072, 12.8654], 'currency': 'NIO', 'wb_code': 'NI'},
            'CUB': {'name': 'Cuba', 'coords': [-77.7812, 21.5218], 'currency': 'CUP', 'wb_code': 'CU'},
            'DOM': {'name': 'Dominican Republic', 'coords': [-70.1627, 18.7357], 'currency': 'DOP', 'wb_code': 'DO'},
            'JAM': {'name': 'Jamaica', 'coords': [-77.2975, 18.1096], 'currency': 'JMD', 'wb_code': 'JM'},
            
            # Additional Countries
            'PRK': {'name': 'North Korea', 'coords': [127.5101, 40.3399], 'currency': 'KPW', 'wb_code': 'KP'},
            'AFG': {'name': 'Afghanistan', 'coords': [67.7090, 33.9391], 'currency': 'AFN', 'wb_code': 'AF'},
            'KAZ': {'name': 'Kazakhstan', 'coords': [66.9237, 48.0196], 'currency': 'KZT', 'wb_code': 'KZ'},
            'UZB': {'name': 'Uzbekistan', 'coords': [64.5853, 41.3775], 'currency': 'UZS', 'wb_code': 'UZ'},
            'UKR': {'name': 'Ukraine', 'coords': [31.1656, 48.3794], 'currency': 'UAH', 'wb_code': 'UA'},
            'BLR': {'name': 'Belarus', 'coords': [27.9534, 53.7098], 'currency': 'BYN', 'wb_code': 'BY'},
            'GEO': {'name': 'Georgia', 'coords': [43.3569, 42.3154], 'currency': 'GEL', 'wb_code': 'GE'},
            'ARM': {'name': 'Armenia', 'coords': [45.0382, 40.0691], 'currency': 'AMD', 'wb_code': 'AM'},
            'AZE': {'name': 'Azerbaijan', 'coords': [47.5769, 40.1431], 'currency': 'AZN', 'wb_code': 'AZ'},
        }
    
    def get_all_countries(self) -> List[Dict[str, Any]]:
        """Get list of all supported countries"""
        return [
            {
                'code': code,
                'name': data['name'],
                'coords': data['coords'],
                'currency': data['currency']
            }
            for code, data in self.countries.items()
        ]
    
    def get_country_info(self, country_code: str) -> Optional[Dict[str, Any]]:
        """Get information for a specific country"""
        return self.countries.get(country_code.upper())
    
    def search_countries(self, query: str) -> List[Dict[str, Any]]:
        """Search countries by name"""
        query_lower = query.lower()
        matches = []
        
        for code, data in self.countries.items():
            if (query_lower in data['name'].lower() or 
                query_lower in code.lower()):
                matches.append({
                    'code': code,
                    'name': data['name'],
                    'coords': data['coords']
                })
        
        return matches
    
    def get_wb_code(self, country_code: str) -> Optional[str]:
        """Get World Bank country code"""
        country_data = self.countries.get(country_code.upper())
        return country_data.get('wb_code') if country_data else None

# Global instance
country_service = CountryService()
