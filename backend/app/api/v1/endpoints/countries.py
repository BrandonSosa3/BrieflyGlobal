from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models.country import Country
from app.core.cache import cache_manager

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_countries(db: AsyncSession = Depends(get_db)):
    """Get list of all countries"""
    cache_key = "countries:all"
    cached_data = await cache_manager.get(cache_key)
    
    if cached_data:
        return cached_data
    
    result = await db.execute(select(Country))
    countries = result.scalars().all()
    
    countries_data = [
        {
            "iso_code": country.iso_code,
            "name": country.name,
            "capital": country.capital,
            "population": country.population,
            "gdp_usd": country.gdp_usd,
            "flag_url": country.flag_url,
        }
        for country in countries
    ]
    
    await cache_manager.set(cache_key, countries_data, expire=1800)  # 30 minutes
    return countries_data

@router.get("/{country_code}")
async def get_country(country_code: str, db: AsyncSession = Depends(get_db)):
    """Get detailed information for a specific country"""
    cache_key = f"country:{country_code}"
    cached_data = await cache_manager.get(cache_key)
    
    if cached_data:
        return cached_data
    
    result = await db.execute(
        select(Country).where(Country.iso_code == country_code.upper())
    )
    country = result.scalar_one_or_none()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    country_data = {
        "iso_code": country.iso_code,
        "name": country.name,
        "official_name": country.official_name,
        "capital": country.capital,
        "region": country.region,
        "subregion": country.subregion,
        "population": country.population,
        "area_km2": float(country.area_km2) if country.area_km2 else None,
        "gdp_usd": country.gdp_usd,
        "currency_code": country.currency_code,
        "timezone": country.timezone,
        "latitude": float(country.latitude) if country.latitude else None,
        "longitude": float(country.longitude) if country.longitude else None,
        "flag_url": country.flag_url,
    }
    
    await cache_manager.set(cache_key, country_data, expire=3600)  # 1 hour
    return country_data
