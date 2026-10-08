// The one place that knows the row format of data/cities-import.sql, shared by the writer (import-cities) and the readers
// (generate-local-cities, fetch-sitelinks): ('Name', 'CC', population, latitude, longitude)
const ROW = /\('((?:[^']|'')+)', '([^']+)', ([0-9]+), (-?[0-9.]+), (-?[0-9.]+)\)/g;

// cities: [{ name, countryCode, population, latitude, longitude }]
export function formatCitiesSql(cities) {
  let sql = '-- Generated SQL for importing cities\n\nBEGIN;\n\n';
  for (let i = 0; i < cities.length; i += 100) {
    const rows = cities
      .slice(i, i + 100)
      .map((c) => `('${c.name.replace(/'/g, "''")}', '${c.countryCode}', ${c.population}, ${c.latitude}, ${c.longitude})`);
    sql += `INSERT INTO cities (name, country, population, latitude, longitude) VALUES\n${rows.join(',\n')};\n\n`;
  }
  return sql + 'COMMIT;\n';
}

// Returns the same shape; an empty list means the text is not in this format.
export function parseCitiesSql(text) {
  return [...text.matchAll(ROW)].map((m) => ({
    name: m[1].replace(/''/g, "'"),
    countryCode: m[2],
    population: Number(m[3]),
    latitude: Number(m[4]),
    longitude: Number(m[5]),
  }));
}
