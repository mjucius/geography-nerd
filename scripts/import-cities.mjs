#!/usr/bin/env node

/**
 * Cities Import Script
 *
 * Downloads the GeoNames cities1000.zip file, parses it, applies regional
 * weighting, and regenerates data/cities-import.sql with the top ~1000 cities.
 *
 * Usage: npm run import-cities
 *
 * After running, also run `npm run generate:local-cities` to rebuild the
 * bundled web/src/data/localCities.ts that ships with the app.
 */

import fs from 'node:fs';
import https from 'node:https';
import zlib from 'node:zlib';
import { execSync } from 'node:child_process';

const GEONAMES_URL = 'https://download.geonames.org/export/dump/cities1000.zip';
const OUTPUT_FILE = 'data/cities-import.sql';
const ZIP_FILE = 'cities1000.zip';
const DATA_FILE = 'cities1000.txt';

const REGION_WEIGHTS = {
  Europe: 0.40,
  Americas: 0.30,
  Asia: 0.15,
  Africa: 0.10,
  Oceania: 0.05,
};

const COUNTRY_REGION_MAP = {
  GB: 'Europe', FR: 'Europe', DE: 'Europe', IT: 'Europe', ES: 'Europe',
  NL: 'Europe', BE: 'Europe', AT: 'Europe', CH: 'Europe', PL: 'Europe',
  CZ: 'Europe', SE: 'Europe', NO: 'Europe', DK: 'Europe', FI: 'Europe',
  GR: 'Europe', PT: 'Europe', TR: 'Europe', RU: 'Europe', UA: 'Europe',
  IE: 'Europe', HU: 'Europe', RO: 'Europe', BG: 'Europe', HR: 'Europe',

  US: 'Americas', CA: 'Americas', MX: 'Americas', BR: 'Americas',
  AR: 'Americas', CL: 'Americas', CO: 'Americas', PE: 'Americas',
  JM: 'Americas', CU: 'Americas', DO: 'Americas',

  CN: 'Asia', IN: 'Asia', JP: 'Asia', TH: 'Asia', MY: 'Asia',
  SG: 'Asia', ID: 'Asia', PH: 'Asia', VN: 'Asia', KR: 'Asia',

  ZA: 'Africa', EG: 'Africa', NG: 'Africa', KE: 'Africa', ET: 'Africa',
  MA: 'Africa', GH: 'Africa',

  AU: 'Oceania', NZ: 'Oceania',
};

const CAPITAL_CITY_KEYS = new Set([
  'Beijing|CN', 'Shanghai|CN', 'Delhi|IN', 'Mumbai|IN', 'Dhaka|BD',
  'Tokyo|JP', 'Jakarta|ID', 'Manila|PH', 'Bangkok|TH', 'Ho Chi Minh City|VN',
  'Istanbul|TR', 'Moscow|RU', 'Cairo|EG', 'Lagos|NG', 'Mexico City|MX',
  'Sao Paulo|BR', 'São Paulo|BR', 'Buenos Aires|AR', 'Lima|PE',
  'Bogota|CO', 'Bogotá|CO', 'Caracas|VE', 'Washington|US', 'London|GB',
  'Paris|FR', 'Berlin|DE', 'Madrid|ES', 'Rome|IT', 'Amsterdam|NL',
  'Brussels|BE', 'Vienna|AT', 'Prague|CZ', 'Warsaw|PL', 'Budapest|HU',
  'Bucharest|RO', 'Sofia|BG', 'Athens|GR', 'Baghdad|IQ', 'Tehran|IR',
  'Dubai|AE', 'Seoul|KR', 'Singapore|SG', 'Hong Kong|HK', 'Taipei|TW',
  'Karachi|PK', 'Lahore|PK', 'Kolkata|IN', 'Bengaluru|IN',
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

function extractZipFile(zipPath) {
  return new Promise((resolve, reject) => {
    console.log(`Extracting ${zipPath}...`);

    try {
      try {
        execSync(`unzip -o "${zipPath}" "${DATA_FILE}" -d .`, { stdio: 'pipe' });
        console.log(`Extracted ${DATA_FILE} from ZIP`);
        resolve();
        return;
      } catch {
        // unzip not available; fall through to manual extraction
      }

      const buffer = fs.readFileSync(zipPath);
      extractFromBuffer(buffer);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function extractFromBuffer(buffer) {
  const signature = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
  let offset = 0;

  while (offset < buffer.length) {
    offset = buffer.indexOf(signature, offset);
    if (offset === -1) break;

    if (offset + 30 > buffer.length) break;

    const filenameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const headerSize = 30 + filenameLength + extraLength;

    if (offset + headerSize > buffer.length) break;

    const filename = buffer.toString('utf8', offset + 30, offset + 30 + filenameLength);

    if (filename === 'cities1000.txt' || filename.endsWith('cities1000.txt')) {
      const compressedSize = buffer.readUInt32LE(offset + 18);
      const uncompressedSize = buffer.readUInt32LE(offset + 22);
      const compressionMethod = buffer.readUInt16LE(offset + 8);

      const fileDataStart = offset + headerSize;
      const fileDataEnd = fileDataStart + compressedSize;

      if (fileDataEnd > buffer.length) break;

      let fileData = buffer.slice(fileDataStart, fileDataEnd);

      if (compressionMethod === 8) {
        fileData = zlib.inflateSync(fileData);
      } else if (compressionMethod !== 0) {
        throw new Error(`Unsupported compression method: ${compressionMethod}`);
      }

      if (fileData.length !== uncompressedSize) {
        console.warn(`Warning: Decompressed size mismatch. Expected ${uncompressedSize}, got ${fileData.length}`);
      }

      fs.writeFileSync(DATA_FILE, fileData);
      console.log(`Successfully extracted ${DATA_FILE}`);
      return;
    }

    offset += 1;
  }

  throw new Error('Could not find cities1000.txt in ZIP file');
}

function parseGeoNamesFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const cities = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const parts = line.split('\t');
    if (parts.length < 15) continue;

    cities.push({
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
      modificationDate: parts[18],
    });
  }

  console.log(`Parsed ${cities.length} cities from GeoNames data`);
  return cities;
}

function selectCities(cities) {
  const validCities = cities.filter((c) => c.population > 0);

  const byRegion = {};
  for (const city of validCities) {
    const region = getRegion(city.countryCode);
    if (!byRegion[region]) {
      byRegion[region] = [];
    }
    byRegion[region].push(city);
  }

  for (const region in byRegion) {
    byRegion[region].sort((a, b) => b.population - a.population);
  }

  const selected = [];
  const targetTotal = 1000;

  for (const region in REGION_WEIGHTS) {
    const targetCount = Math.floor(targetTotal * REGION_WEIGHTS[region]);
    const regionCities = byRegion[region] || [];
    selected.push(...regionCities.slice(0, targetCount));
  }

  selected.sort((a, b) => b.population - a.population);
  const final = selected.slice(0, 1000);

  console.log(`Selected ${final.length} cities with regional weighting:`);
  for (const region in REGION_WEIGHTS) {
    const count = final.filter((c) => getRegion(c.countryCode) === region).length;
    console.log(`  ${region}: ${count} cities`);
  }

  return final;
}

function generateSQL(cities) {
  let sql = '-- Generated SQL for importing cities\n\n';
  sql += 'BEGIN;\n\n';

  const batchSize = 100;
  for (let i = 0; i < cities.length; i += batchSize) {
    const batch = cities.slice(i, i + batchSize);

    sql += 'INSERT INTO cities (name, country, country_code, population, latitude, longitude, region, is_capital) VALUES\n';

    const values = batch.map((city) => {
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
    if (!fs.existsSync(DATA_FILE)) {
      if (!fs.existsSync(ZIP_FILE)) {
        await downloadFile(GEONAMES_URL, ZIP_FILE);
      }

      await extractZipFile(ZIP_FILE);

      try {
        fs.unlinkSync(ZIP_FILE);
      } catch {
        // ignore cleanup errors
      }
    }

    console.log('\nParsing cities data...');
    const cities = parseGeoNamesFile(DATA_FILE);

    console.log('\nSelecting top 1000 cities...');
    const selected = selectCities(cities);

    console.log('\nGenerating SQL...');
    const sql = generateSQL(selected);

    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, sql);
    console.log(`\nSQL saved to ${OUTPUT_FILE}`);

    try {
      fs.unlinkSync(DATA_FILE);
    } catch {
      // ignore cleanup errors
    }

    console.log('\n--- NEXT STEPS ---');
    console.log('Run `npm run generate:local-cities` to rebuild the bundled');
    console.log('web/src/data/localCities.ts from the new SQL.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
