"use client"

import { useUserRoles } from "@/hooks/use-user-roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react"
import Link from "next/link"

// Datos de ejemplo
const mockTeamMembers = [
  {
    id: "1",
    name: "María García",
    email: "maria@example.com",
    role: "Líder de Célula",
    avatar: null,
    status: "active",
    phone: "+52 55 1234 5678",
  },
  {
    id: "2",
    name: "Carlos López",
    email: "carlos@example.com",
    role: "Miembro",
    avatar: null,
    status: "active",
    phone: "+52 55 2345 6789",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@example.com",
    role: "Líder de Alabanza",
    avatar: null,
    status: "pending",
    phone: "+52 55 3456 7890",
  },
  {
    id: "4",
    name: "José Hernández",
    email: "jose@example.com",
    role: "Servidor",
    avatar: null,
    status: "active",
    phone: "+52 55 4567 8901",
  },
]

const mockCelulas = [
  {
    id: "1",
    name: "Célula Centro",
    leader: "María García",
    members: 12,
    location: "Zona Centro",
    day: "Miércoles",
    attendance: 85,
  },
  {
    id: "2",
    name: "Célula Norte",
    leader: "Carlos López",
    members: 8,
    location: "Zona Norte",
    day: "Jueves",
    attendance: 92,
  },
  {
    id: "3",
    name: "Célula Sur",
    leader: "Ana Martínez",
    members: 15,
    location: "Zona Sur",
    day: "Martes",
    attendance: 78,
  },
]

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function TeamMemberCard({ member }: { member: typeof mockTeamMembers[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <Badge
                variant={member.status === "active" ? "default" : "secondary"}
                className={
                  member.status === "active"
                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                }
              >
                {member.status === "active" ? "Activo" : "Pendiente"}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {member.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {member.phone}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CelulaCard({ celula }: { celula: typeof mockCelulas[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{celula.name}</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          Líder: {celula.leader}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {celula.location}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {celula.day}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Asistencia promedio</span>
              <span className="font-medium">{celula.attendance}%</span>
            </div>
            <Progress value={celula.attendance} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{celula.members} miembros</Badge>
            <Button variant="ghost" size="sm" className="gap-1">
              Ver detalles
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GestionPage() {
  const { isAdmin, isPastor, isLider, hasManagementRole } = useUserRoles()

  if (!hasManagementRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Gestión</h1>
          <p className="text-muted-foreground">
            Administra tu equipo, células y recursos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Agregar Miembro
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Total Miembros</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-500/10 p-3">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Células</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de contenido */}
      <Tabs defaultValue="equipo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="equipo">Mi Equipo</TabsTrigger>
          <TabsTrigger value="celulas">Células</TabsTrigger>
          <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
        </TabsList>

        <TabsContent value="equipo" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockTeamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="celulas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCelulas.map((celula) => (
              <CelulaCard key={celula.id} celula={celula} />
            ))}
            {/* Tarjeta para crear nueva célula */}
            <Card className="flex flex-col items-center justify-center p-6 border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
              <UserPlus className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Crear nueva célula
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="asistencia">
          <Card className="flex flex-col items-center justify-center p-12">
            <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Control de Asistencia</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Registra y monitorea la asistencia de tu equipo y células.
            </p>
            <Button>Registrar Asistencia</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
