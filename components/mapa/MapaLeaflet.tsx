"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { INSTITUCIONES, type EscuelaConDistancia } from "@/lib/escuelas";

interface Props {
  origen: [number, number];
  escuelas: EscuelaConDistancia[];
  seleccion: string | null;
  onSeleccion: (id: string) => void;
}

// Mueve la cámara cuando cambia el origen o la escuela seleccionada
// (recibe números sueltos para no volver a moverse en cada render)
function Camara({ origen, lat, lng }: { origen: [number, number]; lat?: number; lng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) map.flyTo([lat, lng], 15, { duration: 0.8 });
    else map.flyTo(origen, 12, { duration: 0.8 });
  }, [map, origen, lat, lng]);
  return null;
}

export default function MapaLeaflet({ origen, escuelas, seleccion, onSeleccion }: Props) {
  const elegida = escuelas.find((e) => e.id === seleccion);

  return (
    <MapContainer center={origen} zoom={12} scrollWheelZoom className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Camara origen={origen} lat={elegida?.lat} lng={elegida?.lng} />

      {/* Tu ubicación */}
      <CircleMarker
        center={origen}
        radius={8}
        pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#1a73e8", fillOpacity: 1 }}
      >
        <Popup>Tu ubicación</Popup>
      </CircleMarker>

      {escuelas.map((e) => {
        const activa = e.id === seleccion;
        // El detalle se abre en la ficha sobre el mapa (no en un globo)
        return (
          <CircleMarker
            key={e.id}
            center={[e.lat, e.lng]}
            radius={activa ? 11 : 7}
            pathOptions={{
              color: activa ? "#2e444f" : "#ffffff",
              weight: activa ? 3 : 2,
              fillColor: INSTITUCIONES[e.institucion].color,
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSeleccion(e.id) }}
          />
        );
      })}
    </MapContainer>
  );
}
