import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  city1: City;
  city2: City;
}

// Fix for default marker icons in React Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function MapView({ city1, city2 }: MapViewProps) {
  // Create positions for markers and line
  const position1: [number, number] = [city1.latitude, city1.longitude];
  const position2: [number, number] = [city2.latitude, city2.longitude];

  // Calculate bounds to fit both cities
  const bounds = new LatLngBounds([position1, position2]);

  return (
    <div className="h-36 w-full overflow-hidden rounded-xl border border-[#d8cdb9] shadow-sm sm:h-48">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={20}
        />

        {/* Line connecting the two cities */}
        <Polyline
          positions={[position1, position2]}
          pathOptions={{ color: '#0891b2', weight: 3, opacity: 0.7, dashArray: '10, 10' }}
        />

        {/* City 1 Marker */}
        <Marker position={position1} icon={defaultIcon}>
          <Popup>
            <div className="text-center font-semibold">
              {city1.name}
            </div>
          </Popup>
        </Marker>

        {/* City 2 Marker */}
        <Marker position={position2} icon={defaultIcon}>
          <Popup>
            <div className="text-center font-semibold">
              {city2.name}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
