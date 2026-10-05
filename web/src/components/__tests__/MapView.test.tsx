import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MapView } from '../MapView';

describe('MapView', () => {
  it('loads tiles from OpenStreetMap', () => {
    const { container } = render(
      <MapView
        city1={{ name: 'Tokyo', latitude: 35.68, longitude: 139.69 }}
        city2={{ name: 'Sydney', latitude: -33.87, longitude: 151.21 }}
      />
    );
    const tile = container.querySelector('img.leaflet-tile');
    expect(tile?.getAttribute('src')).toMatch(/^https:\/\/tile\.openstreetmap\.org\//);
  });
});
