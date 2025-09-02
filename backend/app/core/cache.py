'''Redis: It’s an in-memory data store (all data is kept in RAM, not on disk) that can be used as:
A cache (to make apps faster by storing frequently used data).
A database (for small, fast key-value lookups).
A message broker / queue (for background tasks, pub/sub messaging).
It’s super fast because RAM is much faster than disk-based storage.'''
# The async Redis client library. Lets you talk to a Redis server without blocking
import redis.asyncio as redis
# used to store python objects as strings in Redis, since it only works with binary and text
import json
#
from typing import Any, Optional
# holds app configuration, in this case our Redis connection URL
from app.core.config import settings

class CacheManager:
    def __init__(self):
        # means no connection until you actually need one
        self.redis_client = None
    
    async def connect(self):
        # creates redis client using configured URL
        self.redis_client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True # tells redis to return strings instead of raw bytes
        )
    # cleanly closes redis connection if it exists
    async def disconnect(self):
        if self.redis_client:
            await self.redis_client.close()

    # get from cache
    '''You stored {"name": "USA", "population": 331000000}.
        In Redis, it’s stored as a JSON string
        '{"name": "USA", "population": 331000000}'
        When you call get("country:US") → it turns back into a Python dict.'''
    async def get(self, key: str) -> Optional[Any]:
        if not self.redis_client:   # if no client yet auto-connect
            await self.connect()
        
        data = await self.redis_client.get(key)   # fetches value for key from redis dict
        if data:
            return json.loads(data)  # if found, converts it back to python object
        return None
    

    # Sets data in cache
    # so in countries.py: await cache_manager.set(cache_key, countries_data, expire=1800)
    # means "cache this list of countries for 30 minutes, then auto-delete it.”
    async def set(self, key: str, value: Any, expire: int = 3600):
        if not self.redis_client:
            await self.connect()
        
        await self.redis_client.set(
            key, 
            json.dumps(value, default=str), 
            ex=expire
        )
    
    # delete from cache
    # Lets you manually invalidate cache for a given key.
    # Example: if you update a country’s data in the DB, you could call cache_manager.delete("country:US") so the next request reloads fresh data.
    async def delete(self, key: str):
        if not self.redis_client:
            await self.connect()
        
        await self.redis_client.delete(key)

# creates global instance of cache manager
# this is what you import and use everywhere (from app.core.cache import cache_manager).
cache_manager = CacheManager()
