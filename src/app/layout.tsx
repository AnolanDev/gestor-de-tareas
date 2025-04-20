// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'To‑Do App',
  description: 'Organiza tus tareas con estilo y eficiencia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900 min-h-screen font-sans antialiased flex flex-col">
        <Header />

        <main className="p-6 w-full max-w-screen-2xl mx-auto">
          {children}
        </main>

        <footer className="bg-white text-blue-900 shadow-sm text-center text-xs text-gray-500 py-4 border-b border-gray-200">
          © {new Date().getFullYear()} Mi To‑Do App. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  )
}
