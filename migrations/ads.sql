-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  link_url VARCHAR(512),
  image_url VARCHAR(512),
  is_active BOOLEAN DEFAULT true,
  is_placeholder BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_ads_is_active ON ads(is_active);

-- Create an index on is_placeholder for faster queries
CREATE INDEX IF NOT EXISTS idx_ads_is_placeholder ON ads(is_placeholder);

-- Insert "Submit your own ad" placeholder
INSERT INTO ads (title, description, link_url, is_placeholder, is_active)
VALUES (
  'Submit Your Own Ad',
  'Want to advertise your tool or service? Contact us to submit your ad and reach thousands of developers.',
  '/contact',
  true,
  true
);

-- Enable Row Level Security (RLS)
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read active ads
CREATE POLICY "Allow public read access to active ads" 
ON ads FOR SELECT 
USING (is_active = true);

-- Create policy to allow authenticated users to insert ads (if needed)
-- Uncomment if you want to allow authenticated users to submit ads
-- CREATE POLICY "Allow authenticated users to insert ads" 
-- ON ads FOR INSERT 
-- TO authenticated 
-- WITH CHECK (true);

