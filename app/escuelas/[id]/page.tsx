import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DondeEsta from "@/components/escuelas/DondeEsta";
import TarjetaChevron from "@/components/ui/TarjetaChevron";
import { FICHAS, ORDEN_INSTITUCIONES } from "@/lib/instituciones";
import type { InstitucionConFicha } from "@/lib/instituciones";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return ORDEN_INSTITUCIONES.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const ficha = FICHAS[(await params).id as InstitucionConFicha];
  return { title: ficha ? `${ficha.nombreCorto} · UniWay` : "Escuela · UniWay" };
}

export default async function InstitucionPage({ params }: Params) {
  const ficha = FICHAS[(await params).id as InstitucionConFicha];
  if (!ficha) notFound();
  const { fondo, acento, textoBoton } = ficha.colores;

  return (
    <>
      {/* Conoce a… (con los colores de la institución) */}
      <section style={{ background: fondo }} className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="relative border-[6px] border-white">
            {/* El título "rompe" el marco superior */}
            <h1
              className="display uppercase text-white text-4xl md:text-6xl absolute -top-6 md:-top-9 left-6 md:left-12 px-4"
              style={{ background: fondo }}
            >
              Conoce {ficha.nombreCorto}
            </h1>

            <div className="grid md:grid-cols-2">
              <div className="px-6 md:px-12 pt-16 pb-10 md:py-20 flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/70">{ficha.nombre}</p>
                <h2 className="display text-4xl md:text-5xl mt-3" style={{ color: acento }}>
                  {ficha.titular}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-white/90">{ficha.descripcion}</p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/mapa?institucion=${ficha.id}`}
                    className="display uppercase text-lg px-8 py-4 text-center hover:opacity-90 transition-opacity"
                    style={{ background: acento, color: textoBoton, letterSpacing: "-0.01em" }}
                  >
                    Ver planteles
                  </Link>
                  <Link
                    href={ficha.tipo === "Con examen" ? "/simulador" : "/becas"}
                    className="display uppercase text-lg px-8 py-4 text-center text-white bg-white/10 hover:bg-white/20 transition-colors"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {ficha.tipo === "Con examen" ? "Simular mi ingreso" : "Ver becas"}
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[320px] md:min-h-[520px]">
                <Image
                  src={ficha.img}
                  alt={ficha.nombre}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: ficha.imgPosicion ?? "center" }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Datos relevantes, en tarjetas con flecha y los colores de la institución */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-14">
        <div className="grid lg:grid-cols-3 gap-6">
          {ficha.datos.map((d) => (
            <TarjetaChevron
              key={d.etiqueta}
              panel={fondo}
              acento={fondo}
              valor={d.valor}
              texto={<span className="block">{d.etiqueta}</span>}
              etiqueta={ficha.nombreCorto}
            />
          ))}
        </div>
      </section>

      <DondeEsta ficha={ficha} />

      {/* Otras instituciones */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
        <h2 className="display text-3xl">Conoce otras opciones</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {ORDEN_INSTITUCIONES.filter((id) => id !== ficha.id).map((id) => (
            <Link
              key={id}
              href={`/escuelas/${id}`}
              className="display uppercase border-[3px] border-brand-900 px-6 py-3 text-brand-900 hover:bg-brand-900 hover:text-white transition-colors"
            >
              {FICHAS[id].nombreCorto}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

