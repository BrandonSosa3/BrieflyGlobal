from pydantic_settings import BaseSettings
from typing import Optional


# By inheriting from BaseSettings now any attributes inside can be overriden by environment vars instead of hardcoding them
class Settings(BaseSettings):
    # Database connection string
    database_url: str = "postgresql://worldmap_user:worldmap_pass@localhost:5432/worldmap_db"
    
    # Redis connection URL
    redis_url: str = "redis://localhost:6379"
    
    # Security
    secret_key: str = "your-super-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API Keys (Optional)
    news_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    huggingface_token: Optional[str] = None
    
    # External APIs
    world_bank_api_url: str = "https://api.worldbank.org/v2"
    news_api_url: str = "https://newsapi.org/v2"
    bbc_rss_url: str = "http://feeds.bbci.co.uk/news/rss.xml"
    
    # AI Configuration
    ai_provider: str = "free"
    use_free_models: bool = True
    use_premium_models: bool = False
    max_monthly_ai_budget: int = 50
    showcase_countries: str = "USA,CHN,GBR,DEU,JPN"
    
    # Model Settings
    openai_model_basic: str = "gpt-3.5-turbo"
    openai_model_premium: str = "gpt-4"
    anthropic_model: str = "claude-3-sonnet-20240229"
    
    # Performance Settings
    enable_aggressive_caching: bool = True
    cache_duration_hours: int = 24
    max_tokens_per_request: int = 2000
    
    # Feature Flags
    enable_real_time_analysis: bool = False
    enable_advanced_bias_detection: bool = False
    enable_multi_language_support: bool = False
    
    # tells pydantic to look for a .env in project root, anything in .env will override defaults above
    class Config:
        env_file = ".env"

# creates an instance of the class to be used in other files. this loads all settings into an object
# example: from config import settings
# print(settings.database_url)  prints from .env if set, else default
settings = Settings()
