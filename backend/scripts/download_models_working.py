"""
Working model downloader using only public models
No authentication required - perfect for portfolio projects
"""
import os
import sys

def download_models():
    """Download only public, reliable models"""
    
    print("🚀 Starting reliable model downloads...")
    
    try:
        # 1. Test basic imports
        print("📦 Testing imports...")
        import numpy
        print(f"✅ NumPy version: {numpy.__version__}")
        
        import pandas
        print(f"✅ Pandas version: {pandas.__version__}")
        
        # 2. Download NLTK data (always works)
        print("\n📚 Downloading NLTK data...")
        import nltk
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('vader_lexicon', quiet=True)
            print("✅ NLTK data downloaded successfully")
        except Exception as e:
            print(f"⚠️ NLTK download warning: {e}")
        
        # 3. Test spaCy (already working)
        print("\n🌐 Testing spaCy...")
        import spacy
        try:
            nlp = spacy.load("en_core_web_sm")
            print("✅ spaCy model loaded successfully")
        except OSError:
            print("📥 Downloading spaCy model...")
            os.system("python -m spacy download en_core_web_sm")
        
        # 4. Test transformers with simpler models
        print("\n🤖 Testing transformers with public models...")
        from transformers import pipeline
        
        try:
            # Use a basic sentiment model that doesn't require auth
            print("📥 Testing basic sentiment analysis...")
            sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english"  # Public model
            )
            
            # Test it
            test_result = sentiment_pipeline("This is a great day!")
            print(f"✅ Sentiment analysis working: {test_result[0]}")
            
        except Exception as e:
            print(f"⚠️ Transformers model issue: {e}")
            print("💡 Will use NLTK-based sentiment analysis instead")
        
        try:
            # Test summarization with a simple public model
            print("📝 Testing summarization...")
            summarizer = pipeline(
                "summarization",
                model="sshleifer/distilbart-cnn-6-6"  # Smaller, public model
            )
            
            test_text = "This is a test article. It has multiple sentences. We want to summarize it."
            summary = summarizer(test_text, max_length=50, min_length=10, do_sample=False)
            print(f"✅ Summarization working: {summary[0]['summary_text']}")
            
        except Exception as e:
            print(f"⚠️ Summarization model issue: {e}")
            print("💡 Will use extractive summarization instead")
        
        print("\n🎉 Setup complete with available models!")
        print("💡 Using hybrid approach: transformers where available, NLTK as fallback")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("🔄 Falling back to NLTK-only approach...")
        return False
    except Exception as e:
        print(f"⚠️ Some models unavailable: {e}")
        print("✅ Continuing with available models...")
    
    return True

if __name__ == "__main__":
    success = download_models()
    if success:
        print("\n✅ Setup completed! Ready for development.")
    else:
        print("\n💡 Using lightweight approach with NLTK only.")
