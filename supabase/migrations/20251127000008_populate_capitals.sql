-- Populate capital cities and regions
-- This updates is_capital and region columns for cities

-- Update capital cities (matching by city name and country code)
-- Major capital cities that should be in the top 100 cities
UPDATE cities SET is_capital = TRUE WHERE (name, country_code) IN (
  ('Beijing', 'CN'),
  ('Shanghai', 'CN'),
  ('Delhi', 'IN'),
  ('Mumbai', 'IN'),
  ('Dhaka', 'BD'),
  ('Tokyo', 'JP'),
  ('Jakarta', 'ID'),
  ('Manila', 'PH'),
  ('Bangkok', 'TH'),
  ('Ho Chi Minh City', 'VN'),
  ('Istanbul', 'TR'),
  ('Moscow', 'RU'),
  ('Cairo', 'EG'),
  ('Lagos', 'NG'),
  ('Mexico City', 'MX'),
  ('São Paulo', 'BR'),
  ('Rio de Janeiro', 'BR'),
  ('Buenos Aires', 'AR'),
  ('Lima', 'PE'),
  ('Bogotá', 'CO'),
  ('Caracas', 'VE'),
  ('Los Angeles', 'US'),
  ('New York', 'US'),
  ('Chicago', 'US'),
  ('Washington', 'US'),
  ('Toronto', 'CA'),
  ('Vancouver', 'CA'),
  ('London', 'GB'),
  ('Paris', 'FR'),
  ('Berlin', 'DE'),
  ('Madrid', 'ES'),
  ('Rome', 'IT'),
  ('Amsterdam', 'NL'),
  ('Brussels', 'BE'),
  ('Vienna', 'AT'),
  ('Prague', 'CZ'),
  ('Warsaw', 'PL'),
  ('Budapest', 'HU'),
  ('Bucharest', 'RO'),
  ('Sofia', 'BG'),
  ('Athens', 'GR'),
  ('Istanbul', 'TR'),
  ('Tel Aviv', 'IL'),
  ('Baghdad', 'IQ'),
  ('Tehran', 'IR'),
  ('Dubai', 'AE'),
  ('Johannesburg', 'ZA'),
  ('Sydney', 'AU'),
  ('Melbourne', 'AU'),
  ('Auckland', 'NZ'),
  ('Seoul', 'KR'),
  ('Singapore', 'SG'),
  ('Hong Kong', 'HK'),
  ('Taipei', 'TW'),
  ('Karachi', 'PK'),
  ('Lahore', 'PK'),
  ('Kolkata', 'IN'),
  ('Bangalore', 'IN')
);

-- Update regions for cities based on their country codes
UPDATE cities SET region = c.region
FROM countries c
WHERE cities.country_code = c.code AND cities.region IS NULL;

-- Mark non-capital cities that are in Europe, North America, and South America for Level 2
-- The region is already set from countries table, no additional action needed
