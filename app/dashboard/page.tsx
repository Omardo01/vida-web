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
      <CardHeader className="flex flex-row items-center justify-between pb-0 p-2 lg:p-3">
        <CardTitle className="text-[8px] lg:text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <Icon className={`h-2.5 w-2.5 lg:h-3.5 lg:w-3.5 ${iconColorClasses[color]}`} />
      </CardHeader>
      <CardContent className="p-2 lg:p-3 pt-0.5 lg:pt-0">
        <div className="text-lg lg:text-xl font-bold text-foreground leading-none">{value}</div>
        {trend !== undefined ? (
          <p className="text-[7px] lg:text-[9px] flex items-center gap-0.5 mt-0.5">
            <TrendingUp
              className={`h-2 w-2 lg:h-2.5 lg:w-2.5 ${trend >= 0 ? "text-green-500" : "text-red-500"}`}
            />
            <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="text-muted-foreground">{trendLabel}</span>
          </p>
        ) : (
          <p className="text-[7px] lg:text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
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
    <div className="flex items-start gap-3 rounded-lg p-2 md:p-3 hover:bg-muted/50 transition-colors">
      <div
        className={`rounded-full p-1.5 md:p-2 bg-muted shrink-0 ${status ? statusColors[status] : "text-muted-foreground"}`}
      >
        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </div>
      <div className="flex-1 space-y-0.5 min-w-0">
        <p className="text-xs md:text-sm font-medium leading-none truncate">{title}</p>
        <p className="text-[10px] md:text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <div className="text-[10px] md:text-xs text-muted-foreground shrink-0">{time}</div>
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
        <CardContent className="flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-lg bg-primary/10 p-2 md:p-3 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm md:text-base truncate">{title}</h3>
              {badge && (
                <Badge variant="secondary" className="text-[10px] md:text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground truncate">{description}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
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
    <div className="p-4 md:p-6 lg:h-[calc(100vh-4rem)] lg:overflow-hidden overflow-y-auto">
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3 lg:h-full">
        {/* Columna Izquierda: Bienvenida, Stats y Acceso Rápido */}
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6 lg:h-full">
          {/* Header de bienvenida */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              {getGreeting()}, {getUserName()}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Bienvenido a tu panel de control. Aquí tienes un resumen de tu actividad.
            </p>
            {primaryRole && (
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-[10px] md:text-xs"
                  style={{ borderColor: primaryRole.color, color: primaryRole.color }}
                >
                  {primaryRole.display_name}
                </Badge>
              </div>
            )}
          </div>

          {/* Tarjetas de estadísticas - 2x2 para mantener el equilibrio visual */}
          <div className="grid gap-2 md:gap-3 grid-cols-2 lg:max-w-2xl shrink-0 pr-1">
            <StatCard
              title="Archivos (trabajando)"
              value="--"
              description="En desarrollo"
              icon={FolderOpen}
              color="primary"
            />
            <StatCard
              title="Archivos (trabajando)"
              value="--"
              description="En desarrollo"
              icon={FolderOpen}
              color="primary"
            />
            <StatCard
              title="Calendario (trabajando)"
              value="--"
              description="En desarrollo"
              icon={Calendar}
              color="accent"
            />
            <StatCard
              title="Calendario (trabajando)"
              value="--"
              description="En desarrollo"
              icon={Calendar}
              color="accent"
            />
          </div>

          {/* Acceso rápido - Cards del mismo tamaño */}
          <div className="space-y-3 shrink-0">
            <h2 className="text-lg md:text-xl font-semibold">Acceso Rápido</h2>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
              <QuickAccessCard
                title="Mis Archivos"
                description="Documentos personales"
                icon={FolderOpen}
                href="/dashboard/archivos"
              />
              <QuickAccessCard
                title="Calendario"
                description="Eventos próximos"
                icon={Calendar}
                href="/dashboard/calendario"
                badge="3 eventos"
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Actividad Reciente - Ocupa todo el lateral */}
        <div className="flex flex-col gap-3 md:gap-4 lg:h-full">
          <h2 className="text-base md:text-lg font-semibold shrink-0">Actividad Reciente</h2>
          <Card className="lg:flex-1 lg:overflow-hidden flex flex-col border-muted/20">
            <CardContent className="p-2 md:p-3 lg:overflow-y-auto custom-scrollbar">
              <div className="space-y-1">
                <ActivityItem
                  title="Documento compartido"
                  description="Se compartió 'Guía de estudio'"
                  time="2h"
                  icon={FileText}
                  status="info"
                />
                <ActivityItem
                  title="Evento próximo"
                  description="Reunión de líderes mañana"
                  time="5h"
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
                  description="Nuevo mensaje del pastor"
                  time="2d"
                  icon={Bell}
                />
                <ActivityItem
                  title="Sistema actualizado"
                  description="Errores de fechas corregidos"
                  time="3d"
                  icon={AlertCircle}
                  status="info"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
