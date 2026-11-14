import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ComparadorCursos from "@/components/cursos/ComparadorCursos";
import TarjetaChevron from "@/components/ui/TarjetaChevron";
import { GRATIS, MATERIAL, MODALIDADES, PASOS_REGISTRO } from "@/lib/cursos";

export const metadata: Metadata = { title: "Cursos y material · UniWay" };

const secciones = [
  { id: "gratis", label: "Empieza gratis" },
  { id: "registro", label: "Cómo registrarte" },
  { id: "uniway", label: "Cursos UniWay" },
  { id: "comparar", label: "Compara academias" },
  { id: "material", label: "Material" },
];

// Etiquetas cortas para los botones de recursos gratuitos (el orden sigue a GRATIS)
const BOTONES_GRATIS = ["Curso en YouTube", "Pruébate UNAM", "Simulador IkniuM", "Buscador oficial"];

// Botón con sombra sólida; "principal" usa el color de compra de la paleta
function Boton({ href, children, principal, externo }: { href: string; children: React.ReactNode; principal?: boolean; externo?: boolean }) {
  const clases = `boton-bloque display block text-lg md:text-xl px-5 py-3.5 text-center ${
    principal ? "bg-buy text-brand-900 hover:bg-buy-hover" : "bg-white text-brand-900"
  }`;
  const estilo = { letterSpacing: "-0.015em" };
  return externo ? (
    <a href={href} target="_blank" rel="noreferrer" className={clases} style={estilo}>
      {children}
    </a>
  ) : (
    <Link href={href} className={clases} style={estilo}>
      {children}
    </Link>
  );
}

// Título en bloque oscuro que "sale" del borde de la tarjeta
function TituloBloque({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="display uppercase inline-block bg-brand-900 text-white text-3xl md:text-[44px] px-6 md:px-10 py-3 -ml-7 md:-ml-12">
      {children}
    </h2>
  );
}

export default function CursosPage() {
  return (
    <>
      {/* Portada con foto teñida de la paleta */}
      <section className="relative h-[260px] md:h-[340px] overflow-hidden">
        <Image
          src="/img/cursos/estudiantes-bandera.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-brand-700/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-brand-900/35" />
        <h1
          className="display uppercase relative h-full flex items-center justify-center pb-8 text-white text-6xl md:text-8xl"
          style={{ textShadow: "0 4px 16px rgb(0 0 0 / 0.35)" }}
        >
          Cursos
        </h1>
      </section>

      {/* Pestañas de sección, montadas sobre la portada */}
      <nav className="sticky top-16 z-30 -mt-9 px-5 lg:px-10" aria-label="Secciones de cursos">
        <ul className="mx-auto max-w-6xl flex overflow-x-auto bg-brand-700 shadow-[0_6px_16px_rgb(0_0_0/0.18)]">
          {secciones.map((s, i) => (
            <li key={s.id} className={`shrink-0 sm:flex-1 ${i > 0 ? "border-l border-white/20" : ""}`}>
              <a
                href={`#${s.id}`}
                className="display block px-5 py-4 text-center text-white text-[17px] hover:bg-brand-900 transition-colors"
                style={{ letterSpacing: "-0.01em" }}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Empieza gratis: bloque oscuro con la foto encimada a la derecha */}
      <section id="gratis" className="scroll-mt-36 mx-auto max-w-7xl px-5 lg:px-10 pt-16 md:pt-20 pb-16">
        <div className="md:grid md:grid-cols-12">
          <div className="relative z-10 md:col-start-7 md:col-end-13 md:row-start-1 h-[260px] sm:h-[340px] md:h-[460px]">
            <Image
              src="/img/cursos/cu-ventanal.jpg"
              alt="Vista de Ciudad Universitaria desde un salón"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[center_92%]"
            />
          </div>
          <div className="md:col-start-1 md:col-end-9 md:row-start-1 md:mt-24 bg-brand-900 text-white px-6 py-10 md:py-14 md:pl-14 md:pr-[30%]">
            <h2 className="display text-5xl md:text-6xl">Estudia gratis desde hoy</h2>
            <p className="mt-5 text-lg md:text-xl leading-relaxed text-white/90">
              Videos de las 10 áreas del examen, exámenes de práctica y el buscador oficial.{" "}
              <strong className="text-white">Sin pagar nada.</strong>
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {GRATIS.map((r, i) => (
                <Boton key={r.url} href={r.url} externo principal={i === 0 || i === 3}>
                  {BOTONES_GRATIS[i] ?? r.titulo}
                </Boton>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cómo registrarte: tarjeta blanca con título en bloque y foto a la derecha */}
      <section id="registro" className="scroll-mt-36 bg-brand-50">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 md:gap-0 items-center">
            <div className="md:col-span-7 relative z-10 bg-white shadow-[0_4px_20px_rgb(0_0_0/0.08)] border-b-[10px] border-brand-700 pt-8 pb-10 pr-6 pl-5 md:pl-8 md:pr-12">
              <TituloBloque>Cómo registrarte</TituloBloque>
              <p className="mt-6 text-lg leading-relaxed text-ink">
                El registro es en <strong>Mi derecho, mi lugar</strong>. Tu lugar depende del orden de tus opciones, así que
                elígelas con calma.
              </p>
              <ol className="mt-5 space-y-3">
                {PASOS_REGISTRO.map((p, i) => (
                  <li key={p} className="flex gap-3">
                    <span className="display flex h-7 w-7 shrink-0 items-center justify-center bg-brand-900 text-white text-sm">
                      {i + 1}
                    </span>
                    <span className="text-ink pt-0.5">{p}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-lg">
                <Boton href="https://www.miderechomilugar.gob.mx/" externo principal>
                  Ir al sitio oficial
                </Boton>
                <Boton href="/mapa">Buscar en el mapa</Boton>
              </div>
            </div>
            <div className="md:col-span-5 relative h-[320px] md:h-[560px] md:-ml-10">
              <Image
                src="/img/cursos/mural.jpg"
                alt="Mural de la Biblioteca Central de la UNAM"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Las 3 modalidades */}
          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {MODALIDADES.map((m) => {
              return (
                <TarjetaChevron
                  key={m.nombre}
                  href={`/mapa${m.tipo ? `?tipo=${m.tipo}` : ""}`}
                  valor={m.cifra}
                  texto={m.resumen}
                  etiqueta={`${m.nombre} · ${m.acceso}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Cursos UniWay */}
      <section id="uniway" className="scroll-mt-36 mx-auto max-w-7xl px-5 lg:px-10 py-16 md:py-20">
        <div className="pl-5 md:pl-8">
          <TituloBloque>Cursos UniWay</TituloBloque>
          <p className="mt-5 text-lg text-ink-2 max-w-2xl">
            Preparación personalizada a un precio accesible. Paga tu mamá, papá o tutor desde su cuenta.
          </p>
        </div>
        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          {[
            {
              valor: "$799",
              texto: "MXN por el curso UNAM / IPN completo.",
              puntos: ["Examen diagnóstico de tus materias débiles", "Inicia según las semanas que faltan", "Reembolso completo en los primeros 7 días"],
              cta: "Cotizar mi curso",
              href: "/comprar/curso",
            },
            {
              valor: "$150",
              texto: "MXN por asesoría en vivo de 60 minutos.",
              puntos: ["Con universitarios verificados", "Tú propones fecha y hora", "Cancela gratis con más de 24 h"],
              cta: "Agendar asesoría",
              href: "/comprar/asesoria",
            },
          ].map(({ valor, texto, puntos, cta, href }) => (
            <TarjetaChevron
              key={valor}
              icono={<Image src="/img/logo.png" alt="" width={64} height={80} className="h-16 w-auto sm:h-20" />}
              valor={valor}
              texto={texto}
              etiqueta="Cursos UniWay"
            >
              <ul className="mt-4 space-y-1.5">
                {puntos.map((p) => (
                  <li key={p} className="flex gap-2 text-ink">
                    <span className="mt-2 h-2 w-2 shrink-0 bg-brand-700" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 max-w-xs">
                <Boton href={href} principal>
                  {cta}
                </Boton>
              </div>
            </TarjetaChevron>
          ))}
        </div>
      </section>

      {/* Compara academias */}
      <section id="comparar" className="scroll-mt-36 bg-brand-50">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16 md:py-20">
          <div className="bg-white shadow-[0_4px_20px_rgb(0_0_0/0.08)] border-b-[10px] border-brand-700 pt-8 pb-8 pl-5 pr-5 md:pl-8 md:pr-10">
            <TituloBloque>Compara academias</TituloBloque>
            <p className="mt-5 mb-6 text-lg text-ink-2 max-w-2xl">
              Si prefieres un curso externo, aquí están los más conocidos ordenados por precio.
            </p>
            <ComparadorCursos />
          </div>
        </div>
      </section>

      {/* Material de estudio */}
      <section id="material" className="scroll-mt-36 mx-auto max-w-7xl px-5 lg:px-10 py-16 md:py-20">
        <div className="pl-5 md:pl-8">
          <TituloBloque>Material de estudio</TituloBloque>
          <p className="mt-5 text-lg text-ink-2 max-w-2xl">
            Libros y práctica de IkniuM, la misma editorial del curso gratuito de YouTube.
          </p>
        </div>
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {MATERIAL.map((m, i) => {
            const dato = [
              { valor: "10", texto: "áreas del examen, explicadas y resueltas." },
              { valor: "600+", texto: "reactivos y 2 exámenes con respuestas." },
              { valor: "5", texto: "exámenes y 4 modalidades de práctica en línea." },
            ][i];
            return (
              <TarjetaChevron
                key={m.titulo}
                href={m.url}
                externo
                valor={dato?.valor}
                texto={dato?.texto ?? m.descripcion}
                etiqueta={`${m.titulo} · IkniuM`}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
