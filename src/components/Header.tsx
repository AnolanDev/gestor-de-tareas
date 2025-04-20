// src/components/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white text-blue-900 shadow-sm border-b border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link href="/" className="text-2xl font-semibold text-blue-600">
          📝 Lista de tareas
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
            Inicio
          </Link>
          <Link href="/tasks" className="text-gray-700 hover:text-blue-600 transition">
            Tareas
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
            Acerca
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="sm:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/tasks', label: 'Tareas' },
              { href: '/about', label: 'Acerca' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
