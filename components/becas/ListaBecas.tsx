"use client";

import { useState } from "react";
import TarjetaChevron from "@/components/ui/TarjetaChevron";
import { EnlaceCorchetes } from "@/components/ui/Clemson";
import { AMBITOS, BECAS, type Ambito, type Etapa } from "@/lib/becas";

const chip = (activo: boolean) =>
  `display border-2 px-4 py-2 text-[15px] tracking-tight transition-colors ${
    activo ? "bg-buy border-buy text-brand-900" : "border-line text-ink hover:border-brand-900"
  }`;

// Becas filtrables por quién las da y por etapa escolar
export default function ListaBecas() {
  const [ambito, setAmbito] = useState<Ambito | "Todas">("Todas");
  const [etapa, setEtapa] = useState<Etapa | "Todas">("Todas");
  const lista = BECAS.filter((b) => (ambito === "Todas" || b.ambito === ambito) && (etapa === "Todas" || b.etapa === etapa));

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Quién da la beca">
          {(["Todas", ...AMBITOS] as const).map((a) => (
            <button key={a} onClick={() => setAmbito(a)} aria-pressed={ambito === a} className={chip(ambito === a)}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Etapa escolar">
          {(["Todas", "Antes de la prepa", "Durante la prepa"] as const).map((e) => (
            <button key={e} onClick={() => setEtapa(e)} aria-pressed={etapa === e} className={chip(etapa === e)}>
              {e === "Todas" ? "Cualquier etapa" : e}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        {lista.map((b) => (
          <TarjetaChevron
            key={b.id}
            valor={b.monto}
            texto={
              <>
                {b.periodo && <span className="text-ink-2">{b.periodo}. </span>}
                <span className="block mt-1">{b.paraQuien}</span>
              </>
            }
            etiqueta={`${b.nombre} · ${b.ambito}`}
          >
            <p className="mt-2 text-sm text-ink-2">
              <span className="font-semibold text-ink">Registro:</span> {b.registro}
            </p>
            <div className="mt-3">
              <EnlaceCorchetes href={b.url} externo>
                Sitio oficial
              </EnlaceCorchetes>
            </div>
          </TarjetaChevron>
        ))}
        {lista.length === 0 && <p className="text-ink-2">No hay becas con esos filtros.</p>}
      </div>
    </div>
  );
}
