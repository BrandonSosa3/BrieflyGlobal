"""
Currency exchange rate service
"""
import httpx
from typing import Dict, Any
from datetime import datetime
from app.services.country_service import country_service

class CurrencyService:
    def __init__(self):
        # Using a free exchange rate API
        self.base_url = "https://api.exchangerate-api.com/v4"
    
    async def get_exchange_rates(self, country_code: str) -> Dict[str, Any]:
        """Get current exchange rates for country currency"""
        
        country_info = country_service.get_country_info(country_code)
        currency = country_info.get('currency', 'USD') if country_info else 'USD'
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/latest/{currency}",
                    timeout=15
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        'base_currency': currency,
                        'usd_rate': data['rates'].get('USD', 1.0),
                        'eur_rate': data['rates'].get('EUR', 1.0),
                        'last_updated': data.get('date'),
                        'rates': {
                            'USD': data['rates'].get('USD'),
                            'EUR': data['rates'].get('EUR'),
                            'GBP': data['rates'].get('GBP'),
                            'JPY': data['rates'].get('JPY'),
                            'CNY': data['rates'].get('CNY')
                        }
                    }
        
        except Exception as e:
            print(f"Currency API error for {country_code}: {e}")
            return {
                'base_currency': currency,
                'usd_rate': 1.0,
                'error': str(e)
            }

# Global instance
currency_service = CurrencyService()
