import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BotonAgregar from "@/components/opciones/BotonAgregar";
import TarjetaChevron from "@/components/ui/TarjetaChevron";
import { EnlaceCorchetes, TituloLinea } from "@/components/ui/Clemson";
import { ESCUELAS, INSTITUCIONES, distanciaKm, etiquetaTipo, type Escuela } from "@/lib/escuelas";
import { FICHAS, type InstitucionConFicha } from "@/lib/instituciones";

type Params = { params: Promise<{ id: string }> };

async function buscar(params: Params["params"]) {
  const { id } = await params;
  return ESCUELAS.find((e) => e.id === id);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = await buscar(params);
  return { title: e ? `${e.nombre} · UniWay` : "Plantel · UniWay" };
}

// Colores: los de la ficha de la institución si existe; si no, el color de su punto en el mapa
function colores(e: Escuela) {
  const ficha = FICHAS[e.institucion as InstitucionConFicha];
  if (ficha) return ficha.colores;
  const c = INSTITUCIONES[e.institucion].color;
  return { fondo: c, acento: "#ffffff", textoBoton: c };
}

export default async function PlantelPage({ params }: Params) {
  const e = await buscar(params);
  if (!e) notFound();
  const { fondo, acento, textoBoton } = colores(e);
  const lugar = e.alcaldia.replace(", Edomex", ", Estado de México");

  // Enlaces externos: fotos de la ficha de Google Maps y búsqueda de videos en TikTok
  // Google Maps no tiene un enlace público que abra directo la pestaña de fotos; Google Imágenes sí muestra fotos al instante
  const nombreBusqueda = `${e.nombre} ${INSTITUCIONES[e.institucion].nombre}, ${lugar}`;
  const fotos = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(nombreBusqueda)}`;
  const enMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nombreBusqueda)}`;
  // Tamaños según el largo del nombre para que no se encime con el mapa
  const largo = e.nombre.length > 16;
  const tamOficial = e.nombreOficial.length > 60 ? "text-xl md:text-2xl" : e.nombreOficial.length > 35 ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl";
  const tiktok = `https://www.tiktok.com/search?q=${encodeURIComponent(e.nombre)}`;
  const comoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}&travelmode=transit`;
  const d = 0.006;
  const mapa = `https://www.openstreetmap.org/export/embed.html?bbox=${e.lng - d * 1.6},${e.lat - d},${e.lng + d * 1.6},${e.lat + d}&layer=mapnik&marker=${e.lat},${e.lng}`;

  const cercanas = ESCUELAS.filter((x) => x.id !== e.id)
    .map((x) => ({ x, km: distanciaKm([e.lat, e.lng], [x.lat, x.lng]) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 3);

  return (
    <>
      {/* Conoce el plantel: marco blanco con el título rompiendo el borde */}
      <section style={{ background: fondo }} className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="relative border-[6px] border-white">
            <h1
              className={`display uppercase text-white absolute left-5 md:left-12 px-4 leading-[0.95] max-w-[calc(100%-2.5rem)] md:max-w-[calc(50%-4rem)] ${
                largo ? "text-2xl md:text-4xl -top-4 md:-top-6" : "text-3xl md:text-5xl -top-5 md:-top-8"
              }`}
              style={{ background: fondo }}
            >
              Conoce {e.nombre}
            </h1>

            <div className="grid md:grid-cols-2">
              <div className={`px-6 md:px-12 pb-10 md:pb-16 flex flex-col justify-center text-white ${largo ? "pt-24 md:pt-28" : "pt-14 md:pt-16"}`}>
                <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                  {INSTITUCIONES[e.institucion].nombre} · {etiquetaTipo(e.tipo)}
                </p>
                <h2 className={`display mt-3 uppercase ${tamOficial}`} style={{ color: acento }}>
                  {e.nombreOficial}
                </h2>
                <p className="mt-5 text-lg text-white/90">{e.direccion}</p>
                <p className="mt-1 text-white/70">{lugar}</p>

                <div className="mt-8 grid sm:grid-cols-2 gap-3">
                  <a
                    href={fotos}
                    target="_blank"
                    rel="noreferrer"
                    className="display uppercase text-lg px-6 py-4 text-center hover:opacity-90 transition-opacity"
                    style={{ background: acento, color: textoBoton }}
                  >
                    Ver fotos
                  </a>
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="display uppercase text-lg px-6 py-4 text-center text-white bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Videos en TikTok
                  </a>
                </div>
              </div>

              <div className="relative min-h-[320px] md:min-h-[460px] bg-white/10">
                <iframe
                  title={`Mapa de ${e.nombre}`}
                  src={mapa}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opciones educativas */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-14 md:py-16">
        <TituloLinea>{e.opciones.length === 1 ? "Opción educativa" : "Opciones educativas"}</TituloLinea>
        <p className="mt-5 text-lg text-ink-2 max-w-2xl">
          Marca con el corazón tus favoritas. Después, en tu perfil, armas y ordenas tu lista de{" "}
          <strong className="text-ink">Mis opciones</strong>.
        </p>
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {e.opciones.map((o) => (
            <TarjetaChevron
              key={o.clave}
              panel={fondo}
              acento={fondo}
              valor={o.clave}
              texto={<span className="block">{o.especialidad || "Bachillerato general"}</span>}
              etiqueta="Clave para Mi derecho, mi lugar"
            >
              <div className="mt-4">
                <BotonAgregar clave={o.clave} />
              </div>
            </TarjetaChevron>
          ))}
        </div>
      </section>

      {/* Datos prácticos y escuelas cercanas */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-14 md:py-16 grid lg:grid-cols-2 gap-10">
          <div>
            <TituloLinea>Antes de ir</TituloLinea>
            <dl className="mt-8 space-y-5">
              <div className="border-l-[5px] pl-5" style={{ borderColor: fondo }}>
                <dt className="display uppercase text-brand-900">Ingreso</dt>
                <dd className="mt-1 text-ink">
                  {e.tipo === "examen"
                    ? "Con examen: regístrala en la modalidad 2 o 3 de Mi derecho, mi lugar."
                    : "Sin examen: regístrala en la modalidad 1 o 3 de Mi derecho, mi lugar."}
                </dd>
              </div>
              <div className="border-l-[5px] pl-5" style={{ borderColor: fondo }}>
                <dt className="display uppercase text-brand-900">Accesibilidad</dt>
                <dd className="mt-1 text-ink">{e.accesibilidad ?? "El registro oficial no reporta infraestructura de accesibilidad."}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <EnlaceCorchetes href={comoLlegar} externo>
                Cómo llegar en transporte público
              </EnlaceCorchetes>
              <span className="mx-3 text-ink-2" aria-hidden>
                ·
              </span>
              <EnlaceCorchetes href={enMaps} externo>
                Abrir en Google Maps
              </EnlaceCorchetes>
            </div>
          </div>

          <div>
            <TituloLinea>Cerca de aquí</TituloLinea>
            <ul className="mt-8 space-y-3">
              {cercanas.map(({ x, km }) => (
                <li key={x.id}>
                  <Link
                    href={`/escuelas/plantel/${x.id}`}
                    className="flex items-center justify-between gap-4 bg-white border-2 px-5 py-4 hover:bg-brand-50 transition-colors"
                    style={{ borderColor: INSTITUCIONES[x.institucion].color }}
                  >
                    <span>
                      <span className="block font-semibold text-ink">{x.nombre}</span>
                      <span className="block text-sm text-ink-2">
                        {INSTITUCIONES[x.institucion].nombre} · {etiquetaTipo(x.tipo)}
                      </span>
                    </span>
                    <span className="display text-xl text-brand-700 shrink-0">{km.toFixed(1)} km</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
