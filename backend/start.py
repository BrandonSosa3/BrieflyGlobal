#!/usr/bin/env python3
import os
import sys
import uvicorn

def main():
    # Print debug info
    print("=== RAILWAY STARTUP DEBUG ===")
    print(f"Python version: {sys.version}")
    print(f"Current working directory: {os.getcwd()}")
    
    # Check all environment variables with 'PORT' in them
    port_vars = {k: v for k, v in os.environ.items() if 'PORT' in k.upper()}
    print(f"Port-related environment variables: {port_vars}")
    
    # Try to determine the port
    port = 8000  # Default
    
    # Check various possible port variables
    port_sources = ['PORT', 'RAILWAY_TCP_PROXY_PORT', 'SERVER_PORT']
    for port_var in port_sources:
        if port_var in os.environ:
            try:
                port = int(os.environ[port_var])
                print(f"Using port {port} from environment variable {port_var}")
                break
            except (ValueError, TypeError):
                print(f"Invalid port value in {port_var}: {os.environ[port_var]}")
    else:
        print(f"No valid port found in environment, using default: {port}")
    
    print(f"Starting FastAPI server on 0.0.0.0:{port}")
    print("=== END DEBUG ===")
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )

if __name__ == "__main__":
    main()