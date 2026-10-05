import { describe, expect, it } from 'vitest';
import { formatDistance, getDistanceInfo } from '../distance';

const tokyo = { latitude: 35.68, longitude: 139.69 };
const sydney = { latitude: -33.87, longitude: 151.21 };

describe('getDistanceInfo', () => {
  it('gives direction, km and miles for each axis', () => {
    const { ns, ew } = getDistanceInfo(tokyo, sydney);
    expect(ns.direction).toBe('North');
    expect(ns.km).toBeCloseTo(69.55 * 111.32, 1);
    expect(ns.mi).toBeCloseTo(ns.km * 0.621371, 5);
    expect(ew.direction).toBe('West');
    expect(ew.km).toBeCloseTo(11.52 * 111.32, 1);
  });

  it('wraps across the dateline like the quiz does', () => {
    const auckland = { latitude: -36.85, longitude: 174.76 };
    const honolulu = { latitude: 21.31, longitude: -157.86 };
    const { ew } = getDistanceInfo(auckland, honolulu);
    expect(ew.direction).toBe('West');
    expect(ew.km).toBeLessThan(20000);
  });
});

describe('formatDistance', () => {
  it('shows km and miles with separators and no degrees', () => {
    const text = formatDistance({ km: 6912.4, mi: 4295.2 });
    expect(text).toBe('6,912 km / 4,295 mi');
    expect(text).not.toContain('°');
  });
});
