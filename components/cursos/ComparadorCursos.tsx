"use client";

import { useState } from "react";
import { CURSOS_PRIVADOS, precioMx, type CursoPrivado } from "@/lib/cursos";

type Filtro = "Todas" | CursoPrivado["modalidad"];

// Lista de cursos privados ordenada por precio, con filtro por modalidad
export default function ComparadorCursos() {
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const lista = CURSOS_PRIVADOS.filter((c) => filtro === "Todas" || c.modalidad === filtro).sort(
    (a, b) => a.precio - b.precio,
  );
  const masBarato = lista[0]?.precio;

  return (
    <div>
      <div className="flex gap-2" role="group" aria-label="Modalidad">
        {(["Todas", "En línea", "Presencial"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            aria-pressed={filtro === f}
            className={`display border-2 px-4 py-2 text-[15px] tracking-tight transition-colors ${
              filtro === f ? "bg-buy border-buy text-brand-900" : "border-line text-ink hover:border-brand-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-5 divide-y divide-line border-y border-line">
        {lista.map((c) => (
          <li key={`${c.academia}-${c.modalidad}`}>
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[1fr_auto] sm:grid-cols-[1.2fr_0.8fr_1.6fr_auto] items-center gap-x-6 gap-y-1 py-4 hover:bg-surface px-2 -mx-2"
            >
              <span className="font-semibold text-ink flex items-center gap-2">
                {c.academia}
                {c.precio === masBarato && (
                  <span className="bg-brand-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">Más económico</span>
                )}
              </span>
              <span className="display text-2xl text-ink text-right sm:order-last">{precioMx(c.precio)}</span>
              <span className="text-sm text-ink-2">{c.modalidad}</span>
              <span className="col-span-2 sm:col-span-1 text-sm text-ink-2 flex items-center gap-1.5">
                {c.nota}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-2">
        Precios de lista en MXN consultados el 8 de noviembre de 2026. Cambian con frecuencia y muchas academias ofrecen
        descuentos por pago anticipado: confirma en su sitio antes de pagar.
      </p>
    </div>
  );
}
