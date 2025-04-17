import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'To-Do App',
  description: 'Organiza tus tareas con estilo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 min-h-screen font-sans antialiased flex flex-col">
        {/* Encabezado */}
        <header
          role="banner"
          className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 flex items-center justify-center"
        >
          <h1 className="text-2xl font-semibold text-blue-700 tracking-tight hover:opacity-90 transition-opacity duration-200">
            To-Do App
          </h1>
        </header>

        {/* Contenido principal */}
        <main role="main" className="flex-1 p-6 w-full max-w-5xl mx-auto">
          {children}
        </main>

        {/* Pie de página */}
        <footer
          role="contentinfo"
          className="text-center text-xs text-gray-500 py-5 border-t border-gray-200 bg-white"
        >
          © {new Date().getFullYear()} Mi To-Do App. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
