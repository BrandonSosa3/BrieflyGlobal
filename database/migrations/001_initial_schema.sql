-- Countries table
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

-- News articles table
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id),
    title TEXT NOT NULL,
    content TEXT,
    summary_short VARCHAR(280),
    summary_medium TEXT,
    summary_long TEXT,
    source VARCHAR(255) NOT NULL,
    source_url TEXT,
    author VARCHAR(255),
    bias_score DECIMAL(3,2),
    credibility_score DECIMAL(3,2),
    emotional_tone DECIMAL(3,2),
    impact_score DECIMAL(3,2),
    embedding VECTOR(1536),
    published_at TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Economic indicators table
CREATE TABLE economic_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id),
    indicator_type VARCHAR(100) NOT NULL,
    indicator_name VARCHAR(255) NOT NULL,
    value DECIMAL(20,6),
    unit VARCHAR(50),
    date DATE NOT NULL,
    source VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_id, indicator_type, date)
);

-- Events table for timeline tracking
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    event_type VARCHAR(100),
    importance_score DECIMAL(3,2),
    event_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    actors JSONB,
    sources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_countries_iso_code ON countries(iso_code);
CREATE INDEX idx_news_articles_country_id ON news_articles(country_id);
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX idx_economic_indicators_country_date ON economic_indicators(country_id, date DESC);
CREATE INDEX idx_events_country_date ON events(country_id, event_date DESC);

-- Vector similarity search index
CREATE INDEX ON news_articles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
