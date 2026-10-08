# Attribution

## City Data

Geography Nerd uses city data derived from GeoNames.

- Source: https://www.geonames.org/
- License: Creative Commons Attribution 4.0

## City Familiarity

Each city's familiarity score is the number of Wikipedia language editions with an article on it, taken from Wikidata sitelink counts.

- Source: https://www.wikidata.org/
- License: CC0 (public domain dedication)
- The counts are fetched once by `npm run fetch:sitelinks` and committed in `data/city-sitelinks.json`; the game makes no Wikidata requests at runtime.

## Maps

The game displays maps with React Leaflet and OpenStreetMap raster tiles.

- OpenStreetMap: https://www.openstreetmap.org/copyright
- OSM tile policy reference: https://operations.osmfoundation.org/policies/tiles/
- Leaflet: https://leafletjs.com/

Map attribution is displayed in the map UI.

## Logo

The Geography Nerd logo (`assets/GeographyNerd-Logo_*.png`) was generated using Google's Nano Banana AI image generation. The logo is provided alongside the source code under the project's MIT license.
