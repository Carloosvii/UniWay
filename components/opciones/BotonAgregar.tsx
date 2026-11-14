"use client";

import { usePathname, useRouter } from "next/navigation";
import { useOpciones } from "@/lib/opciones";

// Corazón para marcar una carrera como favorita. Brinca una vez al cargar y al pasar el mouse
// muestra qué hace. Sin sesión, manda a iniciar sesión y regresa a la misma página.
export default function BotonAgregar({ clave, compacto }: { clave: string; compacto?: boolean }) {
  const { conSesion, esFavorita, alternarFavorita } = useOpciones();
  const router = useRouter();
  const ruta = usePathname();
  const favorita = esFavorita(clave);
  const texto = favorita ? "Quitar de mis favoritas" : "Añadir a mis favoritas";

  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        onClick={() => {
          if (!conSesion) return router.push(`/login?siguiente=${encodeURIComponent(ruta)}`);
          alternarFavorita(clave);
        }}
        aria-pressed={favorita}
        aria-label={texto}
        className={`flex items-center justify-center border-2 transition-colors ${compacto ? "h-9 w-9" : "h-11 w-11"} ${
          favorita ? "border-[#d92d5c] bg-[#fff0f4]" : "border-line bg-white hover:border-[#d92d5c]"
        }`}
      >
        <svg viewBox="0 0 24 24" className={`latido-una-vez ${compacto ? "h-5 w-5" : "h-6 w-6"}`} aria-hidden>
          <path
            d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z"
            fill={favorita ? "#d92d5c" : "none"}
            stroke="#d92d5c"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {/* Aviso al pasar el mouse o con el teclado */}
      <span
        role="tooltip"
        className={`pointer-events-none absolute whitespace-nowrap ${compacto ? "right-full mr-2 top-1/2 -mt-3.5" : "left-0 bottom-full mb-2"} bg-brand-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 z-30`}
      >
        {texto}
      </span>
    </span>
  );
}
