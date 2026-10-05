import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { DivIcon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routePositions } from '../services/routePositions';

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  city1: City;
  city2: City;
}

// Pins are plain divs styled in index.css, so they use the palette and need no image files.
// The icon box is 44px so the pin is an easy tap target; the visible dot is 20px (see .map-pin in index.css).
const pin = (className: string) =>
  new DivIcon({ className: `map-pin ${className}`, html: '<span></span>', iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -12] });
const pin1 = pin('map-pin-1');
const pin2 = pin('map-pin-2');

export function MapView({ city1, city2 }: MapViewProps) {
  const [position1, position2] = routePositions(city1, city2);

  // Calculate bounds to fit both cities
  const bounds = new LatLngBounds([position1, position2]);

  return (
    <div className="h-48 w-full overflow-hidden rounded-control border border-line sm:h-56">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Line connecting the two cities, coloured in index.css */}
        <Polyline positions={[position1, position2]} pathOptions={{ className: 'route-line' }} />

        <Marker position={position1} icon={pin1}>
          <Popup closeButton={false}>
            <div className="text-center font-semibold">
              {city1.name}
            </div>
          </Popup>
        </Marker>

        <Marker position={position2} icon={pin2}>
          <Popup closeButton={false}>
            <div className="text-center font-semibold">
              {city2.name}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
