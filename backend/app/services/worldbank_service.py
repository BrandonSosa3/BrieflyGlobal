"""
World Bank API integration for economic indicators
"""
import httpx
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime
from app.services.country_service import country_service

class WorldBankService:
    def __init__(self):
        self.base_url = "https://api.worldbank.org/v2"
    
    async def get_country_indicators(self, country_code: str) -> Dict[str, Any]:
        """Get key economic indicators for a country"""
        
        wb_code = country_service.get_wb_code(country_code)
        if not wb_code:
            return {}
        
        # Key indicators we want to fetch
        indicators = {
            'GDP': 'NY.GDP.MKTP.CD',  # GDP (current US$)
            'GDP_PER_CAPITA': 'NY.GDP.PCAP.CD',  # GDP per capita
            'INFLATION': 'FP.CPI.TOTL.ZG',  # Inflation rate
            'UNEMPLOYMENT': 'SL.UEM.TOTL.ZS',  # Unemployment rate
            'POPULATION': 'SP.POP.TOTL',  # Total population
            'INTERNET_USERS': 'IT.NET.USER.ZS',  # Internet users (% of population)
            'LIFE_EXPECTANCY': 'SP.DYN.LE00.IN',  # Life expectancy
            'TRADE_BALANCE': 'NE.RSB.GNFS.CD'  # Trade balance
        }
        
        results = {}
        
        try:
            async with httpx.AsyncClient() as client:
                # Fetch each indicator
                for name, indicator_code in indicators.items():
                    try:
                        response = await client.get(
                            f"{self.base_url}/country/{wb_code}/indicator/{indicator_code}",
                            params={
                                'format': 'json',
                                'date': '2020:2023',  # Expand date range for better coverage
                                'per_page': '10'
                            },
                            timeout=15
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            if len(data) > 1 and data[1]:  # World Bank returns [metadata, data]
                                # Get most recent non-null value
                                for entry in data[1]:
                                    if entry['value'] is not None:
                                        results[name] = {
                                            'value': entry['value'],
                                            'year': entry['date'],
                                            'indicator': indicator_code
                                        }
                                        break
                        
                    except Exception as e:
                        print(f"Error fetching {name} for {country_code}: {e}")
                        continue
            
            return results
            
        except Exception as e:
            print(f"World Bank API error for {country_code}: {e}")
            return {}
    
    async def get_basic_country_info(self, country_code: str) -> Dict[str, Any]:
        """Get basic country information"""
        
        wb_code = country_service.get_wb_code(country_code)
        if not wb_code:
            return {}
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/country/{wb_code}",
                    params={'format': 'json'},
                    timeout=15
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if len(data) > 1 and data[1]:
                        country_info = data[1][0]
                        return {
                            'name': country_info.get('name'),
                            'capital': country_info.get('capitalCity'),
                            'region': country_info.get('region', {}).get('value'),
                            'income_level': country_info.get('incomeLevel', {}).get('value'),
                            'lending_type': country_info.get('lendingType', {}).get('value'),
                            'longitude': country_info.get('longitude'),
                            'latitude': country_info.get('latitude')
                        }
        
        except Exception as e:
            print(f"Country info error for {country_code}: {e}")
            return {}

# Global instance
worldbank_service = WorldBankService()
