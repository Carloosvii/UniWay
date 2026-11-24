"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ONDAS } from "@/components/ui/Clemson";
import { claseInput } from "@/components/cuenta/Piezas";
import { useSesion } from "@/lib/sesion";
import {
  AREAS,
  DIAS_REEMBOLSO_CURSO,
  DURACION_CURSO_SEMANAS,
  HORAS_CANCELACION_ASESORIA,
  PRECIOS,
  TARJETAS_PRUEBA,
  VIGENCIA_COTIZACION_DIAS,
  cotizar,
  fechaHora,
  fechaLarga,
  horariosDisponibles,
  luhnValido,
  nuevoId,
  peso,
  proximosLunes,
  usePedidos,
  type Pedido,
  type Producto,
} from "@/lib/pedidos";
import { crearMetodoPago } from "@/lib/pagos";

const PASOS = ["Cotiza", "Agenda", "Paga", "Listo"] as const;
const boton = "boton-bloque display px-6 py-4 text-center text-lg disabled:opacity-50 disabled:shadow-none";
const etiqueta = "block text-xs font-semibold uppercase tracking-wide text-ink-2 mb-1.5";

export default function FlujoCompra({ producto }: { producto: Producto }) {
  const usuario = useSesion();
  const router = useRouter();
  const { crear } = usePedidos();
  const esCurso = producto === "curso";

  const [paso, setPaso] = useState(0);
  // Paso 1 · cotiza
  const [examen, setExamen] = useState("UNAM e IPN");
  const [materia, setMateria] = useState(AREAS[0]);
  const [cantidad, setCantidad] = useState(1);
  // Paso 2 · agenda
  const lunes = useMemo(() => proximosLunes(3), []);
  const [inicio, setInicio] = useState(lunes[0]);
  const dias = useMemo(() => horariosDisponibles(), []);
  const [horarios, setHorarios] = useState<string[]>([]);
  // Paso 3 · paga
  const [metodo, setMetodo] = useState<"tarjeta" | "oxxo">("tarjeta");
  const [t, setT] = useState({ titular: "", numero: "", vence: "", cvc: "" });
  const [acepta, setAcepta] = useState(false);
  const [tocado, setTocado] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    if (usuario === null) router.replace(`/login?siguiente=/comprar/${producto}`);
    if (usuario && !t.titular) setT((v) => ({ ...v, titular: usuario.nombre }));
  }, [usuario, router, producto, t.titular]);

  // Si baja el número de sesiones, se quitan los horarios sobrantes
  useEffect(() => setHorarios((h) => h.slice(0, cantidad)), [cantidad]);

  const q = cotizar(producto, esCurso ? 1 : cantidad);

  if (!usuario) return <div className="h-[70vh] bg-surface animate-pulse" aria-label="Cargando" />;

  // ---------- Validación de tarjeta (modo de prueba)
  const digitos = t.numero.replace(/\D/g, "");
  const [mm, aa] = t.vence.split("/").map((x) => Number(x));
  const ahora = new Date();
  const venceOk =
    mm >= 1 && mm <= 12 && aa >= 0 && new Date(2000 + aa, mm, 0) >= new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const errores =
    metodo === "tarjeta"
      ? {
          titular: t.titular.trim().length < 3 ? "Escribe el nombre como aparece en la tarjeta." : null,
          numero: !luhnValido(digitos) ? "Revisa el número de tarjeta." : null,
          vence: !venceOk ? "Usa el formato MM/AA y una fecha vigente." : null,
          cvc: !/^\d{3,4}$/.test(t.cvc) ? "3 o 4 dígitos." : null,
        }
      : { titular: t.titular.trim().length < 3 ? "Escribe el nombre de quien paga." : null };
  const hayErrores = Object.values(errores).some(Boolean) || !acepta;

  async function pagar(ev: React.FormEvent) {
    ev.preventDefault();
    setTocado(true);
    setErrorPago(null);
    if (hayErrores) return;
    setProcesando(true);
    await new Promise((r) => setTimeout(r, 1200)); // simula la respuesta de la pasarela

    // Factory Method: el flujo pide el método de pago sin saber qué clase concreta recibe
    const resultado = crearMetodoPago(metodo).procesar(
      {
        id: nuevoId(),
        producto,
        concepto: esCurso ? "Curso UNAM / IPN" : `Asesoría en vivo × ${cantidad}`,
        detalle: esCurso ? `Examen: ${examen}` : `Materia: ${materia}`,
        cantidad: esCurso ? 1 : cantidad,
        total: q.total,
        descuento: q.descuento,
        pagador: t.titular.trim(),
        creado: new Date().toISOString(),
        inicio: esCurso ? inicio : undefined,
        sesiones: esCurso ? undefined : [...horarios].sort().map((fecha) => ({ fecha, estado: "agendada" as const })),
        reembolsado: 0,
      },
      { numeroTarjeta: digitos },
    );
    if (!resultado.ok) {
      setProcesando(false);
      setErrorPago(resultado.error);
      return;
    }
    const nuevo = resultado.pedido;
    crear(nuevo);
    setPedido(nuevo);
    setProcesando(false);
    setPaso(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const puedeSeguir = paso === 1 ? (esCurso ? !!inicio : horarios.length === cantidad) : true;

  return (
    <>
      {/* Encabezado */}
      <section className="bg-brand-900 text-white" style={{ backgroundImage: ONDAS, backgroundSize: "240px 120px" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-10 pt-10 pb-20 md:pt-14 md:pb-24">
          <Link href="/cursos#uniway" className="display text-buy hover:underline">
            [ Cursos UniWay ]
          </Link>
          <h1 className="display uppercase text-4xl md:text-6xl mt-3">
            {esCurso ? "Cotiza tu" : "Agenda tu"} <span className="text-buy">{esCurso ? "curso" : "asesoría"}</span>
          </h1>
        </div>
      </section>

      {/* Pasos */}
      <nav className="relative z-10 -mt-9 px-5 lg:px-10" aria-label="Pasos de la compra">
        <ol className="mx-auto max-w-6xl grid grid-cols-4 bg-brand-700 shadow-[0_6px_16px_rgb(0_0_0/0.18)]">
          {PASOS.map((p, i) => (
            <li
              key={p}
              aria-current={paso === i ? "step" : undefined}
              className={`display text-center px-2 py-4 text-[15px] sm:text-[17px] text-white ${i > 0 ? "border-l border-white/20" : ""} ${
                paso === i ? "bg-brand-900 shadow-[inset_0_-4px_0_#8acdee]" : i < paso ? "" : "text-white/55"
              }`}
            >
              <span className="hidden sm:inline">{i + 1}. </span>
              {p}
            </li>
          ))}
        </ol>
      </nav>

      <section className="mx-auto max-w-6xl px-5 lg:px-10 py-12 md:py-16 grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div>
          {/* ---------- Paso 1: cotiza */}
          {paso === 0 && (
            <div className="space-y-8">
              <Titulo texto={esCurso ? "¿Para qué examen te preparas?" : "¿Qué quieres repasar?"} />
              {esCurso ? (
                <div className="grid sm:grid-cols-3 gap-3">
                  {["UNAM", "IPN", "UNAM e IPN"].map((x) => (
                    <Opcion key={x} activa={examen === x} onClick={() => setExamen(x)} titulo={x} texto="Mismo precio" />
                  ))}
                </div>
              ) : (
                <>
                  <label className="block max-w-md">
                    <span className={etiqueta}>Materia</span>
                    <select value={materia} onChange={(e) => setMateria(e.target.value)} className={claseInput}>
                      {AREAS.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <span className={etiqueta}>Número de sesiones de 60 minutos</span>
                    <div className="inline-flex items-stretch border-2 border-brand-900">
                      <button
                        onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                        aria-label="Una sesión menos"
                        className="w-12 text-2xl text-brand-900 hover:bg-surface"
                      >
                        −
                      </button>
                      <span className="display w-16 flex items-center justify-center text-2xl text-brand-900 border-x-2 border-brand-900" aria-live="polite">
                        {cantidad}
                      </span>
                      <button
                        onClick={() => setCantidad((c) => Math.min(10, c + 1))}
                        aria-label="Una sesión más"
                        className="w-12 text-2xl text-brand-900 hover:bg-surface"
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-ink-2">
                      Paquete de {PRECIOS.minParaDescuento} sesiones o más: {PRECIOS.descuentoPaquete * 100} % de descuento.
                    </p>
                  </div>
                </>
              )}
              <ul className="space-y-2 text-ink">
                {(esCurso
                  ? [
                      "Examen diagnóstico para detectar tus materias débiles",
                      `${DURACION_CURSO_SEMANAS} semanas de clases en línea y material descargable`,
                      `Reembolso completo en los primeros ${DIAS_REEMBOLSO_CURSO} días`,
                    ]
                  : [
                      "Con estudiantes universitarios verificados",
                      "Tú eliges día y hora",
                      `Cancela gratis con más de ${HORAS_CANCELACION_ASESORIA} h de anticipación`,
                    ]
                ).map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 bg-brand-700" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ---------- Paso 2: agenda */}
          {paso === 1 && (
            <div>
              {esCurso ? (
                <>
                  <Titulo texto="¿Cuándo empiezas?" />
                  <p className="mt-2 text-ink-2">Te proponemos el próximo lunes. Puedes elegir otra fecha.</p>
                  <div className="mt-6 grid sm:grid-cols-3 gap-3">
                    {lunes.map((l, i) => (
                      <Opcion
                        key={l}
                        activa={inicio === l}
                        onClick={() => setInicio(l)}
                        titulo={new Date(l).toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
                        texto={i === 0 ? "Fecha propuesta" : "Lunes"}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-ink">
                    Tu curso termina el{" "}
                    <strong>{fechaLarga(new Date(new Date(inicio).getTime() + DURACION_CURSO_SEMANAS * 7 * 86400000).toISOString())}</strong>.
                  </p>
                </>
              ) : (
                <>
                  <Titulo texto={`Elige ${cantidad === 1 ? "tu horario" : `tus ${cantidad} horarios`}`} />
                  <p className="mt-2 text-ink-2">
                    Llevas {horarios.length} de {cantidad}. Lunes a viernes por la tarde y sábados por la mañana.
                  </p>
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {dias.map((d) => (
                      <div key={d.fecha} className="border-2 border-line">
                        <p className="display uppercase bg-surface px-3 py-2 text-brand-900">{d.etiqueta}</p>
                        <div className="p-2 grid grid-cols-2 gap-1.5">
                          {d.horas.map((h) => {
                            const elegido = horarios.includes(h.iso);
                            const lleno = !elegido && horarios.length >= cantidad;
                            return (
                              <button
                                key={h.iso}
                                disabled={!h.libre || lleno}
                                aria-pressed={elegido}
                                onClick={() => setHorarios((x) => (elegido ? x.filter((y) => y !== h.iso) : [...x, h.iso]))}
                                className={`py-1.5 text-sm border transition-colors ${
                                  elegido
                                    ? "bg-brand-900 border-brand-900 text-white"
                                    : h.libre
                                      ? "border-line hover:border-brand-900 disabled:opacity-40"
                                      : "border-transparent text-ink-2/50 line-through"
                                }`}
                                title={h.libre ? undefined : "Ocupado"}
                              >
                                {new Date(h.iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ---------- Paso 3: paga */}
          {paso === 2 && (
            <form onSubmit={pagar} noValidate className="space-y-6">
              <Titulo texto="¿Cómo quieres pagar?" />
              <div className="grid sm:grid-cols-2 gap-3">
                <Opcion activa={metodo === "tarjeta"} onClick={() => setMetodo("tarjeta")} titulo="Tarjeta" texto="Débito o crédito" />
                <Opcion activa={metodo === "oxxo"} onClick={() => setMetodo("oxxo")} titulo="Efectivo en OXXO" texto="Con referencia, 3 días para pagar" />
              </div>

              <div className="border-l-[5px] border-[#b54708] bg-[#fffaeb] px-5 py-4 text-sm text-ink">
                <strong>Modo de prueba:</strong> no se cobra nada. No escribas una tarjeta real.
                {metodo === "tarjeta" && (
                  <>
                    {" "}
                    Usa <span className="font-mono">{TARJETAS_PRUEBA.aprobada}</span> (aprobada) o{" "}
                    <span className="font-mono">{TARJETAS_PRUEBA.rechazada}</span> (rechazada), con cualquier fecha futura y CVC.
                  </>
                )}
              </div>

              <label className="block">
                <span className={etiqueta}>{metodo === "tarjeta" ? "Nombre en la tarjeta" : "Nombre de quien paga"}</span>
                <input
                  value={t.titular}
                  onChange={(e) => setT({ ...t, titular: e.target.value })}
                  autoComplete="off"
                  className={claseInput}
                />
                {tocado && errores.titular && <MensajeError texto={errores.titular} />}
              </label>

              {metodo === "tarjeta" && (
                <>
                  <label className="block">
                    <span className={etiqueta}>Número de tarjeta</span>
                    <input
                      inputMode="numeric"
                      autoComplete="off"
                      value={t.numero}
                      onChange={(e) =>
                        setT({ ...t, numero: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })
                      }
                      placeholder="4242 4242 4242 4242"
                      className={`${claseInput} font-mono`}
                    />
                    {tocado && "numero" in errores && errores.numero && <MensajeError texto={errores.numero} />}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className={etiqueta}>Vence (MM/AA)</span>
                      <input
                        inputMode="numeric"
                        autoComplete="off"
                        value={t.vence}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setT({ ...t, vence: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
                        }}
                        placeholder="12/29"
                        className={`${claseInput} font-mono`}
                      />
                      {tocado && "vence" in errores && errores.vence && <MensajeError texto={errores.vence} />}
                    </label>
                    <label className="block">
                      <span className={etiqueta}>CVC</span>
                      <input
                        inputMode="numeric"
                        autoComplete="off"
                        value={t.cvc}
                        onChange={(e) => setT({ ...t, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        placeholder="123"
                        className={`${claseInput} font-mono`}
                      />
                      {tocado && "cvc" in errores && errores.cvc && <MensajeError texto={errores.cvc} />}
                    </label>
                  </div>
                </>
              )}

              <label className="flex gap-3 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => setAcepta(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[#466778]"
                />
                <span>
                  Leí y acepto la{" "}
                  <Link href="/reembolsos" target="_blank" className="font-semibold text-brand-700 underline underline-offset-2">
                    política de cancelación y reembolsos
                  </Link>
                  .{tocado && !acepta && <span className="block text-[#b42318]">Necesitas aceptarla para pagar.</span>}
                </span>
              </label>

              {errorPago && (
                <p role="alert" className="border-l-[5px] border-[#b42318] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
                  {errorPago}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={() => setPaso(1)} className={`${boton} bg-white text-brand-900`}>
                  Regresar
                </button>
                <button type="submit" disabled={procesando} className={`${boton} flex-1 bg-buy hover:bg-buy-hover text-brand-900`}>
                  {procesando ? "Procesando pago…" : metodo === "tarjeta" ? `Pagar ${peso(q.total)}` : "Generar referencia OXXO"}
                </button>
              </div>
            </form>
          )}

          {/* ---------- Paso 4: listo */}
          {paso === 3 && pedido && (
            <div>
              <p className="display uppercase inline-block bg-buy text-brand-900 px-3 py-1 text-sm">
                {pedido.estado === "pagado" ? "Pago aprobado" : "Pendiente de pago"}
              </p>
              <h2 className="display uppercase text-brand-900 text-4xl md:text-5xl mt-4">
                {pedido.estado === "pagado" ? "¡Listo, " : "Casi listo, "}
                {usuario.nombre.split(" ")[0]}!
              </h2>
              <p className="mt-3 text-lg text-ink-2">
                Pedido <strong className="text-ink font-mono">{pedido.id}</strong> · {fechaLarga(pedido.creado)}
              </p>

              {pedido.metodo === "oxxo" && (
                <div className="mt-6 border-2 border-brand-900 p-6">
                  <p className="display uppercase text-brand-900">Referencia para pagar en OXXO</p>
                  <p className="font-mono text-3xl tracking-wider text-ink mt-2">{pedido.referenciaOxxo}</p>
                  <p className="mt-2 text-sm text-ink-2">
                    Tienes 3 días para pagar {peso(pedido.total)} en cualquier OXXO. Tu lugar queda apartado mientras tanto.
                  </p>
                </div>
              )}

              <div className="mt-6 bg-surface p-6 space-y-2 text-ink">
                <p>
                  <strong>{pedido.concepto}</strong> · {pedido.detalle}
                </p>
                {pedido.inicio && <p>Inicia el {fechaLarga(pedido.inicio)}.</p>}
                {pedido.sesiones && (
                  <ul className="space-y-1">
                    {pedido.sesiones.map((s) => (
                      <li key={s.fecha}>Sesión: {fechaHora(s.fecha)}</li>
                    ))}
                  </ul>
                )}
                {pedido.tarjeta && (
                  <p className="text-sm text-ink-2">
                    Pagado con {pedido.tarjeta.marca} terminación {pedido.tarjeta.ultimos4}.
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/perfil#cursos" className={`${boton} bg-buy hover:bg-buy-hover text-brand-900`}>
                  Ver en mi perfil
                </Link>
                <button onClick={() => window.print()} className={`${boton} bg-white text-brand-900`}>
                  Imprimir comprobante
                </button>
              </div>
            </div>
          )}

          {/* Navegación de los pasos 1 y 2 */}
          {paso < 2 && (
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              {paso > 0 && (
                <button onClick={() => setPaso(paso - 1)} className={`${boton} bg-white text-brand-900`}>
                  Regresar
                </button>
              )}
              <button
                onClick={() => setPaso(paso + 1)}
                disabled={!puedeSeguir}
                className={`${boton} flex-1 bg-buy hover:bg-buy-hover text-brand-900`}
              >
                {paso === 0 ? (esCurso ? "Elegir fecha de inicio" : "Elegir horarios") : "Continuar al pago"}
              </button>
            </div>
          )}
        </div>

        {/* Resumen / cotización */}
        <aside className="lg:sticky lg:top-24 bg-white shadow-[0_4px_20px_rgb(0_0_0/0.08)] border-b-[10px] border-brand-700 pt-6 pb-6 px-6">
          <h2 className="display uppercase inline-block bg-brand-900 text-white text-2xl px-5 py-2 -ml-9">
            {paso === 3 ? "Comprobante" : "Cotización"}
          </h2>
          <dl className="mt-5 space-y-2 text-ink">
            <Fila etq={esCurso ? "Curso UNAM / IPN" : `Asesoría × ${cantidad}`} valor={peso(q.bruto)} />
            {q.descuento > 0 && <Fila etq={`Descuento paquete (${PRECIOS.descuentoPaquete * 100} %)`} valor={`− ${peso(q.descuento)}`} />}
            <div className="border-t border-line pt-2 text-sm text-ink-2 space-y-1">
              <Fila etq="Subtotal sin IVA" valor={peso(q.base)} />
              <Fila etq="IVA (16 %)" valor={peso(q.iva)} />
            </div>
            <div className="border-t-2 border-brand-900 pt-3 flex items-baseline justify-between">
              <dt className="display uppercase text-brand-900">Total</dt>
              <dd className="display text-3xl text-brand-900">{peso(q.total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-ink-2">
            Precios en MXN con IVA incluido.
            {paso < 3 && ` Cotización válida ${VIGENCIA_COTIZACION_DIAS} días.`}
          </p>
          {paso < 2 && (
            <button onClick={() => window.print()} className="display mt-4 text-brand-700 hover:text-brand-900">
              [ Imprimir cotización ]
            </button>
          )}
          {paso >= 1 && (esCurso ? inicio : horarios.length > 0) && (
            <div className="mt-5 border-t border-line pt-4 text-sm text-ink">
              <p className="display uppercase text-brand-900">{esCurso ? "Inicio" : "Horarios"}</p>
              {esCurso ? (
                <p className="mt-1">{fechaLarga(inicio)}</p>
              ) : (
                <ul className="mt-1 space-y-0.5">
                  {[...horarios].sort().map((h) => (
                    <li key={h}>{fechaHora(h)}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>
      </section>
    </>
  );
}

function Titulo({ texto }: { texto: string }) {
  return <h2 className="display uppercase text-brand-900 text-3xl md:text-4xl">{texto}</h2>;
}

function Opcion({ activa, onClick, titulo, texto }: { activa: boolean; onClick: () => void; titulo: string; texto: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={`text-left border-2 px-5 py-4 transition-colors ${
        activa ? "bg-brand-900 border-brand-900 text-white" : "border-line hover:border-brand-900"
      }`}
    >
      <span className="display block text-xl">{titulo}</span>
      <span className={`block text-sm ${activa ? "text-white/80" : "text-ink-2"}`}>{texto}</span>
    </button>
  );
}

function Fila({ etq, valor }: { etq: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{etq}</dt>
      <dd className="shrink-0">{valor}</dd>
    </div>
  );
}

function MensajeError({ texto }: { texto: string }) {
  return <span className="mt-1 block text-sm text-[#b42318]">{texto}</span>;
}
