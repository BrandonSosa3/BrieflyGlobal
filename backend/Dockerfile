# Use lightweight Python 3.11
FROM python:3.11.6-slim

# Set working directory
WORKDIR /app

# Install system dependencies for libraries like spacy
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first (Docker cache optimization)
COPY backend/requirements.txt .

# Install Python packages
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY backend/ .

# Make the startup script executable
RUN chmod +x railway_start.py

# Use our custom startup script
CMD ["python", "start.py"]