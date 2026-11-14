"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ALCALDIAS, esEdomex } from "@/lib/escuelas";
import { registrar, type TipoCuenta } from "@/lib/sesion";
import { Campo, claseBotonPrincipal, claseInput, destinoSeguro } from "./Piezas";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const nombresAlcaldias = Object.keys(ALCALDIAS).sort((a, b) => a.localeCompare(b, "es"));

export default function FormularioRegistro() {
  const router = useRouter();
  const siguiente = useSearchParams().get("siguiente");
  const [tipo, setTipo] = useState<TipoCuenta>("estudiante");
  const [f, setF] = useState({ nombre: "", correo: "", contrasena: "", confirmar: "", alcaldia: "", correoTutor: "" });
  const [acepta, setAcepta] = useState(false);
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((v) => ({ ...v, [k]: e.target.value }));

  // Validación en vivo (se muestra después del primer intento de envío)
  const errores = {
    nombre: f.nombre.trim().length < 3 ? "Escribe tu nombre completo." : null,
    correo: !CORREO_VALIDO.test(f.correo.trim()) ? "Escribe un correo válido." : null,
    contrasena: f.contrasena.length < 8 ? "Usa al menos 8 caracteres." : null,
    confirmar: f.confirmar !== f.contrasena ? "Las contraseñas no coinciden." : null,
    correoTutor:
      tipo === "estudiante" && f.correoTutor && !CORREO_VALIDO.test(f.correoTutor.trim()) ? "Revisa el correo de tu tutor." : null,
    acepta: !acepta ? "Necesitas aceptar para crear tu cuenta." : null,
  };
  const hayErrores = Object.values(errores).some(Boolean);
  const mostrar = (k: keyof typeof errores) => (tocado ? errores[k] : null);

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    setTocado(true);
    if (hayErrores) return;
    setEnviando(true);
    const err = await registrar({
      nombre: f.nombre.trim(),
      correo: f.correo,
      contrasena: f.contrasena,
      tipo,
      alcaldia: f.alcaldia || undefined,
      correoTutor: tipo === "estudiante" && f.correoTutor ? f.correoTutor.trim().toLowerCase() : undefined,
    });
    setEnviando(false);
    if (err) return setError(err);
    router.push(destinoSeguro(siguiente));
  }

  return (
    <form onSubmit={enviar} className="space-y-5" noValidate>
      {/* Tipo de cuenta: la mamá, papá o tutor es quien paga cursos y asesorías */}
      <div role="group" aria-label="Tipo de cuenta" className="grid grid-cols-2 gap-3">
        {(
          [
            ["estudiante", "Soy estudiante"],
            ["tutor", "Soy mamá, papá o tutor"],
          ] as const
        ).map(([valor, etiqueta]) => (
          <button
            key={valor}
            type="button"
            onClick={() => setTipo(valor)}
            aria-pressed={tipo === valor}
            className={`display border-2 px-3 py-3 text-[17px] leading-tight transition-colors ${
              tipo === valor ? "bg-brand-900 border-brand-900 text-white" : "border-line text-brand-900 hover:border-brand-900"
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <Campo etiqueta="Nombre completo" error={mostrar("nombre")}>
        <input autoComplete="name" value={f.nombre} onChange={cambiar("nombre")} className={claseInput} />
      </Campo>

      <Campo etiqueta="Correo electrónico" error={mostrar("correo")}>
        <input type="email" autoComplete="email" value={f.correo} onChange={cambiar("correo")} className={claseInput} />
      </Campo>

      <div className="grid sm:grid-cols-2 gap-4">
        <Campo etiqueta="Contraseña" ayuda="Mínimo 8 caracteres" error={mostrar("contrasena")}>
          <input type="password" autoComplete="new-password" value={f.contrasena} onChange={cambiar("contrasena")} className={claseInput} />
        </Campo>
        <Campo etiqueta="Confirmar" error={mostrar("confirmar")}>
          <input type="password" autoComplete="new-password" value={f.confirmar} onChange={cambiar("confirmar")} className={claseInput} />
        </Campo>
      </div>

      <Campo etiqueta="¿Dónde vives? (opcional)" ayuda="Para mostrarte primero las escuelas cercanas.">
        <select value={f.alcaldia} onChange={cambiar("alcaldia")} className={claseInput}>
          <option value="">Elige tu alcaldía o municipio</option>
          <optgroup label="Ciudad de México">
            {nombresAlcaldias.filter((a) => !esEdomex(a)).map((a) => (
              <option key={a}>{a}</option>
            ))}
          </optgroup>
          <optgroup label="Estado de México">
            {nombresAlcaldias.filter(esEdomex).map((a) => (
              <option key={a} value={a}>
                {a.replace(", Edomex", "")}
              </option>
            ))}
          </optgroup>
        </select>
      </Campo>

      {tipo === "estudiante" && (
        <Campo
          etiqueta="Correo de tu mamá, papá o tutor (opcional)"
          ayuda="Lo usamos para que tu tutor pague cursos o asesorías por ti."
          error={mostrar("correoTutor")}
        >
          <input type="email" value={f.correoTutor} onChange={cambiar("correoTutor")} className={claseInput} />
        </Campo>
      )}

      <label className="flex gap-3 text-sm text-ink cursor-pointer">
        <input
          type="checkbox"
          checked={acepta}
          onChange={(e) => setAcepta(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#466778]"
        />
        <span>
          Acepto el{" "}
          <Link href="/aviso-de-privacidad" target="_blank" className="font-semibold text-brand-700 underline underline-offset-2">
            aviso de privacidad
          </Link>{" "}
          y los{" "}
          <Link href="/terminos" target="_blank" className="font-semibold text-brand-700 underline underline-offset-2">
            términos de uso
          </Link>{" "}
          de UniWay.
          {mostrar("acepta") && <span className="block text-[#b42318]">{errores.acepta}</span>}
        </span>
      </label>

      {error && (
        <p role="alert" className="border-l-[5px] border-[#b42318] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
          {error}
        </p>
      )}

      <button type="submit" disabled={enviando} className={claseBotonPrincipal}>
        {enviando ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <p className="text-center text-ink-2">
        ¿Ya tienes cuenta?{" "}
        <Link
          href={siguiente ? `/login?siguiente=${encodeURIComponent(siguiente)}` : "/login"}
          className="display uppercase text-brand-700 hover:text-brand-900"
        >
          [ Iniciar sesión ]
        </Link>
      </p>
      <p className="text-center text-xs text-ink-2">Versión de demostración: tu cuenta se guarda solo en este navegador.</p>
    </form>
  );
}
