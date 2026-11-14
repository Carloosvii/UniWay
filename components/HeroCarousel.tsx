"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// overlay = qué tan oscura es la capa azul sobre cada foto (0 a 1). Valores bajos = foto más viva.
const slides = [
  { src: "/img/hero-camino.jpg", alt: "Camino entre árboles al atardecer", position: "center 78%", overlay: 0.12 },
  { src: "/img/hero-estudiantes.jpg", alt: "Alumnos estudiando en un salón de clases", position: "center 55%", overlay: 0.25 },
  { src: "/img/unam.jpg", alt: "Biblioteca Central de la UNAM", position: "center 55%", overlay: 0.12 },
  { src: "/img/ipn.png", alt: "Letras del IPN frente a un edificio del Politécnico", position: "center 80%", overlay: 0.12 },
  { src: "/img/bachilleres.avif", alt: "Plantel del Colegio de Bachilleres", position: "center 70%", overlay: 0.12 },
  { src: "/img/conalep.avif", alt: "Plantel del CONALEP", position: "center 70%", overlay: 0.12 },
  { src: "/img/cetis.jpg", alt: "Letras de CETIS en un plantel", position: "center 85%", overlay: 0.12 },
];

const INTERVALO_MS = 7000;

export default function HeroCarousel() {
  const [actual, setActual] = useState(0);
  // La foto anterior se queda visible debajo mientras entra la nueva,
  // así el fondo oscuro nunca se asoma a media transición.
  const [previa, setPrevia] = useState<number | null>(null);
  const [pausado, setPausado] = useState(false);

  function irA(i: number) {
    if (i === actual) return;
    setPrevia(actual);
    setActual(i);
  }

  useEffect(() => {
    // Respeta a quien pidió reducir el movimiento en su sistema
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (pausado || reducir) return;
    const id = setInterval(() => {
      setActual((i) => {
        setPrevia(i);
        return (i + 1) % slides.length;
      });
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [pausado]);

  return (
    <section
      className="relative h-[600px] md:h-[620px] overflow-hidden bg-brand-900"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
      aria-roledescription="carrusel"
    >
      {slides.map((s, i) => {
        const capa =
          i === actual
            ? "opacity-100 z-[2] transition-opacity duration-1000"
            : i === previa
              ? "opacity-100 z-[1]"
              : "opacity-0 z-0";
        return (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            quality={90}
            sizes="100vw"
            className={`object-cover ${capa}`}
            style={{ objectPosition: s.position }}
            aria-hidden={i !== actual}
          />
        );
      })}

      {/* Capa azul muy ligera para unificar el tono de las fotos */}
      <div
        className="absolute inset-0 z-[3] bg-brand-900 transition-opacity duration-1000"
        style={{ opacity: slides[actual].overlay }}
      />
      {/* Sombra arriba solo para que se lea la barra transparente */}
      <div className="absolute inset-x-0 top-0 z-[3] h-32 bg-gradient-to-b from-black/45 to-transparent" />

      {/* Marco blanco grueso sobre la foto (la foto se sigue viendo completa alrededor) */}
      <div
        className="pointer-events-none absolute z-[4] top-[84px] bottom-14 left-4 right-4 md:top-[92px] md:bottom-20 md:left-[5.5%] md:right-[5.5%] border-[4px] md:border-[6px] border-white"
        aria-hidden
      />

      <div className="relative z-[5] h-full pt-16 pb-10 mx-auto max-w-6xl px-8 md:px-16 flex flex-col items-center justify-center text-center">
        <h1
          className="display text-white text-5xl sm:text-6xl md:text-7xl max-w-4xl"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
        >
          Elige tu prepa con toda la información.
        </h1>

        <form
          action="/mapa"
          className="mt-8 w-full max-w-2xl bg-white p-2 shadow-[0_8px_24px_rgb(0_0_0/0.25)] flex flex-col md:flex-row gap-2 md:gap-0 text-left"
        >
          <label className="flex-1 flex items-center gap-3 px-4 py-2 md:border-r border-line">
            <span className="flex-1">
              <span className="block text-xs font-semibold text-ink">¿Dónde vives?</span>
              <input
                name="ubicacion"
                placeholder="Alcaldía o código postal"
                className="w-full text-sm text-ink placeholder:text-ink-2 outline-none bg-transparent"
              />
            </span>
          </label>
          <label className="flex-1 flex items-center gap-3 px-4 py-2">
            <span className="flex-1">
              <span className="block text-xs font-semibold text-ink">¿Qué te interesa?</span>
              <input
                name="interes"
                placeholder="Área o carrera técnica"
                className="w-full text-sm text-ink placeholder:text-ink-2 outline-none bg-transparent"
              />
            </span>
          </label>
          <button
            type="submit"
            className="display uppercase bg-buy hover:bg-buy-hover px-7 py-3.5 text-brand-900 transition-colors"
          >
            Buscar escuelas
          </button>
        </form>

      </div>

      <div className="absolute z-[5] bottom-[106px] md:bottom-[112px] inset-x-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.src}
            onClick={() => irA(i)}
            aria-label={`Ver imagen ${i + 1}`}
            aria-current={i === actual}
            className={`h-1.5 transition-all ${i === actual ? "w-7 bg-white" : "w-3 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
