# Cómo regenerar `lib/planteles.ts`

Los planteles salen del buscador oficial de la SEP **"Mi derecho, mi lugar"**
(https://www.miderechomilugar.gob.mx/buscador-escuelas). La página trae en su HTML la lista
completa de opciones educativas de la Zona Metropolitana del Valle de México: nombre, coordenadas,
dirección, clave, especialidad, institución, municipio, tipo de participación (con o sin examen)
y accesibilidad.

Desde esta carpeta:

```bash
curl -sL "https://www.miderechomilugar.gob.mx/buscador-escuelas?tipo=1,2" -o mdml.html
python generar.py mdml.html ../../lib/planteles.ts
```

`generar.py` agrupa las opciones del mismo plantel, acorta los nombres (por ejemplo
"CENTRO DE ESTUDIOS TECNOLÓGICOS INDUSTRIAL Y DE SERVICIOS NÚM. 2" → "CETIS 2") y calcula
el centro de cada municipio del Estado de México para el selector de ubicación.

Última extracción: 2026-11-08 — 1,082 opciones educativas en 553 planteles.
Cítese como: Secretaría de Educación Pública. (2026). *Buscador de opciones educativas, Mi derecho, mi lugar*.
