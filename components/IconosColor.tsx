// Íconos sólidos a color, propios de UniWay (en lugar de íconos genéricos de línea).
// Cada uno va sobre un recuadro con un tono claro de su mismo color.

type Props = { className?: string };

function Recuadro({ bg, children, className = "" }: { bg: string; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl ${className}`}
      style={{ background: bg, width: "var(--icono, 3rem)", height: "var(--icono, 3rem)" }}
      aria-hidden
    >
      {children}
    </span>
  );
}

// Silueta de México (imagen proporcionada) coloreada con CSS mask + pin en la CDMX
export function IconoMapa({ className }: Props) {
  return (
    <Recuadro bg="#e3f2fa" className={className}>
      <span className="relative block h-2/3 w-2/3">
        <span
          className="absolute inset-0"
          style={{
            background: "#466778",
            WebkitMask: "url(/img/icons/mexico.png) center / contain no-repeat",
            mask: "url(/img/icons/mexico.png) center / contain no-repeat",
          }}
        />
        <svg viewBox="0 0 24 24" className="absolute" style={{ left: "47%", top: "30%", width: "44%", height: "44%" }}>
          <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z" fill="#e8574a" stroke="#fff" strokeWidth="2" />
          <circle cx="12" cy="9" r="2.5" fill="#fff" />
        </svg>
      </span>
    </Recuadro>
  );
}

// Birrete de graduación con borla
export function IconoBecas({ className }: Props) {
  return (
    <Recuadro bg="#fdf1d8" className={className}>
      <svg viewBox="0 0 32 32" className="h-2/3 w-2/3">
        <path d="M16 5 1.5 12 16 19l14.5-7L16 5Z" fill="#c98a0b" />
        <path d="M7 15.5V22c0 2.5 4 4.5 9 4.5s9-2 9-4.5v-6.5L16 20l-9-4.5Z" fill="#e0a526" />
        <path d="M27 13v8" stroke="#c98a0b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="27" cy="23" r="2.2" fill="#c98a0b" />
      </svg>
    </Recuadro>
  );
}

// Libro abierto
export function IconoCursos({ className }: Props) {
  return (
    <Recuadro bg="#dff3ec" className={className}>
      <svg viewBox="0 0 32 32" className="h-2/3 w-2/3">
        <path d="M3 7c4-1.5 8.5-1.2 12 1v18c-3.5-2.2-8-2.5-12-1V7Z" fill="#1f8a68" />
        <path d="M29 7c-4-1.5-8.5-1.2-12 1v18c3.5-2.2 8-2.5 12-1V7Z" fill="#35b089" />
        <path d="M20 12.5c2.2-.8 4.5-.9 6.5-.3M20 16.5c2.2-.8 4.5-.9 6.5-.3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </Recuadro>
  );
}

// Diana con flecha
export function IconoSimulador({ className }: Props) {
  return (
    <Recuadro bg="#fde7e4" className={className}>
      <svg viewBox="0 0 32 32" className="h-2/3 w-2/3">
        <circle cx="15" cy="17" r="12" fill="#e8574a" />
        <circle cx="15" cy="17" r="8.5" fill="#fff" />
        <circle cx="15" cy="17" r="5" fill="#e8574a" />
        <circle cx="15" cy="17" r="1.8" fill="#fff" />
        <path d="M15 17 27 5" stroke="#2e444f" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M23.5 4.5 27 5l.5 3.5" fill="none" stroke="#2e444f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Recuadro>
  );
}

// Botón de reproducir (videos)
export function IconoVideo({ className }: Props) {
  return (
    <Recuadro bg="#fde7e4" className={className}>
      <svg viewBox="0 0 32 32" className="h-2/3 w-2/3">
        <rect x="3" y="7" width="26" height="18" rx="5" fill="#e8574a" />
        <path d="M13.5 11.5v9l7.5-4.5-7.5-4.5Z" fill="#fff" />
      </svg>
    </Recuadro>
  );
}

// Hoja con palomitas (guías y trámites)
export function IconoGuia({ className }: Props) {
  return (
    <Recuadro bg="#e3f2fa" className={className}>
      <svg viewBox="0 0 32 32" className="h-2/3 w-2/3">
        <path d="M8 3h12l6 6v20H8Z" fill="#466778" />
        <path d="M20 3v6h6Z" fill="#8acdee" />
        <path d="m11.5 15 2 2 3.5-3.5M11.5 22l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 15.5h4M19 22.5h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </Recuadro>
  );
}

// Libro cerrado (material para comprar)
export function IconoLibro({ className }: Props) {
  return (
    <Recuadro bg="#efe9fb" className={className}>
      <svg viewBox="0 0 32 32" className="h-2/3 w-2/3">
        <path d="M7 5h17a2 2 0 0 1 2 2v20H9a2 2 0 0 1-2-2Z" fill="#6d28d9" />
        <path d="M9 23h17v4H9a2 2 0 0 1 0-4Z" fill="#c4b5fd" />
        <path d="M12 10h9M12 14h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </Recuadro>
  );
}
