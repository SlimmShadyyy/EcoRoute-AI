"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// ✅ Fix missing marker icons on Vercel / Next
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 👇 Fits map bounds whenever route changes
function FitBounds({ coordinates, onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;

    // small delay = smoother render
    const timer = setTimeout(() => {
      map.fitBounds(coordinates, { padding: [50, 50] });
      onMapReady?.(); // ✅ tell parent map is ready
    }, 100);

    return () => clearTimeout(timer);
  }, [coordinates, map, onMapReady]);

  return null;
}

export default function MapView({ coordinates, color, onMapReady }) {
  if (!coordinates || coordinates.length === 0) return null;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={coordinates[0]}
        zoom={6}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FitBounds coordinates={coordinates} onMapReady={onMapReady} />

        {coordinates.map((pos, index) => (
          <Marker key={index} position={pos}>
            <Popup>Stop {index + 1}</Popup>
          </Marker>
        ))}

        <Polyline
          key={color}
          positions={coordinates}
          color={color}
          weight={5}
        />
      </MapContainer>
    </div>
  );
}
