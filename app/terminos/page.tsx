import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { CONTACTO, Lista } from "@/components/legal/PaginaLegal";
import { DIAS_REEMBOLSO_CURSO, HORAS_CANCELACION_ASESORIA, PRECIOS, VIGENCIA_COTIZACION_DIAS } from "@/lib/politicas";

export const metadata: Metadata = { title: "Términos de uso · UniWay" };

const enlace = "font-semibold text-brand-700 underline underline-offset-2";

export default function TerminosPage() {
  return (
    <PaginaLegal
      titulo="Términos de"
      resaltado="uso"
      resumen="Las reglas para usar UniWay y comprar nuestros cursos y asesorías. Al crear una cuenta o usar el sitio, las aceptas."
      secciones={[
        {
          id: "servicio",
          titulo: "Qué es UniWay",
          contenido: (
            <>
              <p>UniWay te ayuda a elegir tu bachillerato en la Zona Metropolitana del Valle de México. Ofrece:</p>
              <Lista
                items={[
                  <>
                    <strong>Herramientas gratuitas:</strong> mapa de escuelas, buscador de becas, simulador de examen, guía
                    de registro y recursos de estudio.
                  </>,
                  <>
                    <strong>Servicios de pago:</strong> el curso de preparación UNAM / IPN (${PRECIOS.curso} MXN) y
                    asesorías en vivo (${PRECIOS.asesoria} MXN por sesión de 60 minutos).
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          id: "informacion",
          titulo: "La información es orientativa",
          contenido: (
            <>
              <p>
                Los datos de escuelas provienen del buscador oficial «Mi derecho, mi lugar» de la SEP. Los montos de becas,
                los precios de academias y las fechas de convocatorias provienen de fuentes públicas y pueden cambiar.
              </p>
              <Lista
                items={[
                  "UniWay no es una autoridad educativa ni está afiliada a la SEP, la UNAM, el IPN ni a ninguna otra institución.",
                  <>
                    El registro oficial se hace únicamente en{" "}
                    <a href="https://www.miderechomilugar.gob.mx/" target="_blank" rel="noreferrer" className={enlace}>
                      miderechomilugar.gob.mx
                    </a>
                    . Revisa siempre la convocatoria vigente.
                  </>,
                  "UniWay no garantiza la asignación de un lugar ni el resultado de ningún examen.",
                ]}
              />
            </>
          ),
        },
        {
          id: "cuentas",
          titulo: "Tu cuenta",
          contenido: (
            <Lista
              items={[
                "Si eres menor de edad, necesitas el consentimiento de tu mamá, papá o tutor para crear tu cuenta.",
                "Usa datos verdaderos y mantenlos actualizados.",
                "Tu contraseña es personal: cuídala y no la compartas.",
                "Puedes eliminar tu cuenta cuando quieras desde Mi perfil.",
              ]}
            />
          ),
        },
        {
          id: "compras",
          titulo: "Precios, cotizaciones y pagos",
          contenido: (
            <Lista
              items={[
                "Los precios están en pesos mexicanos e incluyen IVA.",
                `Cada cotización es válida por ${VIGENCIA_COTIZACION_DIAS} días.`,
                `En paquetes de ${PRECIOS.minParaDescuento} asesorías o más aplicamos ${PRECIOS.descuentoPaquete * 100} % de descuento.`,
                "Puedes pagar con tarjeta de débito o crédito, o en efectivo en OXXO con una referencia que vence en 3 días.",
                "Las compras las debe hacer una persona mayor de edad.",
                "Tu comprobante y el estado de cada pedido quedan en Mi perfil → Mis cursos.",
              ]}
            />
          ),
        },
        {
          id: "fechas",
          titulo: "Fechas de inicio y asesorías",
          contenido: (
            <>
              <p>
                Para el curso, UniWay propone como fecha de inicio el lunes siguiente a tu compra; puedes elegir otra de las
                fechas disponibles. Para las asesorías, tú eliges día y hora entre los horarios libres.
              </p>
              <p>
                Si no te conectas a una asesoría en los primeros 15 minutos, la sesión se considera tomada.
              </p>
            </>
          ),
        },
        {
          id: "cancelaciones",
          titulo: "Cancelaciones y reembolsos",
          contenido: (
            <>
              <Lista
                items={[
                  `Curso: reembolso completo si cancelas dentro de los primeros ${DIAS_REEMBOLSO_CURSO} días desde la compra.`,
                  `Asesorías: reembolso de cada sesión que canceles con más de ${HORAS_CANCELACION_ASESORIA} horas de anticipación.`,
                  "Pagos en OXXO pendientes: se cancelan sin ningún cargo.",
                ]}
              />
              <p>
                Consulta todos los detalles en la{" "}
                <Link href="/reembolsos" className={enlace}>
                  política de cancelación y reembolsos
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          id: "uso",
          titulo: "Uso permitido",
          contenido: (
            <>
              <p>Al usar UniWay te comprometes a no:</p>
              <Lista
                items={[
                  "Crear cuentas falsas o usar la cuenta de otra persona.",
                  "Copiar o extraer de forma masiva el contenido o los datos del sitio.",
                  "Intentar dañar, saturar o vulnerar la seguridad del sitio.",
                  "Faltar al respeto a asesores u otros usuarios durante las asesorías.",
                ]}
              />
            </>
          ),
        },
        {
          id: "propiedad",
          titulo: "Propiedad intelectual",
          contenido: (
            <p>
              El nombre, logotipo, diseño y textos de UniWay pertenecen a sus autores. Los datos de escuelas son de la SEP;
              los mapas, de los colaboradores de OpenStreetMap (licencia ODbL); y los cursos y materiales de terceros, de sus
              respectivos titulares.
            </p>
          ),
        },
        {
          id: "terceros",
          titulo: "Sitios de terceros",
          contenido: (
            <p>
              UniWay enlaza a sitios externos como Google Maps, TikTok, YouTube, academias y portales de becas. No
              controlamos su contenido ni somos responsables de él; al visitarlos aplican sus propios términos.
            </p>
          ),
        },
        {
          id: "responsabilidad",
          titulo: "Limitación de responsabilidad",
          contenido: (
            <p>
              Hacemos lo posible por mantener la información correcta y el sitio disponible, pero no garantizamos que esté
              libre de errores o interrupciones. UniWay no es responsable por decisiones tomadas solo con base en la
              información del sitio sin consultar las fuentes oficiales.
            </p>
          ),
        },
        {
          id: "cambios",
          titulo: "Cambios a estos términos",
          contenido: (
            <p>
              Podemos actualizar estos términos. Publicaremos la nueva versión en esta página con su fecha; las compras ya
              hechas se rigen por los términos vigentes al momento de pagarlas.
            </p>
          ),
        },
        {
          id: "ley",
          titulo: "Ley aplicable y contacto",
          contenido: (
            <>
              <p>
                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Como consumidor, también puedes acudir
                a la Procuraduría Federal del Consumidor (Profeco).
              </p>
              <p>
                Dudas o aclaraciones:{" "}
                <a href={`mailto:${CONTACTO}`} className={enlace}>
                  {CONTACTO}
                </a>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
