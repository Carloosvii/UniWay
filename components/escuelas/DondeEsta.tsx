import Image from "next/image";
import Link from "next/link";
import { ESCUELAS, esEdomex } from "@/lib/escuelas";
import type { FichaInstitucion } from "@/lib/instituciones";
import { SILUETA_CDMX, proyectarCdmx } from "@/lib/siluetaCdmx";

const MAX_PLANTELES = 5;

// Sección "¿Dónde está?": foto de fondo, franja oscura, texto y silueta de la CDMX con pines
export default function DondeEsta({ ficha }: { ficha: FichaInstitucion }) {
  const todos = ESCUELAS.filter((e) => e.institucion === ficha.id);
  // Solo los de la CDMX caben en la silueta; se toman repartidos para que no queden todos juntos
  const enCdmx = todos.filter((e) => !esEdomex(e.alcaldia));
  const paso = Math.max(1, Math.floor(enCdmx.length / MAX_PLANTELES));
  const planteles = enCdmx.filter((_, i) => i % paso === 0).slice(0, MAX_PLANTELES);
  const restantes = todos.length - planteles.length;

  return (
    <section className="relative overflow-hidden">
      <Image
        src={ficha.img}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: ficha.imgPosicion ?? "center" }}
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative py-16 md:py-24">
        <div className="bg-black/70 md:mr-[12%]">
          <div className="mx-auto max-w-7xl px-5 lg:px-10 py-10 grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div className="text-white max-w-xl">
              <h2 className="display uppercase text-4xl md:text-5xl">¿Dónde está {ficha.nombreCorto}?</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/90">{ficha.ubicacion}</p>

              {planteles.length > 0 && (
                <>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/70">Algunos planteles</p>
                  <ul className="mt-2 space-y-1.5">
                    {planteles.map((p) => (
                      <li key={p.id} className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: ficha.colores.acento }} />
                        <span className="font-medium">{p.nombre}</span>
                        <span className="text-white/60">· {p.alcaldia}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/mapa?institucion=${ficha.id}`}
                    className="mt-6 inline-block font-semibold underline underline-offset-4 decoration-2 hover:opacity-80"
                    style={{ color: ficha.colores.acento }}
                  >
                    {restantes > 0 ? `Ver los ${todos.length} planteles en el mapa` : "Ver en el mapa"}
                  </Link>
                </>
              )}
            </div>

            <svg
              viewBox={SILUETA_CDMX.viewBox}
              className="w-52 md:w-72 mx-auto md:-my-24"
              role="img"
              aria-label={`Mapa de la Ciudad de México con planteles de ${ficha.nombreCorto}`}
            >
              <path
                d={SILUETA_CDMX.path}
                fill="rgba(255,255,255,0.28)"
                stroke="#fff"
                strokeWidth={6}
                strokeLinejoin="round"
              />
              {planteles.map((p) => {
                const { x, y } = proyectarCdmx(p.lat, p.lng);
                return (
                  <g key={p.id} transform={`translate(${x} ${y})`}>
                    <path
                      d="M0 0c-4-8-14-14-14-25a14 14 0 0 1 28 0c0 11-10 17-14 25Z"
                      fill={ficha.colores.acento}
                      stroke="#fff"
                      strokeWidth={3}
                    />
                    <circle cx={0} cy={-25} r={5} fill={ficha.colores.fondo} />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
