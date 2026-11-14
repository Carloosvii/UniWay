import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import { FICHAS, ORDEN_INSTITUCIONES } from "@/lib/instituciones";

const accesos = [
  { titulo: "Mapa", texto: "Escuelas cerca de ti", href: "/mapa" },
  { titulo: "Becas", texto: "Todas en un lugar", href: "/becas" },
  { titulo: "Cursos", texto: "Gratis y de paga", href: "/cursos" },
  { titulo: "Simulador", texto: "UNAM e IPN", href: "/simulador" },
];

export default function Home() {
  return (
    <>
      <HeroCarousel />

      {/* Accesos rápidos: una sola barra montada sobre el borde inferior de la foto */}
      <nav aria-label="Accesos rápidos" className="relative z-10 -mt-10 md:-mt-11 px-5 lg:px-10">
        <ul className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 bg-brand-700 shadow-[0_6px_16px_rgb(0_0_0/0.18)]">
          {accesos.map(({ titulo, texto, href }, i) => (
            <li key={titulo} className={`border-white/20 ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
              <Link
                href={href}
                className="block h-full px-4 py-4 md:py-5 text-center text-white hover:bg-brand-900 transition-colors"
              >
                <span className="display block text-xl md:text-2xl" style={{ letterSpacing: "-0.015em" }}>
                  {titulo}
                </span>
                <span className="block text-sm text-white/80">{texto}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Instituciones */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="display text-3xl md:text-4xl text-ink">Explora por institución</h2>
          <Link href="/escuelas" className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ORDEN_INSTITUCIONES.map((id) => {
            const f = FICHAS[id];
            return (
              <Link key={id} href={`/escuelas/${id}`} className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface">
                  <Image
                    src={f.img}
                    alt={f.nombre}
                    fill
                    sizes="(min-width: 768px) 20vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    style={{ objectPosition: f.imgPosicion ?? "center" }}
                  />
                </div>
                <p className="mt-3 font-semibold text-ink leading-tight">{f.nombreCorto}</p>
                <p className="text-sm text-ink-2">{f.tipo}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
