"""
Easy scaling commands for different deployment stages
"""
import os
import subprocess

def scale_to_portfolio():
    """Configure for portfolio demo (free)"""
    os.environ['AI_PROVIDER'] = 'free'
    os.environ['USE_PREMIUM_MODELS'] = 'false'
    print("✅ Scaled to Portfolio mode (Free)")

def scale_to_mvp():
    """Configure for MVP with basic paid features"""
    os.environ['AI_PROVIDER'] = 'hybrid'
    os.environ['MAX_MONTHLY_AI_BUDGET'] = '25'
    os.environ['PREMIUM_COUNTRIES'] = 'USA,GBR,DEU'
    print("✅ Scaled to MVP mode ($25/month budget)")

def scale_to_production():
    """Configure for production with premium features"""
    os.environ['AI_PROVIDER'] = 'openai_premium'
    os.environ['USE_PREMIUM_MODELS'] = 'true'
    os.environ['MAX_MONTHLY_AI_BUDGET'] = '200'
    print("✅ Scaled to Production mode (Premium)")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python scale_ai_service.py [portfolio|mvp|production]")
        sys.exit(1)
    
    mode = sys.argv[1].lower()
    
    if mode == 'portfolio':
        scale_to_portfolio()
    elif mode == 'mvp':
        scale_to_mvp()
    elif mode == 'production':
        scale_to_production()
    else:
        print("Invalid mode. Use: portfolio, mvp, or production")
