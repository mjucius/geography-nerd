export const MAX_KM = 40;

export function haversineKm(lat1, lon1, lat2, lon2) {
  const rad = (d) => (d * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

// candidates: [{ qid, lat, lon, sitelinks }]. The most-linked one within MAX_KM of the city, or null.
export function pickCandidate(city, candidates) {
  const near = candidates.filter(
    (c) => c.lat != null && haversineKm(city.lat, city.lon, c.lat, c.lon) <= MAX_KM
  );
  return near.sort((a, b) => b.sitelinks - a.sitelinks)[0] ?? null;
}
