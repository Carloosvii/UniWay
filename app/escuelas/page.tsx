import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FICHAS, ORDEN_INSTITUCIONES } from "@/lib/instituciones";

export const metadata: Metadata = { title: "Escuelas · UniWay" };

export default function EscuelasPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-10 py-12">
      <h1 className="display text-4xl md:text-5xl">Escuelas</h1>
      <p className="mt-3 text-lg text-ink-2">Conoce cada institución antes de elegir.</p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ORDEN_INSTITUCIONES.map((id) => {
          const f = FICHAS[id];
          return (
            <Link key={id} href={`/escuelas/${id}`} className="group block overflow-hidden rounded-2xl" style={{ background: f.colores.fondo }}>
              <div className="relative aspect-[16/10]">
                <Image
                  src={f.img}
                  alt={f.nombre}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  style={{ objectPosition: f.imgPosicion ?? "center" }}
                />
              </div>
              <div className="p-6">
                <p className="display text-3xl text-white">{f.nombreCorto}</p>
                <p className="mt-1 text-white/75">{f.tipo}</p>
                <p className="mt-4 font-semibold" style={{ color: f.colores.acento }}>Conocer más →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
