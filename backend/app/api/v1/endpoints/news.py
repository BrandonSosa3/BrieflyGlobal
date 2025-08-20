from fastapi import APIRouter, HTTPException, Query
import httpx
from app.core.config import settings
from app.services.hybrid_ai_service import hybrid_ai_service
from app.services.worldbank_service import worldbank_service
from app.services.currency_service import currency_service
from app.services.country_service import country_service
from typing import List, Dict, Any, Optional
import asyncio
import logging
from datetime import datetime

# Set up logging
logger = logging.getLogger(__name__)

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

@router.get("/countries")
async def get_all_countries():
    """Get list of all supported countries with coordinates"""
    try:
        countries = country_service.get_all_countries()
        return {
            "countries": countries,
            "total": len(countries),
            "message": f"Successfully retrieved {len(countries)} countries"
        }
    except Exception as e:
        logger.error(f"Error fetching countries: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve countries list"
        )

@router.get("/countries/search")
async def search_countries(q: str = Query(..., min_length=1, description="Search query")):
    """Search countries by name or code"""
    try:
        matches = country_service.search_countries(q)
        return {
            "matches": matches,
            "total": len(matches),
            "query": q
        }
    except Exception as e:
        logger.error(f"Error searching countries: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to search countries"
        )

@router.get("/status")
async def get_api_status():
    """Check API status and data availability"""
    try:
        total_countries = len(country_service.get_all_countries())
        
        # Test key services
        services_status = {
            "countries": True,
            "news_api": bool(settings.news_api_key),
            "world_bank": True,  # Assume available since it's free
            "currency_api": True  # Assume available since it's free
        }
        
        return {
            "status": "operational",
            "total_countries": total_countries,
            "services": services_status,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"API status check failed: {e}")
        return {
            "status": "degraded",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@router.get("/{country_code}")
async def get_country_intelligence(country_code: str):
    """Get comprehensive country intelligence including news, economic data, and currency info"""
    try:
        # Validate country code using the comprehensive country service
        country_info = country_service.get_country_info(country_code)
        if not country_info:
            # Try to find similar countries for helpful error message
            similar_countries = country_service.search_countries(country_code)
            similar_msg = ""
            if similar_countries:
                similar_codes = [c['code'] for c in similar_countries[:3]]
                similar_msg = f" Did you mean: {', '.join(similar_codes)}?"
            
            raise HTTPException(
                status_code=404,
                detail=f"Country '{country_code}' not found. Use /countries endpoint to see available countries.{similar_msg}"
            )
        
        logger.info(f"Fetching intelligence for {country_info['name']} ({country_code})")
        
        # Initialize response structure
        response_data = {
            "country": country_info['name'],
            "country_code": country_code.upper(),
            "country_info": country_info,
            "articles": [],
            "total_articles": 0,
            "economic_indicators": None,
            "currency_data": None,
            "last_updated": datetime.now().isoformat(),
            "data_availability": {
                "news": False,
                "economic": False,
                "currency": False
            }
        }
        
        # Fetch data sequentially with better error handling (instead of asyncio.gather)
        logger.info("📊 Fetching economic data...")
        try:
            economic_data = await fetch_economic_data(country_code.upper())
            if economic_data:
                response_data["economic_indicators"] = economic_data
                response_data["data_availability"]["economic"] = True
                logger.info(f"✅ Economic data: {len(economic_data)} indicators")
            else:
                logger.warning("⚠️ No economic data available")
        except Exception as e:
            logger.error(f"❌ Economic data failed: {e}")
        
        logger.info("💰 Fetching currency data...")
        try:
            # Pass the country_code to fetch_currency_data, not the currency
            currency_data = await fetch_currency_data(country_code.upper())
            if currency_data and 'error' not in currency_data:
                response_data["currency_data"] = currency_data
                response_data["data_availability"]["currency"] = True
                logger.info(f"✅ Currency data: {currency_data.get('base_currency')}")
            else:
                logger.warning(f"⚠️ Currency data issue: {currency_data.get('error', 'Unknown error') if currency_data else 'No data'}")
        except Exception as e:
            logger.error(f"❌ Currency data failed: {e}")
        
        # Check if NewsAPI is configured before fetching news
        if not settings.news_api_key:
            logger.warning("NewsAPI key not configured")
            response_data['news_message'] = "News data unavailable - API key not configured"
        else:
            logger.info("📰 Fetching news data...")
            try:
                news_data = await fetch_news_data(country_info['name'], country_code, settings.news_api_key)
                if news_data and news_data.get("articles"):
                    response_data["articles"] = news_data["articles"]
                    response_data["total_articles"] = len(news_data["articles"])
                    response_data["data_availability"]["news"] = True
                    logger.info(f"✅ News data: {len(news_data['articles'])} articles")
                else:
                    logger.warning(f"⚠️ No news articles: {news_data.get('message', 'Unknown issue') if news_data else 'No data'}")
                    if news_data and news_data.get("message"):
                        response_data['news_message'] = news_data['message']
            except Exception as e:
                logger.error(f"❌ News data failed: {e}")
        
        # Add helpful message about data availability
        available_data_types = [k for k, v in response_data['data_availability'].items() if v]
        if not available_data_types:
            response_data['message'] = f"Country information available for {country_info['name']}, but no recent news, economic, or currency data found. This may be due to limited data coverage, API restrictions, or the country's international profile."
        else:
            response_data['message'] = f"Successfully retrieved {', '.join(available_data_types)} data for {country_info['name']}"
        
        logger.info(f"🎉 Completed intelligence fetch for {country_code}: {', '.join(available_data_types)} available")
        return response_data
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error fetching intelligence for {country_code}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch country intelligence for {country_code}"
        )

async def fetch_news_data(country_name: str, country_code: str, api_key: str) -> Dict[str, Any]:
    """Fetch and process news data with enhanced error handling"""
    
    try:
        # Try different search terms for better coverage
        search_terms = [
            country_name,
            f'"{country_name}"',  # Exact match
        ]
        
        # Add alternative country names for better search results
        country_aliases = {
            'United States': ['USA', 'America', 'US'],
            'United Kingdom': ['UK', 'Britain', 'England'],
            'South Korea': ['Korea'],
            'North Korea': ['DPRK'],
            'Czech Republic': ['Czechia'],
            'United Arab Emirates': ['UAE'],
            'Saudi Arabia': ['KSA']
        }
        
        if country_name in country_aliases:
            search_terms.extend(country_aliases[country_name])
        
        best_articles = []
        
        # Try each search term until we get good results
        for search_term in search_terms:
            if len(best_articles) >= 3:  # We have enough articles
                break
                
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.get(
                        "https://newsapi.org/v2/everything",
                        params={
                            'q': search_term,
                            'sortBy': 'publishedAt',
                            'language': 'en',
                            'pageSize': 5,  # Get more to filter better ones
                            'apiKey': api_key,
                            'from': (datetime.now().replace(day=1)).strftime('%Y-%m-%d'),  # Last month
                        }
                    )
                    
                    if response.status_code == 429:  # Rate limited
                        logger.warning(f"NewsAPI rate limited for {country_name}")
                        return {"articles": [], "message": "News API rate limited - try again later"}
                    
                    if response.status_code != 200:
                        logger.warning(f"NewsAPI error {response.status_code} for {search_term}")
                        continue
                    
                    data = response.json()
                    articles = data.get('articles', [])
                    
                    if not articles:
                        continue
                    
                    # Filter and process articles
                    for article in articles:
                        if len(best_articles) >= 3:
                            break
                            
                        # Skip articles without content
                        if (not article.get('content') or 
                            article['content'] in ['[Removed]', None] or
                            len(article.get('content', '')) < 100):
                            continue
                        
                        # Skip articles that don't seem relevant
                        title_lower = article.get('title', '').lower()
                        desc_lower = article.get('description', '').lower()
                        
                        # Check if article is actually about the country
                        country_mentioned = (
                            country_name.lower() in title_lower or
                            country_name.lower() in desc_lower or
                            any(alias.lower() in title_lower or alias.lower() in desc_lower 
                                for alias in country_aliases.get(country_name, []))
                        )
                        
                        if not country_mentioned:
                            continue
                        
                        best_articles.append(article)
                        
            except httpx.TimeoutException:
                logger.warning(f"Timeout fetching news for {search_term}")
                continue
            except Exception as e:
                logger.error(f"Error fetching news for {search_term}: {e}")
                continue
        
        if not best_articles:
            return {
                "articles": [], 
                "message": f"No recent news found for {country_name}. This could be due to limited English-language coverage or recent API restrictions."
            }
        
        # Process articles with AI
        processed_articles = []
        
        for article in best_articles:
            try:
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
                    
            except Exception as e:
                logger.error(f"Error processing article for {country_name}: {e}")
                continue
        
        return {"articles": processed_articles}
        
    except Exception as e:
        logger.error(f"News processing failed for {country_name}: {e}")
        return {"articles": [], "message": f"News processing failed: {str(e)}"}

async def fetch_economic_data(country_code: str) -> Optional[Dict[str, Any]]:
    """Fetch economic data with error handling"""
    try:
        logger.info(f"Fetching economic data for {country_code}")
        
        # The worldbank_service.get_country_indicators expects the 3-letter country code (FRA)
        # not the 2-letter World Bank code (FR)
        economic_data = await worldbank_service.get_country_indicators(country_code)
        
        if economic_data and len(economic_data) > 0:
            logger.info(f"Successfully fetched {len(economic_data)} economic indicators")
            return economic_data
        else:
            logger.warning(f"No economic data returned for {country_code}")
            return None
            
    except Exception as e:
        logger.error(f"Economic data fetch failed for {country_code}: {e}")
        return None

async def fetch_currency_data(country_code: str) -> Optional[Dict[str, Any]]:
    """Fetch currency data with error handling"""
    try:
        # Use country_code instead of currency_code since currency_service expects country_code
        currency_data = await currency_service.get_exchange_rates(country_code)
        
        # Check if there's an error in the response
        if currency_data and 'error' not in currency_data:
            return currency_data
        elif currency_data and 'error' in currency_data:
            logger.warning(f"Currency service returned error for {country_code}: {currency_data['error']}")
            return None
        else:
            logger.warning(f"No currency data returned for {country_code}")
            return None
            
    except Exception as e:
        logger.error(f"Currency data fetch failed for {country_code}: {e}")
        return None
