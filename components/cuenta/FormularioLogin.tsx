"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { iniciarSesion } from "@/lib/sesion";
import { Campo, claseBotonPrincipal, claseInput, destinoSeguro } from "./Piezas";

export default function FormularioLogin() {
  const router = useRouter();
  const siguiente = useSearchParams().get("siguiente");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [ver, setVer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    setEnviando(true);
    const err = await iniciarSesion(correo, contrasena);
    setEnviando(false);
    if (err) return setError(err);
    router.push(destinoSeguro(siguiente));
  }

  return (
    <form onSubmit={enviar} className="space-y-5" noValidate>
      <Campo etiqueta="Correo electrónico">
        <input
          type="email"
          autoComplete="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={claseInput}
          placeholder="tucorreo@ejemplo.com"
        />
      </Campo>

      <Campo etiqueta="Contraseña">
        <span className="relative block">
          <input
            type={ver ? "text" : "password"}
            autoComplete="current-password"
            required
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className={`${claseInput} pr-12`}
          />
          <button
            type="button"
            onClick={() => setVer(!ver)}
            aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-2 hover:text-ink"
          >
            {ver ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </span>
      </Campo>

      {error && (
        <p role="alert" className="border-l-[5px] border-[#b42318] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
          {error}
        </p>
      )}

      <button type="submit" disabled={enviando || !correo || !contrasena} className={claseBotonPrincipal}>
        {enviando ? "Entrando…" : "Iniciar sesión"}
      </button>

      <p className="text-center text-ink-2">
        ¿No tienes cuenta?{" "}
        <Link
          href={siguiente ? `/registro?siguiente=${encodeURIComponent(siguiente)}` : "/registro"}
          className="display uppercase text-brand-700 hover:text-brand-900"
        >
          [ Crear cuenta ]
        </Link>
      </p>
      <p className="text-center text-xs text-ink-2">Versión de demostración: tu cuenta se guarda solo en este navegador.</p>
    </form>
  );
}
