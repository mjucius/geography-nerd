interface Point {
  latitude: number;
  longitude: number;
}

interface Offset<D extends string> {
  direction: D;
  km: number;
  mi: number;
}

const KM_PER_DEGREE = 111.32;
const MI_PER_KM = 0.621371;

const offset = <D extends string>(degrees: number, direction: D): Offset<D> => {
  const km = Math.abs(degrees) * KM_PER_DEGREE;
  return { direction, km, mi: km * MI_PER_KM };
};

// Where city1 sits relative to city2. Longitude wraps across the dateline,
// the same way the quiz picks its East/West answer in quizService.
export function getDistanceInfo(city1: Point, city2: Point) {
  let lonDiff = city1.longitude - city2.longitude;
  if (lonDiff > 180) lonDiff -= 360;
  else if (lonDiff < -180) lonDiff += 360;
  const latDiff = city1.latitude - city2.latitude;

  return {
    ns: offset(latDiff, latDiff > 0 ? 'North' : 'South'),
    ew: offset(lonDiff, lonDiff > 0 ? 'East' : 'West'),
  };
}

export const formatDistance = ({ km, mi }: { km: number; mi: number }) =>
  `${Math.round(km).toLocaleString('en-US')} km / ${Math.round(mi).toLocaleString('en-US')} mi`;
