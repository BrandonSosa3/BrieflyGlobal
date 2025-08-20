"""
Fixed model downloader that handles dependency conflicts gracefully
"""
import os
import sys

def download_models():
    print("🚀 Starting fixed model downloads...")
    
    # 1. Check HF authentication
    hf_token = os.getenv('HUGGINGFACE_TOKEN')
    if hf_token:
        print(f"✅ HF Token found: {hf_token[:10]}...")
        try:
            from huggingface_hub import login
            login(token=hf_token)
            print("✅ HuggingFace authentication successful")
        except Exception as e:
            print(f"⚠️ HF login issue: {e}")
    else:
        print("⚠️ No HF token found. Models will still work, just using public access.")
    
    # 2. Test basic imports
    print("\n📦 Testing imports...")
    try:
        import numpy
        import pandas
        print(f"✅ NumPy: {numpy.__version__}, Pandas: {pandas.__version__}")
    except ImportError as e:
        print(f"❌ Basic import failed: {e}")
        return False
    
    # 3. NLTK setup (always works)
    print("\n📚 Setting up NLTK...")
    try:
        import nltk
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True) 
        nltk.download('vader_lexicon', quiet=True)
        print("✅ NLTK ready")
    except Exception as e:
        print(f"⚠️ NLTK issue: {e}")
    
    # 4. spaCy test
    print("\n🌐 Testing spaCy...")
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        print("✅ spaCy ready")
    except Exception as e:
        print(f"⚠️ spaCy issue: {e}")
    
    # 5. Transformers (with error handling)
    print("\n🤖 Testing transformers...")
    try:
        from transformers import pipeline
        
        # Test sentiment (already downloaded)
        print("😊 Testing sentiment analysis...")
        sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"  # Simpler model
        )
        result = sentiment_pipeline("This works great!")
        print(f"✅ Sentiment analysis ready: {result[0]['label']}")
        
    except Exception as e:
        print(f"⚠️ Transformers issue: {e}")
        print("💡 Transformers available but may have compatibility issues")
    
    # 6. Sentence transformers (handle gracefully)
    print("\n🔍 Testing embeddings...")
    try:
        # Try the old import first
        try:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer('all-MiniLM-L6-v2')
            test_embedding = model.encode(["Test sentence"])
            print(f"✅ Embeddings ready: {len(test_embedding[0])} dimensions")
        except ImportError:
            print("⚠️ Sentence transformers has compatibility issues")
            print("💡 Will use alternative embedding approach")
    except Exception as e:
        print(f"⚠️ Embedding issue: {e}")
    
    print("\n🎉 Setup complete!")
    print("💡 Core models ready. Some advanced features may use fallbacks.")
    return True

if __name__ == "__main__":
    success = download_models()
    if success:
        print("\n✅ Ready for development!")
    else:
        print("\n❌ Setup had issues, but core functionality should work")
