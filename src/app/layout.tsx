import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVACODE | 3D Experience",
  description: "Experiencia 3D interactiva - Agencia de desarrollo web en Bogotá",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
