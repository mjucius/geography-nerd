// No question has an asked-axis gap under this many km, at any level (CEO Decision 11): closer than that cannot be judged from a map.
export const MIN_ASKED_KM = 25;

// One row per level 1 to 10.
// pool: how many of the most familiar cities (by Wikidata sitelinks) the level draws from.
// A pair is valid when its smaller gap (the asked axis) is within askedMin..askedMax km and its larger gap is at least otherMin km.
export const LEVELS = [
  { pool: 40, askedMin: 1500, askedMax: Infinity, otherMin: 0 },
  { pool: 60, askedMin: 1000, askedMax: Infinity, otherMin: 0 },
  { pool: 90, askedMin: 700, askedMax: Infinity, otherMin: 0 },
  { pool: 130, askedMin: 400, askedMax: 2000, otherMin: 0 },
  { pool: 190, askedMin: 250, askedMax: 1000, otherMin: 0 },
  { pool: 270, askedMin: 150, askedMax: 600, otherMin: 1000 },
  { pool: 400, askedMin: 100, askedMax: 400, otherMin: 1500 },
  { pool: 560, askedMin: 50, askedMax: 250, otherMin: 2000 },
  { pool: 760, askedMin: MIN_ASKED_KM, askedMax: 150, otherMin: 3000 },
  { pool: 1000, askedMin: MIN_ASKED_KM, askedMax: 100, otherMin: 3000 },
];
