"use client"

import { useUserRoles } from "@/hooks/use-user-roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para estadísticas
const overviewStats = [
  {
    title: "Asistencia Total",
    value: "1,234",
    change: 12,
    changeLabel: "vs mes anterior",
    icon: Users,
  },
  {
    title: "Nuevos Miembros",
    value: "45",
    change: 8,
    changeLabel: "vs mes anterior",
    icon: TrendingUp,
  },
  {
    title: "Células Activas",
    value: "24",
    change: -2,
    changeLabel: "vs mes anterior",
    icon: Calendar,
  },
  {
    title: "Tasa de Retención",
    value: "87%",
    change: 3,
    changeLabel: "mejora",
    icon: BarChart3,
  },
]

const recentReports = [
  {
    id: "1",
    name: "Reporte de Asistencia - Diciembre 2024",
    date: "2024-12-10",
    type: "Asistencia",
    status: "completed",
  },
  {
    id: "2",
    name: "Estadísticas de Células - Q4 2024",
    date: "2024-12-05",
    type: "Células",
    status: "completed",
  },
  {
    id: "3",
    name: "Reporte de Crecimiento - Noviembre 2024",
    date: "2024-11-30",
    type: "Crecimiento",
    status: "completed",
  },
  {
    id: "4",
    name: "Análisis de Retención - 2024",
    date: "2024-11-15",
    type: "Análisis",
    status: "draft",
  },
]

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
}: {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className="flex items-center gap-1 text-sm">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-muted-foreground">{changeLabel}</span>
            </div>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportTypeCard({
  title,
  description,
  icon: Icon,
  count,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  count: number
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-muted p-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            <Badge variant="secondary" className="mt-3">
              {count} reportes
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReportesPage() {
  const { hasManagementRole } = useUserRoles()

  if (!hasManagementRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <FileBarChart className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Esta sección está disponible únicamente para líderes, pastores y administradores.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">
            Visualiza estadísticas y genera reportes de tu ministerio
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeLabel={stat.changeLabel}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Tabs de contenido */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="types">Tipos de Reporte</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Gráfico de asistencia simulado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Tendencia de Asistencia
                </CardTitle>
                <CardDescription>
                  Últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de tendencia</p>
                    <p className="text-sm">Próximamente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribución por células */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Distribución por Células
                </CardTitle>
                <CardDescription>
                  Proporción de miembros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Célula Centro</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Célula Norte</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Célula Sur</span>
                      <span className="font-medium">22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Célula Oeste</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas clave */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas Clave</CardTitle>
              <CardDescription>
                Indicadores importantes de este período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-4xl font-bold text-primary">92%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Satisfacción general
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-4xl font-bold text-primary">4.2</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Promedio de asistencia por célula
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-4xl font-bold text-primary">18</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nuevos miembros integrados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportTypeCard
              title="Asistencia"
              description="Reportes de asistencia semanal y mensual"
              icon={Users}
              count={12}
            />
            <ReportTypeCard
              title="Crecimiento"
              description="Análisis de crecimiento y nuevos miembros"
              icon={TrendingUp}
              count={8}
            />
            <ReportTypeCard
              title="Células"
              description="Estado y rendimiento de células"
              icon={Calendar}
              count={15}
            />
            <ReportTypeCard
              title="Financiero"
              description="Reportes de ofrendas y diezmos"
              icon={BarChart3}
              count={6}
            />
            <ReportTypeCard
              title="Actividades"
              description="Resumen de eventos y actividades"
              icon={FileBarChart}
              count={10}
            />
            <ReportTypeCard
              title="Personalizado"
              description="Crea reportes personalizados"
              icon={PieChart}
              count={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reportes Generados</CardTitle>
                  <CardDescription>
                    Historial de reportes anteriores
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-muted p-2">
                        <FileBarChart className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {new Date(report.date).toLocaleDateString("es-ES")}
                          </span>
                          <Badge variant="secondary">{report.type}</Badge>
                          {report.status === "draft" && (
                            <Badge variant="outline">Borrador</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
