-- Create countries table with country-level data
CREATE TABLE IF NOT EXISTS countries (
  code VARCHAR(2) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  population INTEGER,
  area DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert all countries with their data (including those used in cities table)
INSERT INTO countries (code, name, region) VALUES
  ('AE', 'United Arab Emirates', 'Asia'),
  ('AF', 'Afghanistan', 'Asia'),
  ('AO', 'Angola', 'Africa'),
  ('AR', 'Argentina', 'Americas'),
  ('AT', 'Austria', 'Europe'),
  ('AU', 'Australia', 'Oceania'),
  ('BD', 'Bangladesh', 'Asia'),
  ('BE', 'Belgium', 'Europe'),
  ('BF', 'Burkina Faso', 'Africa'),
  ('BG', 'Bulgaria', 'Europe'),
  ('BO', 'Bolivia', 'Americas'),
  ('BR', 'Brazil', 'Americas'),
  ('CA', 'Canada', 'Americas'),
  ('CD', 'Democratic Republic of the Congo', 'Africa'),
  ('CG', 'Congo', 'Africa'),
  ('CH', 'Switzerland', 'Europe'),
  ('CI', 'Côte d''Ivoire', 'Africa'),
  ('CL', 'Chile', 'Americas'),
  ('CN', 'China', 'Asia'),
  ('CO', 'Colombia', 'Americas'),
  ('CU', 'Cuba', 'Americas'),
  ('CZ', 'Czechia', 'Europe'),
  ('DE', 'Germany', 'Europe'),
  ('DK', 'Denmark', 'Europe'),
  ('DO', 'Dominican Republic', 'Americas'),
  ('DZ', 'Algeria', 'Africa'),
  ('EC', 'Ecuador', 'Americas'),
  ('EG', 'Egypt', 'Africa'),
  ('ES', 'Spain', 'Europe'),
  ('ET', 'Ethiopia', 'Africa'),
  ('FI', 'Finland', 'Europe'),
  ('FR', 'France', 'Europe'),
  ('GB', 'United Kingdom', 'Europe'),
  ('GH', 'Ghana', 'Africa'),
  ('GR', 'Greece', 'Europe'),
  ('HK', 'Hong Kong', 'Asia'),
  ('HR', 'Croatia', 'Europe'),
  ('HU', 'Hungary', 'Europe'),
  ('ID', 'Indonesia', 'Asia'),
  ('IE', 'Ireland', 'Europe'),
  ('IN', 'India', 'Asia'),
  ('IQ', 'Iraq', 'Asia'),
  ('IR', 'Iran', 'Asia'),
  ('IT', 'Italy', 'Europe'),
  ('JM', 'Jamaica', 'Americas'),
  ('JP', 'Japan', 'Asia'),
  ('KE', 'Kenya', 'Africa'),
  ('KP', 'North Korea', 'Asia'),
  ('KR', 'South Korea', 'Asia'),
  ('KZ', 'Kazakhstan', 'Asia'),
  ('MA', 'Morocco', 'Africa'),
  ('ML', 'Mali', 'Africa'),
  ('MM', 'Myanmar', 'Asia'),
  ('MX', 'Mexico', 'Americas'),
  ('NG', 'Nigeria', 'Africa'),
  ('NL', 'Netherlands', 'Europe'),
  ('NO', 'Norway', 'Europe'),
  ('NZ', 'New Zealand', 'Oceania'),
  ('PE', 'Peru', 'Americas'),
  ('PH', 'Philippines', 'Asia'),
  ('PK', 'Pakistan', 'Asia'),
  ('PL', 'Poland', 'Europe'),
  ('PT', 'Portugal', 'Europe'),
  ('RO', 'Romania', 'Europe'),
  ('RU', 'Russia', 'Asia'),
  ('SA', 'Saudi Arabia', 'Asia'),
  ('SD', 'Sudan', 'Africa'),
  ('SE', 'Sweden', 'Europe'),
  ('SG', 'Singapore', 'Asia'),
  ('SN', 'Senegal', 'Africa'),
  ('SO', 'Somalia', 'Africa'),
  ('SY', 'Syria', 'Asia'),
  ('TG', 'Togo', 'Africa'),
  ('TH', 'Thailand', 'Asia'),
  ('TR', 'Turkey', 'Asia'),
  ('TW', 'Taiwan', 'Asia'),
  ('TZ', 'Tanzania', 'Africa'),
  ('UA', 'Ukraine', 'Europe'),
  ('US', 'United States', 'Americas'),
  ('UZ', 'Uzbekistan', 'Asia'),
  ('VE', 'Venezuela', 'Americas'),
  ('VN', 'Vietnam', 'Asia'),
  ('ZA', 'South Africa', 'Africa'),
  ('ZM', 'Zambia', 'Africa')
ON CONFLICT (code) DO NOTHING;

-- Add country_code foreign key to cities table
ALTER TABLE cities ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);

-- Migrate existing country codes to new column
UPDATE cities SET country_code = country WHERE country_code IS NULL;

-- Add foreign key constraint
ALTER TABLE cities ADD CONSTRAINT fk_cities_country_code
FOREIGN KEY (country_code) REFERENCES countries(code);

-- Create index for efficient joins
CREATE INDEX IF NOT EXISTS cities_country_code_idx ON cities(country_code);
