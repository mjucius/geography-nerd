import type { City, Question } from './types';

const city = (name: string, latitude: number, longitude: number): City => ({
  id: 1,
  name,
  country: 'X',
  population: 1,
  latitude,
  longitude,
  location: { type: 'Point', coordinates: [longitude, latitude] },
});

export const question: Question = {
  questionText: 'Is Tokyo north or south of Sydney?',
  questionTextParts: [
    { type: 'text', content: 'Is' },
    { type: 'city', cityName: 'Tokyo', countryName: 'Japan' },
    { type: 'text', content: 'north or south of' },
    { type: 'city', cityName: 'Sydney', countryName: 'Australia' },
    { type: 'text', content: '?' },
  ],
  city1: city('Tokyo', 35.68, 139.69),
  city2: city('Sydney', -33.87, 151.21),
  correctAnswer: 'North',
  type: 'latitudinal',
  options: ['North', 'South'],
  difficultyLevel: 1,
};
