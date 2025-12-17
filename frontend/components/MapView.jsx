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

// Fit bounds once per route
function FitOnce({ coordinates }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!coordinates?.length || fitted.current) return;
    map.fitBounds(coordinates, { padding: [40, 40] });
    fitted.current = true;
  }, [coordinates, map]);

  return null;
}

export default function MapView({ coordinates = [], color }) {
  const safeCoordinates = coordinates.filter(
    (c) =>
      Array.isArray(c) &&
      c.length === 2 &&
      typeof c[0] === "number" &&
      typeof c[1] === "number"
  );

  return (
    <div className="h-full w-full">
      <MapContainer
        center={safeCoordinates[0] || [20.5937, 78.9629]} // India fallback
        zoom={5}
        className="h-full w-full"
        preferCanvas
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {safeCoordinates.length >= 2 && (
          <>
            <FitOnce coordinates={safeCoordinates} />

            <Marker position={safeCoordinates[0]}>
              <Popup>Start</Popup>
            </Marker>

            <Marker position={safeCoordinates[safeCoordinates.length - 1]}>
              <Popup>Destination</Popup>
            </Marker>

            <Polyline
              positions={safeCoordinates}
              pathOptions={{ color, weight: 5 }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
