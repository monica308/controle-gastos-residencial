import "./globals.css"

import { Geist, Geist_Mono } from "next/font/google"

import type { Metadata } from "next"
import Navbar from "../app/components/NavBar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Controle Residencial | Mônica",
  description: "Sistema de gerenciamento de gastos e membros da residência",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100">
        <header className="pt-6">
          <Navbar />
        </header>

        {/* O children renderiza o conteúdo específico de cada página */}
        <div className="flex-1">
          {children}
        </div>

        {/* Rodapé opcional para dar um acabamento no layout */}
        <footer className="p-6 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          &copy; 2026 Residencia Control - Full Stack Project
        </footer>
      </body>
    </html>
  )
}