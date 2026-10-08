import type { City, Question } from './types';

const city = (name: string, latitude: number, longitude: number): City => ({
  id: 1,
  name,
  country: 'X',
  population: 1,
  sitelinks: 1,
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

// Mean latitude ~58N, so the cos-scaled east-west km (1,592) is far from the raw-degree value (2,991).
export const longitudinalQuestion: Question = {
  ...question,
  questionText: 'Is Oslo east or west of Moscow?',
  questionTextParts: [
    { type: 'text', content: 'Is' },
    { type: 'city', cityName: 'Oslo', countryName: 'Norway' },
    { type: 'text', content: 'east or west of' },
    { type: 'city', cityName: 'Moscow', countryName: 'Russia' },
    { type: 'text', content: '?' },
  ],
  city1: city('Oslo', 59.91, 10.75),
  city2: city('Moscow', 55.76, 37.62),
  correctAnswer: 'West',
  type: 'longitudinal',
  options: ['East', 'West'],
};

// Same meridian (exact 0 degrees east-west), different latitude.
export const sameLongitudeQuestion: Question = {
  ...longitudinalQuestion,
  city2: city('Aarhus', 55.76, 10.75),
};
