import type { Metadata } from "next";
import { EnlaceCorchetes, ONDAS, TituloLinea } from "@/components/ui/Clemson";
import TarjetaChevron from "@/components/ui/TarjetaChevron";
import { DIAS_REEMBOLSO_CURSO, HORAS_CANCELACION_ASESORIA, VIGENCIA_COTIZACION_DIAS } from "@/lib/politicas";

export const metadata: Metadata = { title: "Política de cancelación y reembolsos · UniWay" };

export default function ReembolsosPage() {
  return (
    <>
      <section className="bg-brand-900 text-white" style={{ backgroundImage: ONDAS, backgroundSize: "240px 120px" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-14 md:py-20">
          <h1 className="display uppercase text-4xl md:text-6xl max-w-3xl">
            Cancelación y <span className="text-buy">reembolsos</span>
          </h1>
          <p className="mt-4 text-lg text-white/85 max-w-2xl">Reglas claras antes de pagar. Todo se cancela desde tu perfil, sin llamadas.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-14 md:py-16">
        <TituloLinea>Resumen</TituloLinea>
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <TarjetaChevron
            valor={`${DIAS_REEMBOLSO_CURSO} días`}
            texto="para cancelar el curso UNAM / IPN con reembolso del 100 %."
            etiqueta="Curso UNAM / IPN"
          />
          <TarjetaChevron
            valor={`${HORAS_CANCELACION_ASESORIA} h`}
            texto="de anticipación para cancelar una asesoría y recuperar lo que pagaste por ella."
            etiqueta="Asesorías en vivo"
          />
          <TarjetaChevron valor="$0" texto="si cancelas un pago en OXXO que aún no haces." etiqueta="Pago en efectivo" />
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-10 text-ink leading-relaxed">
          <div className="space-y-4">
            <h2 className="display uppercase text-2xl text-brand-900">Curso UNAM / IPN</h2>
            <p>
              Puedes cancelar dentro de los primeros {DIAS_REEMBOLSO_CURSO} días naturales desde tu compra y te devolvemos el
              total. Después de ese plazo el curso ya no es reembolsable, pero conservas el acceso hasta que termine.
            </p>
            <h2 className="display uppercase text-2xl text-brand-900 pt-4">Asesorías en vivo</h2>
            <p>
              Cada sesión se puede cancelar por separado. Si faltan más de {HORAS_CANCELACION_ASESORIA} horas, te devolvemos lo
              que pagaste por esa sesión (con el descuento de paquete ya aplicado). Con menos de {HORAS_CANCELACION_ASESORIA}{" "}
              horas la sesión se cancela sin reembolso, porque el asesor ya apartó ese horario.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="display uppercase text-2xl text-brand-900">Cómo y cuándo llega tu dinero</h2>
            <p>
              El reembolso regresa a la misma tarjeta con la que pagaste, en un plazo de 5 a 10 días hábiles según tu banco.
              Los pagos en OXXO ya realizados se devuelven por transferencia a la cuenta que nos indiques.
            </p>
            <h2 className="display uppercase text-2xl text-brand-900 pt-4">Cotizaciones</h2>
            <p>
              Cada cotización es válida por {VIGENCIA_COTIZACION_DIAS} días. Los precios están en pesos mexicanos e incluyen
              IVA.
            </p>
            <div className="pt-2">
              <EnlaceCorchetes href="/perfil#cursos">Ir a mis cursos</EnlaceCorchetes>
            </div>
          </div>
        </div>
        <p className="mt-12 text-sm text-ink-2">
          Proyecto escolar: los pagos funcionan en modo de prueba y no se mueve dinero real.
        </p>
      </section>
    </>
  );
}
