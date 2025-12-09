"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validaciones
    if (!isLogin && password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // Iniciar sesión
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message === "Invalid login credentials" 
            ? "Credenciales incorrectas" 
            : "Error al iniciar sesión")
        } else {
          setSuccess("¡Sesión iniciada correctamente!")
          setTimeout(() => {
            onOpenChange(false)
            // Limpiar formulario
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setError(null)
            setSuccess(null)
          }, 1500)
        }
      } else {
        // Registrar
        const { error } = await signUp(email, password)
        if (error) {
          setError(error.message === "User already registered"
            ? "Este correo ya está registrado"
            : "Error al crear la cuenta")
        } else {
          setSuccess("¡Cuenta creada! Revisa tu email para confirmar.")
          setTimeout(() => {
            setIsLogin(true)
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setSuccess(null)
          }, 3000)
        }
      }
    } catch (err) {
      setError("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 gap-0 bg-background">
        <div className="flex flex-col items-center pt-8 pb-6 px-8">
          {/* Logo */}
          <div className="mb-6">
            <Image 
              src="/images/vida-sc-logo.png" 
              alt="Vida SCMX Logo" 
              width={60} 
              height={60} 
              className="h-15 w-auto"
            />
          </div>

          {/* Title */}
          <DialogHeader className="space-y-2 mb-6 w-full">
            <DialogTitle className="text-2xl font-bold text-foreground text-center">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-center">
              {isLogin ? (
                <>
                  ¿No tienes cuenta?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Regístrate →
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Inicia sesión →
                  </button>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Mensajes de error y éxito */}
          {error && (
            <div className="w-full p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="w-full p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Correo electrónico
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 border-input focus:border-primary focus:ring-primary"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-11 border-input focus:border-primary focus:ring-primary"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 h-11 border-input focus:border-primary focus:ring-primary"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
                </div>
              ) : (
                isLogin ? "Iniciar Sesión" : "Crear Cuenta"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              Política de Privacidad
            </a>
          </p>

          <p className="text-xs text-muted-foreground text-center mt-4">
            ¿Necesitas ayuda?{" "}
            <a href="#contacto" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Contáctanos
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

