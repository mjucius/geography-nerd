// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs shared by the import and generator scripts, no types
import { formatCitiesSql, parseCitiesSql } from '../../../../scripts/cities-sql.mjs';

const root = new URL('../../../../', import.meta.url).pathname;
const committedSql = readFileSync(join(root, 'data/cities-import.sql'), 'utf8');
const rows = parseCitiesSql(committedSql);

describe('cities-import.sql format', () => {
  it('parses the committed file into 1000 rows', () => {
    expect(rows).toHaveLength(1000);
    expect(rows[0]).toEqual({ name: 'Shanghai', countryCode: 'CN', population: 24874500, latitude: 31.22222, longitude: 121.45806 });
  });

  it('writes rows that parse back to the same rows', () => {
    expect(parseCitiesSql(formatCitiesSql(rows))).toEqual(rows);
  });

  it('keeps quotes and accents in names, and rows past a batch boundary', () => {
    const made = Array.from({ length: 250 }, (_, i) => ({
      name: i === 0 ? "O'Fallon" : i === 1 ? 'São Paulo' : `City ${i}`,
      countryCode: 'US',
      population: 1000 + i,
      latitude: -12.5 + i / 100,
      longitude: 130.25,
    }));
    const back = parseCitiesSql(formatCitiesSql(made));
    expect(back).toEqual(made);
    expect(back[0].name).toBe("O'Fallon");
  });

  it('does not read the old 7-column row shape the import used to write', () => {
    expect(parseCitiesSql("('X', 'CC', 'CC', 1, 2, 3, 'Asia')")).toEqual([]);
  });

  it('gives the generator the same cities.json from the import writer output as from the committed file', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'cities-sql-'));
    try {
      mkdirSync(join(tmp, 'data'));
      mkdirSync(join(tmp, 'web/src/data'), { recursive: true });
      for (const f of ['countries.sql', 'city-sitelinks.json', 'excluded-cities.json']) cpSync(join(root, 'data', f), join(tmp, 'data', f));
      writeFileSync(join(tmp, 'data/cities-import.sql'), formatCitiesSql(rows));
      execFileSync(process.execPath, [join(root, 'scripts/generate-local-cities.mjs')], { cwd: tmp });
      expect(readFileSync(join(tmp, 'web/src/data/cities.json'), 'utf8')).toBe(readFileSync(join(root, 'web/src/data/cities.json'), 'utf8'));
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
