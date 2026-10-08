import fs from 'node:fs';
import { parseCitiesSql } from './cities-sql.mjs';

const importSql = fs.readFileSync('data/cities-import.sql', 'utf8');
const schemaSql = fs.readFileSync('data/countries.sql', 'utf8');
const sitelinks = JSON.parse(fs.readFileSync('data/city-sitelinks.json', 'utf8'));
// { "Name|CC": "reason" }: places left out of the game (duplicates, sub-city entries).
const excluded = JSON.parse(fs.readFileSync('data/excluded-cities.json', 'utf8'));

const countries = {};
for (const match of schemaSql.matchAll(/\('([^']+)', '((?:[^']|'')+)', '([^']+)'\)/g)) {
  countries[match[1]] = [match[2].replace(/''/g, "'"), match[3]];
}

// One row per city: name, country code, population, lat, lon, sitelinks.
const cities = parseCitiesSql(importSql);
if (cities.length === 0) throw new Error('No cities found in data/cities-import.sql (wrong row format?)');
const sqlRows = cities.map((c) => ({ key: `${c.name}|${c.countryCode}`, city: c }));
for (const key of Object.keys(excluded)) {
  if (!sqlRows.some((r) => r.key === key)) throw new Error(`Excluded city ${key} is not in data/cities-import.sql`);
}
const rows = sqlRows.filter((r) => !(r.key in excluded)).map(({ key, city }) => {
  if (!sitelinks[key]) throw new Error(`No sitelink count for ${key}; run npm run fetch:sitelinks`);
  return [city.name, city.countryCode, city.population, city.latitude, city.longitude, sitelinks[key].sitelinks];
});

const usedCodes = [...new Set(rows.map((r) => r[1]))].sort();
const usedCountries = Object.fromEntries(usedCodes.map((c) => [c, countries[c] ?? [c, '']]));

const output =
  '{"countries":' + JSON.stringify(usedCountries) + ',\n"cities":[\n' + rows.map((r) => JSON.stringify(r)).join(',\n') + '\n]}\n';

fs.writeFileSync('web/src/data/cities.json', output);
