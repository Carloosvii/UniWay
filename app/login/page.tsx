import type { Metadata } from "next";
import { Suspense } from "react";
import FormularioLogin from "@/components/cuenta/FormularioLogin";
import { PantallaCuenta } from "@/components/cuenta/Piezas";

export const metadata: Metadata = { title: "Iniciar sesión · UniWay" };

export default function LoginPage() {
  return (
    <PantallaCuenta
      titulo="Qué gusto verte"
      resaltado="de nuevo"
      texto="Entra para seguir donde te quedaste."
      puntos={["Tus escuelas guardadas", "Tus cursos y asesorías", "Avisos de becas y fechas"]}
      img="/img/becas/cu-biblioteca.jpg"
      imgAlt="Biblioteca Central de Ciudad Universitaria"
      tituloFormulario="Iniciar sesión"
    >
      <Suspense>
        <FormularioLogin />
      </Suspense>
    </PantallaCuenta>
  );
}
