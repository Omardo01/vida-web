"use client"

import { useAuth } from "@/contexts/auth-context"
import { useUserRoles } from "@/hooks/use-user-roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  LogOut,
  Camera,
} from "lucide-react"

export default function ConfiguracionPage() {
  const { user, signOut } = useAuth()
  const { roles, primaryRole } = useUserRoles()

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil
          </CardTitle>
          <CardDescription>
            Información de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user?.email ? getInitials(user.email) : "US"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-semibold">
                {user?.email?.split("@")[0] || "Usuario"}
              </p>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                {roles.map((role) => (
                  <Badge
                    key={role.role_id}
                    variant="outline"
                    style={{ borderColor: role.color, color: role.color }}
                  >
                    {role.display_name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nombre para mostrar</Label>
              <Input
                id="displayName"
                placeholder="Tu nombre"
                defaultValue={user?.email?.split("@")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>
          </div>

          <Button>Guardar cambios</Button>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura cómo quieres recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificaciones por email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones importantes en tu correo
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recordatorios de eventos</Label>
              <p className="text-sm text-muted-foreground">
                Notificaciones antes de eventos programados
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Actualizaciones del equipo</Label>
              <p className="text-sm text-muted-foreground">
                Notificaciones cuando hay cambios en tu equipo
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Nuevos documentos compartidos</Label>
              <p className="text-sm text-muted-foreground">
                Aviso cuando te comparten un documento
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Apariencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza la apariencia de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tema oscuro</Label>
              <p className="text-sm text-muted-foreground">
                Cambia entre tema claro y oscuro
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Barra lateral compacta</Label>
              <p className="text-sm text-muted-foreground">
                Muestra solo iconos en la barra lateral
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
          <CardDescription>
            Gestiona la seguridad de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cambiar contraseña</Label>
              <p className="text-sm text-muted-foreground">
                Actualiza tu contraseña de acceso
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Lock className="h-4 w-4 mr-2" />
              Cambiar
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cerrar sesión</Label>
              <p className="text-sm text-muted-foreground">
                Cierra la sesión en este dispositivo
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
