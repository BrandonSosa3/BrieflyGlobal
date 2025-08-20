"""
Create database tables
"""
import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine
from app.core.database import Base
from app.core.config import settings
from app.models.country import Country  # Import to register the model

async def create_tables():
    """Create all tables"""
    engine = create_async_engine(settings.database_url)
    
    async with engine.begin() as conn:
        # Drop all tables (for clean start)
        await conn.run_sync(Base.metadata.drop_all)
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    print("✅ Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())
