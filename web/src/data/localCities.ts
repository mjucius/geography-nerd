import data from './cities.json';
import type { City } from '../types';

type Row = [name: string, code: string, population: number, lat: number, lon: number, sitelinks: number, capital: 0 | 1];

// Expands the compact rows in cities.json (made by npm run generate:local-cities).
export const LOCAL_CITIES: City[] = (data.cities as Row[]).map(([name, code, population, latitude, longitude, sitelinks, capital], i) => {
  const [countryName, region] = (data.countries as Record<string, string[]>)[code];
  return {
    id: i + 1,
    name,
    country: code,
    country_code: code,
    countries: { code, name: countryName, region },
    population,
    latitude,
    longitude,
    location: { type: 'Point', coordinates: [longitude, latitude] },
    sitelinks,
    is_capital: capital === 1,
    region,
  };
});
