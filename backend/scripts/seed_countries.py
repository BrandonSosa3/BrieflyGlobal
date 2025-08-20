"""
Seed script to populate the countries table with initial data
"""
import asyncio
import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.models.country import Country
from app.core.config import settings

# Sample country data
SAMPLE_COUNTRIES = [
    {
        "iso_code": "USA",
        "iso_code_2": "US",
        "name": "United States",
        "official_name": "United States of America",
        "capital": "Washington, D.C.",
        "region": "Americas",
        "subregion": "Northern America",
        "population": 331900000,
        "area_km2": 9833520,
        "gdp_usd": 23315080000000,
        "currency_code": "USD",
        "timezone": "UTC-5 to UTC-10",
        "latitude": 37.0902,
        "longitude": -95.7129,
        "flag_url": "https://flagcdn.com/w320/us.png"
    },
    {
        "iso_code": "GBR",
        "iso_code_2": "GB",
        "name": "United Kingdom",
        "official_name": "United Kingdom of Great Britain and Northern Ireland",
        "capital": "London",
        "region": "Europe",
        "subregion": "Northern Europe",
        "population": 67886000,
        "area_km2": 243610,
        "gdp_usd": 3131000000000,
        "currency_code": "GBP",
        "timezone": "UTC+0",
        "latitude": 55.3781,
        "longitude": -3.4360,
        "flag_url": "https://flagcdn.com/w320/gb.png"
    },
    {
        "iso_code": "JPN",
        "iso_code_2": "JP",
        "name": "Japan",
        "official_name": "Japan",
        "capital": "Tokyo",
        "region": "Asia",
        "subregion": "Eastern Asia",
        "population": 125800000,
        "area_km2": 377930,
        "gdp_usd": 4937000000000,
        "currency_code": "JPY",
        "timezone": "UTC+9",
        "latitude": 36.2048,
        "longitude": 138.2529,
        "flag_url": "https://flagcdn.com/w320/jp.png"
    },
    {
        "iso_code": "DEU",
        "iso_code_2": "DE",
        "name": "Germany",
        "official_name": "Federal Republic of Germany",
        "capital": "Berlin",
        "region": "Europe",
        "subregion": "Western Europe",
        "population": 83200000,
        "area_km2": 357022,
        "gdp_usd": 4220000000000,
        "currency_code": "EUR",
        "timezone": "UTC+1",
        "latitude": 51.1657,
        "longitude": 10.4515,
        "flag_url": "https://flagcdn.com/w320/de.png"
    },
    {
        "iso_code": "CHN",
        "iso_code_2": "CN",
        "name": "China",
        "official_name": "People's Republic of China",
        "capital": "Beijing",
        "region": "Asia",
        "subregion": "Eastern Asia",
        "population": 1439323776,
        "area_km2": 9596960,
        "gdp_usd": 14723000000000,
        "currency_code": "CNY",
        "timezone": "UTC+8",
        "latitude": 35.8617,
        "longitude": 104.1954,
        "flag_url": "https://flagcdn.com/w320/cn.png"
    }
]

async def seed_countries():
    """Seed the countries table with initial data"""
    engine = create_async_engine(settings.database_url)
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as session:
        try:
            # Check if countries already exist
            result = await session.execute(text("SELECT COUNT(*) FROM countries"))
            count = result.scalar()
            
            if count > 0:
                print(f"Countries table already has {count} entries. Skipping seed.")
                return
            
            # Add sample countries
            for country_data in SAMPLE_COUNTRIES:
                country = Country(**country_data)
                session.add(country)
            
            await session.commit()
            print(f"✅ Successfully seeded {len(SAMPLE_COUNTRIES)} countries")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error seeding countries: {e}")
            raise
        finally:
            await session.close()
            await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_countries())
