"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuthPage() {
  const { user, session, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🧪 Prueba de Autenticación
          </h1>
          <p className="text-muted-foreground">
            Página de prueba para verificar la integración con Supabase
          </p>
        </div>

        {/* Estado de la sesión */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de la Sesión</CardTitle>
            <CardDescription>
              {user ? "✅ Usuario autenticado" : "❌ No hay sesión activa"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">ID de Usuario</p>
                    <p className="font-mono text-xs text-foreground break-all">{user.id}</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Email Confirmado</p>
                    <p className="font-medium text-foreground">
                      {user.email_confirmed_at ? (
                        <span className="text-green-600">✅ Sí</span>
                      ) : (
                        <span className="text-orange-600">⏳ Pendiente</span>
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Creado</p>
                    <p className="font-medium text-foreground text-sm">
                      {new Date(user.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => signOut()} 
                    variant="destructive"
                    className="w-full md:w-auto"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No hay ninguna sesión activa. Ve al inicio y haz clic en "Iniciar Sesión"
                </p>
                <Button asChild>
                  <a href="/">Ir al Inicio</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del token */}
        {session && (
          <Card>
            <CardHeader>
              <CardTitle>Token JWT</CardTitle>
              <CardDescription>
                Este token se envía al backend para verificar la identidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Access Token (primeros 50 caracteres)</p>
                  <p className="font-mono text-xs text-foreground break-all">
                    {session.access_token.substring(0, 50)}...
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Expira en</p>
                    <p className="font-medium text-foreground">
                      {new Date(session.expires_at! * 1000).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Tipo de Token</p>
                    <p className="font-medium text-foreground">{session.token_type}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Datos completos (para debugging) */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Completos (JSON)</CardTitle>
            <CardDescription>
              Información técnica para debugging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-xs">
                {JSON.stringify({ user, session: session ? { ...session, access_token: session.access_token.substring(0, 20) + '...' } : null }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>📋 Checklist de Pruebas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Registrar un nuevo usuario y verificar que llegue el email de confirmación</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Iniciar sesión con credenciales válidas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Intentar iniciar sesión con credenciales incorrectas (debe mostrar error)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Verificar que el botón del header cambie cuando hay sesión activa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Cerrar sesión y verificar que todo se limpie correctamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Recargar la página y verificar que la sesión persista</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

