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

const offset = <D extends string>(degrees: number, direction: D, scale = 1): Offset<D> => {
  const km = Math.abs(degrees) * KM_PER_DEGREE * scale;
  return { direction, km, mi: km * MI_PER_KM };
};

// Longitude difference the short way round, in [-180, 180].
export function wrapLongitudeDiff(lon1: number, lon2: number) {
  let diff = lon1 - lon2;
  if (diff > 180) diff -= 360;
  else if (diff < -180) diff += 360;
  return diff;
}

// Where city1 sits relative to city2. Longitude wraps across the dateline,
// the same way the quiz picks its East/West answer in quizService.
// East-west km shrinks with latitude: a degree of longitude is cos(mean lat) as wide.
export function getDistanceInfo(city1: Point, city2: Point) {
  const lonDiff = wrapLongitudeDiff(city1.longitude, city2.longitude);
  const meanLatRad = (((city1.latitude + city2.latitude) / 2) * Math.PI) / 180;
  const latDiff = city1.latitude - city2.latitude;

  return {
    ns: offset(latDiff, latDiff > 0 ? 'North' : 'South'),
    ew: offset(lonDiff, lonDiff > 0 ? 'East' : 'West', Math.cos(meanLatRad)),
  };
}

export const formatDistance = ({ km, mi }: { km: number; mi: number }) =>
  `${Math.round(km).toLocaleString('en-US')} km / ${Math.round(mi).toLocaleString('en-US')} mi`;
