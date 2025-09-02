# Normally, SQLAlchemy uses create_engine (synchronous). Here, you’re using the async version.
# It creates a connection pool for your database that works with async/await (asyncpg driver for PostgreSQL).
# This lets you write non-blocking code — the server can handle other requests while waiting for the database.
# AsyncSession: A special version of Session that works with async with and await.
# It’s what you use to talk to the database: querying, inserting, committing, etc.
# Example: async with AsyncSession(engine) as session: result = await session.execute(query)
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
# creates a baseclass that all my ORM models will inherit from 
from sqlalchemy.ext.declarative import declarative_base
# a factory that produces db sessions. Each session represents a temporary connection to the db. You do not want to create sessions manually everywhere
# instead we define how sessions should be built once, then call like a function
from sqlalchemy.orm import sessionmaker
# gives us access to database_url
from app.core.config import settings

# Convert postgresql:// to postgresql+asyncpg:// for async support
database_url = settings.database_url
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Create async engine
# core object that manages the db connection pool
engine = create_async_engine(
    database_url,
    echo=True,  # Logs every SQL query to the console for debugging
    future=True, # ensures compatability with SQLAlchemy 2.0+ style APIs
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)
# Every ORM model in your project (e.g., User, Country, News) should inherit from Base.
# This registers them so you can later run migrations or create all tables with Base.metadata.create_all()
Base = declarative_base()

# Dependency to get database session
# any endpoint that needs db access will use this method
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close() # after the request is done, this closes the session properly
