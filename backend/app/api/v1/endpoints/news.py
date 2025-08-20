from fastapi import APIRouter, HTTPException
import httpx
from app.core.config import settings
from app.services.hybrid_ai_service import hybrid_ai_service
from app.services.worldbank_service import worldbank_service
from app.services.currency_service import currency_service
from typing import List, Dict, Any
import asyncio

router = APIRouter()

@router.get("/test")
async def test_news():
    """Simple test endpoint"""
    if not settings.news_api_key:
        return {"error": "NewsAPI key not configured"}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    'q': 'United States',
                    'sortBy': 'publishedAt',
                    'language': 'en',
                    'pageSize': 1,
                    'apiKey': settings.news_api_key
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                
                if articles:
                    article = articles[0]
                    return {
                        "success": True,
                        "article": {
                            "title": article['title'],
                            "source": article['source']['name'],
                            "published_at": article['publishedAt'],
                            "url": article['url']
                        }
                    }
            
            return {"error": "No articles found"}
                
    except Exception as e:
        return {"error": f"Failed to fetch news: {str(e)}"}

@router.get("/{country_code}")
async def get_country_intelligence(country_code: str):
    """Get comprehensive country intelligence: news + economic data + metrics"""
    
    # Country name mapping
    country_names = {
        'USA': 'United States',
        'GBR': 'United Kingdom', 
        'JPN': 'Japan',
        'DEU': 'Germany',
        'CHN': 'China'
    }
    
    country_name = country_names.get(country_code.upper())
    if not country_name:
        raise HTTPException(status_code=404, detail=f"Country {country_code} not supported yet")
    
    if not settings.news_api_key:
        raise HTTPException(status_code=500, detail="NewsAPI not configured")
    
    try:
        # Run all data fetching in parallel for speed
        news_task = fetch_news_data(country_name, country_code, settings.news_api_key)
        economic_task = worldbank_service.get_country_indicators(country_code.upper())
        country_info_task = worldbank_service.get_basic_country_info(country_code.upper())
        currency_task = currency_service.get_exchange_rates(country_code.upper())
        
        # Wait for all tasks to complete
        news_data, economic_data, country_info, currency_data = await asyncio.gather(
            news_task, economic_task, country_info_task, currency_task,
            return_exceptions=True
        )
        
        # Handle any exceptions
        if isinstance(news_data, Exception):
            news_data = {"articles": [], "message": f"News fetch failed: {str(news_data)}"}
        if isinstance(economic_data, Exception):
            economic_data = {}
        if isinstance(country_info, Exception):
            country_info = {}
        if isinstance(currency_data, Exception):
            currency_data = {}
        
        return {
            "country": country_name,
            "country_code": country_code.upper(),
            "articles": news_data.get("articles", []),
            "total_articles": len(news_data.get("articles", [])),
            "economic_indicators": economic_data,
            "country_info": country_info,
            "currency_data": currency_data,
            "last_updated": "2025-08-18T04:00:00Z"  # Current timestamp
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch country data: {str(e)}")

async def fetch_news_data(country_name: str, country_code: str, api_key: str) -> Dict[str, Any]:
    """Fetch and process news data"""
    
    try:
        # Fetch news from NewsAPI
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    'q': country_name,
                    'sortBy': 'publishedAt',
                    'language': 'en',
                    'pageSize': 3,
                    'apiKey': api_key
                }
            )
            
            if response.status_code != 200:
                return {"articles": [], "message": f"NewsAPI error: {response.status_code}"}
            
            data = response.json()
            articles = data.get('articles', [])
            
            if not articles:
                return {"articles": [], "message": "No recent news found"}
            
            # Process articles with AI
            processed_articles = []
            
            for article in articles[:3]:
                if article.get('content') and article['content'] != '[Removed]':
                    
                    content = article['content'] or article.get('description', '')
                    
                    if len(content) > 50:
                        
                        # Generate AI analysis
                        ai_summary = await hybrid_ai_service.generate_layered_summary(content)
                        sentiment = await hybrid_ai_service.analyze_sentiment(content)
                        bias_analysis = await hybrid_ai_service.analyze_bias(content, article['source']['name'])
                        
                        processed_article = {
                            "title": article['title'],
                            "source": article['source']['name'],
                            "published_at": article['publishedAt'],
                            "url": article['url'],
                            "description": article.get('description', ''),
                            "ai_analysis": {
                                "summary_tweet": ai_summary.get('tweet', ''),
                                "summary_bullets": ai_summary.get('bullets', []),
                                "sentiment": {
                                    "label": sentiment.get('label', 'neutral'),
                                    "score": sentiment.get('compound', 0)
                                },
                                "bias": {
                                    "label": bias_analysis.get('bias_label', 'neutral'),
                                    "credibility": bias_analysis.get('credibility_score', 0.5)
                                }
                            }
                        }
                        
                        processed_articles.append(processed_article)
            
            return {"articles": processed_articles}
            
    except Exception as e:
        return {"articles": [], "message": f"News processing failed: {str(e)}"}
