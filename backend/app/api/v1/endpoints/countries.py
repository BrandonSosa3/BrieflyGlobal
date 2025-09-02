# APIRouter lets use have a group of related endpoints instead of putting them all in main.py
# Depends allows Fastapi to manage DB connections for us so we dont do it manually
# HTTPException is how we catch errors and return responses in fastapi
from fastapi import APIRouter, Depends, HTTPException
''' SQLAlchemy is a Python library for working with databases.
It provides two main things:
SQL Toolkit (Core)
Lets you write SQL queries in Python without writing raw SQL strings.
Example: instead of writing "SELECT * FROM users WHERE id=1", you can build that query using Python objects.
ORM (Object Relational Mapper)
Maps Python classes ↔ database tables.
Lets you work with Python objects instead of raw SQL rows.
Example: You define a User class in Python → SQLAlchemy creates and queries the users table in your database.'''
# allows server to handle other requests while waiting for DB responses
from sqlalchemy.ext.asyncio import AsyncSession
# SQLalchemy ORM query builder. 
# select(Country) is equivalent to SELECT * FROM country in SQL.
from sqlalchemy import select
# used for type hints, @router.get("/", response_model=List[dict]) tells Fastapi that this route returns a list of dictionaries.
from typing import List

from app.core.database import get_db
from app.models.country import Country
from app.core.cache import cache_manager # gives caching capabilities, Used here to store country data so you don’t hammer the DB with the same query repeatedly.

# mini router for this file, plugged into main.py API later
router = APIRouter()


# This route gives you a list of all countries (basic info only), cached for performance.
# /api/v1/countries/ -> list of all countries
@router.get("/", response_model=List[dict])
async def get_countries(db: AsyncSession = Depends(get_db)):
    #Get list of all countries
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

# This route gives you detailed info about one specific country.
# /api/v1/countries/US -> details for US
@router.get("/{country_code}")
async def get_country(country_code: str, db: AsyncSession = Depends(get_db)):
    #Get detailed information for a specific country
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
