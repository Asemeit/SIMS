import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon missing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface Location {
    id: string | number;
    name: string;
    address: string;
    type: string;
    status: string;
    latitude?: number;
    longitude?: number;
}

import { useSettings } from '../../context/SettingsContext';

export function MapComponent({ locations }: { locations: Location[] }) {
  const { region } = useSettings();
  
  // Dynamic center based on region or first location
  const getCenter = (): [number, number] => {
    if (locations.length > 0 && locations[0].latitude && locations[0].longitude) {
        return [locations[0].latitude, locations[0].longitude];
    }
    switch (region) {
      case 'Kenya': return [-1.2921, 36.8219];
      case 'North America': return [39.8283, -98.5795];
      case 'Europe': return [54.5260, 15.2551];
      default: return [20, 0];
    }
  };

  const getZoom = () => {
    if (locations.length === 1) return 12;
    switch (region) {
      case 'Kenya': return 6;
      case 'North America': return 3;
      case 'Europe': return 4;
      default: return 2;
    }
  };

  return (
    <MapContainer 
        key={region + (locations.length > 0 ? locations[0].id : 'empty')} 
        center={getCenter()} 
        zoom={getZoom()} 
        scrollWheelZoom={false} 
        className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => {
         if (!loc.latitude || !loc.longitude) return null;
         return (
            <Marker 
                key={loc.id} 
                position={[loc.latitude, loc.longitude]} 
                icon={DefaultIcon}
            >
            <Popup>
                <div className="font-sans min-w-[150px]">
                    <h3 className="font-bold text-sm text-slate-800">{loc.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{loc.address}</p>
                    <div className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-bold ${
                        loc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                        {loc.status}
                    </div>
                </div>
            </Popup>
            </Marker>
         );
      })}
    </MapContainer>
  );
}
