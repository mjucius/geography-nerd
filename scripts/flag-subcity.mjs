#!/usr/bin/env node

/**
 * Reads the Wikidata instance-of classes (P31) of every shipped city and writes
 * data/subcity-flags.json, a report for reviewing which cities are really parts of a city.
 * One-time, run by hand: npm run flag:subcity
 * The game never reads the report; data/excluded-cities.json (reviewed by hand) decides what is dropped.
 */

import fs from 'node:fs';
import { classify } from './subcity-classes.mjs';

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

async function entities(qids, props, extra = {}) {
  const out = {};
  for (let i = 0; i < qids.length; i += 50) {
    const data = await api({ action: 'wbgetentities', ids: qids.slice(i, i + 50).join('|'), props, ...extra });
    Object.assign(out, data.entities);
  }
  return out;
}

const sitelinks = JSON.parse(fs.readFileSync('data/city-sitelinks.json', 'utf8'));
const excluded = JSON.parse(fs.readFileSync('data/excluded-cities.json', 'utf8'));
const keys = Object.keys(sitelinks).filter((k) => !(k in excluded)).sort((a, b) => a.localeCompare(b));

const claims = await entities(keys.map((k) => sitelinks[k].qid), 'claims');
const classesOf = Object.fromEntries(
  keys.map((k) => [
    k,
    (claims[sitelinks[k].qid]?.claims?.P31 ?? []).map((c) => c.mainsnak?.datavalue?.value?.id).filter(Boolean),
  ])
);

const classIds = [...new Set(Object.values(classesOf).flat())].sort();
const labelData = await entities(classIds, 'labels', { languages: 'en' });
const classes = Object.fromEntries(classIds.map((q) => [q, labelData[q]?.labels?.en?.value ?? q]));

const cities = Object.fromEntries(keys.map((k) => [k, { tier: classify(classesOf[k]), classes: classesOf[k] }]));

const out =
  '{"classes":' + JSON.stringify(classes) + ',\n"cities":{\n' +
  keys.map((k) => `${JSON.stringify(k)}:${JSON.stringify(cities[k])}`).join(',\n') + '\n}}\n';
fs.writeFileSync('data/subcity-flags.json', out);

const count = (tier) => keys.filter((k) => cities[k].tier === tier).length;
console.log(`${keys.length} cities: ${count('flagged')} flagged, ${count('review')} review`);
