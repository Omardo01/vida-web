"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export function VerificationToast() {
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShow(true)
      // Auto-hide después de 5 segundos
      setTimeout(() => setShow(false), 5000)
      
      // Limpiar el parámetro de la URL sin recargar
      const url = new URL(window.location.href)
      url.searchParams.delete('verified')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  if (!show) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
      <div className="bg-green-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-md">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">¡Cuenta verificada!</h3>
          <p className="text-sm text-green-100">
            Tu email ha sido confirmado correctamente. Ya puedes iniciar sesión.
          </p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

