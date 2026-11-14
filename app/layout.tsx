import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Inter es el respaldo para Windows y Android; en Apple se usa SF Pro del sistema.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Tipografía de titulares y logo (estilo Statly)
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: "UniWay · Elige tu prepa",
  description:
    "Encuentra bachilleratos públicos cerca de ti, becas y cursos para tu examen de ingreso.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${interTight.variable} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
