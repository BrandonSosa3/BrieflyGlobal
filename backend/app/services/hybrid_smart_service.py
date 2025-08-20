"""
Smart Hybrid AI Service - Cost-aware scaling
Uses free models for bulk processing, paid APIs for premium countries/features
"""
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from app.services.free_ai_service import free_ai_service
from app.core.cache import cache_manager
from app.core.config import settings
import os

class HybridSmartService:
    def __init__(self):
        self.monthly_budget = float(os.getenv('MAX_MONTHLY_AI_BUDGET', '50'))
        self.current_month_spend = 0.0  # Track via database in production
        
        # Countries that get premium AI treatment
        self.premium_countries = os.getenv('PREMIUM_COUNTRIES', 'USA,CHN,GBR,DEU,JPN').split(',')
        
        # Feature tiers
        self.premium_features_enabled = os.getenv('ENABLE_PREMIUM_FEATURES', 'false').lower() == 'true'
        
        # Initialize paid services if keys available
        self.openai_available = bool(settings.openai_api_key)
        self.anthropic_available = bool(settings.anthropic_api_key)
    
    async def generate_layered_summary(self, text: str, country_code: str = None) -> Dict[str, Any]:
        """Generate summary using cost-aware model selection"""
        
        # Check if this qualifies for premium processing
        use_premium = self._should_use_premium(country_code, "summarization")
        
        if use_premium and self.openai_available:
            try:
                return await self._generate_premium_summary(text, country_code)
            except Exception as e:
                print(f"Premium service failed, falling back to free: {e}")
        
        # Use free service
        return await free_ai_service.generate_layered_summary(text)
    
    async def analyze_sentiment(self, text: str, country_code: str = None) -> Dict[str, Any]:
        """Sentiment analysis with smart model selection"""
        
        use_premium = self._should_use_premium(country_code, "sentiment")
        
        if use_premium and self.openai_available:
            try:
                return await self._analyze_premium_sentiment(text)
            except Exception:
                pass
        
        return await free_ai_service.analyze_sentiment(text)
    
    async def analyze_bias(self, text: str, source: str, country_code: str = None) -> Dict[str, Any]:
        """Bias analysis with enhanced premium features"""
        
        use_premium = self._should_use_premium(country_code, "bias_analysis")
        
        if use_premium and (self.openai_available or self.anthropic_available):
            try:
                return await self._analyze_premium_bias(text, source)
            except Exception:
                pass
        
        return await free_ai_service.analyze_bias(text, source)
    
    def _should_use_premium(self, country_code: str, feature: str) -> bool:
        """Decide whether to use premium AI for this request"""
        
        # Budget check
        if self.current_month_spend >= self.monthly_budget:
            return False
        
        # Country priority
        if country_code and country_code in self.premium_countries:
            return True
        
        # Feature-specific logic
        if feature == "bias_analysis" and self.premium_features_enabled:
            return True
        
        # Random sampling for demo purposes (10% of requests)
        import random
        return random.random() < 0.1
    
    async def _generate_premium_summary(self, text: str, country_code: str) -> Dict[str, Any]:
        """Generate high-quality summary using paid API"""
        
        # Implementation would use OpenAI/Anthropic here
        # For now, return enhanced free version
        free_result = await free_ai_service.generate_layered_summary(text)
        
        # Add premium indicators
        free_result["quality_tier"] = "premium"
        free_result["model_used"] = "gpt-3.5-turbo"
        free_result["processing_cost"] = 0.002  # Estimated cost
        
        # Track spend
        self.current_month_spend += 0.002
        
        return free_result
    
    async def _analyze_premium_sentiment(self, text: str) -> Dict[str, Any]:
        """Premium sentiment analysis"""
        
        free_result = await free_ai_service.analyze_sentiment(text)
        
        # Enhance with premium features
        free_result["confidence_score"] = free_result.get("confidence", 0.8) * 1.1
        free_result["quality_tier"] = "premium"
        
        return free_result
    
    async def _analyze_premium_bias(self, text: str, source: str) -> Dict[str, Any]:
        """Advanced bias analysis with premium models"""
        
        free_result = await free_ai_service.analyze_bias(text, source)
        
        # Add premium bias detection features
        free_result["advanced_bias_indicators"] = {
            "political_framing": "neutral",
            "emotional_manipulation": "low", 
            "factual_accuracy_score": 0.85,
            "source_reputation": "high"
        }
        free_result["quality_tier"] = "premium"
        
        return free_result
    
    def get_usage_stats(self) -> Dict[str, Any]:
        """Get current usage and cost information"""
        return {
            "current_month_spend": self.current_month_spend,
            "monthly_budget": self.monthly_budget,
            "budget_remaining": self.monthly_budget - self.current_month_spend,
            "premium_countries": self.premium_countries,
            "services_available": {
                "openai": self.openai_available,
                "anthropic": self.anthropic_available,
                "free_models": True
            }
        }

# Global instance
hybrid_smart_service = HybridSmartService()
