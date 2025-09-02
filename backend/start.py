#!/usr/bin/env python3
import os
import sys
import uvicorn

def main():
    print("=== RAILWAY STARTUP DEBUG ===")
    print(f"Python version: {sys.version}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Files in current directory: {os.listdir('.')}")
    
    # Check if app directory exists
    if os.path.exists('app'):
        print(f"Files in app directory: {os.listdir('app')}")
    else:
        print("No 'app' directory found!")
    
    # Try to import your app to see what fails
    print("\n=== TESTING IMPORT ===")
    try:
        from app.main import app
        print("✅ Successfully imported app.main:app")
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Trying alternative imports...")
        
        # Try different import paths
        try:
            import app.main
            print("✅ Can import app.main module")
        except ImportError as e2:
            print(f"❌ Can't import app.main: {e2}")
        
        try:
            import main
            print("✅ Can import main module directly")
        except ImportError as e3:
            print(f"❌ Can't import main directly: {e3}")
    
    except Exception as e:
        print(f"❌ Other error importing app: {e}")
    
    # Check Python path
    print(f"\nPython path: {sys.path}")
    
    port = int(os.environ.get("PORT", 8000))
    print(f"\nStarting server on port {port}")
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="debug"
    )

if __name__ == "__main__":
    main()