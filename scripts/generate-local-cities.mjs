import fs from 'node:fs';

const importSql = fs.readFileSync('supabase/cities-import.sql', 'utf8');
const schemaSql = fs.readFileSync('supabase/schema.sql', 'utf8');

const countries = new Map();
for (const match of schemaSql.matchAll(/\('([^']+)', '((?:[^']|'')+)', '([^']+)'\)/g)) {
  countries.set(match[1], {
    name: match[2].replace(/''/g, "'"),
    region: match[3],
  });
}

const capitals = new Set(
  [...importSql.matchAll(/\('((?:[^']|'')+)', '([^']+)'\)/g)].map((match) => {
    return `${match[1].replace(/''/g, "'")}\u0000${match[2]}`;
  })
);

const rows = [...importSql.matchAll(/\('((?:[^']|'')+)', '([^']+)', ([0-9]+), (-?[0-9.]+), (-?[0-9.]+)\)/g)]
  .slice(0, 100)
  .map((match, index) => {
    const name = match[1].replace(/''/g, "'");
    const code = match[2];
    const country = countries.get(code) ?? { name: code, region: undefined };
    const latitude = Number(match[4]);
    const longitude = Number(match[5]);

    return {
      id: index + 1,
      name,
      country: code,
      country_code: code,
      countries: {
        code,
        name: country.name,
        region: country.region,
      },
      population: Number(match[3]),
      latitude,
      longitude,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      is_capital: capitals.has(`${name}\u0000${code}`),
      region: country.region,
    };
  });

const output = `import type { City } from '../types';\n\nexport const LOCAL_CITIES: City[] = ${JSON.stringify(rows, null, 2)};\n`;

fs.mkdirSync('web/src/data', { recursive: true });
fs.writeFileSync('web/src/data/localCities.ts', output);
