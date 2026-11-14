"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cerrarSesion, useSesion } from "@/lib/sesion";

const links = [
  { href: "/escuelas", label: "Escuelas" },
  { href: "/mapa", label: "Mapa" },
  { href: "/becas", label: "Becas" },
  { href: "/cursos", label: "Cursos" },
  { href: "/simulador", label: "Simulador" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const usuario = useSesion();
  const primerNombre = usuario?.nombre.split(" ")[0];
  const ruta = usePathname();
  const esInicio = ruta === "/";
  const esActual = (href: string) => ruta === href || ruta.startsWith(href + "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // En el inicio la barra es transparente sobre la foto hasta que el usuario baja
  const transparente = esInicio && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          transparente ? "bg-transparent border-b border-transparent" : "bg-white border-b border-line"
        }`}
      >
        <nav className="w-full h-16 px-5 lg:px-10 flex items-center gap-10">
          <Link
            href="/"
            className={`display text-[28px] transition-colors ${transparente ? "text-white" : "text-brand-900"}`}
          >
            UniWay
          </Link>

          <ul className={`hidden md:flex self-stretch items-stretch gap-7 text-[15px] font-medium ${transparente ? "text-white" : "text-ink"}`}>
            {links.map((l) => {
              const actual = esActual(l.href);
              return (
                <li key={l.href} className="flex">
                  {/* La pestaña actual va en azul de la paleta con una barra inferior */}
                  <Link
                    href={l.href}
                    aria-current={actual ? "page" : undefined}
                    className={`flex items-center border-b-[3px] pt-[3px] transition-colors ${
                      actual
                        ? "border-brand-300 text-brand-700 font-semibold"
                        : "border-transparent opacity-90 hover:opacity-100 hover:border-brand-100"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto hidden md:flex items-center gap-5 text-[15px] font-medium">
            {usuario ? (
              <>
                <Link href="/perfil" className={`hover:underline underline-offset-4 ${transparente ? "text-white" : "text-ink"}`}>
                  Hola, <strong className="font-semibold">{primerNombre}</strong>
                  <span className={`ml-2 text-xs uppercase tracking-wide ${transparente ? "text-white/80" : "text-ink-2"}`}>
                    {usuario.tipo === "tutor" ? "Tutor" : "Estudiante"}
                  </span>
                </Link>
                <button
                  onClick={cerrarSesion}
                  className={`display border-2 px-4 py-2 transition-colors ${
                    transparente ? "border-white text-white hover:bg-white/15" : "border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white"
                  }`}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
            <Link href="/login" className={transparente ? "text-white" : "text-brand-700 hover:text-brand-900"}>
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="display bg-buy px-5 py-2.5 text-brand-900 hover:bg-buy-hover transition-colors"
            >
              Crear cuenta
            </Link>
              </>
            )}
          </div>

          <button
            className={`ml-auto md:hidden p-2 -mr-2 ${transparente ? "text-white" : "text-ink"}`}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {open && (
          <ul className="md:hidden border-t border-line bg-white px-4 py-2 text-base">
            {[...links, ...(usuario ? [{ href: "/perfil", label: "Mi perfil" }] : [{ href: "/login", label: "Iniciar sesión" }, { href: "/registro", label: "Crear cuenta" }])].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={esActual(l.href) ? "page" : undefined}
                  className={`block py-3 pl-3 -ml-3 border-l-[3px] ${
                    esActual(l.href) ? "border-brand-300 text-brand-700 font-semibold" : "border-transparent"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {usuario && (
              <li>
                <button
                  className="block w-full text-left py-3 pl-3 -ml-3 border-l-[3px] border-transparent"
                  onClick={() => {
                    cerrarSesion();
                    setOpen(false);
                  }}
                >
                  Cerrar sesión ({primerNombre})
                </button>
              </li>
            )}
          </ul>
        )}
      </header>

      {/* Fuera del inicio, este espacio evita que la barra fija tape el contenido */}
      {!esInicio && <div className="h-16" aria-hidden />}
    </>
  );
}
