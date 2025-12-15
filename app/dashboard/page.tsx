"use client"

import { useAuth } from "@/contexts/auth-context"
import { useUserRoles } from "@/hooks/use-user-roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FolderOpen,
  Users,
  FileBarChart,
  TrendingUp,
  Clock,
  Calendar,
  BookOpen,
  Bell,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

// Componente de tarjeta de estadística
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  color = "primary",
}: {
  title: string
  value: string | number
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: number
  trendLabel?: string
  color?: "primary" | "secondary" | "accent" | "muted"
}) {
  const colorClasses = {
    primary: "border-primary/20 bg-gradient-to-br from-card to-primary/5",
    secondary: "border-secondary/20 bg-gradient-to-br from-card to-secondary/5",
    accent: "border-accent/20 bg-gradient-to-br from-card to-accent/5",
    muted: "border-muted bg-gradient-to-br from-card to-muted/10",
  }

  const iconColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent-foreground",
    muted: "text-muted-foreground",
  }

  return (
    <Card className={`relative overflow-hidden ${colorClasses[color]}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColorClasses[color]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {trend !== undefined ? (
          <p className="text-xs flex items-center gap-1 mt-1">
            <TrendingUp
              className={`h-3 w-3 ${trend >= 0 ? "text-green-500" : "text-red-500"}`}
            />
            <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="text-muted-foreground">{trendLabel}</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

// Componente de ítem de actividad reciente
function ActivityItem({
  title,
  description,
  time,
  icon: Icon,
  status,
}: {
  title: string
  description: string
  time: string
  icon: React.ComponentType<{ className?: string }>
  status?: "success" | "warning" | "info"
}) {
  const statusColors = {
    success: "text-green-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  }

  return (
    <div className="flex items-start gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors">
      <div
        className={`rounded-full p-2 bg-muted ${status ? statusColors[status] : "text-muted-foreground"}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  )
}

// Componente de acceso rápido
function QuickAccessCard({
  title,
  description,
  icon: Icon,
  href,
  badge,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/40">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{title}</h3>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardContent>
      </Card>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { roles, primaryRole, hasManagementRole, isAdmin, isPastor, isLider } = useUserRoles()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  const getUserName = () => {
    if (!user?.email) return "Usuario"
    return user.email.split("@")[0]
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header de bienvenida */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {getUserName()}
        </h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control. Aquí tienes un resumen de tu actividad.
        </p>
        {primaryRole && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">Tu rol:</span>
            <Badge
              variant="outline"
              style={{ borderColor: primaryRole.color, color: primaryRole.color }}
            >
              {primaryRole.display_name}
            </Badge>
            {roles.length > 1 && (
              <span className="text-xs text-muted-foreground">
                +{roles.length - 1} más
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Archivos"
          value="12"
          description="Documentos guardados"
          icon={FolderOpen}
          color="primary"
        />
        <StatCard
          title="Tareas Pendientes"
          value="5"
          description="Para completar esta semana"
          icon={Clock}
          color="secondary"
        />
        <StatCard
          title="Eventos"
          value="3"
          description="Próximos eventos"
          icon={Calendar}
          color="accent"
        />
        <StatCard
          title="Notificaciones"
          value="8"
          description="Sin leer"
          icon={Bell}
          color="muted"
        />
      </div>

      {/* Estadísticas adicionales para roles de gestión */}
      {hasManagementRole && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Miembros del Equipo"
            value="24"
            description=""
            trend={12}
            trendLabel="este mes"
            icon={Users}
            color="primary"
          />
          <StatCard
            title="Reportes Generados"
            value="8"
            description=""
            trend={-5}
            trendLabel="vs semana pasada"
            icon={FileBarChart}
            color="secondary"
          />
          <StatCard
            title="Cursos Activos"
            value="4"
            description="En progreso"
            icon={BookOpen}
            color="accent"
          />
          <StatCard
            title="Asistencia Promedio"
            value="87%"
            description=""
            trend={3}
            trendLabel="mejora"
            icon={CheckCircle2}
            color="primary"
          />
        </div>
      )}

      {/* Contenido principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Acceso rápido */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Acceso Rápido</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <QuickAccessCard
              title="Mis Archivos"
              description="Accede a tus documentos personales"
              icon={FolderOpen}
              href="/dashboard/archivos"
            />
            <QuickAccessCard
              title="Calendario"
              description="Revisa tus próximos eventos"
              icon={Calendar}
              href="/dashboard/calendario"
              badge="3 eventos"
            />
            {hasManagementRole && (
              <>
                <QuickAccessCard
                  title="Gestión de Equipo"
                  description="Administra tu equipo y células"
                  icon={Users}
                  href="/dashboard/gestion"
                />
                <QuickAccessCard
                  title="Reportes"
                  description="Genera y consulta reportes"
                  icon={FileBarChart}
                  href="/dashboard/reportes"
                />
              </>
            )}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Actividad Reciente</h2>
          <Card>
            <CardContent className="p-2">
              <div className="space-y-1">
                <ActivityItem
                  title="Documento compartido"
                  description="Se compartió 'Guía de estudio' contigo"
                  time="Hace 2h"
                  icon={FileText}
                  status="info"
                />
                <ActivityItem
                  title="Evento próximo"
                  description="Reunión de líderes mañana a las 7pm"
                  time="Hace 5h"
                  icon={Calendar}
                  status="warning"
                />
                <ActivityItem
                  title="Tarea completada"
                  description="Has completado 'Revisar material'"
                  time="Ayer"
                  icon={CheckCircle2}
                  status="success"
                />
                <ActivityItem
                  title="Nueva notificación"
                  description="Tienes un nuevo mensaje del pastor"
                  time="Hace 2d"
                  icon={Bell}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sección de progreso (para usuarios con cursos) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Mi Progreso</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fundamentos de Fe</CardTitle>
              <CardDescription>Curso en progreso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  4 de 6 lecciones completadas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Liderazgo Efectivo</CardTitle>
              <CardDescription>Curso en progreso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">30%</span>
                </div>
                <Progress value={30} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  2 de 8 lecciones completadas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center justify-center p-6 border-dashed">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Explora más cursos disponibles
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link href="/dashboard/cursos">Ver cursos</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
