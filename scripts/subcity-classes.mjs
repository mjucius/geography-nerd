// Wikidata instance-of (P31) classes that say a place is part of a city or is an administrative area, not a city.
// Strong: names a part of a city or a plainly sub-city kind. Weak: sub-city in some countries, an ordinary place in others.
export const STRONG = new Set([
  'Q253019', // Ortsteil (a part of a German municipality)
  'Q14562709', // London Underground station
  'Q55491', // underground railway station
  'Q22808403', // underground station
  'Q55488', // railway station
  'Q928830', // metro station
  'Q15921300', // sector of Bucharest
  'Q278976', // borough of Hamburg
  'Q408804', // borough of New York City
  'Q211690', // London borough
  'Q5195043', // borough
  'Q3032114', // district of Madrid
  'Q790344', // district of Barcelona
  'Q18559008', // district of São Paulo
  'Q4389092', // district of Moscow
  'Q26907711', // district of the Australian Capital Territory
  'Q2734310', // territorial demarcation of Mexico City
  'Q15830667', // quarter of Hamburg
  'Q2983893', // quarter
  'Q123705', // neighborhood
  'Q3413329', // neighborhood in Boston
  'Q4286337', // city district
  'Q15195406', // city district in Russia
  'Q3565075', // raion of city in Ukraine
  'Q1639634', // local government area of Nigeria
  'Q3299260', // local government area
  'Q33127844', // Local Government Area
  'Q1426035', // local government area of Victoria
  'Q55593624', // local government area of Queensland
  'Q55558027', // local government area of South Australia
  'Q738570', // central business district
  'Q45242174', // gazetted locality of Victoria
  'Q986065', // subdistrict in China
]);

export const WEAK = new Set([
  'Q2460358', // municipality of Turkey (every Turkish municipality: Istanbul districts and towns alike)
  'Q82794', // region
  'Q2327515', // City district in Baden-Württemberg (Stadtkreis: also a real city)
  'Q188509', // suburb
  'Q15243209', // historic district
  'Q1147395', // district of Turkey
  'Q149621', // district
  'Q3032103', // district of Colombia
  'Q85635630', // urban district of North Rhine-Westphalia
  'Q85631896', // urban district of Bavaria
  'Q61708099', // urban district in Saxony
  'Q85635929', // urban district of Lower Saxony
  'Q61856863', // urban district in Schleswig-Holstein
  'Q7897276', // unparished area
  'Q192287', // administrative divisions of Russia
  'Q1065118', // district of China
  'Q871419', // district of Austria
]);

// "flagged": any strong class. "review": no strong class but a weak one. "": anything else.
export function classify(classIds) {
  if (classIds.some((q) => STRONG.has(q))) return 'flagged';
  if (classIds.some((q) => WEAK.has(q))) return 'review';
  return '';
}
