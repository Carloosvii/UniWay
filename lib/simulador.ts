// Banco de práctica propio de UniWay: 2 preguntas por cada una de las 10 áreas del examen de ingreso.
// Es un diagnóstico corto, no reproduce reactivos oficiales.

export interface Pregunta {
  area: string;
  texto: string;
  opciones: string[];
  correcta: number; // índice en `opciones`
}

export const PREGUNTAS: Pregunta[] = [
  { area: "Habilidad verbal", texto: "Elige el sinónimo de «efímero».", opciones: ["Eterno", "Pasajero", "Enorme", "Valiente"], correcta: 1 },
  { area: "Habilidad verbal", texto: "Libro es a biblioteca como cuadro es a…", opciones: ["Pintor", "Museo", "Marco", "Color"], correcta: 1 },
  { area: "Habilidad matemática", texto: "Sigue la serie: 2, 6, 12, 20, 30, …", opciones: ["40", "42", "44", "36"], correcta: 1 },
  { area: "Habilidad matemática", texto: "Un tren recorre 240 km en 3 horas. A la misma velocidad, ¿cuántos km recorre en 5 horas?", opciones: ["360", "400", "420", "480"], correcta: 1 },
  { area: "Español", texto: "¿Qué palabra está escrita correctamente?", opciones: ["Exámen", "Exsamen", "Examen", "Egzamen"], correcta: 2 },
  { area: "Español", texto: "En la oración «Los estudiantes leyeron el libro», ¿cuál es el sujeto?", opciones: ["leyeron", "el libro", "Los estudiantes", "leyeron el libro"], correcta: 2 },
  { area: "Matemáticas", texto: "Si 3x − 7 = 11, ¿cuánto vale x?", opciones: ["4", "5", "6", "−6"], correcta: 2 },
  { area: "Matemáticas", texto: "¿Cuánto es el 25 % de 360?", opciones: ["60", "75", "90", "120"], correcta: 2 },
  { area: "Física", texto: "¿Cuál es la unidad de fuerza en el Sistema Internacional?", opciones: ["Joule", "Watt", "Newton", "Pascal"], correcta: 2 },
  { area: "Física", texto: "¿Qué energía tiene un objeto por estar a cierta altura del suelo?", opciones: ["Cinética", "Potencial", "Térmica", "Eléctrica"], correcta: 1 },
  { area: "Química", texto: "¿Cuál es el símbolo químico del sodio?", opciones: ["S", "So", "Na", "Sd"], correcta: 2 },
  { area: "Química", texto: "El agua (H₂O) es un ejemplo de…", opciones: ["Elemento", "Compuesto", "Mezcla heterogénea", "Átomo"], correcta: 1 },
  { area: "Biología", texto: "¿Qué organelo realiza la fotosíntesis en las células vegetales?", opciones: ["Mitocondria", "Núcleo", "Cloroplasto", "Ribosoma"], correcta: 2 },
  { area: "Biología", texto: "¿Dónde se guarda principalmente la información genética de una célula eucariota?", opciones: ["Membrana", "Núcleo", "Citoplasma", "Pared celular"], correcta: 1 },
  { area: "Historia", texto: "¿En qué año inició la Independencia de México?", opciones: ["1810", "1821", "1857", "1910"], correcta: 0 },
  { area: "Historia", texto: "¿Quién encabezó el Plan de Ayala en 1911?", opciones: ["Francisco I. Madero", "Emiliano Zapata", "Venustiano Carranza", "Francisco Villa"], correcta: 1 },
  { area: "Geografía", texto: "¿Qué línea imaginaria divide la Tierra en hemisferio norte y hemisferio sur?", opciones: ["Meridiano de Greenwich", "Ecuador", "Trópico de Cáncer", "Círculo polar ártico"], correcta: 1 },
  { area: "Geografía", texto: "¿Qué océano baña las costas del oeste de México?", opciones: ["Atlántico", "Pacífico", "Índico", "Ártico"], correcta: 1 },
  { area: "Formación cívica y ética", texto: "¿Qué documento establece los derechos fundamentales y la organización del Estado mexicano?", opciones: ["El Código Civil", "La Constitución Política", "La Ley Federal del Trabajo", "El reglamento escolar"], correcta: 1 },
  { area: "Formación cívica y ética", texto: "¿Cuáles son los tres Poderes de la Unión en México?", opciones: ["Ejecutivo, Legislativo y Judicial", "Federal, Estatal y Municipal", "Presidencia, Senado y Ejército", "Civil, Militar y Religioso"], correcta: 0 },
];
