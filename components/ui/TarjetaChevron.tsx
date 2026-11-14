import Link from "next/link";

// Tarjeta de "dato destacado": panel oscuro con punta de flecha y un ícono a color a la izquierda;
// a la derecha, la cifra grande, un texto corto y una etiqueta en cursiva.
type Props = {
  icono?: React.ReactNode; // sin ícono, el panel queda como franja con flecha
  valor?: string;
  texto: React.ReactNode;
  etiqueta?: string;
  panel?: string; // color del panel con flecha
  acento?: string; // color de la cifra y la etiqueta (debe leerse sobre gris claro)
  href?: string;
  externo?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export default function TarjetaChevron({
  icono,
  valor,
  texto,
  etiqueta,
  panel = "#2e444f",
  acento = "#466778",
  href,
  externo,
  children,
  className = "",
}: Props) {
  const contenido = (
    <>
      <div
        className={`chevron shrink-0 flex items-center justify-center ${icono ? "w-28 sm:w-36 pr-6" : "w-12 sm:w-14 [--punta:20px]"}`}
        style={{ background: panel }}
        aria-hidden
      >
        {icono}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center py-5 pl-3 pr-5 sm:pl-5">
        <p className="text-[17px] leading-snug text-ink">
          {valor && (
            <span className="display text-[32px] mr-1.5 align-[-2px]" style={{ color: acento, letterSpacing: "-0.03em" }}>
              {valor}
            </span>
          )}
          {texto}
        </p>
        {etiqueta && (
          <p className="mt-2 font-bold italic" style={{ color: acento }}>
            {etiqueta}
          </p>
        )}
        {children}
      </div>
    </>
  );

  const clases = `flex bg-surface shadow-[0_2px_10px_rgb(0_0_0/0.10)] min-h-[150px] ${className}`;

  if (!href) return <div className={clases}>{contenido}</div>;
  if (externo)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={`${clases} group hover:shadow-[0_6px_18px_rgb(0_0_0/0.16)] transition-shadow`}>
        {contenido}
      </a>
    );
  return (
    <Link href={href} className={`${clases} group hover:shadow-[0_6px_18px_rgb(0_0_0/0.16)] transition-shadow`}>
      {contenido}
    </Link>
  );
}
