import type { Metadata } from "next";
import Perfil from "@/components/perfil/Perfil";

export const metadata: Metadata = { title: "Mi perfil · UniWay" };

export default function PerfilPage() {
  return <Perfil />;
}
