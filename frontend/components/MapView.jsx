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
import "leaflet/dist/leaflet.css";

import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


function FitBounds({ coordinates, onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (!coordinates?.length) return;

    // tiny delay = smoother mount
    const timer = setTimeout(() => {
      map.fitBounds(coordinates, { padding: [40, 40] });
      onMapReady?.(); // tell parent map is ready
    }, 100);

    return () => clearTimeout(timer);
  }, [coordinates, map, onMapReady]);

  return null;
}

export default function MapView({ coordinates, onMapReady }) {
  if (!coordinates || coordinates.length === 0) return null;

  return (
    <div className="h-[400px] w-full">
      <MapContainer
        center={coordinates[0]}
        zoom={6}
        className="h-full w-full rounded-2xl"
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        <FitBounds coordinates={coordinates} onMapReady={onMapReady} />

        {coordinates.map((pos, index) => (
          <Marker key={index} position={pos}>
            <Popup>Stop {index + 1}</Popup>
          </Marker>
        ))}

        <Polyline positions={coordinates} color="#16a34a" />
      </MapContainer>
    </div>
  );
}
