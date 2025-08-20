"""
Simple database setup without async complications
"""
import os
import sys
import subprocess

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def setup_database():
    """Setup database using direct SQL commands"""
    
    print("��️ Setting up database...")
    
    # Database connection details
    db_host = "localhost"
    db_port = "5432"
    db_name = "worldmap_db"
    db_user = "worldmap_user"
    db_password = "worldmap_pass"
    
    # SQL commands to create tables
    create_tables_sql = """
    -- Enable extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Drop existing tables
    DROP TABLE IF EXISTS news_articles CASCADE;
    DROP TABLE IF EXISTS economic_indicators CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
    DROP TABLE IF EXISTS countries CASCADE;
    
    -- Create countries table
    CREATE TABLE countries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        iso_code VARCHAR(3) UNIQUE NOT NULL,
        iso_code_2 VARCHAR(2) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        official_name VARCHAR(255),
        capital VARCHAR(255),
        region VARCHAR(100),
        subregion VARCHAR(100),
        population BIGINT,
        area_km2 DECIMAL(15,2),
        gdp_usd BIGINT,
        currency_code VARCHAR(3),
        timezone VARCHAR(100),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        flag_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Insert sample countries
    INSERT INTO countries (iso_code, iso_code_2, name, official_name, capital, region, subregion, population, area_km2, gdp_usd, currency_code, timezone, latitude, longitude, flag_url) VALUES
    ('USA', 'US', 'United States', 'United States of America', 'Washington, D.C.', 'Americas', 'Northern America', 331900000, 9833520, 23315080000000, 'USD', 'UTC-5 to UTC-10', 37.0902, -95.7129, 'https://flagcdn.com/w320/us.png'),
    ('GBR', 'GB', 'United Kingdom', 'United Kingdom of Great Britain and Northern Ireland', 'London', 'Europe', 'Northern Europe', 67886000, 243610, 3131000000000, 'GBP', 'UTC+0', 55.3781, -3.4360, 'https://flagcdn.com/w320/gb.png'),
    ('JPN', 'JP', 'Japan', 'Japan', 'Tokyo', 'Asia', 'Eastern Asia', 125800000, 377930, 4937000000000, 'JPY', 'UTC+9', 36.2048, 138.2529, 'https://flagcdn.com/w320/jp.png'),
    ('DEU', 'DE', 'Germany', 'Federal Republic of Germany', 'Berlin', 'Europe', 'Western Europe', 83200000, 357022, 4220000000000, 'EUR', 'UTC+1', 51.1657, 10.4515, 'https://flagcdn.com/w320/de.png'),
    ('CHN', 'CN', 'China', 'People''s Republic of China', 'Beijing', 'Asia', 'Eastern Asia', 1439323776, 9596960, 14723000000000, 'CNY', 'UTC+8', 35.8617, 104.1954, 'https://flagcdn.com/w320/cn.png');
    """
    
    # Write SQL to temporary file
    sql_file = "/tmp/setup_worldmap.sql"
    with open(sql_file, "w") as f:
        f.write(create_tables_sql)
    
    try:
        # Execute SQL using psql through Docker
        print("📝 Creating tables and inserting data...")
        cmd = [
            "docker-compose", "exec", "-T", "postgres", 
            "psql", "-U", db_user, "-d", db_name, "-f", "-"
        ]
        
        result = subprocess.run(
            cmd, 
            input=create_tables_sql.encode(), 
            capture_output=True, 
            text=False
        )
        
        if result.returncode == 0:
            print("✅ Database setup completed successfully!")
            print("📊 Sample countries added:")
            print("   - United States (USA)")
            print("   - United Kingdom (GBR)")
            print("   - Japan (JPN)")
            print("   - Germany (DEU)")
            print("   - China (CHN)")
        else:
            print(f"❌ Error setting up database:")
            print(result.stderr.decode())
            
    except Exception as e:
        print(f"❌ Error running database setup: {e}")
        print("\n🔧 Manual setup option:")
        print("1. Make sure Docker is running: docker-compose ps")
        print("2. Access database: docker-compose exec postgres psql -U worldmap_user -d worldmap_db")
        print("3. Run the SQL commands manually")

if __name__ == "__main__":
    setup_database()
