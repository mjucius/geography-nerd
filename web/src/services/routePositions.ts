import { wrapLongitudeDiff } from './distance';

interface Point {
  latitude: number;
  longitude: number;
}

// city2 is drawn at most 180 degrees from city1, so a pair across the date line gets the short line.
// Leaflet shows longitudes past 180 on the repeated world copy. Same wrap as the East/West text.
export function routePositions(city1: Point, city2: Point): [[number, number], [number, number]] {
  const lon2 = city1.longitude - wrapLongitudeDiff(city1.longitude, city2.longitude);
  return [[city1.latitude, city1.longitude], [city2.latitude, lon2]];
}
