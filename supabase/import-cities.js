#!/usr/bin/env node

/**
 * Cities Import Script
 *
 * This script downloads the GeoNames cities1000.zip file, parses it,
 * and generates SQL INSERT statements for importing cities into Supabase.
 *
 * Usage: node import-cities.js
 *
 * The script will:
 * 1. Download cities1000.zip from GeoNames
 * 2. Extract the TSV file from the ZIP
 * 3. Parse the TSV file
 * 4. Sort by population and apply regional weighting
 * 5. Output SQL INSERT statements
 * 6. Generate instructions for importing into Supabase
 */

const fs = require('fs');
const https = require('https');
const path = require('path');
const zlib = require('zlib');

const GEONAMES_URL = 'https://download.geonames.org/export/dump/cities1000.zip';
const OUTPUT_FILE = 'cities-import.sql';
const ZIP_FILE = 'cities1000.zip';
const DATA_FILE = 'cities1000.txt';

// Regional weights for distribution
const REGION_WEIGHTS = {
  'Europe': 0.40,
  'Americas': 0.30,
  'Asia': 0.15,
  'Africa': 0.10,
  'Oceania': 0.05
};

// Country to region mapping (simplified)
const COUNTRY_REGION_MAP = {
  // Europe
  'GB': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'IT': 'Europe', 'ES': 'Europe',
  'NL': 'Europe', 'BE': 'Europe', 'AT': 'Europe', 'CH': 'Europe', 'PL': 'Europe',
  'CZ': 'Europe', 'SE': 'Europe', 'NO': 'Europe', 'DK': 'Europe', 'FI': 'Europe',
  'GR': 'Europe', 'PT': 'Europe', 'TR': 'Europe', 'RU': 'Europe', 'UA': 'Europe',
  'IE': 'Europe', 'HU': 'Europe', 'RO': 'Europe', 'BG': 'Europe', 'HR': 'Europe',

  // Americas
  'US': 'Americas', 'CA': 'Americas', 'MX': 'Americas', 'BR': 'Americas',
  'AR': 'Americas', 'CL': 'Americas', 'CO': 'Americas', 'PE': 'Americas',
  'JM': 'Americas', 'CU': 'Americas', 'DO': 'Americas',

  // Asia
  'CN': 'Asia', 'IN': 'Asia', 'JP': 'Asia', 'TH': 'Asia', 'MY': 'Asia',
  'SG': 'Asia', 'ID': 'Asia', 'PH': 'Asia', 'VN': 'Asia', 'KR': 'Asia',

  // Africa
  'ZA': 'Africa', 'EG': 'Africa', 'NG': 'Africa', 'KE': 'Africa', 'ET': 'Africa',
  'MA': 'Africa', 'GH': 'Africa',

  // Oceania
  'AU': 'Oceania', 'NZ': 'Oceania'
};

const CAPITAL_CITY_KEYS = new Set([
  'Beijing|CN',
  'Shanghai|CN',
  'Delhi|IN',
  'Mumbai|IN',
  'Dhaka|BD',
  'Tokyo|JP',
  'Jakarta|ID',
  'Manila|PH',
  'Bangkok|TH',
  'Ho Chi Minh City|VN',
  'Istanbul|TR',
  'Moscow|RU',
  'Cairo|EG',
  'Lagos|NG',
  'Mexico City|MX',
  'Sao Paulo|BR',
  'São Paulo|BR',
  'Buenos Aires|AR',
  'Lima|PE',
  'Bogota|CO',
  'Bogotá|CO',
  'Caracas|VE',
  'Washington|US',
  'London|GB',
  'Paris|FR',
  'Berlin|DE',
  'Madrid|ES',
  'Rome|IT',
  'Amsterdam|NL',
  'Brussels|BE',
  'Vienna|AT',
  'Prague|CZ',
  'Warsaw|PL',
  'Budapest|HU',
  'Bucharest|RO',
  'Sofia|BG',
  'Athens|GR',
  'Baghdad|IQ',
  'Tehran|IR',
  'Dubai|AE',
  'Seoul|KR',
  'Singapore|SG',
  'Hong Kong|HK',
  'Taipei|TW',
  'Karachi|PK',
  'Lahore|PK',
  'Kolkata|IN',
  'Bengaluru|IN',
]);

function getRegion(countryCode) {
  return COUNTRY_REGION_MAP[countryCode] || 'Asia';
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);

    https.get(url, (response) => {
      const file = fs.createWriteStream(dest);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded to ${dest}`);
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

function extractZipFile(zipPath, extractPath) {
  return new Promise((resolve, reject) => {
    console.log(`Extracting ${zipPath}...`);

    // We'll use a simple approach: read the ZIP and extract the cities1000.txt file
    // Since we're only interested in one file, we can use Node's built-in modules
    const { execSync } = require('child_process');

    try {
      // Try using unzip command if available
      try {
        execSync(`unzip -o "${zipPath}" "${DATA_FILE}" -d .`, { stdio: 'pipe' });
        console.log(`Extracted ${DATA_FILE} from ZIP`);
        resolve();
        return;
      } catch (e) {
        // unzip command not available, try alternative method
      }

      // Fallback: use a simple ZIP reader (basic implementation for uncompressed/deflate)
      const buffer = fs.readFileSync(zipPath);
      extractFromBuffer(buffer);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function extractFromBuffer(buffer) {
  // Simple ZIP file parser for extracting cities1000.txt
  // ZIP files have a central directory at the end, but we can search for the file signature
  const signature = Buffer.from([0x50, 0x4b, 0x03, 0x04]); // Local file header signature
  let offset = 0;

  while (offset < buffer.length) {
    offset = buffer.indexOf(signature, offset);
    if (offset === -1) break;

    // Read the local file header
    if (offset + 30 > buffer.length) break;

    const filenameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const headerSize = 30 + filenameLength + extraLength;

    if (offset + headerSize > buffer.length) break;

    const filename = buffer.toString('utf8', offset + 30, offset + 30 + filenameLength);

    // Check if this is the cities1000.txt file
    if (filename === 'cities1000.txt' || filename.endsWith('cities1000.txt')) {
      const compressedSize = buffer.readUInt32LE(offset + 18);
      const uncompressedSize = buffer.readUInt32LE(offset + 22);
      const compressionMethod = buffer.readUInt16LE(offset + 8);

      const fileDataStart = offset + headerSize;
      const fileDataEnd = fileDataStart + compressedSize;

      if (fileDataEnd > buffer.length) break;

      let fileData = buffer.slice(fileDataStart, fileDataEnd);

      // Decompress if needed
      if (compressionMethod === 8) { // Deflate compression
        fileData = zlib.inflateSync(fileData);
      } else if (compressionMethod !== 0) {
        throw new Error(`Unsupported compression method: ${compressionMethod}`);
      }

      // Verify decompressed size
      if (fileData.length !== uncompressedSize) {
        console.warn(`Warning: Decompressed size mismatch. Expected ${uncompressedSize}, got ${fileData.length}`);
      }

      // Write the extracted file
      fs.writeFileSync(DATA_FILE, fileData);
      console.log(`Successfully extracted ${DATA_FILE}`);
      return;
    }

    offset += 1;
  }

  throw new Error(`Could not find cities1000.txt in ZIP file`);
}

function parseGeoNamesFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const cities = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const parts = line.split('\t');
    if (parts.length < 15) continue;

    const city = {
      geonameid: parseInt(parts[0]),
      name: parts[1],
      asciiname: parts[2],
      alternatenames: parts[3],
      latitude: parseFloat(parts[4]),
      longitude: parseFloat(parts[5]),
      featureClass: parts[6],
      featureCode: parts[7],
      countryCode: parts[8],
      cc2: parts[9],
      admin1Code: parts[10],
      admin2Code: parts[11],
      admin3Code: parts[12],
      admin4Code: parts[13],
      population: parseInt(parts[14]) || 0,
      elevation: parts[15],
      dem: parts[16],
      timezone: parts[17],
      modificationDate: parts[18]
    };

    cities.push(city);
  }

  console.log(`Parsed ${cities.length} cities from GeoNames data`);
  return cities;
}

function selectCities(cities) {
  // Filter cities with valid population data
  const validCities = cities.filter(c => c.population > 0);

  // Group by region
  const byRegion = {};
  for (const city of validCities) {
    const region = getRegion(city.countryCode);
    if (!byRegion[region]) {
      byRegion[region] = [];
    }
    byRegion[region].push(city);
  }

  // Sort each region by population
  for (const region in byRegion) {
    byRegion[region].sort((a, b) => b.population - a.population);
  }

  // Select top cities from each region based on weights
  const selected = [];
  const targetTotal = 1000;

  for (const region in REGION_WEIGHTS) {
    const targetCount = Math.floor(targetTotal * REGION_WEIGHTS[region]);
    const regionCities = byRegion[region] || [];
    selected.push(...regionCities.slice(0, targetCount));
  }

  // Sort by population and take top 1000
  selected.sort((a, b) => b.population - a.population);
  const final = selected.slice(0, 1000);

  console.log(`Selected ${final.length} cities with regional weighting:`);
  for (const region in REGION_WEIGHTS) {
    const count = final.filter(c => getRegion(c.countryCode) === region).length;
    console.log(`  ${region}: ${count} cities`);
  }

  return final;
}

function generateSQL(cities) {
  let sql = '-- Generated SQL for importing cities\n\n';
  sql += 'BEGIN;\n\n';

  // Insert cities in batches
  const batchSize = 100;
  for (let i = 0; i < cities.length; i += batchSize) {
    const batch = cities.slice(i, i + batchSize);

    sql += 'INSERT INTO cities (name, country, country_code, population, latitude, longitude, region, is_capital) VALUES\n';

    const values = batch.map(city => {
      const name = city.name.replace(/'/g, "''");
      const country = city.countryCode;
      const population = city.population;
      const lat = city.latitude;
      const lon = city.longitude;
      const region = getRegion(country);
      const isCapital = CAPITAL_CITY_KEYS.has(`${city.name}|${country}`);

      return `('${name}', '${country}', '${country}', ${population}, ${lat}, ${lon}, '${region}', ${isCapital})`;
    });

    sql += values.join(',\n') + ';\n\n';
  }

  sql += 'COMMIT;\n';

  return sql;
}

async function main() {
  try {
    // Download ZIP file if cities1000.txt doesn't exist
    if (!fs.existsSync(DATA_FILE)) {
      // Check if ZIP already exists
      if (!fs.existsSync(ZIP_FILE)) {
        await downloadFile(GEONAMES_URL, ZIP_FILE);
      }

      // Extract the ZIP file
      await extractZipFile(ZIP_FILE);

      // Clean up ZIP file after extraction
      try {
        fs.unlinkSync(ZIP_FILE);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    console.log('\nParsing cities data...');
    const cities = parseGeoNamesFile(DATA_FILE);

    console.log('\nSelecting top 1000 cities...');
    const selected = selectCities(cities);

    console.log('\nGenerating SQL...');
    const sql = generateSQL(selected);

    fs.writeFileSync(OUTPUT_FILE, sql);
    console.log(`\nSQL saved to ${OUTPUT_FILE}`);

    console.log('\n--- NEXT STEPS ---');
    console.log('1. Create a new Supabase project at https://supabase.com');
    console.log('2. Enable PostGIS extension (Settings > Database > Extensions)');
    console.log('3. Run the schema.sql file in the Supabase SQL editor');
    console.log('4. Run the cities-import.sql file in the Supabase SQL editor');
    console.log('5. Verify import with: SELECT COUNT(*) FROM cities;');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
