#!/usr/bin/env python3
"""
Debug script for your current services
Save this as debug_services.py in your backend/ directory and run it
"""

import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

async def test_current_services():
    print("🔍 Testing your current services with France (FRA)...")
    
    try:
        # Test country service first
        from app.services.country_service import country_service
        print("\n1️⃣ Testing Country Service...")
        
        france_info = country_service.get_country_info('FRA')
        print(f"France info: {france_info}")
        
        wb_code = country_service.get_wb_code('FRA')
        print(f"World Bank code for FRA: {wb_code}")
        
    except Exception as e:
        print(f"❌ Country service error: {e}")
        return
    
    try:
        # Test WorldBank service
        from app.services.worldbank_service import worldbank_service
        print("\n2️⃣ Testing WorldBank Service...")
        
        wb_result = await worldbank_service.get_country_indicators('FRA')
        print(f"WorldBank result keys: {list(wb_result.keys()) if wb_result else 'None'}")
        
        if wb_result:
            print(f"WorldBank data count: {len(wb_result)}")
            for key, value in list(wb_result.items())[:3]:  # Show first 3
                print(f"  {key}: {value}")
        
        # Test country info
        country_info = await worldbank_service.get_basic_country_info('FRA')
        print(f"Country info: {country_info}")
        
    except Exception as e:
        print(f"❌ WorldBank service error: {e}")
    
    try:
        # Test Currency service
        from app.services.currency_service import currency_service
        print("\n3️⃣ Testing Currency Service...")
        
        currency_result = await currency_service.get_exchange_rates('FRA')
        print(f"Currency result keys: {list(currency_result.keys()) if currency_result else 'None'}")
        
        if currency_result:
            print(f"Base currency: {currency_result.get('base_currency')}")
            print(f"USD rate: {currency_result.get('usd_rate')}")
            print(f"Error: {currency_result.get('error', 'No error')}")
        
    except Exception as e:
        print(f"❌ Currency service error: {e}")
    
    # Test APIs directly
    print("\n4️⃣ Testing APIs directly...")
    
    import httpx
    
    # Test World Bank API directly
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                'https://api.worldbank.org/v2/country/FR/indicator/NY.GDP.MKTP.CD?format=json&date=2023&per_page=5',
                timeout=15
            )
            print(f"WorldBank API direct test: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"WorldBank response structure: {len(data)} items")
                if len(data) > 1 and data[1]:
                    print(f"Data points: {len(data[1])}")
                    if data[1]:
                        sample = data[1][0]
                        print(f"Sample data: value={sample.get('value')}, date={sample.get('date')}")
    except Exception as e:
        print(f"❌ WorldBank direct API error: {e}")
    
    # Test Currency API directly
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                'https://api.exchangerate-api.com/v4/latest/EUR',
                timeout=15
            )
            print(f"Currency API direct test: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Currency response keys: {list(data.keys())}")
                print(f"Sample rates: USD={data.get('rates', {}).get('USD')}, GBP={data.get('rates', {}).get('GBP')}")
    except Exception as e:
        print(f"❌ Currency direct API error: {e}")

if __name__ == "__main__":
    asyncio.run(test_current_services())