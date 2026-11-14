import type { Institucion } from "./escuelas";

// Instituciones con página propia en /escuelas
export type InstitucionConFicha = Extract<Institucion, "unam" | "ipn" | "colbach" | "conalep" | "cetis">;

// Ficha de cada institución para su página "Conoce a…".
// IMPORTANTE: los datos son generales y de conocimiento público; verificarlos con las
// fuentes oficiales de cada institución antes de la entrega final (y citarlas en APA).

export interface FichaInstitucion {
  id: InstitucionConFicha;
  nombre: string;
  nombreCorto: string;
  img: string;
  imgPosicion?: string;
  tipo: "Con examen" | "Sin examen";
  colores: {
    fondo: string; // color institucional oscuro (fondo de la sección)
    acento: string; // color para el titular y el botón principal
    textoBoton: string; // color del texto sobre el botón de acento
  };
  titular: string;
  descripcion: string;
  datos: { valor: string; etiqueta: string }[];
  ubicacion: string; // texto de "¿Dónde está?"
}

export const FICHAS: Record<InstitucionConFicha, FichaInstitucion> = {
  unam: {
    id: "unam",
    nombre: "Universidad Nacional Autónoma de México",
    nombreCorto: "UNAM",
    img: "/img/unam.jpg",
    imgPosicion: "center 35%",
    tipo: "Con examen",
    colores: { fondo: "#0b2a4a", acento: "#d6a419", textoBoton: "#0b2a4a" },
    titular: "La universidad de la nación.",
    descripcion:
      "Su bachillerato tiene dos sistemas: la Escuela Nacional Preparatoria (ENP), con un plan de estudios propedéutico, y el Colegio de Ciencias y Humanidades (CCH), que impulsa que aprendas a investigar por tu cuenta. Al terminar puedes seguir a licenciatura en la UNAM por pase reglamentario si cumples con el promedio y el tiempo establecidos.",
    datos: [
      { valor: "1910", etiqueta: "Año de fundación" },
      { valor: "ENP y CCH", etiqueta: "Sistemas de bachillerato" },
      { valor: "Examen", etiqueta: "Ingreso con examen propio" },
    ],
    ubicacion:
      "Sus preparatorias y CCH están repartidos por la Ciudad de México y el Estado de México, desde Azcapotzalco hasta Xochimilco.",
  },
  ipn: {
    id: "ipn",
    nombre: "Instituto Politécnico Nacional",
    nombreCorto: "IPN",
    img: "/img/ipn.png",
    imgPosicion: "center 60%",
    tipo: "Con examen",
    colores: { fondo: "#4a0f2b", acento: "#f0c2d4", textoBoton: "#4a0f2b" },
    titular: "La técnica al servicio de la patria.",
    descripcion:
      "En sus Centros de Estudios Científicos y Tecnológicos (CECyT) estudias un bachillerato bivalente: terminas con tu certificado de bachillerato y con una carrera técnica, lista para trabajar o para seguir a una ingeniería en el mismo Politécnico.",
    datos: [
      { valor: "1936", etiqueta: "Año de fundación" },
      { valor: "Bivalente", etiqueta: "Bachillerato + carrera técnica" },
      { valor: "Examen", etiqueta: "Ingreso con examen propio" },
    ],
    ubicacion:
      "Sus CECyT están principalmente en la zona norte y centro de la ciudad, con planteles también en el oriente y en el Estado de México.",
  },
  colbach: {
    id: "colbach",
    nombre: "Colegio de Bachilleres",
    nombreCorto: "Bachilleres",
    img: "/img/bachilleres.avif",
    tipo: "Sin examen",
    colores: { fondo: "#063f3c", acento: "#7fd3c5", textoBoton: "#063f3c" },
    titular: "Bachillerato general, cerca de tu casa.",
    descripcion:
      "Ofrece un bachillerato general que te prepara para cualquier licenciatura, y además una capacitación para el trabajo que eliges durante la carrera. Tiene modalidad presencial y no presencial.",
    datos: [
      { valor: "1973", etiqueta: "Año de fundación" },
      { valor: "General", etiqueta: "Bachillerato propedéutico" },
      { valor: "Sin examen", etiqueta: "Ingreso por Mi derecho, mi lugar" },
    ],
    ubicacion: "Tiene planteles en la Ciudad de México y en municipios conurbados del Estado de México.",
  },
  conalep: {
    id: "conalep",
    nombre: "Colegio Nacional de Educación Profesional Técnica",
    nombreCorto: "CONALEP",
    img: "/img/conalep.avif",
    tipo: "Sin examen",
    colores: { fondo: "#0b3d24", acento: "#8fd19e", textoBoton: "#0b3d24" },
    titular: "Técnico y bachiller en una sola carrera.",
    descripcion:
      "Estudias como Profesional Técnico Bachiller: sales con una carrera técnica para entrar a trabajar y con el bachillerato completo para seguir a la universidad. Sus carreras están ligadas a la industria y los servicios.",
    datos: [
      { valor: "1978", etiqueta: "Año de fundación" },
      { valor: "Técnico", etiqueta: "Profesional Técnico Bachiller" },
      { valor: "Sin examen", etiqueta: "Ingreso por Mi derecho, mi lugar" },
    ],
    ubicacion: "Tiene planteles en distintas alcaldías de la Ciudad de México y en el Estado de México.",
  },
  cetis: {
    id: "cetis",
    nombre: "Centros de Estudios Tecnológicos industrial y de servicios",
    nombreCorto: "CETIS",
    img: "/img/cetis.jpg",
    imgPosicion: "center 70%",
    tipo: "Sin examen",
    colores: { fondo: "#5c1529", acento: "#d8b98a", textoBoton: "#5c1529" },
    titular: "Bachillerato tecnológico para crear y construir.",
    descripcion:
      "Forman parte de la educación tecnológica industrial de la SEP. Cursas un bachillerato tecnológico: estudias el bachillerato y una especialidad técnica al mismo tiempo, con prácticas en talleres y laboratorios. En UniWay también encontrarás los CBTIS, del mismo subsistema.",
    datos: [
      { valor: "SEP", etiqueta: "Educación tecnológica industrial" },
      { valor: "Bivalente", etiqueta: "Bachillerato + especialidad" },
      { valor: "Sin examen", etiqueta: "Ingreso por Mi derecho, mi lugar" },
    ],
    ubicacion: "Hay planteles CETIS y CBTIS en muchas alcaldías de la Ciudad de México y en municipios del Estado de México.",
  },
};

export const ORDEN_INSTITUCIONES: InstitucionConFicha[] = ["unam", "ipn", "colbach", "conalep", "cetis"];
