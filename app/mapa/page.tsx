import type { Metadata } from "next";
import { Suspense } from "react";
import MapaEscuelas from "@/components/mapa/MapaEscuelas";

export const metadata: Metadata = {
  title: "Mapa de escuelas · UniWay",
};

export default function MapaPage() {
  return (
    <Suspense>
      <MapaEscuelas />
    </Suspense>
  );
}
