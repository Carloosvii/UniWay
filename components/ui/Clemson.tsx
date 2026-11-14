import Image from "next/image";
import Link from "next/link";

// Piezas de diseño compartidas por Becas y Simulador (inspiradas en portadas institucionales):
// portada con marco sobre fondo con ondas, títulos con línea y enlaces entre corchetes.

// Ondas suaves en un tono apenas más claro que el fondo
export const ONDAS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120' viewBox='0 0 240 120'%3E%3Cpath d='M0 30c40-30 80 30 120 0s80 30 120 0M0 90c40-30 80 30 120 0s80 30 120 0' fill='none' stroke='%23466778' stroke-opacity='.45' stroke-width='22'/%3E%3C/svg%3E\")";

type Accion = { href: string; label: string; externo?: boolean };

export function PortadaMarco({
  titulo,
  resaltado,
  texto,
  img,
  imgAlt,
  imgPosicion = "center",
  acciones,
}: {
  titulo: string;
  resaltado: string; // palabra que va en el color principal
  texto: string;
  img: string;
  imgAlt: string;
  imgPosicion?: string;
  acciones: [Accion, Accion?];
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900" style={{ backgroundImage: ONDAS, backgroundSize: "240px 120px" }}>
      {/* Foto a la derecha que se funde con el fondo */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[58%]">
        <Image src={img} alt={imgAlt} fill priority sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" style={{ objectPosition: imgPosicion }} />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/40 to-brand-900/10 md:via-brand-900/25" />
        <div className="absolute inset-0 bg-brand-900/45 md:hidden" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-10 py-14 md:py-20">
        <div className="border-[5px] border-buy max-w-2xl px-6 py-10 md:px-14 md:py-16 bg-brand-900/30 md:bg-transparent">
          <h1 className="display uppercase text-white text-5xl md:text-7xl leading-[0.95]">
            {titulo} <span className="text-buy">{resaltado}</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">{texto}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {acciones.filter(Boolean).map((a, i) => {
              const clases = `display uppercase text-center text-lg px-8 py-4 transition-colors ${
                i === 0 ? "bg-buy text-brand-900 hover:bg-buy-hover" : "bg-brand-700 text-white hover:bg-brand-500"
              }`;
              return a!.externo ? (
                <a key={a!.href} href={a!.href} target="_blank" rel="noreferrer" className={clases}>
                  {a!.label}
                </a>
              ) : (
                <Link key={a!.href} href={a!.href} className={clases}>
                  {a!.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Título de sección: guion corto, texto en mayúsculas y línea que corre hasta el borde
export function TituloLinea({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="scroll-mt-24 flex items-center gap-4">
      <span className="h-[3px] w-8 shrink-0 bg-brand-300" aria-hidden />
      <h2 className="display uppercase text-brand-900 text-4xl md:text-5xl shrink-0">{children}</h2>
      <span className="h-[3px] flex-1 bg-brand-300" aria-hidden />
    </div>
  );
}

// Enlace entre corchetes, como los de las secciones académicas
export function EnlaceCorchetes({ href, children, externo }: { href: string; children: React.ReactNode; externo?: boolean }) {
  const clases = "display uppercase inline-block text-brand-700 hover:text-brand-900 text-lg tracking-tight";
  const contenido = (
    <>
      [ <span className="underline-offset-4 hover:underline">{children}</span> ]
    </>
  );
  return externo ? (
    <a href={href} target="_blank" rel="noreferrer" className={clases}>
      {contenido}
    </a>
  ) : (
    <Link href={href} className={clases}>
      {contenido}
    </Link>
  );
}
