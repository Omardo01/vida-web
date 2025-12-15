"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, UserPlus, Mail, Calendar, TrendingUp, Shield, FileText, CalendarDays } from "lucide-react"
import Link from "next/link"
import { RoleManager } from "@/components/admin/role-manager"
import { UserRoleAssignment } from "@/components/admin/user-role-assignment"
import { BlogManager } from "@/components/admin/blog-manager"
import { EventManager } from "@/components/admin/event-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserRole {
  role_id: string
  role_name: string
  display_name: string
  color: string
}

interface UserData {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  roles: UserRole[]
}

interface UserStats {
  total: number
  verified: number
  unverified: number
  thisMonth: number
  trend: number
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [availableRoles, setAvailableRoles] = useState<any[]>([])
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    verified: 0,
    unverified: 0,
    thisMonth: 0,
    trend: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      try {
        // Llamar a la API route para obtener usuarios
        const usersResponse = await fetch('/api/admin/users')
        
        if (!usersResponse.ok) {
          const errorData = await usersResponse.json()
          console.error("Error fetching users:", errorData)
          setError(errorData.error || "No tienes permisos para ver esta información")
          setLoading(false)
          return
        }

        const { users: fetchedUsers } = await usersResponse.json()
        const formattedUsers: UserData[] = fetchedUsers

        setUsers(formattedUsers)
        
        // Cargar roles disponibles
        const rolesResponse = await fetch('/api/admin/roles')
        if (rolesResponse.ok) {
          const { roles } = await rolesResponse.json()
          setAvailableRoles(roles)
        }

        // Calcular estadísticas
        const now = new Date()
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        
        const usersThisMonth = formattedUsers.filter(
          (u) => new Date(u.created_at) >= thisMonth
        ).length
        
        const usersLastMonth = formattedUsers.filter(
          (u) => {
            const createdDate = new Date(u.created_at)
            return createdDate >= lastMonth && createdDate < thisMonth
          }
        ).length

        const verified = formattedUsers.filter((u) => u.email_confirmed_at).length
        
        let trend = 0
        if (usersLastMonth > 0) {
          trend = ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100
        } else if (usersThisMonth > 0) {
          trend = 100
        }

        setStats({
          total: formattedUsers.length,
          verified,
          unverified: formattedUsers.length - verified,
          thisMonth: usersThisMonth,
          trend: Math.round(trend),
        })

        setLoading(false)
      } catch (err) {
        console.error("Error:", err)
        setError("Error al cargar los datos")
        setLoading(false)
      }
    }

    if (user && !authLoading) {
      fetchData()
    }
  }, [user, authLoading])

  const refreshData = async () => {
    setLoading(true)
    try {
      const usersResponse = await fetch('/api/admin/users')
      if (usersResponse.ok) {
        const { users: fetchedUsers } = await usersResponse.json()
        setUsers(fetchedUsers)
      }
      const rolesResponse = await fetch('/api/admin/roles')
      if (rolesResponse.ok) {
        const { roles } = await rolesResponse.json()
        setAvailableRoles(roles)
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return null
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">Gestión de usuarios y estadísticas</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Sesión activa
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error ? (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Para acceder al panel de administración, necesitas configurar las credenciales de servicio de Supabase.
              </p>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tabs para diferentes secciones */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="events" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Eventos
                </TabsTrigger>
                <TabsTrigger value="blog" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Blog
                </TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total de usuarios */}
              <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Usuarios
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Usuarios registrados
                  </p>
                </CardContent>
              </Card>

              {/* Nuevos este mes */}
              <Card className="relative overflow-hidden border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Nuevos Este Mes
                  </CardTitle>
                  <UserPlus className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.thisMonth}</div>
                  <p className="text-xs flex items-center gap-1 mt-1">
                    <TrendingUp className={`h-3 w-3 ${stats.trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={stats.trend >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {stats.trend >= 0 ? '+' : ''}{stats.trend}%
                    </span>
                    <span className="text-muted-foreground">vs mes anterior</span>
                  </p>
                </CardContent>
              </Card>

              {/* Usuarios verificados */}
              <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-card to-accent/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Verificados
                  </CardTitle>
                  <Mail className="h-4 w-4 text-accent-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.verified}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}% del total
                  </p>
                </CardContent>
              </Card>

              {/* Sin verificar */}
              <Card className="relative overflow-hidden border-muted bg-gradient-to-br from-card to-muted/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Sin Verificar
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.unverified}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pendientes de confirmación
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de usuarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Lista de Usuarios
                </CardTitle>
                <CardDescription>
                  Todos los usuarios registrados en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Roles</TableHead>
                        <TableHead className="font-semibold">Estado</TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">Registrado</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Último acceso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No hay usuarios registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((userData) => (
                          <TableRow key={userData.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">{userData.email}</TableCell>
                            <TableCell>
                              <UserRoleAssignment
                                userId={userData.id}
                                userEmail={userData.email}
                                currentRoles={userData.roles}
                                availableRoles={availableRoles}
                                onRolesChanged={refreshData}
                              />
                            </TableCell>
                            <TableCell>
                              {userData.email_confirmed_at ? (
                                <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                                  Verificado
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
                                  Pendiente
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground hidden sm:table-cell">
                              {formatDate(userData.created_at)}
                            </TableCell>
                            <TableCell className="text-muted-foreground hidden md:table-cell">
                              {formatDate(userData.last_sign_in_at)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="events">
                <EventManager />
              </TabsContent>

              <TabsContent value="blog">
                <BlogManager />
              </TabsContent>

              <TabsContent value="roles">
                <RoleManager />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

