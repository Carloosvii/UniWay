import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { CONTACTO, Lista } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = { title: "Aviso de privacidad · UniWay" };

const correo = (
  <a href={`mailto:${CONTACTO}`} className="font-semibold text-brand-700 underline underline-offset-2">
    {CONTACTO}
  </a>
);

export default function AvisoPrivacidadPage() {
  return (
    <PaginaLegal
      titulo="Aviso de"
      resaltado="privacidad"
      resumen="Qué datos pedimos, para qué los usamos y cómo puedes controlarlos. Lo escribimos claro porque muchos de nuestros usuarios son menores de edad."
      secciones={[
        {
          id: "responsable",
          titulo: "Quién es responsable de tus datos",
          contenido: (
            <>
              <p>
                UniWay, plataforma de orientación para elegir bachillerato en la Zona Metropolitana del Valle de México,
                desarrollada por Omar Garrido, Alejandra Saucedo y Carlos López Estrada en la Ciudad de México, es
                responsable del tratamiento de tus datos personales.
              </p>
              <p>Para cualquier tema relacionado con tus datos, escríbenos a {correo}.</p>
              <p>
                Este aviso se emite conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
                Particulares, publicada en el Diario Oficial de la Federación el 20 de marzo de 2025.
              </p>
            </>
          ),
        },
        {
          id: "datos",
          titulo: "Qué datos recabamos",
          contenido: (
            <>
              <Lista
                items={[
                  <>
                    <strong>De identificación y contacto:</strong> nombre completo, correo electrónico, alcaldía o municipio
                    (opcional) y, si eres estudiante, el correo de tu mamá, papá o tutor (opcional).
                  </>,
                  <>
                    <strong>De tu cuenta:</strong> tipo de cuenta (estudiante o tutor) y tu contraseña, que guardamos
                    cifrada; nunca en texto.
                  </>,
                  <>
                    <strong>De uso:</strong> tus escuelas favoritas, tus listas de opciones por modalidad y tus preferencias
                    de avisos.
                  </>,
                  <>
                    <strong>De compra:</strong> nombre de quien paga, productos, fechas agendadas y, si pagas con tarjeta,
                    solo la marca y los últimos 4 dígitos. Nunca guardamos el número completo ni el código de seguridad.
                  </>,
                  <>
                    <strong>Ubicación:</strong> solo si tocas «Mi ubicación» en el mapa y das permiso. La usamos en ese
                    momento para ordenar las escuelas por cercanía y no la guardamos.
                  </>,
                ]}
              />
              <p>No pedimos datos personales sensibles, como salud, religión u origen étnico.</p>
            </>
          ),
        },
        {
          id: "finalidades",
          titulo: "Para qué los usamos",
          contenido: (
            <>
              <p>
                <strong>Finalidades necesarias</strong> para darte el servicio:
              </p>
              <Lista
                items={[
                  "Crear y administrar tu cuenta.",
                  "Mostrarte escuelas cercanas, guardar tus favoritas y tus listas de opciones.",
                  "Cotizar, cobrar y agendar cursos y asesorías, y atender cancelaciones y reembolsos.",
                  "Responder tus dudas y solicitudes.",
                ]}
              />
              <p>
                <strong>Finalidades adicionales</strong>, que puedes rechazar sin perder el servicio:
              </p>
              <Lista
                items={[
                  "Avisarte cuando abran convocatorias de becas y fechas de registro.",
                  "Enviarte promociones de los cursos de UniWay.",
                ]}
              />
              <p>
                Puedes activar o desactivar estos avisos en cualquier momento desde{" "}
                <Link href="/perfil#avisos" className="font-semibold text-brand-700 underline underline-offset-2">
                  Mi perfil → Notificaciones
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          id: "menores",
          titulo: "Datos de menores de edad",
          contenido: (
            <>
              <p>
                UniWay está pensado para estudiantes de secundaria que eligen su bachillerato, por lo que muchos de
                nuestros usuarios tienen menos de 18 años.
              </p>
              <Lista
                items={[
                  "Si eres menor de edad, crea tu cuenta con el conocimiento y consentimiento de tu mamá, papá o tutor.",
                  "Te pedimos solo los datos indispensables y nunca datos sensibles.",
                  "Las compras de cursos y asesorías las debe realizar una persona mayor de edad desde una cuenta de tutor.",
                  "La madre, el padre o el tutor puede pedirnos en cualquier momento consultar, corregir o eliminar los datos del menor.",
                ]}
              />
            </>
          ),
        },
        {
          id: "transferencias",
          titulo: "Con quién compartimos tus datos",
          contenido: (
            <>
              <p>
                <strong>No vendemos, rentamos ni compartimos tus datos con fines comerciales.</strong>
              </p>
              <p>
                En la versión actual, tus datos se guardan únicamente en tu navegador (almacenamiento local) y no se envían
                a nuestros servidores. Si en el futuro se habilitan pagos reales, los datos de tu tarjeta los recibiría
                directamente el procesador de pagos autorizado, sin pasar por UniWay.
              </p>
              <p>
                Solo compartiríamos información cuando lo exija una autoridad competente conforme a la ley.
              </p>
            </>
          ),
        },
        {
          id: "arco",
          titulo: "Tus derechos ARCO",
          contenido: (
            <>
              <p>
                Tienes derecho a <strong>Acceder</strong> a tus datos, <strong>Rectificarlos</strong> si están mal,{" "}
                <strong>Cancelarlos</strong> cuando ya no sean necesarios y <strong>Oponerte</strong> a su uso para
                fines específicos. También puedes revocar tu consentimiento.
              </p>
              <p>Para ejercerlos, escribe a {correo} con:</p>
              <Lista
                items={[
                  "Tu nombre y el correo de tu cuenta.",
                  "Qué derecho quieres ejercer y sobre qué datos.",
                  "Un documento que acredite tu identidad o, si eres tutor, la representación del menor.",
                ]}
              />
              <p>Te responderemos dentro de los plazos que establece la ley.</p>
              <p>
                También puedes corregir tus datos o eliminar tu cuenta tú mismo desde{" "}
                <Link href="/perfil#datos" className="font-semibold text-brand-700 underline underline-offset-2">
                  Mi perfil → Mis datos
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          id: "almacenamiento",
          titulo: "Almacenamiento local y cookies",
          contenido: (
            <>
              <p>
                Usamos el almacenamiento local de tu navegador para mantener tu sesión, tus favoritas, tus listas y tus
                pedidos. <strong>No usamos cookies de publicidad ni de rastreo.</strong>
              </p>
              <p>
                El mapa carga imágenes de OpenStreetMap, que recibe tu dirección IP para entregarlas. Los botones «Ver
                fotos», «Videos en TikTok» y «Abrir en Google Maps» te llevan a sitios externos con sus propias políticas
                de privacidad.
              </p>
            </>
          ),
        },
        {
          id: "seguridad",
          titulo: "Cómo protegemos tus datos",
          contenido: (
            <Lista
              items={[
                "Tu contraseña se guarda cifrada con un algoritmo de un solo sentido (SHA-256).",
                "No guardamos el número completo de tu tarjeta ni su código de seguridad.",
                "El sitio publicado funciona con conexión cifrada (HTTPS).",
              ]}
            />
          ),
        },
        {
          id: "cambios",
          titulo: "Cambios a este aviso",
          contenido: (
            <p>
              Si cambiamos este aviso, publicaremos la nueva versión en esta página con su fecha de actualización. Si el
              cambio es importante, te lo avisaremos en tu perfil.
            </p>
          ),
        },
        {
          id: "autoridad",
          titulo: "Autoridad",
          contenido: (
            <p>
              Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir a la Secretaría
              Anticorrupción y Buen Gobierno, autoridad en la materia desde la entrada en vigor de la ley de 2025.
            </p>
          ),
        },
      ]}
    />
  );
}
