from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.api.v1 import api_router
from app.core.config import settings

app = FastAPI(
    title="World Map Intelligence API",
    description="AI-powered country intelligence and analytics",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local development
        "http://127.0.0.1:3000",
        "https://briefly-global.vercel.app",  # Your production Vercel URL
        "https://*.vercel.app",            # All Vercel deployments (previews)
        # Temporary for debugging:
        "*",                               # Remove this after testing
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "World Map Intelligence API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Additional endpoint for frontend to test connection
@app.get("/api/v1/ping")
async def ping():
    return {
        "message": "Backend is connected!",
        "status": "success",
        "timestamp": "2025-08-20T15:30:00Z"
    }
