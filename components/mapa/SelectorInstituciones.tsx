"use client";

import { useEffect, useId, useRef, useState } from "react";
import { INSTITUCIONES, normalizar, type Institucion } from "@/lib/escuelas";

const TODAS = Object.keys(INSTITUCIONES) as Institucion[];

// Desplegable con buscador para elegir una o varias instituciones
export default function SelectorInstituciones({
  seleccion,
  onCambiar,
}: {
  seleccion: Institucion[];
  onCambiar: (nuevas: Institucion[]) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const caja = useRef<HTMLDivElement>(null);
  const idLista = useId();

  // Se cierra al hacer clic fuera o con Escape
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false);
    };
    const escape = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", escape);
    };
  }, [abierto]);

  const q = normalizar(busqueda);
  const opciones = TODAS.filter((i) => !q || normalizar(INSTITUCIONES[i].nombre).includes(q));
  const alternar = (i: Institucion) =>
    onCambiar(seleccion.includes(i) ? seleccion.filter((x) => x !== i) : [...seleccion, i]);

  const resumen =
    seleccion.length === 0
      ? "Todas las instituciones"
      : seleccion.length <= 2
        ? seleccion.map((i) => INSTITUCIONES[i].nombre).join(", ")
        : `${INSTITUCIONES[seleccion[0]].nombre} y ${seleccion.length - 1} más`;

  return (
    <div ref={caja} className="relative">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls={idLista}
        className={`w-full flex items-center justify-between gap-3 border-2 bg-white px-3 py-2.5 text-left text-sm transition-colors ${
          abierto ? "border-brand-700" : "border-line hover:border-brand-900"
        }`}
      >
        <span className={`truncate ${seleccion.length ? "text-ink font-semibold" : "text-ink-2"}`}>{resumen}</span>
        <span className="text-ink-2 text-xs" aria-hidden>
          {abierto ? "▲" : "▼"}
        </span>
      </button>

      {abierto && (
        <div id={idLista} className="absolute z-20 mt-1 w-full border-2 border-brand-900 bg-white shadow-[0_12px_28px_rgb(0_0_0/0.18)]">
          <input
            autoFocus
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar institución"
            aria-label="Buscar institución"
            className="w-full border-b-2 border-line px-3 py-2.5 text-sm outline-none focus:border-brand-700"
          />
          <ul className="max-h-64 overflow-y-auto py-1" role="listbox" aria-multiselectable="true">
            {opciones.map((i) => {
              const marcada = seleccion.includes(i);
              return (
                <li key={i} role="option" aria-selected={marcada}>
                  <label className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-surface">
                    <input
                      type="checkbox"
                      checked={marcada}
                      onChange={() => alternar(i)}
                      className="h-4 w-4 accent-[#466778]"
                    />
                    {/* Muestra de color: el mismo de los puntos del mapa */}
                    <span className="h-3 w-3 shrink-0" style={{ background: INSTITUCIONES[i].color }} aria-hidden />
                    <span className="flex-1">{INSTITUCIONES[i].nombre}</span>
                  </label>
                </li>
              );
            })}
            {opciones.length === 0 && <li className="px-3 py-2 text-sm text-ink-2">Sin resultados</li>}
          </ul>
          <div className="flex border-t-2 border-line">
            <button
              type="button"
              onClick={() => onCambiar([])}
              className="display flex-1 px-3 py-2.5 text-sm text-brand-900 hover:bg-surface"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="display flex-1 bg-buy px-3 py-2.5 text-sm text-brand-900 hover:bg-buy-hover"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
