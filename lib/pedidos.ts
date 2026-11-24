"use client";

// Productos de pago de UniWay, cotización, pedidos y reglas de cancelación/reembolso.
// DEMO: el pago es en MODO DE PRUEBA (no hay pasarela real) y los pedidos se guardan por cuenta
// en el navegador. Nunca se guarda el número de tarjeta: solo la marca y los últimos 4 dígitos.

import { useCallback, useEffect, useState } from "react";
import { useSesion } from "./sesion";

// ---------- Catálogo
export type Producto = "curso" | "asesoria";

// Precios y plazos viven en un módulo sin "use client" para poder usarlos también en páginas del servidor
export {
  AREAS,
  DIAS_REEMBOLSO_CURSO,
  DURACION_CURSO_SEMANAS,
  HORAS_CANCELACION_ASESORIA,
  PRECIOS,
  VIGENCIA_COTIZACION_DIAS,
} from "./politicas";
import { DIAS_REEMBOLSO_CURSO, HORAS_CANCELACION_ASESORIA, PRECIOS } from "./politicas";

export const peso = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });

// Precios con IVA incluido: el desglose separa la base y el 16 %.
// El precio y el descuento los decide la estrategia del producto (ver ESTRATEGIAS más abajo).
export function cotizar(producto: Producto, cantidad = 1) {
  const estrategia = ESTRATEGIAS[producto];
  const unitario = estrategia.precioUnitario;
  const bruto = unitario * cantidad;
  const descuento = estrategia.descuento(bruto, cantidad);
  const total = bruto - descuento;
  const base = Math.round((total / 1.16) * 100) / 100;
  return { unitario, cantidad, bruto, descuento, total, base, iva: Math.round((total - base) * 100) / 100 };
}

// ---------- Fechas
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const fechaLarga = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString("es-MX", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// Próximos lunes como fechas propuestas de inicio del curso (el primero es la propuesta)
export function proximosLunes(n = 3, desde = new Date()) {
  const d = new Date(desde);
  d.setHours(9, 0, 0, 0);
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return Array.from({ length: n }, (_, i) => new Date(d.getTime() + i * 7 * 86400000).toISOString());
}

// Horarios de asesoría de los próximos 14 días. Algunos aparecen ocupados (simulado, siempre los mismos).
export function horariosDisponibles(desde = new Date()) {
  const dias: { fecha: string; etiqueta: string; horas: { iso: string; libre: boolean }[] }[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(desde);
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    if (dow === 0) continue; // domingo sin asesorías
    const horas = (dow === 6 ? [10, 11, 12, 13] : [16, 17, 18, 19]).map((h) => {
      const s = new Date(d);
      s.setHours(h, 0, 0, 0);
      const libre = (d.getDate() * 7 + h * 3) % 5 !== 0;
      return { iso: s.toISOString(), libre };
    });
    dias.push({
      fecha: d.toISOString(),
      etiqueta: `${DIAS[dow].slice(0, 3)} ${d.getDate()}`,
      horas,
    });
  }
  return dias;
}

// ---------- Pedidos
export type EstadoPedido = "pagado" | "pendiente" | "cancelado" | "reembolsado";
export type EstadoSesion = "agendada" | "cancelada" | "reembolsada";

export interface Pedido {
  id: string;
  producto: Producto;
  concepto: string;
  detalle: string; // examen objetivo o materia
  cantidad: number;
  total: number;
  descuento: number;
  metodo: "tarjeta" | "oxxo";
  tarjeta?: { marca: string; ultimos4: string };
  referenciaOxxo?: string;
  pagador: string;
  creado: string;
  estado: EstadoPedido;
  inicio?: string; // curso
  sesiones?: { fecha: string; estado: EstadoSesion }[]; // asesorías
  reembolsado: number; // monto devuelto acumulado
}

const EVENTO = "uniway:pedidos-cambio";
const claveDe = (correo: string) => `uniway:pedidos:${correo}`;

function leer(correo: string): Pedido[] {
  try {
    return JSON.parse(localStorage.getItem(claveDe(correo)) ?? "[]") as Pedido[];
  } catch {
    return [];
  }
}
function escribir(correo: string, pedidos: Pedido[]) {
  try {
    localStorage.setItem(claveDe(correo), JSON.stringify(pedidos));
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}

export function borrarPedidos(correo: string) {
  try {
    localStorage.removeItem(claveDe(correo));
  } catch {}
}

export const nuevoId = () => `UW-${Date.now().toString(36).toUpperCase().slice(-6)}`;

export function usePedidos() {
  const usuario = useSesion();
  const correo = usuario?.correo ?? null;
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    if (!correo) return setPedidos([]);
    const actualizar = () => setPedidos(leer(correo));
    actualizar();
    window.addEventListener(EVENTO, actualizar);
    window.addEventListener("storage", actualizar);
    return () => {
      window.removeEventListener(EVENTO, actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, [correo]);

  const cambiar = useCallback(
    (id: string, f: (p: Pedido) => Pedido) => {
      if (correo) escribir(correo, leer(correo).map((p) => (p.id === id ? f(p) : p)));
    },
    [correo],
  );

  return {
    pedidos: [...pedidos].sort((a, b) => b.creado.localeCompare(a.creado)),
    crear: (p: Pedido) => correo && escribir(correo, [...leer(correo), p]),
    cancelarPedido: (id: string) =>
      cambiar(id, (p) => {
        const r = reembolsoPedido(p);
        return { ...p, estado: r.monto > 0 ? "reembolsado" : "cancelado", reembolsado: p.reembolsado + r.monto };
      }),
    cancelarSesion: (id: string, fecha: string) =>
      cambiar(id, (p) => {
        const r = reembolsoSesion(p, fecha);
        const sesiones = (p.sesiones ?? []).map((s) =>
          s.fecha === fecha ? { ...s, estado: (r.monto > 0 ? "reembolsada" : "cancelada") as EstadoSesion } : s,
        );
        const todas = sesiones.every((s) => s.estado !== "agendada");
        return {
          ...p,
          sesiones,
          reembolsado: p.reembolsado + r.monto,
          estado: todas ? (p.reembolsado + r.monto > 0 ? "reembolsado" : "cancelado") : p.estado,
        };
      }),
    confirmarPagoOxxo: (id: string) => cambiar(id, (p) => ({ ...p, estado: "pagado" })),
  };
}

// ---------- PATRÓN STRATEGY · reglas de cada producto
//
// Cada producto tiene su propia estrategia con la misma interfaz: cuánto cuesta, qué descuento aplica
// y cuánto se reembolsa al cancelar. `cotizar` y `reembolsoPedido` no preguntan qué producto es:
// solo piden su estrategia a ESTRATEGIAS y la usan. Un producto nuevo = una estrategia nueva.
export interface Reembolso {
  monto: number;
  motivo: string;
}

export interface EstrategiaProducto {
  precioUnitario: number;
  descuento(bruto: number, cantidad: number): number;
  reembolso(p: Pedido, ahora: Date): Reembolso;
}

// Curso: reembolso total dentro de los primeros 7 días desde la compra; después ya no.
const estrategiaCurso: EstrategiaProducto = {
  precioUnitario: PRECIOS.curso,
  descuento: () => 0,
  reembolso(p, ahora) {
    const dias = (ahora.getTime() - new Date(p.creado).getTime()) / 86400000;
    return dias <= DIAS_REEMBOLSO_CURSO
      ? { monto: p.total - p.reembolsado, motivo: `Estás dentro de los ${DIAS_REEMBOLSO_CURSO} días: te devolvemos el total.` }
      : { monto: 0, motivo: `Pasaron más de ${DIAS_REEMBOLSO_CURSO} días desde la compra: ya no aplica reembolso.` };
  },
};

// Asesoría: 10 % de descuento desde 5 sesiones; cada sesión se reembolsa si faltan más de 24 h.
const estrategiaAsesoria: EstrategiaProducto = {
  precioUnitario: PRECIOS.asesoria,
  descuento: (bruto, cantidad) =>
    cantidad >= PRECIOS.minParaDescuento ? Math.round(bruto * PRECIOS.descuentoPaquete) : 0,
  reembolso(p, ahora) {
    const reembolsables = (p.sesiones ?? []).filter(
      (s) => s.estado === "agendada" && horasPara(s.fecha, ahora) > HORAS_CANCELACION_ASESORIA,
    );
    return {
      monto: Math.round(reembolsables.length * precioPorSesion(p) * 100) / 100,
      motivo: `Se reembolsan las sesiones con más de ${HORAS_CANCELACION_ASESORIA} h de anticipación.`,
    };
  },
};

export const ESTRATEGIAS: Record<Producto, EstrategiaProducto> = {
  curso: estrategiaCurso,
  asesoria: estrategiaAsesoria,
};

// Pago en OXXO pendiente: se cancela sin cargo (no hubo cobro). Si ya se pagó, decide la estrategia.
export function reembolsoPedido(p: Pedido, ahora = new Date()): Reembolso {
  if (p.estado === "pendiente") return { monto: 0, motivo: "Aún no pagas: se cancela sin ningún cargo." };
  return ESTRATEGIAS[p.producto].reembolso(p, ahora);
}

export function reembolsoSesion(p: Pedido, fecha: string, ahora = new Date()) {
  if (p.estado === "pendiente") return { monto: 0, motivo: "Aún no pagas: se cancela sin cargo." };
  return horasPara(fecha, ahora) > HORAS_CANCELACION_ASESORIA
    ? { monto: precioPorSesion(p), motivo: `Faltan más de ${HORAS_CANCELACION_ASESORIA} h: te devolvemos esta sesión.` }
    : { monto: 0, motivo: `Faltan menos de ${HORAS_CANCELACION_ASESORIA} h: la sesión se cancela sin reembolso.` };
}

const horasPara = (iso: string, ahora: Date) => (new Date(iso).getTime() - ahora.getTime()) / 3600000;
export const precioPorSesion = (p: Pedido) => Math.round((p.total / Math.max(1, p.cantidad)) * 100) / 100;

// ---------- Tarjetas de prueba (modo de prueba, como las pasarelas reales)
export const TARJETAS_PRUEBA = {
  aprobada: "4242 4242 4242 4242",
  rechazada: "4000 0000 0000 0002",
};

export function luhnValido(numero: string) {
  const d = numero.replace(/\D/g, "");
  if (d.length < 13 || d.length > 19) return false;
  let suma = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    suma += n;
  }
  return suma % 10 === 0;
}

export function marcaTarjeta(numero: string) {
  const d = numero.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "American Express";
  return "Tarjeta";
}
