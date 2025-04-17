'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50 border-b">
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">
          📝 Mi Lista de Tareas
        </h1>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600 transition"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? 'max-h-40' : 'max-h-0'
        }`}
      >
        <div className="bg-white px-4 pb-4 border-t">
          <Link
            href="/"
            className="block py-2 text-sm text-gray-700 hover:text-blue-600 transition"
            onClick={() => setOpen(false)}
          >
            Inicio
          </Link>
        </div>
      </div>
    </header>
  );
}
