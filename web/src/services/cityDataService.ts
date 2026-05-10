import { createClient } from '@supabase/supabase-js';
import { LOCAL_CITIES } from '../data/localCities';
import type { City, DifficultyLevel } from '../types';

type CityDataSource = 'local' | 'supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configuredSource = import.meta.env.VITE_CITY_DATA_SOURCE as CityDataSource | undefined;

function getDataSource(): CityDataSource {
  if (configuredSource === 'supabase' && supabaseUrl && supabaseAnonKey) {
    return 'supabase';
  }

  return 'local';
}

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase city data source requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function filterCitiesByDifficulty(cities: City[], difficultyLevel: DifficultyLevel): City[] {
  switch (difficultyLevel) {
    case 1:
    case 2:
      return cities.filter((city) => city.is_capital && city.population > 500000);
    case 3:
      return cities.filter((city) => city.is_capital && city.population > 200000);
    case 4:
    case 5:
      return cities.filter((city) => city.is_capital);
    case 6:
      return cities.filter((city) => city.population > 1000000);
    case 7:
      return cities.filter((city) => city.population > 500000);
    case 8:
      return cities.filter((city) => city.population > 250000);
    case 9:
      return cities.filter((city) => city.population > 100000);
    case 10:
      return cities.filter((city) => city.population > 50000);
  }
}

export async function getCitiesByDifficulty(difficultyLevel: DifficultyLevel): Promise<City[]> {
  if (getDataSource() === 'local') {
    return filterCitiesByDifficulty(LOCAL_CITIES, difficultyLevel)
      .sort((a, b) => b.population - a.population)
      .slice(0, 100);
  }

  let query = getSupabaseClient()
    .from('cities')
    .select('*, countries(code, name, region)')
    .order('population', { ascending: false });

  switch (difficultyLevel) {
    case 1:
    case 2:
      query = query.eq('is_capital', true).gt('population', 500000);
      break;
    case 3:
      query = query.eq('is_capital', true).gt('population', 200000);
      break;
    case 4:
    case 5:
      query = query.eq('is_capital', true);
      break;
    case 6:
      query = query.gt('population', 1000000);
      break;
    case 7:
      query = query.gt('population', 500000);
      break;
    case 8:
      query = query.gt('population', 250000);
      break;
    case 9:
      query = query.gt('population', 100000);
      break;
    case 10:
      query = query.gt('population', 50000);
      break;
  }

  const { data, error } = await query.limit(100);

  if (error) {
    throw new Error(`Failed to fetch cities for level ${difficultyLevel}: ${error.message}`);
  }

  return data || [];
}
