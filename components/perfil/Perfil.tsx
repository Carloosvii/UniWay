"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ONDAS } from "@/components/ui/Clemson";
import { claseInput } from "@/components/cuenta/Piezas";
import { ALCALDIAS, INSTITUCIONES, esEdomex, etiquetaTipo } from "@/lib/escuelas";
import { CALENDARIO } from "@/lib/becas";
import {
  borrarPedidos,
  fechaHora,
  fechaLarga,
  peso,
  reembolsoPedido,
  reembolsoSesion,
  usePedidos,
  type EstadoPedido,
} from "@/lib/pedidos";
import { MODALIDADES_REGLAS, borrarOpciones, cabe, compatible, revisarOpciones, useOpciones, type Modalidad } from "@/lib/opciones";
import {
  actualizarUsuario,
  cerrarSesion,
  eliminarCuenta,
  guardarAvisos,
  leerAvisos,
  useSesion,
  type Avisos,
  type Usuario,
} from "@/lib/sesion";

const PESTANAS = [
  { id: "opciones", label: "Mis opciones" },
  { id: "cursos", label: "Mis cursos" },
  { id: "avisos", label: "Notificaciones" },
  { id: "datos", label: "Mis datos" },
] as const;
type Pestana = (typeof PESTANAS)[number]["id"];

const boton = "boton-bloque display px-6 py-3.5 text-center text-lg";

export default function Perfil() {
  const usuario = useSesion();
  const router = useRouter();
  const [pestana, setPestana] = useState<Pestana>("opciones");

  // La pestaña se recuerda en la URL (#avisos, #datos…) para poder enlazarla
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (PESTANAS.some((p) => p.id === h)) setPestana(h as Pestana);
  }, []);
  const abrir = (p: Pestana) => {
    setPestana(p);
    history.replaceState(null, "", `#${p}`);
  };

  useEffect(() => {
    if (usuario === null) router.replace("/login?siguiente=/perfil");
  }, [usuario, router]);

  if (!usuario) return <div className="h-[60vh] bg-surface animate-pulse" aria-label="Cargando perfil" />;

  const primerNombre = usuario.nombre.split(" ")[0];

  return (
    <>
      {/* Encabezado oscuro con ondas */}
      <section className="bg-brand-900 text-white" style={{ backgroundImage: ONDAS, backgroundSize: "240px 120px" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-10 pt-12 pb-20 md:pt-16 md:pb-24">
          <p className="display uppercase inline-block bg-buy text-brand-900 px-3 py-1 text-sm">
            {usuario.tipo === "tutor" ? "Mamá, papá o tutor" : "Estudiante"}
          </p>
          <h1 className="display uppercase text-5xl md:text-7xl mt-4">
            Hola, <span className="text-buy">{primerNombre}</span>
          </h1>
          <p className="mt-3 text-lg text-white/80">
            {usuario.correo}
            {usuario.alcaldia && ` · ${usuario.alcaldia.replace(", Edomex", ", Estado de México")}`}
          </p>
        </div>
      </section>

      {/* Pestañas montadas sobre el encabezado, como en Cursos */}
      <nav className="relative z-10 -mt-9 px-5 lg:px-10" aria-label="Secciones del perfil">
        <ul className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 bg-brand-700 shadow-[0_6px_16px_rgb(0_0_0/0.18)]" role="tablist">
          {PESTANAS.map((p, i) => (
            <li
              key={p.id}
              className={`border-white/20 ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
            >
              <button
                role="tab"
                aria-selected={pestana === p.id}
                onClick={() => abrir(p.id)}
                className={`display w-full px-4 py-4 text-[17px] transition-colors ${
                  pestana === p.id ? "bg-brand-900 text-white shadow-[inset_0_-4px_0_#8acdee]" : "text-white hover:bg-brand-900"
                }`}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="mx-auto max-w-6xl px-5 lg:px-10 py-12 md:py-16" role="tabpanel">
        {pestana === "opciones" && <MisOpciones />}
        {pestana === "cursos" && <MisCursos usuario={usuario} />}
        {pestana === "avisos" && <Notificaciones usuario={usuario} />}
        {pestana === "datos" && <MisDatos usuario={usuario} />}
      </section>
    </>
  );
}

function Encabezado({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="mb-8">
      <h2 className="display uppercase text-brand-900 text-3xl md:text-4xl">{titulo}</h2>
      <p className="mt-2 text-lg text-ink-2 max-w-2xl">{texto}</p>
    </div>
  );
}

// ---------- Mis opciones
// Paso 1: elegir modalidad. Paso 2: armar y ordenar la lista desde las favoritas.
// Cada modalidad guarda su propia lista; para empezar otra hay que completar la actual.
function MisOpciones() {
  const o = useOpciones();
  const [eligiendo, setEligiendo] = useState(false);
  const actual = o.modalidad;
  const actualCompleta = actual ? revisarOpciones(actual, o.listas[actual]).lista : true;

  if (!actual || eligiendo) {
    return (
      <div>
        <Encabezado
          titulo="Paso 1 · Elige tu modalidad"
          texto="Así te vas a registrar en Mi derecho, mi lugar. Cada modalidad guarda su propia lista."
        />
        <div className="grid md:grid-cols-3 gap-4">
          {([1, 2, 3] as Modalidad[]).map((m) => {
            const lista = o.listas[m];
            const empezada = lista.length > 0 || m === actual;
            const bloqueada = !empezada && !actualCompleta;
            const completa = lista.length > 0 && revisarOpciones(m, lista).lista;
            return (
              <button
                key={m}
                disabled={bloqueada}
                onClick={() => {
                  o.elegirModalidad(m);
                  setEligiendo(false);
                }}
                className={`text-left border-2 p-6 transition-colors ${
                  m === actual ? "border-brand-900 bg-brand-50" : "border-line hover:border-brand-900"
                } disabled:opacity-50 disabled:hover:border-line disabled:cursor-not-allowed`}
              >
                <span className="display uppercase block text-brand-700 text-sm">{MODALIDADES_REGLAS[m].nombre}</span>
                <span className="display block text-3xl text-brand-900 mt-1">{MODALIDADES_REGLAS[m].corto}</span>
                <span className="block mt-2 text-ink-2">{MODALIDADES_REGLAS[m].descripcion}</span>
                <span className="block mt-4 text-sm font-semibold">
                  {bloqueada ? (
                    <span className="text-ink-2">Completa tu {MODALIDADES_REGLAS[actual!].nombre.toLowerCase()} para armar esta</span>
                  ) : lista.length > 0 ? (
                    <span className={completa ? "text-brand-700" : "text-[#c2410c]"}>
                      {lista.length} {lista.length === 1 ? "opción guardada" : "opciones guardadas"} · {completa ? "lista completa" : "incompleta"}
                    </span>
                  ) : (
                    <span className="text-brand-700">Empezar →</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        {actual && (
          <button onClick={() => setEligiendo(false)} className="display mt-6 text-brand-700 hover:text-brand-900">
            [ Volver a mi lista ]
          </button>
        )}
      </div>
    );
  }

  const lista = o.listas[actual];
  const revision = revisarOpciones(actual, lista);
  const disponibles = o.favoritas.filter((f) => compatible(actual, f.escuela) && !lista.some((l) => l.clave === f.clave));
  const noAplican = o.favoritas.filter((f) => !compatible(actual, f.escuela)).length;

  return (
    <div>
      {/* Modalidad actual */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="display uppercase text-brand-700">{MODALIDADES_REGLAS[actual].nombre}</p>
          <h2 className="display uppercase text-brand-900 text-3xl md:text-4xl">Paso 2 · {MODALIDADES_REGLAS[actual].corto}</h2>
          <p className="mt-2 text-lg text-ink-2">{MODALIDADES_REGLAS[actual].descripcion} Ordénalas de la que más quieres a la que menos.</p>
        </div>
        <button
          onClick={() => setEligiendo(true)}
          className="display shrink-0 border-2 border-brand-900 px-5 py-3 text-brand-900 hover:bg-brand-900 hover:text-white transition-colors"
        >
          Cambiar de modalidad
        </button>
      </div>

      {/* Conteo */}
      <div className={`grid gap-px bg-line border border-line ${actual === 3 ? "sm:grid-cols-3" : actual === 1 ? "" : "sm:grid-cols-2"}`}>
        {(
          [
            ["Sin examen", revision.directo, "/ 10", actual !== 2],
            ["UNAM", revision.unam, "/ 5", actual !== 1],
            ["IPN", revision.ipn, "/ 5", actual !== 1],
          ] as const
        )
          .filter(([, , , ver]) => ver)
          .map(([etq, n, max]) => (
            <div key={etq} className="bg-white px-5 py-4">
              <p className="display text-3xl text-brand-900">
                {n} <span className="text-lg text-ink-2">{max}</span>
              </p>
              <p className="text-sm text-ink-2">{etq}</p>
            </div>
          ))}
      </div>

      {lista.length > 0 && (
        <div
          role="status"
          className={`mt-4 border-l-[5px] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
            revision.lista ? "border-brand-700 bg-brand-50" : "border-[#c2410c] bg-[#fff4ed]"
          }`}
        >
          {revision.lista ? (
            <>
              <p className="text-ink">
                <strong>¡Lista completa!</strong> Ya puedes imprimirla o armar otra modalidad.
              </p>
              <button onClick={() => setEligiendo(true)} className="display shrink-0 bg-brand-900 px-4 py-2 text-white hover:bg-brand-700">
                Armar otra modalidad
              </button>
            </>
          ) : (
            <ul className="space-y-1 text-ink">
              {revision.avisos.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Lista ordenada */}
      {lista.length > 0 && (
        <ol className="mt-6 space-y-3">
          {lista.map(({ clave, escuela, opcion }, i) => {
            const color = INSTITUCIONES[escuela.institucion].color;
            return (
              <li key={clave} className="flex items-stretch bg-white border-2" style={{ borderColor: color }}>
                <span
                  className="chevron [--punta:16px] display w-16 sm:w-20 shrink-0 flex items-center justify-center pr-3 text-white text-3xl"
                  style={{ background: color }}
                  aria-label={`Lugar ${i + 1}`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0 px-4 py-3">
                  <Link href={`/escuelas/plantel/${escuela.id}`} className="font-semibold text-ink hover:underline">
                    {escuela.nombre}
                  </Link>
                  <p className="text-sm text-ink-2">
                    {opcion.especialidad || "Bachillerato general"} · {etiquetaTipo(escuela.tipo)}
                  </p>
                  <p className="mt-1 inline-block border border-line bg-surface px-1.5 py-0.5 font-mono text-xs text-ink-2">{clave}</p>
                </div>
                <div className="flex items-stretch border-l border-line">
                  <button
                    onClick={() => o.mover(actual, clave, -1)}
                    disabled={i === 0}
                    aria-label="Subir"
                    title="Subir"
                    className="w-11 text-xl text-brand-900 hover:bg-surface disabled:opacity-25"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => o.mover(actual, clave, 1)}
                    disabled={i === lista.length - 1}
                    aria-label="Bajar"
                    title="Bajar"
                    className="w-11 text-xl text-brand-900 hover:bg-surface disabled:opacity-25 border-l border-line"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => o.quitar(actual, clave)}
                    aria-label="Quitar de la lista"
                    title="Quitar de la lista"
                    className="w-11 text-xl text-[#b42318] hover:bg-[#fef3f2] border-l border-line"
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/* Favoritas para agregar */}
      <h3 className="display uppercase text-2xl text-brand-900 mt-10">Tus favoritas</h3>
      {o.favoritas.length === 0 ? (
        <div className="mt-4 bg-surface px-6 py-10 text-center">
          <p className="display text-2xl text-brand-900">Aún no tienes favoritas</p>
          <p className="mt-2 text-ink-2">Busca escuelas en el mapa y márcalas con el corazón.</p>
          <Link href="/mapa" className={`${boton} mt-6 inline-block bg-buy hover:bg-buy-hover text-brand-900`}>
            Ir al mapa
          </Link>
        </div>
      ) : (
        <>
          {disponibles.length === 0 ? (
            <p className="mt-3 text-ink-2">Ya agregaste todas tus favoritas que aplican en esta modalidad.</p>
          ) : (
            <ul className="mt-4 grid md:grid-cols-2 gap-3">
              {disponibles.map(({ clave, escuela, opcion }) => {
                const puede = cabe(actual, lista, escuela);
                return (
                  <li key={clave} className="flex items-center gap-3 border-2 border-line bg-white px-4 py-3">
                    <span className="h-3 w-3 shrink-0" style={{ background: INSTITUCIONES[escuela.institucion].color }} aria-hidden />
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-ink truncate">{escuela.nombre}</span>
                      <span className="block text-sm text-ink-2 truncate">{opcion.especialidad || "Bachillerato general"}</span>
                    </span>
                    <button
                      onClick={() => o.agregar(actual, clave)}
                      disabled={!puede}
                      title={puede ? "Agregar a la lista" : "Ya llegaste al máximo para este tipo de escuela"}
                      className="display shrink-0 bg-buy px-3 py-2 text-sm text-brand-900 hover:bg-buy-hover disabled:opacity-40"
                    >
                      {puede ? "Agregar" : "Máximo"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {noAplican > 0 && (
            <p className="mt-3 text-sm text-ink-2">
              {noAplican} {noAplican === 1 ? "favorita no aplica" : "favoritas no aplican"} en esta modalidad (
              {actual === 1 ? "son con examen" : "son sin examen"}).
            </p>
          )}
        </>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {lista.length > 0 && (
          <button onClick={() => window.print()} className={`${boton} bg-buy hover:bg-buy-hover text-brand-900`}>
            Imprimir mi lista
          </button>
        )}
        <Link href="/mapa" className={`${boton} bg-white text-brand-900`}>
          Buscar más escuelas
        </Link>
      </div>
    </div>
  );
}

// ---------- Mis cursos: pedidos, sesiones, cancelación y reembolso
const ESTADOS: Record<EstadoPedido, { texto: string; clase: string }> = {
  pagado: { texto: "Pagado", clase: "bg-brand-700 text-white" },
  pendiente: { texto: "Pendiente de pago", clase: "bg-[#fffaeb] text-[#b54708] border border-[#b54708]" },
  cancelado: { texto: "Cancelado", clase: "bg-surface text-ink-2 border border-line" },
  reembolsado: { texto: "Reembolsado", clase: "bg-[#ecfdf3] text-[#067647] border border-[#067647]" },
};

function MisCursos({ usuario }: { usuario: Usuario }) {
  const { pedidos, cancelarPedido, cancelarSesion, confirmarPagoOxxo } = usePedidos();
  // Qué se está por cancelar: el pedido completo o una sesión
  const [confirmando, setConfirmando] = useState<{ id: string; sesion?: string } | null>(null);

  if (pedidos.length === 0) {
    return (
      <div>
        <Encabezado
          titulo="Mis cursos"
          texto={
            usuario.tipo === "tutor"
              ? "Aquí verás los cursos y asesorías que compres, con su fecha y su estado."
              : "Aquí verás tus cursos y asesorías, con su fecha y su estado."
          }
        />
        <div className="bg-surface px-6 py-10 text-center">
          <p className="display text-2xl text-brand-900">Aún no tienes cursos ni asesorías</p>
          <p className="mt-2 text-ink-2">Curso UNAM / IPN desde $799 · Asesoría en vivo desde $150 por sesión.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/comprar/curso" className={`${boton} bg-buy hover:bg-buy-hover text-brand-900`}>
              Cotizar curso
            </Link>
            <Link href="/comprar/asesoria" className={`${boton} bg-white text-brand-900`}>
              Agendar asesoría
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <Encabezado titulo="Mis cursos" texto="Tus compras, fechas y reembolsos." />
        <div className="flex gap-3 shrink-0">
          <Link href="/comprar/curso" className="display border-2 border-brand-900 px-4 py-2.5 text-brand-900 hover:bg-brand-900 hover:text-white">
            + Curso
          </Link>
          <Link href="/comprar/asesoria" className="display border-2 border-brand-900 px-4 py-2.5 text-brand-900 hover:bg-brand-900 hover:text-white">
            + Asesoría
          </Link>
        </div>
      </div>

      <ul className="space-y-6">
        {pedidos.map((p) => {
          const activo = p.estado === "pagado" || p.estado === "pendiente";
          const r = reembolsoPedido(p);
          return (
            <li key={p.id} className="bg-white border-2 border-line">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface px-5 py-4 border-b-2 border-line">
                <div>
                  <p className="display text-2xl text-brand-900">{p.concepto}</p>
                  <p className="text-sm text-ink-2">
                    <span className="font-mono">{p.id}</span> · {fechaLarga(p.creado)}
                  </p>
                </div>
                <span className={`display uppercase self-start sm:self-auto px-3 py-1 text-sm ${ESTADOS[p.estado].clase}`}>
                  {ESTADOS[p.estado].texto}
                </span>
              </div>

              <div className="px-5 py-4 space-y-3 text-ink">
                <p>
                  {p.detalle} · <strong>{peso(p.total)}</strong>
                  {p.descuento > 0 && <span className="text-ink-2"> (ahorraste {peso(p.descuento)})</span>}
                </p>
                <p className="text-sm text-ink-2">
                  {p.metodo === "tarjeta" && p.tarjeta
                    ? `${p.tarjeta.marca} terminación ${p.tarjeta.ultimos4} · pagó ${p.pagador}`
                    : `OXXO · referencia ${p.referenciaOxxo}`}
                </p>
                {p.reembolsado > 0 && (
                  <p className="border-l-[4px] border-[#067647] pl-3 text-sm">
                    Reembolso de <strong>{peso(p.reembolsado)}</strong> en proceso: llega a tu forma de pago en 5 a 10 días hábiles.
                  </p>
                )}

                {p.inicio && (
                  <p>
                    <span className="display uppercase text-brand-900">Inicio: </span>
                    {fechaLarga(p.inicio)}
                  </p>
                )}

                {p.sesiones && (
                  <ul className="divide-y divide-line border-y border-line">
                    {p.sesiones.map((s) => {
                      const rs = reembolsoSesion(p, s.fecha);
                      const preguntando = confirmando?.id === p.id && confirmando.sesion === s.fecha;
                      return (
                        <li key={s.fecha} className="py-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className={s.estado === "agendada" ? "" : "text-ink-2 line-through"}>{fechaHora(s.fecha)}</span>
                            {s.estado === "agendada" && activo ? (
                              <button
                                onClick={() => setConfirmando({ id: p.id, sesion: s.fecha })}
                                className="display text-sm text-[#b42318] hover:underline"
                              >
                                Cancelar sesión
                              </button>
                            ) : (
                              <span className="text-sm text-ink-2">{s.estado === "agendada" ? "Agendada" : s.estado === "reembolsada" ? "Reembolsada" : "Cancelada"}</span>
                            )}
                          </div>
                          {preguntando && (
                            <Confirmar
                              texto={`${rs.motivo} ${rs.monto > 0 ? `Te devolvemos ${peso(rs.monto)}.` : ""}`}
                              onSi={() => {
                                cancelarSesion(p.id, s.fecha);
                                setConfirmando(null);
                              }}
                              onNo={() => setConfirmando(null)}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {activo && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {p.estado === "pendiente" && (
                      <button onClick={() => confirmarPagoOxxo(p.id)} className="display bg-buy px-4 py-2.5 text-brand-900 hover:bg-buy-hover">
                        Simular pago en tienda (demo)
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmando({ id: p.id })}
                      className="display border-2 border-[#b42318] px-4 py-2 text-[#b42318] hover:bg-[#fef3f2]"
                    >
                      {p.estado === "pendiente" ? "Cancelar pedido" : "Cancelar y pedir reembolso"}
                    </button>
                  </div>
                )}
                {confirmando?.id === p.id && !confirmando.sesion && (
                  <Confirmar
                    texto={`${r.motivo} ${r.monto > 0 ? `Te devolvemos ${peso(r.monto)}.` : ""}`}
                    onSi={() => {
                      cancelarPedido(p.id);
                      setConfirmando(null);
                    }}
                    onNo={() => setConfirmando(null)}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-sm text-ink-2">
        Consulta la{" "}
        <Link href="/reembolsos" className="font-semibold text-brand-700 underline underline-offset-2">
          política de cancelación y reembolsos
        </Link>
        . Modo de prueba: no se mueve dinero real.
      </p>
    </div>
  );
}

function Confirmar({ texto, onSi, onNo }: { texto: string; onSi: () => void; onNo: () => void }) {
  return (
    <div role="alertdialog" className="mt-3 border-l-[5px] border-[#b42318] bg-[#fef3f2] px-4 py-3">
      <p className="text-sm text-ink">{texto} ¿Confirmas la cancelación?</p>
      <div className="mt-3 flex gap-2">
        <button onClick={onSi} className="display bg-[#b42318] px-4 py-2 text-sm text-white hover:bg-[#912018]">
          Sí, cancelar
        </button>
        <button onClick={onNo} className="display border-2 border-line bg-white px-4 py-1.5 text-sm text-ink hover:border-ink">
          No
        </button>
      </div>
    </div>
  );
}

// ---------- Notificaciones
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function Notificaciones({ usuario }: { usuario: Usuario }) {
  const [avisos, setAvisos] = useState<Avisos>(() => leerAvisos(usuario.correo));
  const cambiar = (k: keyof Avisos) => {
    const nuevo = { ...avisos, [k]: !avisos[k] };
    setAvisos(nuevo);
    guardarAvisos(usuario.correo, nuevo);
  };

  // Próximas convocatorias a partir del mes actual; se ocultan las del otro estado si sabemos dónde vive
  const hoy = new Date();
  const enEdomex = usuario.alcaldia ? esEdomex(usuario.alcaldia) : null;
  const proximas = CALENDARIO.map((c) => {
    const mes = MESES.indexOf(c.mes);
    const anio = mes >= hoy.getMonth() ? hoy.getFullYear() : hoy.getFullYear() + 1;
    const becas = c.becas.filter((b) =>
      enEdomex === null ? true : enEdomex ? !/PILARES|Mi Beca/.test(b) : !/Edomex/.test(b),
    );
    return { mes, anio, becas };
  })
    .filter((c) => c.becas.length > 0)
    .sort((a, b) => a.anio - b.anio || a.mes - b.mes);

  return (
    <div>
      <Encabezado titulo="Notificaciones" texto="Elige qué avisos quieres recibir. Te mostramos aquí lo que viene." />

      <div className="grid md:grid-cols-3 gap-3">
        {(
          [
            ["becas", "Becas", "Cuando abran las convocatorias"],
            ["registro", "Registro", "Fechas de Mi derecho, mi lugar"],
            ["cursos", "Cursos", "Promociones de cursos UniWay"],
          ] as const
        ).map(([k, titulo, texto]) => (
          <label
            key={k}
            className={`flex items-start gap-3 border-2 px-5 py-4 cursor-pointer transition-colors ${
              avisos[k] ? "border-brand-900 bg-brand-50" : "border-line"
            }`}
          >
            <input type="checkbox" checked={avisos[k]} onChange={() => cambiar(k)} className="mt-1 h-5 w-5 accent-[#2e444f]" />
            <span>
              <span className="display block text-lg text-brand-900">{titulo}</span>
              <span className="block text-sm text-ink-2">{texto}</span>
            </span>
          </label>
        ))}
      </div>

      <h3 className="display uppercase text-2xl text-brand-900 mt-10">Próximas fechas</h3>
      <ol className="mt-4 space-y-3">
        {avisos.becas &&
          proximas.map((c) => (
            <li key={`${c.anio}-${c.mes}`} className="flex items-stretch bg-white shadow-[0_2px_10px_rgb(0_0_0/0.06)] border border-line">
              <span className="chevron [--punta:14px] display uppercase w-24 shrink-0 bg-brand-900 text-white flex flex-col items-center justify-center pr-3 leading-tight">
                <span className="text-xl">{MESES[c.mes]}</span>
                <span className="text-xs text-white/70">{c.anio}</span>
              </span>
              <span className="px-4 py-3">
                <span className="block font-semibold text-ink">Abren convocatorias de becas</span>
                <span className="block text-sm text-ink-2">{c.becas.join(" · ")}</span>
              </span>
            </li>
          ))}
        {avisos.registro && (
          <li className="flex items-stretch bg-white shadow-[0_2px_10px_rgb(0_0_0/0.06)] border border-line">
            <span className="chevron [--punta:14px] display uppercase w-24 shrink-0 bg-brand-700 text-white flex items-center justify-center pr-3 text-sm text-center">
              Pronto
            </span>
            <span className="px-4 py-3">
              <span className="block font-semibold text-ink">Convocatoria de Mi derecho, mi lugar</span>
              <span className="block text-sm text-ink-2">Te avisamos aquí en cuanto se publiquen las fechas de registro.</span>
            </span>
          </li>
        )}
        {!avisos.becas && !avisos.registro && <li className="text-ink-2">Activa algún aviso para ver las próximas fechas.</li>}
      </ol>
      <p className="mt-4 text-xs text-ink-2">
        Versión de demostración: los avisos se muestran en tu perfil; el envío por correo se activa al conectar el servidor.
      </p>
    </div>
  );
}

// ---------- Mis datos
function MisDatos({ usuario }: { usuario: Usuario }) {
  const router = useRouter();
  const [f, setF] = useState({ nombre: usuario.nombre, alcaldia: usuario.alcaldia ?? "", correoTutor: usuario.correoTutor ?? "" });
  const [guardado, setGuardado] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const nombres = Object.keys(ALCALDIAS).sort((a, b) => a.localeCompare(b, "es"));

  function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    if (f.nombre.trim().length < 3) return;
    actualizarUsuario(usuario.correo, {
      nombre: f.nombre.trim(),
      alcaldia: f.alcaldia || undefined,
      correoTutor: usuario.tipo === "estudiante" ? f.correoTutor.trim() || undefined : undefined,
    });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-10">
      <form onSubmit={guardar} className="space-y-5">
        <Encabezado titulo="Mis datos" texto="Tu correo y el tipo de cuenta no se pueden cambiar." />
        <div className="grid sm:grid-cols-2 gap-4">
          <Dato etiqueta="Correo" valor={usuario.correo} />
          <Dato etiqueta="Tipo de cuenta" valor={usuario.tipo === "tutor" ? "Mamá, papá o tutor" : "Estudiante"} />
        </div>
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink-2 mb-1.5">Nombre completo</span>
          <input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} className={claseInput} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink-2 mb-1.5">Alcaldía o municipio</span>
          <select value={f.alcaldia} onChange={(e) => setF({ ...f, alcaldia: e.target.value })} className={claseInput}>
            <option value="">Sin elegir</option>
            {nombres.map((a) => (
              <option key={a} value={a}>
                {a.replace(", Edomex", ", Estado de México")}
              </option>
            ))}
          </select>
        </label>
        {usuario.tipo === "estudiante" && (
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-ink-2 mb-1.5">Correo de tu tutor</span>
            <input
              type="email"
              value={f.correoTutor}
              onChange={(e) => setF({ ...f, correoTutor: e.target.value })}
              className={claseInput}
            />
          </label>
        )}
        <div className="flex items-center gap-4">
          <button type="submit" className={`${boton} bg-buy hover:bg-buy-hover text-brand-900`}>
            Guardar cambios
          </button>
          {guardado && (
            <span role="status" className="text-brand-700 font-semibold">
              Cambios guardados
            </span>
          )}
        </div>
      </form>

      <aside className="space-y-4">
        <div className="bg-surface p-6">
          <p className="display uppercase text-xl text-brand-900">Sesión</p>
          <button
            onClick={() => {
              cerrarSesion();
              router.push("/");
            }}
            className="display mt-4 w-full border-2 border-brand-900 px-5 py-3 text-brand-900 hover:bg-brand-900 hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
        <div className="border-2 border-[#b42318] p-6">
          <p className="display uppercase text-xl text-[#b42318]">Eliminar cuenta</p>
          <p className="mt-2 text-sm text-ink-2">Borra tu cuenta y tus opciones guardadas de este navegador. No se puede deshacer.</p>
          {confirmar ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  borrarOpciones(usuario.correo);
                  borrarPedidos(usuario.correo);
                  eliminarCuenta(usuario.correo);
                  router.push("/");
                }}
                className="display bg-[#b42318] px-3 py-3 text-white hover:bg-[#912018]"
              >
                Sí, eliminar
              </button>
              <button onClick={() => setConfirmar(false)} className="display border-2 border-line px-3 py-3 text-ink hover:border-ink">
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmar(true)}
              className="display mt-4 w-full border-2 border-[#b42318] px-5 py-3 text-[#b42318] hover:bg-[#fef3f2]"
            >
              Eliminar mi cuenta
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-2">{etiqueta}</p>
      <p className="mt-1 text-ink break-all">{valor}</p>
    </div>
  );
}
