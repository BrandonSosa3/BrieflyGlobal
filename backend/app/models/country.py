# each attribute in the Country class and table is a Column
# the rest are Data types for the columns, which map to Postgres types under the hood
from sqlalchemy import Column, String, BigInteger, DECIMAL, DateTime, Text
# Using UUID(as_uuid=True) in the column definition allows SQLAlchemy to map the DB UUID to a Python uuid.UUID object automatically.
from sqlalchemy.dialects.postgresql import UUID
# func is a generic way to call SQL functions in SQLAlchemy.
# func.now() → generates NOW() in SQL. This ensures timestamps are created/updated inside the database, not in Python. 
# That’s more reliable and avoids timezone issues.
from sqlalchemy.sql import func
# Used to generate new UUIDs in Python: uuid.uuid4().
# Each time a new Country object is created, if no id is provided, this function generates a globally unique identifier.
# Works in combination with the UUID SQL type.
import uuid
# Base comes from declarative_base() in your database.py.
# Every ORM model must inherit from Base so SQLAlchemy knows it is a table and can manage it.
# It also gives you Base.metadata to later create tables or run migrations:
from app.core.database import Base

# creates the table called "countries" in the db
class Country(Base):
    __tablename__ = "countries"
    
    # each line is a db column
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
