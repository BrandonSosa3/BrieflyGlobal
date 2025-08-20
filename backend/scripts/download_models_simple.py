"""
Simplified model downloader that avoids dependency conflicts
Run: python scripts/download_models_simple.py
"""
import os
import sys

def download_models():
    """Download models one by one to avoid conflicts"""
    
    print("🚀 Starting model downloads...")
    
    try:
        # 1. Test basic imports first
        print("📦 Testing imports...")
        import numpy
        print(f"✅ NumPy version: {numpy.__version__}")
        
        import pandas
        print(f"✅ Pandas version: {pandas.__version__}")
        
        # 2. Download NLTK data
        print("\n📚 Downloading NLTK data...")
        import nltk
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('vader_lexicon', quiet=True)
            print("✅ NLTK data downloaded")
        except Exception as e:
            print(f"⚠️ NLTK download warning: {e}")
        
        # 3. Test spaCy
        print("\n🌐 Testing spaCy...")
        import spacy
        try:
            nlp = spacy.load("en_core_web_sm")
            print("✅ spaCy model loaded successfully")
        except OSError:
            print("📥 Downloading spaCy model...")
            os.system("python -m spacy download en_core_web_sm")
            print("✅ spaCy model downloaded")
        
        # 4. Test transformers (lightweight)
        print("\n🤖 Testing transformers...")
        from transformers import pipeline
        
        # Download a small model first
        print("📥 Downloading sentiment analysis model...")
        sentiment_pipeline = pipeline(
            "sentiment-analysis", 
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            max_length=512,
            truncation=True
        )
        
        # Test it
        test_result = sentiment_pipeline("This is a test sentence.")
        print(f"✅ Sentiment model working: {test_result}")
        
        print("\n🎉 Basic setup complete!")
        print("💡 We'll download heavier models as needed to avoid memory issues")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Troubleshooting suggestions:")
        print("1. Make sure you're in the virtual environment: source venv/bin/activate")
        print("2. Try reinstalling with: pip install --force-reinstall --no-cache-dir transformers")
        print("3. Check Python version: python --version (should be 3.8+)")
        
        return False
    
    return True

if __name__ == "__main__":
    success = download_models()
    if success:
        print("\n✅ Setup completed successfully!")
    else:
        print("\n❌ Setup failed. Check the errors above.")
        sys.exit(1)
