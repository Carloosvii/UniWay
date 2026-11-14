"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const politicas = [
  { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
  { href: "/reembolsos", label: "Política de reembolsos" },
  { href: "/terminos", label: "Términos de uso" },
  { href: "/accesibilidad", label: "Accesibilidad" },
];

const recursos = [
  { href: "/escuelas", label: "Escuelas" },
  { href: "/mapa", label: "Mapa" },
  { href: "/becas", label: "Becas" },
  { href: "/cursos", label: "Cursos" },
  { href: "/simulador", label: "Simulador" },
];

// Mismo color que el borde inferior de la ilustración, para que se una sin línea visible
const FONDO_PIE = "#30424e";

export default function Footer() {
  // En el mapa no hay pie de página: el mapa ocupa toda la pantalla
  if (usePathname() === "/mapa") return null;

  return (
    <footer className="mt-10">
      {/* Ilustración de la Ciudad de México (Biblioteca Central, Monumento a la Revolución,
          Ángel de la Independencia, Bellas Artes, volcanes…) */}
      <div className="relative w-full aspect-[3768/1120] min-h-[160px]">
        <Image
          src="/img/final-ciudad.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      <div className="text-white -mt-px" style={{ background: FONDO_PIE }}>
        <div className="w-full px-5 lg:px-10 pt-10 pb-10 grid gap-10 md:grid-cols-3 md:items-start">
          <nav aria-label="Políticas" className="order-2 md:order-1">
            <p className="display text-xl">Políticas</p>
            <ul className="mt-4 space-y-2.5 text-white/85">
              {politicas.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:underline underline-offset-4">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="order-1 md:order-2 text-center">
            <p className="display text-6xl md:text-7xl">UniWay</p>
            <p className="mt-3 text-white/70">Elige tu prepa con toda la información.</p>
          </div>

          <nav aria-label="Recursos" className="order-3 md:text-right">
            <p className="display text-xl">Recursos</p>
            <ul className="mt-4 space-y-2.5 text-white/85">
              {recursos.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:underline underline-offset-4">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-white/15 px-5 lg:px-10 py-5 text-sm text-white/60 flex flex-col md:flex-row gap-2 md:justify-between">
          <span>© {new Date().getFullYear()} UniWay · Proyecto académico, Facultad de Ingeniería UNAM</span>
          <span>Mapas © colaboradores de OpenStreetMap</span>
        </div>
      </div>
    </footer>
  );
}
