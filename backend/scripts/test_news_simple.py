"""
Simple test: Can we fetch one news article?
"""
import asyncio
import httpx
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now we can import our app modules
from app.core.config import settings

async def test_fetch_one_article():
    """Test fetching one news article from NewsAPI"""
    
    print("🧪 Testing: Can we fetch one news article?")
    
    # Check if we have NewsAPI key
    if not settings.news_api_key:
        print("❌ No NewsAPI key found in settings")
        print(f"🔍 Available settings: {dir(settings)}")
        return False
    
    print(f"✅ NewsAPI key found: {settings.news_api_key[:10]}...")
    
    try:
        # Make a simple request for US news
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    'q': 'United States',
                    'sortBy': 'publishedAt',
                    'language': 'en',
                    'pageSize': 1,  # Just get one article
                    'apiKey': settings.news_api_key
                }
            )
            
            print(f"📡 API Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                
                if articles:
                    article = articles[0]
                    print(f"✅ Got article: '{article['title'][:50]}...'")
                    print(f"📰 Source: {article['source']['name']}")
                    print(f"📅 Published: {article['publishedAt']}")
                    return True
                else:
                    print("❌ No articles found")
                    return False
            else:
                print(f"❌ API Error: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_fetch_one_article())
    if success:
        print("\n🎉 SUCCESS: News fetching works!")
    else:
        print("\n💥 FAILED: Need to fix news fetching first")
