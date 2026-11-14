"""Genera lib/planteles.ts a partir del buscador oficial "Mi derecho, mi lugar" (SEP).

Uso (desde esta carpeta):
    curl -sL "https://www.miderechomilugar.gob.mx/buscador-escuelas?tipo=1,2" -o mdml.html
    python generar.py mdml.html ../../lib/planteles.ts

La página trae en su HTML (atributo wire:snapshot de Livewire) la lista de "marcadores":
una entrada por opción educativa con nombre, coordenadas, dirección, clave, especialidad,
institución, municipio, tipo de participación y accesibilidad.
"""
import html, json, re, sys, unicodedata
from collections import defaultdict

src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding="utf-8").read()
snap = json.loads(html.unescape(re.search(r'wire:snapshot="([^"]+)"', s).group(1)))


def un(v):  # quita el formato [valor, {"s": "arr"}] de Livewire
    if isinstance(v, list) and len(v) == 2 and isinstance(v[1], dict) and "s" in v[1]:
        return [un(x) for x in v[0]] if isinstance(v[0], list) else {k: un(x) for k, x in v[0].items()}
    if isinstance(v, dict):
        return {k: un(x) for k, x in v.items()}
    return v


marcadores = un(snap["data"]["marcadores"])

GRUPO = {"UNAM": "unam", "IPN": "ipn", "COLEGIO DE BACHILLERES": "colbach", "CONALEP": "conalep",
         "SECTI CONALEP": "conalep", "DGETI": "cetis", "IEMS": "iems", "DGB": "dgb", "DGETAyCM": "cbta"}
# Todo lo demás (SECTI PO, CBT, CECYTEM, COBAEM, Telebachillerato, UAEMéx) es del Estado de México
CDMX = {"AZCAPOTZALCO": "Azcapotzalco", "BENITO JUÁREZ": "Benito Juárez", "COYOACÁN": "Coyoacán",
        "CUAJIMALPA DE MORELOS": "Cuajimalpa", "CUAUHTÉMOC": "Cuauhtémoc", "GUSTAVO A. MADERO": "Gustavo A. Madero",
        "IZTACALCO": "Iztacalco", "IZTAPALAPA": "Iztapalapa", "LA MAGDALENA CONTRERAS": "Magdalena Contreras",
        "MIGUEL HIDALGO": "Miguel Hidalgo", "MILPA ALTA": "Milpa Alta", "TLALPAN": "Tlalpan", "TLÁHUAC": "Tláhuac",
        "VENUSTIANO CARRANZA": "Venustiano Carranza", "XOCHIMILCO": "Xochimilco", "ÁLVARO OBREGÓN": "Álvaro Obregón"}
CORTO_EDOMEX = {"ECATEPEC DE MORELOS": "Ecatepec", "NAUCALPAN DE JUÁREZ": "Naucalpan", "TLALNEPANTLA DE BAZ": "Tlalnepantla",
                "COACALCO DE BERRIOZÁBAL": "Coacalco", "ATIZAPÁN DE ZARAGOZA": "Atizapán"}

MINUS = {"de", "del", "la", "las", "los", "y", "e", "en", "a", "el", "con", "por"}
SIGLAS = {"CONALEP", "CETIS", "CBTIS", "CBTA", "CBT", "CET", "CCH", "ENP", "IEMS", "CEB", "COBAEM",
          "UNAM", "IPN", "SECOFI", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"}
ESPECIAL = {"CECYT": "CECyT", "CECYTEM": "CECyTEM", "DR.": "Dr.", "LIC.": "Lic.", "ING.": "Ing.",
            "PROFR.": "Profr.", "MTRO.": "Mtro.", "GRAL.": "Gral.", "UAEMÉX": "UAEMéx"}


def titulo(t):
    out = []
    for i, w in enumerate(t.split()):
        W = w.upper()
        if W in ESPECIAL:
            out.append(ESPECIAL[W])
        elif W in SIGLAS or re.fullmatch(r"[\d/]+", w):
            out.append(W)
        elif i > 0 and w.lower() in MINUS:
            out.append(w.lower())
        else:
            out.append(w[:1].upper() + w[1:].lower())
    return " ".join(out)


def limpio(t):
    t = t.replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", t).strip()


def nombre_corto(inst, n):
    """Devuelve (nombre corto legible, especialidad implícita en el nombre o None)."""
    m = re.match(r'ESCUELA NACIONAL PREPARATORIA PLANTEL NÚM\. (\d) "(.+)"', n)
    if m:
        return f"ENP {m.group(1)} {titulo(m.group(2))}", None
    m = re.match(r"COLEGIO DE CIENCIAS Y HUMANIDADES, PLANTEL (.+)", n)
    if m:
        return f"CCH {titulo(m.group(1))}", None
    m = re.match(r'CENTRO DE ESTUDIOS (?:CIENTÍFICOS Y )?TECNOLÓGICOS \((CECyT \d+|CET \d+)\)\s*"(.+?)\s*"\s*RAMA (?:DE )?(.+)', n)
    if m:
        rama = titulo(m.group(3))
        rama = "Rama multidisciplinaria" if rama.lower().startswith("multidisciplin") else "Rama de " + rama
        return f"{m.group(1)} {titulo(m.group(2))}", rama
    if inst == "COLEGIO DE BACHILLERES":
        m = re.match(r"PLANTEL (\d+),\s*(.*)", n)
        resto = m.group(2)
        antes = resto.split('"')[0].strip()
        lugar = antes if antes else resto.strip('" ')
        return f"Bachilleres {m.group(1)} {titulo(lugar)}", None
    if inst == "IEMS":
        return "IEMS " + titulo(n.replace(" - ", " ")), None
    reglas = [
        (r"CENTRO DE ESTUDIOS TECNOLÓGICOS,? INDUSTRIAL(?:ES)? Y DE SERVICIOS", "CETIS"),
        (r"CENTRO DE BACHILLERATO TECNOLÓGICO INDUSTRIAL Y DE SERVICIOS", "CBTIS"),
        (r"CENTRO DE BACHILLERATO TECNOLÓGICO AGROPECUARIO", "CBTA"),
        (r"CENTRO DE BACHILLERATO TECNOLÓGICO", "CBT"),
        (r"CENTRO DE ESTUDIOS DE BACHILLERATO", "CEB"),
        (r"COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE MÉXICO PLANTEL", "CECyTEM"),
        (r"COLEGIO DE BACHILLERES DEL ESTADO DE MÉXICO PLANTEL", "COBAEM"),
        (r"TELEBACHILLERATO COMUNITARIO", "Telebachillerato"),
        (r"(?:ESCUELA )?PREPARATORIA OFICIAL", "Preparatoria Oficial"),
        (r"PLANTEL TEXCOCO DE LA ESCUELA PREPARATORIA", "Prepa UAEMéx Texcoco"),
    ]
    for pat, rep in reglas:
        if re.search(pat, n):
            n = re.sub(pat, rep, n)
            break
    n = re.sub(r"\b(?:NÚM\.|No\.|N°)\s*", "", n).replace('"', "").replace(",", "")
    return titulo(n), None


def municipio(m):
    m = m.strip()
    if m in CDMX:
        return CDMX[m]
    return f"{CORTO_EDOMEX.get(m, titulo(m))}, Edomex"


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", unicodedata.normalize("NFD", t).encode("ascii", "ignore").decode().lower()).strip("-")


# Una opción educativa = plantel + especialidad. Se agrupan las opciones del mismo plantel:
# mismo nombre e institución y a menos de ~1 km (las coordenadas varían un poco entre opciones).
por_nombre = defaultdict(list)
for x in marcadores:
    por_nombre[(x["institucion"], limpio(x["nombre"]))].append(x)
grupos = []
for (inst, nombre), xs in por_nombre.items():
    clusters = []
    for x in xs:
        for c in clusters:
            if abs(c[0]["lat"] - x["lat"]) < 0.01 and abs(c[0]["lng"] - x["lng"]) < 0.01:
                c.append(x)
                break
        else:
            clusters.append([x])
    grupos += [((inst, nombre), c) for c in clusters]

planteles, ids = [], set()
for (inst, nombre), xs in grupos:
    x0 = xs[0]
    corto, rama = nombre_corto(inst, nombre)
    pid = base = slug(corto)
    k = 2
    while pid in ids:
        pid = f"{base}-{k}"
        k += 1
    ids.add(pid)
    opciones, vistos = [], set()
    for x in xs:
        if x["clave"] in vistos:
            continue
        vistos.add(x["clave"])
        opciones.append({"clave": x["clave"], "especialidad": (x["especialidad"] or rama or "").strip()})
    acc = next((x["infraestructura"] for x in xs if x["conAccesibilidad"] and x["infraestructura"]), None)
    planteles.append({
        "id": pid,
        "nombre": corto,
        "nombreOficial": nombre,
        "institucion": GRUPO.get(inst, "edomex"),
        "subsistema": inst,
        "tipo": "examen" if x0["tipoParticipacion"] == "Con Examen" else "directo",
        "alcaldia": municipio(x0["municipio"]),
        "lat": round(x0["lat"], 6),
        "lng": round(x0["lng"], 6),
        "direccion": limpio(x0["direccion"]),
        "opciones": opciones,
        "accesibilidad": limpio(acc) if acc else None,
    })

orden = ["unam", "ipn", "colbach", "conalep", "cetis", "iems", "dgb", "cbta", "edomex"]


def num(t):
    m = re.search(r"\d+", t)
    return int(m.group()) if m else 9999


planteles.sort(key=lambda p: (orden.index(p["institucion"]), re.sub(r"\d.*", "", p["nombre"]), num(p["nombre"]), p["nombre"]))

# Centro de cada municipio del Edomex = promedio de sus planteles (para el selector de ubicación)
acum = defaultdict(list)
for p in planteles:
    if p["alcaldia"].endswith(", Edomex"):
        acum[p["alcaldia"]].append((p["lat"], p["lng"]))
centros = {k: (sum(a for a, _ in v) / len(v), sum(b for _, b in v) / len(v)) for k, v in acum.items()}

L = [
    "// ARCHIVO GENERADO por scripts/planteles/generar.py — no editar a mano.",
    '// Fuente: SEP, buscador de opciones educativas de "Mi derecho, mi lugar" (www.miderechomilugar.gob.mx),',
    f"// consultado el 2026-11-08. {len(marcadores)} opciones educativas agrupadas en {len(planteles)} planteles.",
    'import type { Escuela } from "./escuelas";',
    "",
    "export const PLANTELES: Escuela[] = " + json.dumps(planteles, ensure_ascii=False, indent=1) + ";",
    "",
    "// Centro aproximado de cada municipio del Estado de México (promedio de sus planteles)",
    "export const CENTROS_EDOMEX: Record<string, [number, number]> = {",
]
for k in sorted(centros):
    L.append(f"  {json.dumps(k, ensure_ascii=False)}: [{centros[k][0]:.4f}, {centros[k][1]:.4f}],")
L += ["};", ""]
open(dst, "w", encoding="utf-8").write("\n".join(L))
print(len(marcadores), "opciones,", len(planteles), "planteles")
