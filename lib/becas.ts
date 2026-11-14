// Becas para estudiantes antes y durante la prepa en la ZMVM. Consultadas el 8 de noviembre de 2026.
// Montos y fechas cambian cada ciclo: confirmarlos en el sitio oficial de cada programa antes de la entrega.

export type Ambito = "Federal" | "CDMX" | "Edomex" | "UNAM" | "IPN";
export type Etapa = "Antes de la prepa" | "Durante la prepa";

export interface Beca {
  id: string;
  nombre: string;
  ambito: Ambito;
  etapa: Etapa;
  monto: string; // cifra destacada
  periodo: string; // "bimestrales", "al mes", "pago único"…
  paraQuien: string;
  registro: string; // cuándo suele abrir
  url: string;
}

export const BECAS: Beca[] = [
  {
    id: "benito-juarez",
    nombre: "Beca Universal Benito Juárez",
    ambito: "Federal",
    etapa: "Durante la prepa",
    monto: "$1,900",
    periodo: "bimestrales",
    paraQuien: "Todas y todos los estudiantes de prepa pública, sin importar promedio.",
    registro: "Febrero y septiembre, con Llave MX",
    url: "https://www.becabenitojuarez.gob.mx/",
  },
  {
    id: "rita-cetina",
    nombre: "Beca Rita Cetina",
    ambito: "Federal",
    etapa: "Antes de la prepa",
    monto: "$1,900",
    periodo: "bimestrales por familia",
    paraQuien: "Estudiantes de secundaria pública. Te acompaña hasta que entres a la prepa.",
    registro: "Septiembre, con Llave MX",
    url: "https://becaritacetina.gob.mx/",
  },
  {
    id: "mi-beca-para-empezar",
    nombre: "Mi Beca para Empezar",
    ambito: "CDMX",
    etapa: "Antes de la prepa",
    monto: "Mensual",
    periodo: "",
    paraQuien: "Estudiantes de escuelas públicas de la CDMX hasta secundaria.",
    registro: "Agosto a octubre",
    url: "https://www.mibecaparaempezar.cdmx.gob.mx/",
  },
  {
    id: "pilares",
    nombre: "Beca PILARES Bienestar",
    ambito: "CDMX",
    etapa: "Durante la prepa",
    monto: "$1,000",
    periodo: "al mes",
    paraQuien: "Quienes viven en la CDMX y estudian prepa en línea, abierta o a distancia.",
    registro: "Enero",
    url: "https://pilares.cdmx.gob.mx/",
  },
  {
    id: "edomex-aprovechamiento",
    nombre: "Becas por Aprovechamiento Académico",
    ambito: "Edomex",
    etapa: "Durante la prepa",
    monto: "$1,200",
    periodo: "al mes",
    paraQuien: "Prepa pública del Estado de México con promedio mínimo de 9.5.",
    registro: "Diciembre",
    url: "https://seduc.edomex.gob.mx/",
  },
  {
    id: "edomex-exencion",
    nombre: "Becas de Exención",
    ambito: "Edomex",
    etapa: "Durante la prepa",
    monto: "Hasta 100 %",
    periodo: "de la colegiatura",
    paraQuien: "Prepas particulares incorporadas a la SECTI del Estado de México.",
    registro: "Septiembre",
    url: "https://secti.edomex.gob.mx",
  },
  {
    id: "unam-deportiva",
    nombre: "Beca UNAM Deportiva",
    ambito: "UNAM",
    etapa: "Durante la prepa",
    monto: "$12,000",
    periodo: "en cuatro pagos",
    paraQuien: "Alumnos de ENP y CCH que hacen deporte, con ingreso familiar de hasta 4 salarios mínimos.",
    registro: "Inicio del ciclo escolar",
    url: "https://www.becas.unam.mx/category/becas-y-apoyos/becas-por-nivel/bachillerato/",
  },
  {
    id: "ipn-institucional",
    nombre: "Beca Institucional IPN",
    ambito: "IPN",
    etapa: "Durante la prepa",
    monto: "$5,700",
    periodo: "pago único",
    paraQuien: "Alumnos de CECyT y CET. También hay becas Cultural y Deportiva de $6,000.",
    registro: "Agosto y septiembre, en SIBec",
    url: "https://www.ipn.mx/daes/",
  },
];

// Meses en que suelen abrir las convocatorias (patrón de 2025 y 2026)
export const CALENDARIO = [
  { mes: "Ene", becas: ["PILARES Bienestar"] },
  { mes: "Feb", becas: ["Benito Juárez"] },
  { mes: "Ago", becas: ["Mi Beca para Empezar", "IPN"] },
  { mes: "Sep", becas: ["Benito Juárez", "Rita Cetina", "Exención Edomex"] },
  { mes: "Dic", becas: ["Aprovechamiento Edomex"] },
];

export const AMBITOS: Ambito[] = ["Federal", "CDMX", "Edomex", "UNAM", "IPN"];
