// Recursos de estudio para el ingreso al bachillerato. Consultados el 8 de noviembre de 2026.
// Los precios de academias privadas son de lista y cambian seguido: revisarlos antes de la entrega.

export interface Recurso {
  titulo: string;
  fuente: string;
  descripcion: string;
  url: string;
  etiqueta: string; // "Gratis", "Video", etc.
}

export const GRATIS: Recurso[] = [
  {
    titulo: "Curso completo en YouTube",
    fuente: "IkniuM Media Superior",
    descripcion: "Videos de las 10 áreas del examen de ingreso, explicados paso a paso. Ideal para estudiar a tu ritmo.",
    url: "https://www.youtube.com/@IkniuM",
    etiqueta: "Videos",
  },
  {
    titulo: "Pruébate UNAM",
    fuente: "Bachillerato UNAM",
    descripcion: "Examen de práctica de la UNAM para medir qué tan preparado estás antes del examen real.",
    url: "https://www.pruebate.bach.unam.mx:8181/pruebateb/",
    etiqueta: "Examen de práctica",
  },
  {
    titulo: "Examen simulador",
    fuente: "IkniuM",
    descripcion: "Simulador en línea con resultados inmediatos, sin costo.",
    url: "https://www.tienda-iknium.com/ex%C3%A1menes-media-superior-gratis",
    etiqueta: "Examen de práctica",
  },
  {
    titulo: "Buscador oficial de escuelas",
    fuente: "SEP · Mi derecho, mi lugar",
    descripcion: "Consulta todas las opciones educativas con su clave antes de hacer tu registro.",
    url: "https://www.miderechomilugar.gob.mx/buscador-escuelas?tipo=1,2",
    etiqueta: "Oficial",
  },
];

// Modalidades de participación de Mi derecho, mi lugar (según el sitio oficial)
export const MODALIDADES = [
  {
    nombre: "Modalidad 1",
    acceso: "Sin examen",
    detalle: "Eliges entre 5 y 10 opciones educativas de acceso directo.",
    cifra: "5 a 10",
    resumen: "opciones de acceso directo, sin examen.",
    tipo: "directo",
  },
  {
    nombre: "Modalidad 2",
    acceso: "Con examen",
    detalle: "Eliges hasta 5 opciones del IPN y hasta 5 de la UNAM.",
    cifra: "5 + 5",
    resumen: "opciones con examen: hasta 5 del IPN y 5 de la UNAM.",
    tipo: "examen",
  },
  {
    nombre: "Modalidad 3",
    acceso: "Con y sin examen",
    detalle: "Combinas de 5 a 10 opciones sin examen con hasta 5 del IPN y 5 de la UNAM.",
    cifra: "20",
    resumen: "opciones como máximo, combinando con y sin examen.",
    tipo: "",
  },
];

export const PASOS_REGISTRO = [
  "Revisa la convocatoria y las fechas en miderechomilugar.gob.mx.",
  "Elige tu modalidad: sin examen, con examen o ambas.",
  "Busca tus escuelas en el mapa de UniWay y anota la clave de cada opción.",
  "Ordénalas de la que más quieres a la que menos: el orden cuenta.",
  "Haz tu registro en línea con tu CURP e imprime tu comprobante.",
];

export interface CursoPrivado {
  academia: string;
  modalidad: "En línea" | "Presencial";
  precio: number; // precio de lista en MXN
  nota?: string;
  url: string;
}

export const CURSOS_PRIVADOS: CursoPrivado[] = [
  { academia: "CONAMAT", modalidad: "En línea", precio: 2900, nota: "Plataforma 24/7, +70 videos y guía impresa", url: "https://www.conamat.com/curso-ingreso-al-bachillerato-conamat" },
  { academia: "CONAMAT", modalidad: "Presencial", precio: 8250, nota: "90 horas de clase; 20 % de descuento de contado", url: "https://www.conamat.com/curso-ingreso-al-bachillerato-conamat" },
  { academia: "CreaEdu", modalidad: "En línea", precio: 3400, nota: "Pago de contado", url: "https://educativacrea.com/" },
  { academia: "CreaEdu", modalidad: "Presencial", precio: 3900, nota: "Pago de contado", url: "https://educativacrea.com/" },
  { academia: "Antonio Díaz", modalidad: "En línea", precio: 3999, nota: "Suele tener descuentos por fecha", url: "https://antoniodiazprofe.com/producto/ecoems-2027-2/" },
  { academia: "Conversa", modalidad: "Presencial", precio: 4449, nota: "Pago único; planteles en CDMX y Edomex", url: "https://www.conversa.com.mx/ecoems/" },
  { academia: "Classvroom", modalidad: "En línea", precio: 7350, nota: "También en pagos quincenales", url: "https://classvroom.mx/curso-ecoems/" },
  { academia: "CEDINA", modalidad: "En línea", precio: 9500, nota: "Pago inicial más mensualidades", url: "https://cedinacursos.com/products/curso-ecoems-en-linea-prepa-unam-ipn-2027" },
];

export const MATERIAL: Recurso[] = [
  {
    titulo: "Temario resuelto",
    fuente: "IkniuM Editorial",
    descripcion: "Las 10 áreas de estudio del examen de ingreso, explicadas y resueltas.",
    url: "https://www.iknium.com/puntos-de-venta",
    etiqueta: "Libro",
  },
  {
    titulo: "Cuadernillo de ejercicios",
    fuente: "IkniuM Editorial",
    descripcion: "Más de 600 reactivos y 2 exámenes, con respuestas y hoja de óvalos.",
    url: "https://www.iknium.com/puntos-de-venta",
    etiqueta: "Ejercicios",
  },
  {
    titulo: "Práctica Rífate",
    fuente: "IkniuM",
    descripcion: "Acceso a 5 exámenes y 4 modalidades de práctica en línea.",
    url: "https://www.tienda-iknium.com/planes-y-suscripcion",
    etiqueta: "Suscripción",
  },
];

export const precioMx = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
