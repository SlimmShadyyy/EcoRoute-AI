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
        className="h-full w-full"
        preferCanvas={true} // 🚀 performance boost
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenIdle={true}
          keepBuffer={2}
        />

        <FitOnce coordinates={coordinates} onMapReady={onMapReady} />

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
          smoothFactor={1.5}
        />
      </MapContainer>
    </div>
  );
}
