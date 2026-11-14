import type { Metadata } from "next";
import { Suspense } from "react";
import FormularioRegistro from "@/components/cuenta/FormularioRegistro";
import { PantallaCuenta } from "@/components/cuenta/Piezas";

export const metadata: Metadata = { title: "Crear cuenta · UniWay" };

export default function RegistroPage() {
  return (
    <PantallaCuenta
      titulo="Empieza tu camino a la"
      resaltado="prepa"
      texto="Crea tu cuenta gratis. Si eres mamá, papá o tutor, desde aquí pagas los cursos y asesorías."
      puntos={["Mapa, becas y simulador gratis", "Avisos cuando abran las becas", "Cursos y asesorías a buen precio"]}
      img="/img/cursos/estudiantes-bandera.jpg"
      imgAlt="Estudiantes caminando con la bandera de México"
      tituloFormulario="Crear cuenta"
    >
      <Suspense>
        <FormularioRegistro />
      </Suspense>
    </PantallaCuenta>
  );
}
