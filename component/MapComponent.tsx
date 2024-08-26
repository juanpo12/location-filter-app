import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  latitude: number;
  longitude: number;
}

const SetViewOnClick = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], 13); 
  }, [latitude, longitude, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude }) => {
  if (typeof window === 'undefined') {
    return null; 
  }

  return (
    <MapContainer
      style={{ height: '500px', width: '100%' }}
    >
      <SetViewOnClick latitude={latitude} longitude={longitude} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          Ubicación actual: {latitude}, {longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
