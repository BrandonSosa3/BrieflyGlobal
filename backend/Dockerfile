# 1. Use Python 3.11
FROM python:3.11-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy only requirements first (for caching)
COPY requirements.txt .

# 4. Upgrade pip and install dependencies
RUN pip install --upgrade pip setuptools wheel
RUN pip install -r requirements.txt

# 5. Copy the rest of the backend code
COPY . .

# 6. Expose port your FastAPI app runs on
EXPOSE 8000

# 7. Run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
