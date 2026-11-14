"use client";

// Cuentas SIMULADAS para la demo del proyecto: todo se guarda solo en el navegador (localStorage).
// No hay servidor ni base de datos. La contraseña nunca se guarda en texto: se guarda su hash SHA-256.
// En producción esto se reemplaza por un backend con autenticación real (p. ej. NextAuth o Supabase).

import { useEffect, useState } from "react";

export type TipoCuenta = "estudiante" | "tutor";

export interface Usuario {
  nombre: string;
  correo: string;
  tipo: TipoCuenta;
  alcaldia?: string;
  correoTutor?: string;
}

interface UsuarioGuardado extends Usuario {
  hash: string;
}

const CLAVE_USUARIOS = "uniway:usuarios";
const CLAVE_SESION = "uniway:sesion";
const EVENTO = "uniway:sesion-cambio";

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const v = localStorage.getItem(clave);
    return v ? (JSON.parse(v) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown) {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Navegación privada o almacenamiento bloqueado: la demo sigue sin guardar
  }
  window.dispatchEvent(new Event(EVENTO));
}

async function hashear(texto: string) {
  const datos = new TextEncoder().encode(texto);
  const digest = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const normalizarCorreo = (c: string) => c.trim().toLowerCase();

export async function registrar(datos: Usuario & { contrasena: string }): Promise<string | null> {
  const correo = normalizarCorreo(datos.correo);
  const usuarios = leer<UsuarioGuardado[]>(CLAVE_USUARIOS, []);
  if (usuarios.some((u) => u.correo === correo)) return "Ya existe una cuenta con ese correo. Inicia sesión.";
  const { contrasena, ...resto } = datos;
  const nuevo: UsuarioGuardado = { ...resto, correo, hash: await hashear(contrasena) };
  escribir(CLAVE_USUARIOS, [...usuarios, nuevo]);
  const { hash: _hash, ...sesion } = nuevo;
  escribir(CLAVE_SESION, sesion);
  return null;
}

export async function iniciarSesion(correo: string, contrasena: string): Promise<string | null> {
  const usuarios = leer<UsuarioGuardado[]>(CLAVE_USUARIOS, []);
  const u = usuarios.find((x) => x.correo === normalizarCorreo(correo));
  // Mismo mensaje en ambos casos para no revelar qué correos existen
  if (!u || u.hash !== (await hashear(contrasena))) return "Correo o contraseña incorrectos.";
  const { hash: _hash, ...sesion } = u;
  escribir(CLAVE_SESION, sesion);
  return null;
}

export function cerrarSesion() {
  escribir(CLAVE_SESION, null);
}

// Hook para leer la sesión actual y enterarse cuando cambia (también entre pestañas)
// Devuelve `undefined` mientras lee el navegador, `null` si no hay sesión
export function useSesion() {
  const [usuario, setUsuario] = useState<Usuario | null | undefined>(undefined);
  useEffect(() => {
    const actualizar = () => setUsuario(leer<Usuario | null>(CLAVE_SESION, null));
    actualizar();
    window.addEventListener(EVENTO, actualizar);
    window.addEventListener("storage", actualizar);
    return () => {
      window.removeEventListener(EVENTO, actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, []);
  return usuario;
}

// Cambia datos del perfil (no el correo ni la contraseña)
export function actualizarUsuario(correo: string, cambios: Partial<Pick<Usuario, "nombre" | "alcaldia" | "correoTutor">>) {
  const usuarios = leer<UsuarioGuardado[]>(CLAVE_USUARIOS, []).map((u) => (u.correo === correo ? { ...u, ...cambios } : u));
  escribir(CLAVE_USUARIOS, usuarios);
  const actual = leer<Usuario | null>(CLAVE_SESION, null);
  if (actual?.correo === correo) escribir(CLAVE_SESION, { ...actual, ...cambios });
}

// Borra la cuenta y su sesión de este navegador
export function eliminarCuenta(correo: string) {
  escribir(CLAVE_USUARIOS, leer<UsuarioGuardado[]>(CLAVE_USUARIOS, []).filter((u) => u.correo !== correo));
  escribir(CLAVE_SESION, null);
}

// Preferencias de avisos por cuenta
export type Avisos = { becas: boolean; registro: boolean; cursos: boolean };
const claveAvisos = (correo: string) => `uniway:avisos:${correo}`;
export function leerAvisos(correo: string): Avisos {
  return leer<Avisos>(claveAvisos(correo), { becas: true, registro: true, cursos: false });
}
export function guardarAvisos(correo: string, a: Avisos) {
  escribir(claveAvisos(correo), a);
}
