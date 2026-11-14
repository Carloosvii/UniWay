import type { Metadata } from "next";
import Image from "next/image";
import ListaBecas from "@/components/becas/ListaBecas";
import { EnlaceCorchetes, PortadaMarco, TituloLinea } from "@/components/ui/Clemson";
import { CALENDARIO } from "@/lib/becas";

export const metadata: Metadata = { title: "Becas · UniWay" };

export default function BecasPage() {
  return (
    <>
      <PortadaMarco
        titulo="Tu prepa, con"
        resaltado="apoyo"
        texto="Las becas del gobierno y de tu escuela, reunidas en un solo lugar. Sin buscar en grupos de Facebook."
        img="/img/becas/escolta.jpg"
        imgAlt="Estudiantes de secundaria en una escolta con la bandera de México"
        imgPosicion="60% center"
        acciones={[
          { href: "#becas", label: "Ver becas" },
          { href: "/registro", label: "Recibir avisos" },
        ]}
      />

      {/* Lista filtrable */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-16 md:py-20">
        <TituloLinea id="becas">Becas</TituloLinea>
        <p className="mt-6 mb-8 text-lg text-ink-2 max-w-2xl">
          Para antes de entrar y durante la prepa. Filtra por quién la da y entra directo al sitio oficial.
        </p>
        <ListaBecas />
        <p className="mt-6 text-xs text-ink-2">
          Montos y fechas consultados el 8 de noviembre de 2026. Cambian cada ciclo: confirma siempre en el sitio oficial.
        </p>
      </section>

      {/* Calendario y aviso contra fraudes, con fotos a la derecha */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16 md:py-20">
          <TituloLinea>Calendario</TituloLinea>
          <div className="mt-10 grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14">
            <div>
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Que no se te pase la fecha</h3>
              <p className="mt-4 text-lg leading-relaxed text-ink-2">
                Las convocatorias abren pocos días al año. Estos son los meses en que suelen abrir.
              </p>
              <ol className="mt-8 space-y-3">
                {CALENDARIO.map((c) => (
                  <li key={c.mes} className="flex items-stretch bg-white shadow-[0_2px_10px_rgb(0_0_0/0.06)]">
                    <span className="chevron [--punta:14px] display uppercase w-20 shrink-0 bg-brand-900 text-white text-xl flex items-center justify-center pr-3">
                      {c.mes}
                    </span>
                    <span className="px-4 py-3 text-ink">{c.becas.join(" · ")}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <EnlaceCorchetes href="/registro">Avísame cuando abran</EnlaceCorchetes>
              </div>
            </div>

            <div>
              <div className="relative aspect-[4/3]">
                <Image
                  src="/img/becas/cu-biblioteca.jpg"
                  alt="Biblioteca Central de Ciudad Universitaria al atardecer"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-6 border-l-[5px] border-brand-700 bg-white px-6 py-5">
                <p className="display uppercase text-brand-900 text-2xl">Las becas del gobierno son gratuitas</p>
                <p className="mt-2 text-ink-2">
                  Nadie te puede cobrar por registrarte ni pedirte tus contraseñas. Si una página o un grupo te pide dinero, es
                  fraude: regístrate solo en los sitios oficiales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
