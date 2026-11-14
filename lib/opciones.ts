"use client";

// Favoritas y "Mis opciones".
// - Favoritas: las carreras que el alumno marca con el corazón (sin orden).
// - Listas: una lista ORDENADA por cada modalidad de Mi derecho, mi lugar, armada desde las favoritas.
//   Cada modalidad guarda la suya, así cambiar de modalidad no borra nada.
// Se guarda por cuenta en el navegador (demo, igual que la sesión).

import { useCallback, useEffect, useState } from "react";
import { ESCUELAS, type Escuela, type OpcionEducativa } from "./escuelas";
import { useSesion } from "./sesion";

export type Modalidad = 1 | 2 | 3;

interface Guardado {
  favoritas: string[];
  listas: Record<Modalidad, string[]>;
  modalidad: Modalidad | null; // la que está armando
}

export interface OpcionElegida {
  clave: string;
  escuela: Escuela;
  opcion: OpcionEducativa;
}

const POR_CLAVE = new Map<string, { escuela: Escuela; opcion: OpcionEducativa }>();
for (const escuela of ESCUELAS) for (const opcion of escuela.opciones) POR_CLAVE.set(opcion.clave, { escuela, opcion });

export const buscarOpcion = (clave: string) => POR_CLAVE.get(clave);

const EVENTO = "uniway:opciones-cambio";
const claveDe = (correo: string) => `uniway:opciones:${correo}`;
const vacio = (): Guardado => ({ favoritas: [], listas: { 1: [], 2: [], 3: [] }, modalidad: null });

function leer(correo: string): Guardado {
  try {
    const v = localStorage.getItem(claveDe(correo));
    if (!v) return vacio();
    const g = JSON.parse(v);
    // Formato anterior ({ modalidad, claves }): las claves pasan a favoritas
    if (Array.isArray(g.claves)) return { ...vacio(), favoritas: g.claves };
    return { ...vacio(), ...g, listas: { ...vacio().listas, ...g.listas } };
  } catch {
    return vacio();
  }
}

function escribir(correo: string, g: Guardado) {
  try {
    localStorage.setItem(claveDe(correo), JSON.stringify(g));
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}

export function borrarOpciones(correo: string) {
  try {
    localStorage.removeItem(claveDe(correo));
  } catch {}
}

const resolver = (claves: string[]): OpcionElegida[] =>
  claves.flatMap((clave) => {
    const r = POR_CLAVE.get(clave);
    return r ? [{ clave, ...r }] : [];
  });

// ¿Esta opción cabe en la modalidad? (1: solo sin examen · 2: solo UNAM/IPN con examen · 3: ambas)
export function compatible(m: Modalidad, e: Escuela) {
  return m === 3 || (m === 1 ? e.tipo === "directo" : e.tipo === "examen");
}

export function useOpciones() {
  const usuario = useSesion();
  const correo = usuario?.correo ?? null;
  const [datos, setDatos] = useState<Guardado>(vacio);

  useEffect(() => {
    if (!correo) return setDatos(vacio());
    const actualizar = () => setDatos(leer(correo));
    actualizar();
    window.addEventListener(EVENTO, actualizar);
    window.addEventListener("storage", actualizar);
    return () => {
      window.removeEventListener(EVENTO, actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, [correo]);

  const guardar = useCallback(
    (cambio: (g: Guardado) => Guardado) => {
      if (correo) escribir(correo, cambio(leer(correo)));
    },
    [correo],
  );

  const conLista = (m: Modalidad, f: (l: string[]) => string[]) =>
    guardar((g) => ({ ...g, listas: { ...g.listas, [m]: f(g.listas[m]) } }));

  return {
    conSesion: !!correo,
    modalidad: datos.modalidad,
    favoritas: resolver(datos.favoritas),
    listas: {
      1: resolver(datos.listas[1]),
      2: resolver(datos.listas[2]),
      3: resolver(datos.listas[3]),
    } as Record<Modalidad, OpcionElegida[]>,
    esFavorita: (clave: string) => datos.favoritas.includes(clave),
    alternarFavorita: (clave: string) =>
      guardar((g) =>
        g.favoritas.includes(clave)
          ? { ...g, favoritas: g.favoritas.filter((c) => c !== clave) }
          : { ...g, favoritas: [...g.favoritas, clave] },
      ),
    elegirModalidad: (m: Modalidad | null) => guardar((g) => ({ ...g, modalidad: m })),
    agregar: (m: Modalidad, clave: string) => conLista(m, (l) => (l.includes(clave) ? l : [...l, clave])),
    quitar: (m: Modalidad, clave: string) => conLista(m, (l) => l.filter((c) => c !== clave)),
    mover: (m: Modalidad, clave: string, paso: -1 | 1) =>
      conLista(m, (l) => {
        const i = l.indexOf(clave);
        const j = i + paso;
        if (i < 0 || j < 0 || j >= l.length) return l;
        const nueva = [...l];
        [nueva[i], nueva[j]] = [nueva[j], nueva[i]];
        return nueva;
      }),
  };
}

// Reglas de cada modalidad (según Mi derecho, mi lugar; verificar con la convocatoria vigente)
export const MODALIDADES_REGLAS: Record<Modalidad, { nombre: string; corto: string; descripcion: string }> = {
  1: { nombre: "Modalidad 1", corto: "Sin examen", descripcion: "De 5 a 10 opciones de acceso directo." },
  2: { nombre: "Modalidad 2", corto: "Con examen", descripcion: "Hasta 5 opciones del IPN y hasta 5 de la UNAM." },
  3: { nombre: "Modalidad 3", corto: "Con y sin examen", descripcion: "De 5 a 10 sin examen, más hasta 5 del IPN y 5 de la UNAM." },
};

const contar = (lista: OpcionElegida[]) => ({
  directo: lista.filter((e) => e.escuela.tipo === "directo").length,
  unam: lista.filter((e) => e.escuela.tipo === "examen" && e.escuela.institucion === "unam").length,
  ipn: lista.filter((e) => e.escuela.tipo === "examen" && e.escuela.institucion === "ipn").length,
});

// ¿Se puede agregar una opción más sin pasar el máximo?
export function cabe(m: Modalidad, lista: OpcionElegida[], e: Escuela) {
  if (!compatible(m, e)) return false;
  const c = contar(lista);
  if (e.tipo === "directo") return c.directo < 10;
  return e.institucion === "unam" ? c.unam < 5 : c.ipn < 5;
}

export function revisarOpciones(m: Modalidad, lista: OpcionElegida[]) {
  const { directo, unam, ipn } = contar(lista);
  const avisos: string[] = [];
  if (m !== 2 && directo < 5) avisos.push(`Te faltan ${5 - directo} opciones sin examen para llegar al mínimo de 5.`);
  if (m === 2 && unam + ipn === 0) avisos.push("Agrega al menos una opción de la UNAM o del IPN.");
  return { directo, unam, ipn, avisos, lista: avisos.length === 0 };
}
