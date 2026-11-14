import Link from "next/link";
import { ONDAS } from "@/components/ui/Clemson";

// Datos comunes de las páginas legales
export const CONTACTO = "carloscii203@gmail.com";
export const ACTUALIZACION = "14 de noviembre de 2026";

export interface Seccion {
  id: string;
  titulo: string;
  contenido: React.ReactNode;
}

// Plantilla de documento legal: encabezado con ondas, índice fijo a la izquierda y secciones numeradas
export default function PaginaLegal({
  titulo,
  resaltado,
  resumen,
  secciones,
}: {
  titulo: string;
  resaltado: string;
  resumen: string;
  secciones: Seccion[];
}) {
  return (
    <>
      <section className="bg-brand-900 text-white" style={{ backgroundImage: ONDAS, backgroundSize: "240px 120px" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-14 md:py-20">
          <h1 className="display uppercase text-4xl md:text-6xl max-w-4xl">
            {titulo} <span className="text-buy">{resaltado}</span>
          </h1>
          <p className="mt-4 text-lg text-white/85 max-w-2xl">{resumen}</p>
          <p className="mt-6 text-sm text-white/70">Última actualización: {ACTUALIZACION}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-12 md:py-16 grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
        {/* Índice */}
        <nav aria-label="Contenido" className="lg:sticky lg:top-24 self-start">
          <p className="display uppercase text-brand-900 text-lg">Contenido</p>
          <ol className="mt-3 border-l-[3px] border-line">
            {secciones.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block -ml-[3px] border-l-[3px] border-transparent py-1.5 pl-4 text-sm text-ink-2 hover:border-brand-300 hover:text-ink"
                >
                  {i + 1}. {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Texto */}
        <article className="max-w-3xl">
          {secciones.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 pb-10 mb-10 border-b border-line last:border-0">
              <h2 className="display uppercase text-brand-900 text-2xl md:text-3xl">
                <span className="text-brand-500">{String(i + 1).padStart(2, "0")}</span> {s.titulo}
              </h2>
              <div className="legal mt-4 space-y-4 text-[17px] leading-relaxed text-ink">{s.contenido}</div>
            </section>
          ))}

          <div className="border-l-[5px] border-brand-700 bg-brand-50 px-5 py-4 text-sm text-ink">
            UniWay es un proyecto escolar de la materia Negocios Electrónicos y Desarrollo Web de la Facultad de Ingeniería,
            UNAM. No es una empresa constituida y los pagos funcionan en modo de prueba. Dudas:{" "}
            <a href={`mailto:${CONTACTO}`} className="font-semibold text-brand-700 underline underline-offset-2">
              {CONTACTO}
            </a>
            .
          </div>
          <p className="mt-6 text-sm text-ink-2">
            Ver también:{" "}
            <Link href="/aviso-de-privacidad" className="text-brand-700 underline underline-offset-2">
              Aviso de privacidad
            </Link>
            {" · "}
            <Link href="/terminos" className="text-brand-700 underline underline-offset-2">
              Términos de uso
            </Link>
            {" · "}
            <Link href="/reembolsos" className="text-brand-700 underline underline-offset-2">
              Reembolsos
            </Link>
            {" · "}
            <Link href="/accesibilidad" className="text-brand-700 underline underline-offset-2">
              Accesibilidad
            </Link>
          </p>
        </article>
      </div>
    </>
  );
}

// Lista con viñetas cuadradas, igual que en el resto del sitio
export function Lista({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 h-2 w-2 shrink-0 bg-brand-700" aria-hidden />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
