"use client";

// PATRÓN FACTORY METHOD · métodos de pago
//
// `MetodoPago` es el creador abstracto: define el proceso de cobro común (`procesar`) pero deja que
// cada subclase decida, con su propio método fábrica `crearCobro`, qué datos de cobro se generan:
//   - PagoTarjeta → pedido "pagado" con marca y últimos 4 dígitos (nunca el número completo)
//   - PagoOxxo    → pedido "pendiente" con una referencia de 14 dígitos
// El flujo de compra solo pide `crearMetodoPago(tipo)` y no sabe qué clase concreta recibe.
// Agregar otro método (por ejemplo, transferencia) = una subclase nueva, sin tocar el flujo.

import { TARJETAS_PRUEBA, marcaTarjeta, type Pedido } from "./pedidos";

export type TipoPago = Pedido["metodo"];

// Datos que el cliente captura para pagar (solo los que necesita cada método)
export interface DatosPago {
  numeroTarjeta?: string;
}

// Lo que cada método fabrica: el estado del pedido y su comprobante
type Cobro = Pick<Pedido, "estado" | "tarjeta" | "referenciaOxxo">;

// El pedido sin los campos que decide el método de pago
export type PedidoSinCobro = Omit<Pedido, "metodo" | keyof Cobro>;

export type ResultadoPago = { ok: true; pedido: Pedido } | { ok: false; error: string };

export abstract class MetodoPago {
  abstract readonly tipo: TipoPago;

  /** Factory Method: cada subclase crea su propio cobro. */
  protected abstract crearCobro(datos: DatosPago): Cobro;

  /** Motivo por el que la pasarela rechazaría el pago, o `null` si se puede cobrar. */
  protected rechazo(datos: DatosPago): string | null {
    void datos; // por defecto, ningún método rechaza; PagoTarjeta lo sobrescribe
    return null;
  }

  /** Operación común a todos los métodos: valida, fabrica el cobro y arma el pedido. */
  procesar(base: PedidoSinCobro, datos: DatosPago): ResultadoPago {
    const error = this.rechazo(datos);
    if (error) return { ok: false, error };
    return { ok: true, pedido: { ...base, metodo: this.tipo, ...this.crearCobro(datos) } };
  }
}

class PagoTarjeta extends MetodoPago {
  readonly tipo = "tarjeta" as const;

  // Modo de prueba: como en las pasarelas reales, solo se aceptan tarjetas de prueba
  protected rechazo({ numeroTarjeta = "" }: DatosPago) {
    const digitos = numeroTarjeta.replace(/\D/g, "");
    if (digitos === TARJETAS_PRUEBA.aprobada.replace(/\s/g, "")) return null;
    if (digitos === TARJETAS_PRUEBA.rechazada.replace(/\s/g, ""))
      return "Tu banco rechazó el pago. Prueba con otra tarjeta o paga en OXXO.";
    return "Modo de prueba: solo se aceptan las tarjetas de prueba que aparecen abajo. No escribas una tarjeta real.";
  }

  protected crearCobro({ numeroTarjeta = "" }: DatosPago): Cobro {
    const digitos = numeroTarjeta.replace(/\D/g, "");
    return { estado: "pagado", tarjeta: { marca: marcaTarjeta(digitos), ultimos4: digitos.slice(-4) } };
  }
}

class PagoOxxo extends MetodoPago {
  readonly tipo = "oxxo" as const;

  protected crearCobro(): Cobro {
    const referencia = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10))
      .join("")
      .replace(/(\d{4})(?=\d)/g, "$1 ");
    return { estado: "pendiente", referenciaOxxo: referencia };
  }
}

// Punto único de creación: el resto del sistema nunca usa `new PagoTarjeta()` ni `new PagoOxxo()`
const METODOS: Record<TipoPago, () => MetodoPago> = {
  tarjeta: () => new PagoTarjeta(),
  oxxo: () => new PagoOxxo(),
};

export function crearMetodoPago(tipo: TipoPago): MetodoPago {
  return METODOS[tipo]();
}
