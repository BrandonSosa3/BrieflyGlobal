from sqlalchemy import Column, String, BigInteger, DECIMAL, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Country(Base):
    __tablename__ = "countries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    iso_code = Column(String(3), unique=True, nullable=False, index=True)
    iso_code_2 = Column(String(2), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    official_name = Column(String(255))
    capital = Column(String(255))
    region = Column(String(100))
    subregion = Column(String(100))
    population = Column(BigInteger)
    area_km2 = Column(DECIMAL(15, 2))
    gdp_usd = Column(BigInteger)
    currency_code = Column(String(3))
    timezone = Column(String(100))
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    flag_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
