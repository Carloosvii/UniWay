import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FlujoCompra from "@/components/compra/FlujoCompra";

type Params = { params: Promise<{ producto: string }> };

export function generateStaticParams() {
  return [{ producto: "curso" }, { producto: "asesoria" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { producto } = await params;
  return { title: producto === "curso" ? "Cotiza tu curso · UniWay" : "Agenda tu asesoría · UniWay" };
}

export default async function ComprarPage({ params }: Params) {
  const { producto } = await params;
  if (producto !== "curso" && producto !== "asesoria") notFound();
  return <FlujoCompra producto={producto} />;
}
