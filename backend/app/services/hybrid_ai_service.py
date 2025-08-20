"""
Simple AI service that works with our current setup
"""
import asyncio
from typing import Dict, List, Any
import random

class SimpleAIService:
    def __init__(self):
        self.available = True
    
    async def generate_layered_summary(self, text: str) -> Dict[str, Any]:
        """Generate a simple summary"""
        # For now, just truncate the text to create a summary
        words = text.split()
        
        # Create tweet-length summary (first 10 words)
        tweet = ' '.join(words[:10]) + '...' if len(words) > 10 else text
        
        # Create bullet points (split into 2-3 parts)
        bullets = []
        chunk_size = len(words) // 3
        if chunk_size > 0:
            bullets = [
                f"• {' '.join(words[0:chunk_size])}...",
                f"• {' '.join(words[chunk_size:chunk_size*2])}...",
                f"• {' '.join(words[chunk_size*2:chunk_size*3])}..."
            ]
        else:
            bullets = [f"• {text}"]
        
        return {
            "tweet": tweet,
            "bullets": bullets[:3],  # Limit to 3 bullets
            "brief": text[:200] + "..." if len(text) > 200 else text
        }
    
    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Simple sentiment analysis"""
        # Simple keyword-based sentiment
        positive_words = ['good', 'great', 'excellent', 'positive', 'success', 'growth', 'up', 'rise']
        negative_words = ['bad', 'terrible', 'negative', 'crisis', 'down', 'fall', 'decline', 'problem']
        
        text_lower = text.lower()
        pos_count = sum(1 for word in positive_words if word in text_lower)
        neg_count = sum(1 for word in negative_words if word in text_lower)
        
        if pos_count > neg_count:
            label = 'positive'
            score = 0.6 + (pos_count * 0.1)
        elif neg_count > pos_count:
            label = 'negative' 
            score = -(0.6 + (neg_count * 0.1))
        else:
            label = 'neutral'
            score = 0.0
        
        return {
            "label": label,
            "compound": max(-1.0, min(1.0, score))  # Keep between -1 and 1
        }
    
    async def analyze_bias(self, text: str, source: str) -> Dict[str, Any]:
        """Simple bias analysis"""
        # Simple source-based credibility
        trusted_sources = ['reuters', 'ap', 'bbc', 'npr', 'pbs', 'wall street journal']
        credibility = 0.9 if any(ts in source.lower() for ts in trusted_sources) else 0.7
        
        # Simple bias detection
        liberal_keywords = ['progressive', 'reform', 'climate', 'diversity']
        conservative_keywords = ['traditional', 'security', 'freedom', 'defense']
        
        text_lower = text.lower()
        liberal_count = sum(1 for word in liberal_keywords if word in text_lower)
        conservative_count = sum(1 for word in conservative_keywords if word in text_lower)
        
        if conservative_count > liberal_count:
            bias_label = 'conservative'
        elif liberal_count > conservative_count:
            bias_label = 'liberal'
        else:
            bias_label = 'neutral'
        
        return {
            "bias_label": bias_label,
            "credibility_score": credibility
        }

# Global instance
hybrid_ai_service = SimpleAIService()
