import { describe, expect, it } from 'vitest';
import { routePositions } from '../routePositions';
import { getDistanceInfo } from '../distance';

const auckland = { name: 'Auckland', latitude: -36.85, longitude: 174.76 };
const honolulu = { name: 'Honolulu', latitude: 21.31, longitude: -157.86 };
const tokyo = { name: 'Tokyo', latitude: 35.68, longitude: 139.69 };
const sydney = { name: 'Sydney', latitude: -33.87, longitude: 151.21 };

describe('routePositions', () => {
  it('takes the short way across the date line', () => {
    const [p1, p2] = routePositions(auckland, honolulu);
    expect(Math.abs(p1[1] - p2[1])).toBeLessThanOrEqual(180);
    expect(p2[1]).toBeCloseTo(202.14, 1);
  });

  it('leaves ordinary pairs unchanged', () => {
    expect(routePositions(tokyo, sydney)).toEqual([[35.68, 139.69], [-33.87, 151.21]]);
  });

  it.each([[auckland, honolulu], [honolulu, auckland], [tokyo, sydney], [sydney, tokyo]])(
    'puts city1 on the side the distance text says',
    (a, b) => {
      const [p1, p2] = routePositions(a, b);
      const dir = p1[1] > p2[1] ? 'East' : 'West';
      expect(dir).toBe(getDistanceInfo(a, b).ew.direction);
    }
  );
});
