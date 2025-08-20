"""
Model downloader with Hugging Face authentication
Now you can access all models!
"""
import os
from huggingface_hub import login

def download_models():
    print("🚀 Starting authenticated model downloads...")
    
    try:
        # 1. Login to Hugging Face (if token is set)
        hf_token = os.getenv('HUGGINGFACE_TOKEN')
        if hf_token:
            print("🔑 Logging into Hugging Face...")
            login(token=hf_token)
            print("✅ Hugging Face authentication successful")
        else:
            print("⚠️ No HF token found, using public models only")
        
        # 2. Test basic imports
        print("\n📦 Testing imports...")
        import numpy
        import pandas
        print(f"✅ NumPy: {numpy.__version__}, Pandas: {pandas.__version__}")
        
        # 3. Download NLTK data
        print("\n📚 Downloading NLTK data...")
        import nltk
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('vader_lexicon', quiet=True)
        print("✅ NLTK data downloaded")
        
        # 4. Test spaCy
        print("\n🌐 Testing spaCy...")
        import spacy
        try:
            nlp = spacy.load("en_core_web_sm")
            print("✅ spaCy model loaded")
        except OSError:
            print("📥 Downloading spaCy model...")
            os.system("python -m spacy download en_core_web_sm")
        
        # 5. Now try the authenticated models
        print("\n🤖 Testing transformer models with authentication...")
        from transformers import pipeline
        
        # Sentiment analysis (should work now)
        print("😊 Downloading sentiment analysis model...")
        sentiment_pipeline = pipeline(
            "sentiment-analysis", 
            model="cardiffnlp/twitter-roberta-base-sentiment-latest"
        )
        test_sentiment = sentiment_pipeline("This is amazing!")
        print(f"✅ Sentiment model working: {test_sentiment}")
        
        # Summarization
        print("📝 Downloading summarization model...")
        summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn"
        )
        test_text = "This is a test article about artificial intelligence. AI is transforming many industries. It has applications in healthcare, finance, and technology."
        summary = summarizer(test_text, max_length=50, min_length=10, do_sample=False)
        print(f"✅ Summarization working: {summary[0]['summary_text']}")
        
        # Named Entity Recognition
        print("🏷️ Downloading NER model...")
        ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")
        test_entities = ner_pipeline("President Biden met with Chancellor Merkel in Washington.")
        print(f"✅ NER working: {[e['word'] for e in test_entities if e['score'] > 0.9]}")
        
        # Embeddings
        print("🔍 Downloading embedding model...")
        from sentence_transformers import SentenceTransformer
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        test_embeddings = embedding_model.encode(["Test sentence"])
        print(f"✅ Embeddings working: {len(test_embeddings[0])} dimensions")
        
        print("\n🎉 All models downloaded and tested successfully!")
        print("💰 Total cost: $0 (all free with HF account)")
        print("🚀 Ready for professional-quality AI features!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Check your HF token is correct")
        print("2. Make sure you're logged in: huggingface-cli login")
        print("3. Verify internet connection")
        return False

if __name__ == "__main__":
    success = download_models()
    if success:
        print("\n✅ Ready to build amazing AI features!")
    else:
        print("\n❌ Setup incomplete. Check errors above.")
