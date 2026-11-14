import { CENTROS_EDOMEX, PLANTELES } from "./planteles";

// Grupos de instituciones que muestra UniWay. Los 5 primeros tienen página propia en /escuelas.
export type Institucion = "unam" | "ipn" | "colbach" | "conalep" | "cetis" | "iems" | "dgb" | "cbta" | "edomex";
export type TipoIngreso = "examen" | "directo";

export interface OpcionEducativa {
  clave: string; // clave de opción educativa en "Mi derecho, mi lugar"
  especialidad: string; // carrera técnica, rama o modalidad ("" si es bachillerato general)
}

export interface Escuela {
  id: string;
  nombre: string;
  nombreOficial: string;
  institucion: Institucion;
  subsistema: string; // nombre de la institución tal como aparece en el registro oficial
  tipo: TipoIngreso;
  alcaldia: string;
  lat: number;
  lng: number;
  direccion: string;
  opciones: OpcionEducativa[];
  accesibilidad: string | null; // infraestructura para personas con discapacidad
}

export const INSTITUCIONES: Record<Institucion, { nombre: string; sigla: string; color: string }> = {
  unam: { nombre: "UNAM", sigla: "UNAM", color: "#1f3a5f" },
  ipn: { nombre: "IPN", sigla: "IPN", color: "#7a1f3d" },
  colbach: { nombre: "Colegio de Bachilleres", sigla: "COLBACH", color: "#0f766e" },
  conalep: { nombre: "CONALEP", sigla: "CONALEP", color: "#2e7d32" },
  cetis: { nombre: "CETIS y CBTIS", sigla: "DGETI", color: "#b4691f" },
  iems: { nombre: "Prepas IEMS", sigla: "IEMS", color: "#c2410c" },
  dgb: { nombre: "CEB", sigla: "CEB", color: "#6d28d9" },
  cbta: { nombre: "CBTA", sigla: "CBTA", color: "#65a30d" },
  edomex: { nombre: "Estado de México", sigla: "EDOMEX", color: "#5d8aa1" },
};

// Todos los planteles de la Zona Metropolitana del Valle de México (fuente oficial, ver lib/planteles.ts)
export const ESCUELAS: Escuela[] = PLANTELES;

// Centro de cada alcaldía o municipio, para quien no comparte su ubicación.
// En la CDMX se usa el centro de la zona urbana (el centro geométrico de Tlalpan, por ejemplo, cae en el bosque).
export const ALCALDIAS: Record<string, [number, number]> = {
  ...CENTROS_EDOMEX,
  "Álvaro Obregón": [19.36, -99.2],
  Azcapotzalco: [19.487, -99.186],
  "Benito Juárez": [19.372, -99.159],
  Coyoacán: [19.329, -99.16],
  Cuajimalpa: [19.357, -99.299],
  Cuauhtémoc: [19.433, -99.15],
  "Gustavo A. Madero": [19.49, -99.11],
  Iztacalco: [19.395, -99.097],
  Iztapalapa: [19.357, -99.06],
  "Magdalena Contreras": [19.308, -99.242],
  "Miguel Hidalgo": [19.429, -99.2],
  "Milpa Alta": [19.192, -99.023],
  Tláhuac: [19.286, -99.004],
  Tlalpan: [19.29, -99.17],
  "Venustiano Carranza": [19.43, -99.1],
  Xochimilco: [19.257, -99.103],
};

export const esEdomex = (alcaldia: string) => alcaldia.endsWith(", Edomex");

export const CENTRO_CDMX: [number, number] = [19.4326, -99.1332];

// Distancia en línea recta (fórmula de Haversine), en km
export function distanciaKm(a: [number, number], b: [number, number]): number {
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// Estimación simple: transporte público a ~15 km/h promedio + 10 min de espera y caminata
export function minutosEstimados(km: number): number {
  return Math.round((km / 15) * 60 + 10);
}

export const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function buscarAlcaldia(texto: string | null | undefined): string | null {
  if (!texto) return null;
  const t = normalizar(texto);
  return Object.keys(ALCALDIAS).find((a) => normalizar(a).includes(t) || t.includes(normalizar(a))) ?? null;
}

export interface EscuelaConDistancia extends Escuela {
  km: number;
  minutos: number;
}

// Enlace a Google Maps con la ruta en transporte público
export function linkComoLlegar(origen: [number, number], e: Escuela): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${origen[0]},${origen[1]}&destination=${e.lat},${e.lng}&travelmode=transit`;
}

export const etiquetaTipo = (t: TipoIngreso) => (t === "examen" ? "Con examen" : "Sin examen");
