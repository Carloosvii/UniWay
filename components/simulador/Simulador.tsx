"use client";

import { useEffect, useState } from "react";
import TarjetaChevron from "@/components/ui/TarjetaChevron";
import { EnlaceCorchetes } from "@/components/ui/Clemson";
import { PREGUNTAS } from "@/lib/simulador";

type Fase = "inicio" | "examen" | "resultado";

const boton = "display uppercase text-lg px-8 py-4 text-center transition-colors";

// Examen corto: una pregunta a la vez, con progreso, tiempo y resultados por área
export default function Simulador() {
  const [fase, setFase] = useState<Fase>("inicio");
  const [actual, setActual] = useState(0);
  const [respuestas, setRespuestas] = useState<(number | null)[]>(() => PREGUNTAS.map(() => null));
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (fase !== "examen") return;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [fase]);

  const empezar = () => {
    setRespuestas(PREGUNTAS.map(() => null));
    setActual(0);
    setSegundos(0);
    setFase("examen");
  };

  const tiempo = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`;

  if (fase === "inicio") {
    return (
      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center bg-surface p-8 md:p-12">
        <div>
          <p className="display text-3xl md:text-4xl text-ink">20 preguntas · 10 áreas · unos 15 minutos</p>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            Un diagnóstico rápido para saber qué materias repasar. Al terminar ves tus aciertos por área y qué estudiar.
          </p>
        </div>
        <button onClick={empezar} className={`${boton} boton-bloque bg-buy text-brand-900 hover:bg-buy-hover`}>
          Empezar
        </button>
      </div>
    );
  }

  if (fase === "examen") {
    const p = PREGUNTAS[actual];
    const elegida = respuestas[actual];
    const ultima = actual === PREGUNTAS.length - 1;
    return (
      <div className="bg-surface p-6 md:p-10">
        <div className="flex items-center justify-between text-sm text-ink-2">
          <span>
            Pregunta <strong className="text-ink">{actual + 1}</strong> de {PREGUNTAS.length}
          </span>
          <span aria-label="Tiempo transcurrido">⏱ {tiempo}</span>
        </div>
        <div className="mt-3 h-2 bg-white" role="progressbar" aria-valuenow={actual + 1} aria-valuemin={1} aria-valuemax={PREGUNTAS.length}>
          <div className="h-full bg-brand-700 transition-all" style={{ width: `${((actual + 1) / PREGUNTAS.length) * 100}%` }} />
        </div>

        <p className="mt-8 font-bold italic text-brand-700">{p.area}</p>
        <h3 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-ink">{p.texto}</h3>

        <div className="mt-6 grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Opciones">
          {p.opciones.map((o, i) => (
            <button
              key={o}
              role="radio"
              aria-checked={elegida === i}
              onClick={() => setRespuestas((r) => r.map((v, j) => (j === actual ? i : v)))}
              className={`flex items-center gap-3 text-left px-5 py-4 border-2 text-lg transition-colors ${
                elegida === i ? "border-brand-700 bg-brand-50" : "border-white bg-white hover:border-brand-300"
              }`}
            >
              <span
                className={`display flex h-8 w-8 shrink-0 items-center justify-center text-sm ${
                  elegida === i ? "bg-brand-700 text-white" : "bg-surface text-ink"
                }`}
              >
                {"ABCD"[i]}
              </span>
              {o}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between gap-3">
          <button
            onClick={() => setActual((a) => a - 1)}
            disabled={actual === 0}
            className={`${boton} bg-white text-brand-900 disabled:opacity-40`}
          >
            Anterior
          </button>
          <button
            onClick={() => (ultima ? setFase("resultado") : setActual((a) => a + 1))}
            disabled={elegida === null}
            className={`${boton} boton-bloque bg-buy text-brand-900 hover:bg-buy-hover disabled:opacity-40 disabled:shadow-none`}
          >
            {ultima ? "Ver resultados" : "Siguiente"}
          </button>
        </div>
      </div>
    );
  }

  // Resultados
  const aciertos = PREGUNTAS.filter((p, i) => respuestas[i] === p.correcta).length;
  const areas = [...new Set(PREGUNTAS.map((p) => p.area))].map((area) => {
    const delArea = PREGUNTAS.map((p, i) => ({ p, i })).filter(({ p }) => p.area === area);
    return { area, total: delArea.length, bien: delArea.filter(({ p, i }) => respuestas[i] === p.correcta).length };
  });
  const repasar = areas.filter((a) => a.bien < a.total);
  const errores = PREGUNTAS.map((p, i) => ({ p, r: respuestas[i] })).filter(({ p, r }) => r !== p.correcta);

  return (
    <div className="space-y-8">
      <TarjetaChevron
        valor={`${aciertos}/${PREGUNTAS.length}`}
        texto={`aciertos en ${tiempo} minutos.`}
        etiqueta={
          aciertos >= 16 ? "¡Vas muy bien! Sigue practicando" : aciertos >= 11 ? "Buen inicio: refuerza tus áreas débiles" : "Empieza por las áreas marcadas"
        }
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-surface p-6 md:p-8">
          <h3 className="display uppercase text-2xl text-brand-900">Aciertos por área</h3>
          <ul className="mt-5 space-y-3">
            {areas.map((a) => (
              <li key={a.area}>
                <div className="flex justify-between text-sm">
                  <span className="text-ink">{a.area}</span>
                  <span className="font-semibold text-ink">
                    {a.bien}/{a.total}
                  </span>
                </div>
                <div className="mt-1 h-2.5 bg-white">
                  <div
                    className={`h-full ${a.bien === a.total ? "bg-brand-700" : a.bien === 0 ? "bg-[#c2410c]" : "bg-brand-300"}`}
                    style={{ width: `${(a.bien / a.total) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface p-6 md:p-8">
          <h3 className="display uppercase text-2xl text-brand-900">Qué repasar</h3>
          {repasar.length === 0 ? (
            <p className="mt-4 text-ink">Acertaste todo. Prueba un examen completo para medirte con más preguntas.</p>
          ) : (
            <p className="mt-4 text-ink">
              Refuerza <strong>{repasar.map((a) => a.area).join(", ")}</strong> con los videos gratuitos y vuelve a intentarlo.
            </p>
          )}
          <div className="mt-5 flex flex-col gap-2">
            <EnlaceCorchetes href="https://www.youtube.com/@IkniuM" externo>
              Videos gratis por área
            </EnlaceCorchetes>
            <EnlaceCorchetes href="https://www.pruebate.bach.unam.mx:8181/pruebateb/" externo>
              Examen completo Pruébate UNAM
            </EnlaceCorchetes>
            <EnlaceCorchetes href="/cursos#uniway">Curso UniWay</EnlaceCorchetes>
          </div>
        </div>
      </div>

      {errores.length > 0 && (
        <div className="bg-surface p-6 md:p-8">
          <h3 className="display uppercase text-2xl text-brand-900">Revisa tus errores</h3>
          <ul className="mt-5 divide-y divide-line">
            {errores.map(({ p, r }) => (
              <li key={p.texto} className="py-4">
                <p className="text-sm font-bold italic text-brand-700">{p.area}</p>
                <p className="mt-1 font-semibold text-ink">{p.texto}</p>
                <p className="mt-2 border-l-[4px] border-[#c2410c] pl-3 text-sm text-ink-2">
                  Tu respuesta: {r === null ? "sin responder" : p.opciones[r]}
                </p>
                <p className="mt-1 border-l-[4px] border-brand-700 pl-3 text-sm text-ink">
                  Correcta: <strong>{p.opciones[p.correcta]}</strong>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={empezar} className={`${boton} boton-bloque bg-buy text-brand-900 hover:bg-buy-hover`}>
        Intentar de nuevo
      </button>
    </div>
  );
}
