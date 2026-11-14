import Image from "next/image";
import { ONDAS } from "@/components/ui/Clemson";

// Pantalla de cuenta: fondo con ondas y foto a la derecha; a la izquierda un marco con el mensaje
// y la tarjeta blanca del formulario con título en bloque y barra inferior (como en Cursos).
export function PantallaCuenta({
  titulo,
  resaltado,
  texto,
  puntos,
  img,
  imgAlt,
  tituloFormulario,
  children,
}: {
  titulo: string;
  resaltado: string;
  texto: string;
  puntos: string[];
  img: string;
  imgAlt: string;
  tituloFormulario: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900" style={{ backgroundImage: ONDAS, backgroundSize: "240px 120px" }}>
      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2">
        <Image src={img} alt={imgAlt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/60 to-brand-900/20" />
        <div className="absolute inset-0 bg-brand-900/50 lg:hidden" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-10 py-12 md:py-16 grid lg:grid-cols-[1fr_500px] gap-10 lg:gap-14 items-center">
        <div className="border-[5px] border-buy px-6 py-8 md:px-12 md:py-12 text-white">
          <h1 className="display uppercase text-4xl md:text-6xl leading-[0.95]">
            {titulo} <span className="text-buy">{resaltado}</span>
          </h1>
          <p className="mt-5 text-lg text-white/90 leading-relaxed max-w-lg">{texto}</p>
          <ul className="mt-6 space-y-2.5">
            {puntos.map((p) => (
              <li key={p} className="flex gap-3 text-white">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 bg-buy" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-[0_12px_40px_rgb(0_0_0/0.35)] border-b-[10px] border-brand-700 pt-8 pb-8 pl-5 pr-5 md:pl-8 md:pr-10">
          <h2 className="display uppercase inline-block bg-brand-900 text-white text-3xl md:text-4xl px-6 md:px-8 py-3 -ml-7 md:-ml-12">
            {tituloFormulario}
          </h2>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </section>
  );
}

// Campo de formulario cuadrado con etiqueta en mayúsculas
export function Campo({
  etiqueta,
  ayuda,
  error,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-ink-2 mb-1.5">{etiqueta}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-sm text-[#b42318]">{error}</span>
      ) : (
        ayuda && <span className="mt-1 block text-xs text-ink-2">{ayuda}</span>
      )}
    </label>
  );
}

export const claseInput =
  "w-full border-2 border-line bg-white px-4 py-3 text-ink placeholder:text-ink-2/70 outline-none focus:border-brand-700 transition-colors";

export const claseBotonPrincipal =
  "boton-bloque display w-full bg-buy hover:bg-buy-hover px-6 py-4 text-xl text-brand-900 disabled:opacity-60";

// Solo se permite volver a rutas internas (evita redirecciones a otros sitios)
export function destinoSeguro(siguiente: string | null) {
  return siguiente && siguiente.startsWith("/") && !siguiente.startsWith("//") ? siguiente : "/";
}
