"""
Download free AI models for local use
Run once to set up models: python scripts/download_models.py
"""
from transformers import pipeline, AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer
import nltk
import spacy

def download_models():
    print("Downloading free AI models...")
    
    # 1. Summarization model (Facebook BART - FREE)
    print("📰 Downloading summarization model...")
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    # 2. Sentiment analysis (RoBERTa - FREE)
    print("😊 Downloading sentiment analysis model...")
    sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest")
    
    # 3. Named Entity Recognition (FREE)
    print("🏷️ Downloading NER model...")
    ner = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")
    
    # 4. Embeddings for semantic search (FREE)
    print("🔍 Downloading embedding model...")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # 5. Download NLTK data
    print("📚 Downloading NLTK data...")
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('vader_lexicon')
    
    # 6. Download spaCy model
    print("🌐 Downloading spaCy model...")
    spacy.cli.download("en_core_web_sm")
    
    print("✅ All models downloaded successfully!")
    print("💰 Total cost: $0 (all free models)")

if __name__ == "__main__":
    download_models()
