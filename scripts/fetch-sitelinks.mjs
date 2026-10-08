#!/usr/bin/env node

/**
 * Looks up every city of data/cities-import.sql on Wikidata (CC0) and writes its
 * sitelink count to data/city-sitelinks.json. One-time, run by hand:
 *   npm run fetch:sitelinks
 * Cities it cannot match are listed (exit 1); fix them in data/wikidata-overrides.json
 * as { "Name|CC": "Qnnn" } and re-run.
 */

import fs from 'node:fs';
import { pickCandidate } from './sitelinks-match.mjs';
import { parseCitiesSql } from './cities-sql.mjs';

const API = 'https://www.wikidata.org/w/api.php';
const HEADERS = { 'User-Agent': 'geography-nerd-sitelinks/1.0 (https://github.com/mjucius/geography-nerd)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await sleep(100);
      return await res.json();
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(1000 * attempt);
    }
  }
}

async function entities(qids) {
  const out = {};
  for (let i = 0; i < qids.length; i += 50) {
    const data = await api({ action: 'wbgetentities', ids: qids.slice(i, i + 50).join('|'), props: 'claims|sitelinks' });
    Object.assign(out, data.entities);
  }
  return out;
}

const toCandidate = (qid, e) => {
  const coord = e?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
  return { qid, lat: coord?.latitude, lon: coord?.longitude, sitelinks: Object.keys(e?.sitelinks ?? {}).length };
};

const sql = fs.readFileSync('data/cities-import.sql', 'utf8');
const cities = parseCitiesSql(sql).map((c) => ({ name: c.name, cc: c.countryCode, lat: c.latitude, lon: c.longitude }));
if (cities.length === 0) throw new Error('No cities found in data/cities-import.sql (wrong row format?)');
const overrides = JSON.parse(fs.readFileSync('data/wikidata-overrides.json', 'utf8'));

const result = {};
const unmatched = [];
for (const [i, city] of cities.entries()) {
  const key = `${city.name}|${city.cc}`;
  let found = null;
  if (overrides[key]) {
    const ents = await entities([overrides[key]]);
    // Overrides get the same location check as searched candidates.
    found = pickCandidate(city, [toCandidate(overrides[key], ents[overrides[key]])]);
  } else {
    const search = await api({ action: 'wbsearchentities', search: city.name, language: 'en', limit: '10' });
    const qids = (search.search ?? []).map((s) => s.id);
    if (qids.length) {
      const ents = await entities(qids);
      found = pickCandidate(city, qids.map((q) => toCandidate(q, ents[q])));
    }
  }
  if (found && found.sitelinks > 0) result[key] = { qid: found.qid, sitelinks: found.sitelinks };
  else unmatched.push(key);
  if ((i + 1) % 50 === 0) console.log(`${i + 1}/${cities.length}`);
}

const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync('data/city-sitelinks.json', JSON.stringify(sorted, null, 1) + '\n');
const counts = Object.values(result).map((r) => r.sitelinks);
console.log(`matched ${counts.length}/${cities.length}, sitelinks min ${Math.min(...counts)} max ${Math.max(...counts)}`);
if (unmatched.length) {
  console.log(`UNMATCHED (${unmatched.length}):\n${unmatched.join('\n')}`);
  process.exit(1);
}
