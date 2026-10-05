import { describe, expect, it } from 'vitest';
import { formatDistance, formatOffset, getDistanceInfo, wrapLongitudeDiff } from '../distance';

const tokyo = { latitude: 35.68, longitude: 139.69 };
const sydney = { latitude: -33.87, longitude: 151.21 };

describe('getDistanceInfo', () => {
  it('gives direction, km and miles for each axis', () => {
    const { ns, ew } = getDistanceInfo(tokyo, sydney);
    expect(ns.direction).toBe('North');
    expect(ns.km).toBeCloseTo(69.55 * 111.32, 1);
    expect(ns.mi).toBeCloseTo(ns.km * 0.621371, 5);
    expect(ew.direction).toBe('West');
    expect(ew.km).toBeCloseTo(11.52 * 111.32 * Math.cos((1.81 / 2) * Math.PI / 180), 1);
  });

  it('wraps across the dateline like the quiz does', () => {
    const auckland = { latitude: -36.85, longitude: 174.76 };
    const honolulu = { latitude: 21.31, longitude: -157.86 };
    const { ew } = getDistanceInfo(auckland, honolulu);
    expect(ew.direction).toBe('West');
    // 27.38 deg the short way, at mean latitude -7.77
    expect(ew.km).toBeCloseTo(27.38 * 111.32 * Math.cos((7.77 * Math.PI) / 180), 0);
  });

  it('is 10 degrees = ~1,113 km on the equator', () => {
    const { ew } = getDistanceInfo({ latitude: 0, longitude: 10 }, { latitude: 0, longitude: 0 });
    expect(ew.km).toBeCloseTo(1113.2, 1);
  });

  it('is 10 degrees = ~557 km at 60N', () => {
    const { ew } = getDistanceInfo({ latitude: 60, longitude: 10 }, { latitude: 60, longitude: 0 });
    expect(ew.km).toBeCloseTo(556.6, 1);
  });

  it('leaves north-south alone', () => {
    const { ns } = getDistanceInfo({ latitude: 60, longitude: 0 }, { latitude: 50, longitude: 0 });
    expect(ns.km).toBeCloseTo(1113.2, 1);
  });
});

describe('same longitude / same latitude', () => {
  it('flags an exact 0 degree gap and says Same longitude', () => {
    const { ns, ew } = getDistanceInfo({ latitude: 10, longitude: 20 }, { latitude: 0, longitude: 20 });
    expect(ew.same).toBe(true);
    expect(formatOffset(ew, 'Same longitude')).toBe('Same longitude');
    expect(ns.same).toBe(false);
  });

  it('says Same latitude for an exact 0 degree north-south gap', () => {
    const { ns, ew } = getDistanceInfo({ latitude: 10, longitude: 30 }, { latitude: 10, longitude: 20 });
    expect(formatOffset(ns, 'Same latitude')).toBe('Same latitude');
    expect(formatOffset(ew, 'Same longitude')).toBe('East by 1,096 km / 681 mi');
  });

  it('treats 180 and -180 as the same longitude', () => {
    expect(getDistanceInfo({ latitude: 5, longitude: 180 }, { latitude: 0, longitude: -180 }).ew.same).toBe(true);
  });

  it('keeps the direction for a tiny non-zero gap', () => {
    const { ew } = getDistanceInfo({ latitude: 0, longitude: 20.0001 }, { latitude: 0, longitude: 20 });
    expect(ew.same).toBe(false);
    expect(formatOffset(ew, 'Same longitude')).toBe('East by 0 km / 0 mi');
  });
});

describe('wrapLongitudeDiff', () => {
  it('takes the short way round', () => {
    expect(wrapLongitudeDiff(170, -170)).toBe(-20);
    expect(wrapLongitudeDiff(-170, 170)).toBe(20);
    expect(wrapLongitudeDiff(10, 0)).toBe(10);
  });
});

describe('formatDistance', () => {
  it('shows km and miles with separators and no degrees', () => {
    const text = formatDistance({ km: 6912.4, mi: 4295.2 });
    expect(text).toBe('6,912 km / 4,295 mi');
    expect(text).not.toContain('°');
  });
});
