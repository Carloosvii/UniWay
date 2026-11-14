import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { CONTACTO, Lista } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = { title: "Accesibilidad · UniWay" };

const enlace = "font-semibold text-brand-700 underline underline-offset-2";

export default function AccesibilidadPage() {
  return (
    <PaginaLegal
      titulo="Declaración de"
      resaltado="accesibilidad"
      resumen="Queremos que cualquier estudiante pueda elegir su prepa con UniWay, sin importar cómo navegue por internet."
      secciones={[
        {
          id: "compromiso",
          titulo: "Nuestro compromiso",
          contenido: (
            <p>
              Diseñamos UniWay buscando cumplir las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2 en su nivel AA,
              el estándar internacional del W3C. Hoy cumplimos parcialmente: abajo te contamos qué hicimos y qué nos falta.
            </p>
          ),
        },
        {
          id: "hecho",
          titulo: "Lo que ya hicimos",
          contenido: (
            <Lista
              items={[
                <>
                  <strong>Contraste:</strong> el texto tiene un contraste de al menos 4.5:1 con su fondo. Nuestro azul claro
                  se usa solo como fondo de botones con texto oscuro, nunca como color de texto sobre blanco.
                </>,
                <>
                  <strong>Teclado:</strong> menús, filtros, formularios, el simulador y la compra se pueden usar con el
                  teclado.
                </>,
                <>
                  <strong>Lectores de pantalla:</strong> las imágenes informativas tienen texto alternativo y los botones
                  que solo muestran un símbolo (como el corazón de favoritas) tienen una etiqueta que dice lo que hacen.
                </>,
                <>
                  <strong>Movimiento:</strong> si tu sistema pide reducir el movimiento, el carrusel deja de avanzar solo y
                  las animaciones se desactivan.
                </>,
                <>
                  <strong>Pantallas pequeñas y zoom:</strong> el sitio se adapta desde 375 px de ancho y se puede ampliar
                  sin perder contenido.
                </>,
                <>
                  <strong>Formularios:</strong> cada campo tiene su etiqueta y los errores se explican con texto, no solo
                  con color.
                </>,
                <>
                  <strong>Escuelas accesibles:</strong> en el{" "}
                  <Link href="/mapa" className={enlace}>
                    mapa
                  </Link>{" "}
                  puedes filtrar los planteles con atención a personas con discapacidad, con datos oficiales de la SEP.
                </>,
              ]}
            />
          ),
        },
        {
          id: "pendiente",
          titulo: "Limitaciones conocidas",
          contenido: (
            <>
              <Lista
                items={[
                  <>
                    <strong>Mapa interactivo:</strong> mover y hacer zoom funciona mejor con mouse o pantalla táctil.
                    Alternativa: la lista junto al mapa tiene la misma información de cada escuela y se usa con teclado.
                  </>,
                  <>
                    <strong>Mapa de cada plantel:</strong> es un mapa insertado de OpenStreetMap que no controlamos.
                    Alternativa: la dirección completa aparece en texto.
                  </>,
                  <>
                    <strong>Contenido externo:</strong> Google Maps, TikTok y los sitios de academias y becas tienen su
                    propio nivel de accesibilidad.
                  </>,
                ]}
              />
              <p>Seguimos trabajando para resolver estas limitaciones.</p>
            </>
          ),
        },
        {
          id: "evaluacion",
          titulo: "Cómo lo evaluamos",
          contenido: (
            <p>
              Revisamos el sitio de forma manual: navegación completa con teclado, medición de contraste de colores y pruebas
              en pantallas de celular y computadora. Aún no contamos con una auditoría externa.
            </p>
          ),
        },
        {
          id: "contacto",
          titulo: "Reporta una barrera",
          contenido: (
            <>
              <p>
                Si algo no te funciona o necesitas la información en otro formato, escríbenos a{" "}
                <a href={`mailto:${CONTACTO}`} className={enlace}>
                  {CONTACTO}
                </a>{" "}
                con la página y lo que intentabas hacer. Te respondemos en un máximo de 5 días hábiles.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
