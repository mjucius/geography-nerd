import fs from 'node:fs';

const importSql = fs.readFileSync('data/cities-import.sql', 'utf8');
const schemaSql = fs.readFileSync('data/countries.sql', 'utf8');
const sitelinks = JSON.parse(fs.readFileSync('data/city-sitelinks.json', 'utf8'));

const countries = {};
for (const match of schemaSql.matchAll(/\('([^']+)', '((?:[^']|'')+)', '([^']+)'\)/g)) {
  countries[match[1]] = [match[2].replace(/''/g, "'"), match[3]];
}

const capitals = new Set(
  [...importSql.matchAll(/\('((?:[^']|'')+)', '([^']+)'\)/g)].map((match) => {
    return `${match[1].replace(/''/g, "'")}|${match[2]}`;
  })
);

// One row per city: name, country code, population, lat, lon, sitelinks, capital (0/1).
const rows = [...importSql.matchAll(/\('((?:[^']|'')+)', '([^']+)', ([0-9]+), (-?[0-9.]+), (-?[0-9.]+)\)/g)].map((match) => {
  const key = `${match[1].replace(/''/g, "'")}|${match[2]}`;
  if (!sitelinks[key]) throw new Error(`No sitelink count for ${key}; run npm run fetch:sitelinks`);
  return [key.split('|')[0], match[2], Number(match[3]), Number(match[4]), Number(match[5]), sitelinks[key].sitelinks, capitals.has(key) ? 1 : 0];
});

const usedCodes = [...new Set(rows.map((r) => r[1]))].sort();
const usedCountries = Object.fromEntries(usedCodes.map((c) => [c, countries[c] ?? [c, '']]));

const output =
  '{"countries":' + JSON.stringify(usedCountries) + ',\n"cities":[\n' + rows.map((r) => JSON.stringify(r)).join(',\n') + '\n]}\n';

fs.writeFileSync('web/src/data/cities.json', output);
