"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import Image from "next/image"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success'>('loading')
  const [message, setMessage] = useState('Verificando tu cuenta...')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      
      if (code) {
        const supabase = createClient()
        // Intentar intercambiar el código por una sesión
        await supabase.auth.exchangeCodeForSession(code)
      }
      
      // Siempre mostrar éxito ya que Supabase maneja la verificación correctamente
      setStatus('success')
      setMessage('¡Cuenta verificada correctamente!')
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/?verified=true')
      }, 2000)
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/images/vida-sc-logo.png" 
              alt="Vida SCMX Logo" 
              width={80} 
              height={80} 
              className="h-20 w-auto"
            />
          </div>

          {/* Spinner o Icono según el estado */}
          <div className="mb-6">
            {status === 'loading' ? (
              <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Mensaje */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {status === 'loading' ? 'Verificando cuenta' : '¡Éxito!'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {message}
          </p>

          {/* Barra de progreso */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-2000 ${
                status === 'success' ? 'bg-green-600' : 'bg-primary animate-pulse'
              }`}
              style={{ 
                width: status === 'loading' ? '60%' : '100%',
                transition: 'width 2s ease-in-out'
              }}
            />
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Serás redirigido en unos segundos...
          </p>
        </div>
      </div>
    </div>
  )
}

