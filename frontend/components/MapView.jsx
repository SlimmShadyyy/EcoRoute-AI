"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitOnce({ coordinates, onMapReady }) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (!coordinates?.length || hasFitted.current) return;

    map.fitBounds(coordinates, { padding: [40, 40] });
    hasFitted.current = true;
    onMapReady?.();
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
        minZoom={4}
        maxZoom={12}
        className="h-full w-full"
        preferCanvas
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenIdle={true}
          keepBuffer={2}
        />

        <FitOnce coordinates={coordinates} onMapReady={onMapReady} />

        {/* Start marker */}
        <Marker position={coordinates[0]}>
          <Popup>Start</Popup>
        </Marker>
        
        {/* End marker */}
        <Marker position={coordinates[coordinates.length - 1]}>
          <Popup>Destination</Popup>
        </Marker>

        <Polyline
          positions={coordinates}
          pathOptions={{ color, weight: 5 }}
        />
      </MapContainer>
    </div>
  );
}
