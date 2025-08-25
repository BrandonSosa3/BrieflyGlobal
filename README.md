BrieflyGlobal – World Intelligence Platform

A full-stack geopolitical intelligence platform with an interactive world map, real-time news analysis, and economic data visualization for 100+ countries.

Project Overview

BrieflyGlobal aggregates and analyzes global data from multiple sources and presents it through an intuitive, interactive interface. It combines modern frontend and backend technologies with AI-powered analysis to deliver insights into world affairs.

Important Note for Users:
When using the Vercel live demo, please allow up to 3-7 minutes on the first load. The backend is hosted on Render’s free tier and spins down when idle. Because the backend includes heavy machine learning dependencies, it takes extra time to restart. Once running, subsequent interactions are fast and responsive.

Live Links:

Frontend and Backend (full project): https://briefly-global.vercel.app 

Backend API: https://brieflyglobal.onrender.com 

API Documentation: https://brieflyglobal.onrender.com/docs

Live Demo Walkthrough

Step 1: Interactive Map
Visit briefly-global.vercel.app
 and select a country to see its data dashboard. This is an interactive map and you can click whichever country you choose.

Step 2: Explore Global Coverage
Check major countries (USA, France, Japan, Brazil) to view consistent economic and news insights.

Step 3: News Intelligence
Scroll to the news section for AI-powered sentiment, bias, and credibility scoring.

Step 4: Country Comparison
Use the comparison tool to analyze two countries side by side.

Step 5 (Optional): API Docs
Explore API Docs
 for technical details.

Key Features

Interactive World Map – Built with MapLibre GL, supports 100+ countries, click to view instant intelligence reports.

Economic Dashboard – Integrates World Bank API for GDP, population, unemployment, inflation, life expectancy.

Real-Time News Analysis – NewsAPI integration with sentiment and bias detection using NLP.

Currency Exchange – Live currency rates with automatic base currency detection.

Country Comparison Tool – Side-by-side economic and news sentiment analysis.

AI Insights – Article summarization, sentiment analysis, and credibility scoring.

Technical Architecture

Frontend (Vercel hosted)

React 18 + TypeScript

MapLibre GL for interactive maps

Custom hooks, responsive UI, error boundaries

Backend (Render hosted)

FastAPI (Python 3.11)

Async HTTP clients (httpx)

Pydantic models for validation

Dockerized deployment with logging and CORS

External APIs

NewsAPI – global news coverage

World Bank API – economic indicators

ExchangeRate API – currency data

Custom AI pipeline – NLTK + custom ML models

Local Setup

Requirements: Node.js 18+, Python 3.11+, Git, you will also need your own api keys for the .env file

Clone the repository

git clone https://github.com/BrandonSosa3/BrieflyGlobal.git
cd BrieflyGlobal


Backend setup

cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000


Frontend setup

cd frontend
npm install
npm run dev


Access locally:

Frontend: http://localhost:3000

Backend API: http://localhost:8000

API Docs: http://localhost:8000/docs

Performance Notes

Backend spins down after inactivity (free tier limitation).

Cold start: 3-7 minutes (due to ML dependencies).

Warm performance: sub-second response times.

Production deployment would use always-on hosting for instant availability.

Technical Highlights for Recruiters

Frontend: React with TypeScript, responsive design, interactive map UI.

Backend: FastAPI with async operations, pydantic validation, error handling.

AI/ML: News sentiment and bias detection, article summarization.

DevOps: Docker containerization, deployment on Vercel and Render.

Best Practices: Modular architecture, type safety, comprehensive logging, user-friendly error handling.

Contact

Developer: Brandon Sosa

LinkedIn: https://www.linkedin.com/in/brandonsosa123/ 

GitHub: https://github.com/BrandonSosa3 

Email: brandonsosa10101@gmail.com

Phone number: 1(818)-309-6961