"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import SelectorInstituciones from "./SelectorInstituciones";
import BotonAgregar from "@/components/opciones/BotonAgregar";
import {
  ALCALDIAS,
  CENTRO_CDMX,
  ESCUELAS,
  INSTITUCIONES,
  buscarAlcaldia,
  distanciaKm,
  esEdomex,
  etiquetaTipo,
  linkComoLlegar,
  minutosEstimados,
  normalizar,
  type EscuelaConDistancia,
  type Institucion,
  type TipoIngreso,
} from "@/lib/escuelas";

// Leaflet usa `window`, así que el mapa solo se carga en el navegador
const MapaLeaflet = dynamic(() => import("./MapaLeaflet"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-surface animate-pulse" />,
});

const MAX_LISTA = 60; // la lista muestra las más cercanas; el mapa las muestra todas

export default function MapaEscuelas() {
  const params = useSearchParams();
  const alcaldiaInicial = buscarAlcaldia(params.get("ubicacion"));
  const institucionInicial = params.get("institucion") as Institucion | null;
  const tipoInicial = params.get("tipo");

  const [alcaldia, setAlcaldia] = useState<string>(alcaldiaInicial ?? "");
  const [miUbicacion, setMiUbicacion] = useState<[number, number] | null>(null);
  const [ubicando, setUbicando] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);
  const [texto, setTexto] = useState(params.get("interes") ?? "");
  const [instituciones, setInstituciones] = useState<Institucion[]>(
    institucionInicial && institucionInicial in INSTITUCIONES ? [institucionInicial] : [],
  );
  const [tipo, setTipo] = useState<TipoIngreso | "todos">(
    tipoInicial === "examen" || tipoInicial === "directo" ? tipoInicial : "todos",
  );
  const [soloAccesibles, setSoloAccesibles] = useState(false);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [verTodas, setVerTodas] = useState(false);

  const origen: [number, number] = miUbicacion ?? (alcaldia ? ALCALDIAS[alcaldia] : CENTRO_CDMX);

  const lista: EscuelaConDistancia[] = useMemo(() => {
    const q = normalizar(texto);
    return ESCUELAS.filter((e) => instituciones.length === 0 || instituciones.includes(e.institucion))
      .filter((e) => tipo === "todos" || e.tipo === tipo)
      .filter((e) => !soloAccesibles || e.accesibilidad)
      .filter(
        (e) =>
          !q ||
          normalizar(`${e.nombre} ${e.nombreOficial} ${e.alcaldia}`).includes(q) ||
          e.opciones.some((o) => normalizar(`${o.clave} ${o.especialidad}`).includes(q)),
      )
      .map((e) => {
        const km = distanciaKm(origen, [e.lat, e.lng]);
        return { ...e, km, minutos: minutosEstimados(km) };
      })
      .sort((a, b) => a.km - b.km);
  }, [origen, instituciones, tipo, soloAccesibles, texto]);

  const elegida = lista.find((e) => e.id === seleccion) ?? null;
  const visibles = verTodas ? lista : lista.slice(0, MAX_LISTA);

  function usarMiUbicacion() {
    if (!navigator.geolocation) {
      setErrorUbicacion("Tu navegador no permite compartir la ubicación.");
      return;
    }
    setUbicando(true);
    setErrorUbicacion(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMiUbicacion([pos.coords.latitude, pos.coords.longitude]);
        setSeleccion(null);
        setUbicando(false);
      },
      () => {
        setErrorUbicacion("No pudimos obtener tu ubicación. Elige tu alcaldía o municipio.");
        setUbicando(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }



  return (
    <div className="flex flex-col md:flex-row md:h-[calc(100vh-4rem)]">
      {/* Panel lateral */}
      <aside className="order-2 md:order-1 md:w-[420px] md:shrink-0 md:overflow-y-auto border-r border-line bg-white">
        <div className="p-4 space-y-4 border-b border-line">
          <h1 className="display text-2xl">Escuelas cerca de ti</h1>

          <label className="flex items-center gap-2 border-2 border-line px-3 py-2 focus-within:border-brand-300">
            <input
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                setSeleccion(null);
              }}
              placeholder="Nombre, carrera técnica o clave"
              className="flex-1 min-w-0 text-sm outline-none bg-transparent"
              aria-label="Buscar escuela"
            />
            {texto && (
              <button onClick={() => setTexto("")} aria-label="Borrar búsqueda" className="text-ink-2 hover:text-ink">
                <X size={16} />
              </button>
            )}
          </label>

          <div className="flex gap-2">
            <select
              value={miUbicacion ? "" : alcaldia}
              onChange={(e) => {
                setAlcaldia(e.target.value);
                setMiUbicacion(null);
                setSeleccion(null);
              }}
              className="flex-1 min-w-0 border-2 border-line px-3 py-2 text-sm bg-white"
              aria-label="Alcaldía o municipio"
            >
              <option value="">{miUbicacion ? "Mi ubicación" : "Alcaldía o municipio"}</option>
              <optgroup label="Ciudad de México">
                {Object.keys(ALCALDIAS)
                  .filter((a) => !esEdomex(a))
                  .sort((x, y) => x.localeCompare(y, "es"))
                  .map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
              </optgroup>
              <optgroup label="Estado de México">
                {Object.keys(ALCALDIAS)
                  .filter(esEdomex)
                  .sort((x, y) => x.localeCompare(y, "es"))
                  .map((a) => (
                    <option key={a} value={a}>{a.replace(", Edomex", "")}</option>
                  ))}
              </optgroup>
            </select>
            <button
              onClick={usarMiUbicacion}
              disabled={ubicando}
              className="flex items-center gap-1.5 display bg-buy px-3 py-2 text-sm text-ink hover:bg-buy-hover transition-colors"
            >
              {ubicando ? "Buscando…" : "Mi ubicación"}
            </button>
          </div>
          {errorUbicacion && <p className="text-sm text-red-700">{errorUbicacion}</p>}

          {/* Tipo de participación, igual que en Mi derecho, mi lugar */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-2 mb-2">Tipo de participación</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                ["todos", "Todas"],
                ["examen", "Con examen"],
                ["directo", "Sin examen"],
              ] as const).map(([valor, etiqueta]) => (
                <button
                  key={valor}
                  onClick={() => {
                    setTipo(valor);
                    setSeleccion(null);
                  }}
                  className={`display border-2 py-2 text-sm tracking-tight transition-colors ${
                    tipo === valor ? "bg-buy border-buy font-medium text-ink" : "border-line hover:border-brand-300"
                  }`}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-2 mb-2">Institución</p>
            <SelectorInstituciones
              seleccion={instituciones}
              onCambiar={(nuevas) => {
                setInstituciones(nuevas);
                setSeleccion(null);
              }}
            />
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={soloAccesibles}
              onChange={(e) => setSoloAccesibles(e.target.checked)}
              className="h-4 w-4 accent-[#466778]"
            />
            Con atención a personas con discapacidad
          </label>
        </div>

        <p className="px-4 pt-3 text-xs text-ink-2">
          {lista.length} escuelas · tiempos estimados en transporte público · Fuente: SEP, Mi derecho, mi lugar
        </p>

        <ul className="p-3 space-y-2.5">
          {visibles.map((e) => {
            const activa = seleccion === e.id;
            const color = INSTITUCIONES[e.institucion].color;
            return (
              <li key={e.id}>
                {/* Cada escuela va enmarcada con el color de su institución */}
                <button
                  onClick={() => {
                    setSeleccion(activa ? null : e.id);
                    // En celular el mapa está arriba: se sube para ver la ficha
                    if (!activa && window.innerWidth < 768) window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-pressed={activa}
                  className={`w-full text-left flex items-stretch gap-3 pr-4 border-2 transition-shadow ${
                    activa ? "bg-brand-50" : "bg-white hover:bg-surface"
                  }`}
                  style={{ borderColor: color, boxShadow: activa ? `inset 0 0 0 2px ${color}` : undefined }}
                >
                  {/* Panel con flecha en el color de la institución (en el mapa siguen los puntos de color) */}
                  <span
                    className="chevron [--punta:14px] shrink-0 w-[76px] flex items-center justify-center pr-3 text-white display text-[11px] tracking-wide"
                    style={{ background: INSTITUCIONES[e.institucion].color }}
                    aria-hidden
                  >
                    {INSTITUCIONES[e.institucion].sigla}
                  </span>
                  <span className="flex-1 min-w-0 py-3">
                    <span className="block font-semibold text-ink">{e.nombre}</span>
                    <span className="block text-sm text-ink-2">
                      {INSTITUCIONES[e.institucion].nombre} · {etiquetaTipo(e.tipo)}
                    </span>
                    <span className="block text-sm text-ink-2">{e.alcaldia.replace(", Edomex", ", Estado de México")}</span>
                  </span>
                  <span className="text-right shrink-0 py-3">
                    <span className="block display text-xl text-brand-700">{e.km.toFixed(1)} km</span>
                    <span className="block text-sm text-ink-2">≈ {e.minutos} min</span>
                  </span>
                </button>
              </li>
            );
          })}
          {lista.length > MAX_LISTA && !verTodas && (
            <li className="p-4">
              <button
                onClick={() => setVerTodas(true)}
                className="w-full border-2 border-line py-2.5 text-sm font-medium hover:border-brand-300"
              >
                Ver las {lista.length - MAX_LISTA} escuelas restantes
              </button>
            </li>
          )}
          {lista.length === 0 && (
            <li className="p-6 text-sm text-ink-2">No hay escuelas con esos filtros. Quita alguno para ver más.</li>
          )}
        </ul>
      </aside>

      {/* Mapa */}
      <div className="relative order-1 md:order-2 shrink-0 md:shrink md:flex-1 h-[55vh] md:h-auto">
        <MapaLeaflet origen={origen} escuelas={lista} seleccion={elegida?.id ?? null} onSeleccion={setSeleccion} />
        {elegida && <FichaPlantel escuela={elegida} origen={origen} onCerrar={() => setSeleccion(null)} />}
      </div>
    </div>
  );
}

// Ficha del plantel sobre el mapa: marco grueso y encabezado con el color de la institución
function FichaPlantel({
  escuela: e,
  origen,
  onCerrar,
}: {
  escuela: EscuelaConDistancia;
  origen: [number, number];
  onCerrar: () => void;
}) {
  const color = INSTITUCIONES[e.institucion].color;
  return (
    <div
      className="absolute z-[500] left-3 right-3 bottom-3 max-h-[75%] md:left-auto md:right-6 md:top-6 md:bottom-auto md:w-[400px] md:max-h-[calc(100%-3rem)] flex flex-col bg-white border-[5px] shadow-[0_12px_32px_rgb(0_0_0/0.3)]"
      style={{ borderColor: color }}
      role="dialog"
      aria-label={`Detalle de ${e.nombre}`}
    >
      <div className="flex items-start gap-3 px-5 py-4 text-white" style={{ background: color }}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/85">
            {INSTITUCIONES[e.institucion].nombre} · {etiquetaTipo(e.tipo)}
          </p>
          <h3 className="display uppercase text-2xl leading-tight mt-1">{e.nombre}</h3>
        </div>
        <button onClick={onCerrar} aria-label="Cerrar detalle" className="p-1 -mr-1 hover:bg-white/15">
          <X size={22} />
        </button>
      </div>

      <div className="overflow-y-auto px-5 py-4 text-sm space-y-4">
        <p className="flex items-baseline gap-3">
          <span className="display text-3xl text-brand-900">{e.km.toFixed(1)} km</span>
          <span className="text-ink-2">≈ {e.minutos} min en transporte público</span>
        </p>

        <p className="text-ink-2">{e.direccion}</p>

        <div>
          <p className="display uppercase text-brand-900">
            {e.opciones.length === 1 ? "Opción educativa" : `${e.opciones.length} opciones educativas`}
          </p>
          <ul className="mt-2 space-y-1.5">
            {e.opciones.map((o) => (
              <li key={o.clave} className="flex items-center justify-between gap-3">
                <span className="text-ink">
                  {o.especialidad || "Bachillerato general"}
                  <span className="ml-2 border border-line bg-surface px-1.5 py-0.5 font-mono text-xs text-ink-2">{o.clave}</span>
                </span>
                <BotonAgregar clave={o.clave} compacto />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-2">Usa la clave para registrar tu opción en Mi derecho, mi lugar.</p>
        </div>

        {e.accesibilidad && (
          <p className="text-ink-2">
            <span className="font-semibold text-ink">Accesibilidad: </span>
            {e.accesibilidad}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/escuelas/plantel/${e.id}`}
            className="display uppercase block text-center bg-brand-900 hover:bg-brand-700 px-4 py-3 text-white transition-colors"
          >
            Saber más
          </Link>
          <a
            href={linkComoLlegar(origen, e)}
            target="_blank"
            rel="noreferrer"
            className="display uppercase block text-center bg-buy hover:bg-buy-hover px-4 py-3 text-brand-900 transition-colors"
          >
            Cómo llegar
          </a>
        </div>
      </div>
    </div>
  );
}
