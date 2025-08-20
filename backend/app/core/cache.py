import redis.asyncio as redis
import json
from typing import Any, Optional
from app.core.config import settings

class CacheManager:
    def __init__(self):
        self.redis_client = None
    
    async def connect(self):
        self.redis_client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True
        )
    
    async def disconnect(self):
        if self.redis_client:
            await self.redis_client.close()
    
    async def get(self, key: str) -> Optional[Any]:
        if not self.redis_client:
            await self.connect()
        
        data = await self.redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    
    async def set(self, key: str, value: Any, expire: int = 3600):
        if not self.redis_client:
            await self.connect()
        
        await self.redis_client.set(
            key, 
            json.dumps(value, default=str), 
            ex=expire
        )
    
    async def delete(self, key: str):
        if not self.redis_client:
            await self.connect()
        
        await self.redis_client.delete(key)

cache_manager = CacheManager()
