import type { Metadata } from "next";
import Image from "next/image";
import Simulador from "@/components/simulador/Simulador";
import { EnlaceCorchetes, PortadaMarco, TituloLinea } from "@/components/ui/Clemson";

export const metadata: Metadata = { title: "Simulador · UniWay" };

// Siguientes pasos después del diagnóstico, al estilo de las secciones académicas
const PASOS = [
  {
    img: "/img/hero-estudiantes.jpg",
    alt: "Estudiantes estudiando juntos",
    titulo: "Estudia por áreas",
    href: "/cursos#gratis",
    enlace: "Cursos gratis",
  },
  {
    img: "/img/unam.jpg",
    alt: "Ciudad Universitaria de la UNAM",
    titulo: "Conoce las escuelas con examen",
    href: "/mapa?tipo=examen",
    enlace: "Ver UNAM e IPN en el mapa",
  },
  {
    img: "/img/ipn.png",
    alt: "Instituto Politécnico Nacional",
    titulo: "Mídete con un examen completo",
    href: "https://www.pruebate.bach.unam.mx:8181/pruebateb/",
    enlace: "Pruébate UNAM",
    externo: true,
  },
];

export default function SimuladorPage() {
  return (
    <>
      <PortadaMarco
        titulo="Ponte a prueba antes del"
        resaltado="examen"
        texto="Descubre en 15 minutos qué materias dominas y cuáles te conviene repasar para la UNAM y el IPN."
        img="/img/hero-estudiantes.jpg"
        imgAlt="Estudiantes estudiando"
        acciones={[
          { href: "#simulador", label: "Empezar" },
          { href: "https://www.pruebate.bach.unam.mx:8181/pruebateb/", label: "Pruébate UNAM", externo: true },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-16 md:py-20">
        <TituloLinea id="simulador">Simulador</TituloLinea>
        <div className="mt-10">
          <Simulador />
        </div>
        <p className="mt-4 text-xs text-ink-2">
          Preguntas de práctica de UniWay. No son reactivos oficiales ni predicen tu resultado en el examen real.
        </p>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16 md:py-20">
          <TituloLinea>Después</TituloLinea>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {PASOS.map((p) => (
              <div key={p.titulo}>
                <div className="relative aspect-[4/3]">
                  <Image src={p.img} alt={p.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink">{p.titulo}</h3>
                <div className="mt-2">
                  <EnlaceCorchetes href={p.href} externo={p.externo}>
                    {p.enlace}
                  </EnlaceCorchetes>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
