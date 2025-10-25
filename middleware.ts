import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Variable de entorno para activar/desactivar el modo construcción
  const isUnderConstruction = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true'
  
  // Si no está en modo construcción, continuar normalmente
  if (!isUnderConstruction) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  // Rutas que NO se redirigen (excepciones)
  const allowedPaths = [
    '/construyendo',           // La página de construcción misma
    '/api',                    // APIs
    '/_next',                  // Assets de Next.js
    '/images',                 // Imágenes públicas
    '/favicon.ico',            // Favicon
  ]

  // Rutas opcionales que puedes permitir (comenta/descomenta según necesites)
  const optionalAllowedPaths = [
    // '/admin',               // Descomentar para permitir acceso al admin
    // '/auth',                // Descomentar para permitir autenticación
    // '/test-auth',           // Descomentar para tests
  ]

  // Combinar rutas permitidas
  const allAllowedPaths = [...allowedPaths, ...optionalAllowedPaths]

  // Verificar si la ruta actual está permitida
  const isAllowed = allAllowedPaths.some(path => pathname.startsWith(path))

  // Si la ruta está permitida, continuar
  if (isAllowed) {
    return NextResponse.next()
  }

  // Si no, redirigir a la página de construcción
  return NextResponse.redirect(new URL('/construyendo', request.url))
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

