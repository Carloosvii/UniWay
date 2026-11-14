// Precios y plazos de los productos de pago de UniWay (los usan el flujo de compra y la política de reembolsos)

export const PRECIOS = {
  curso: 799, // curso UNAM / IPN completo
  asesoria: 150, // por sesión de 60 minutos
  descuentoPaquete: 0.1, // 10 % en paquetes de 5 asesorías o más
  minParaDescuento: 5,
};

export const AREAS = [
  "Matemáticas",
  "Habilidad matemática",
  "Español",
  "Habilidad verbal",
  "Física",
  "Química",
  "Biología",
  "Historia",
  "Geografía",
  "Formación cívica y ética",
];

export const DURACION_CURSO_SEMANAS = 12;
export const DIAS_REEMBOLSO_CURSO = 7;
export const HORAS_CANCELACION_ASESORIA = 24;
export const VIGENCIA_COTIZACION_DIAS = 7;
