import { LOCAL_CITIES } from '../data/localCities';
import type { City, DifficultyLevel } from '../types';

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
  return filterCitiesByDifficulty(LOCAL_CITIES, difficultyLevel)
    .sort((a, b) => b.population - a.population)
    .slice(0, 100);
}
