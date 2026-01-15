"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  Search,
  ExternalLink,
  Grid,
  List,
  MoreHorizontal,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Role {
  id: string
  name: string
  display_name: string
  color: string
}

interface Archivo {
  id: string
  nombre: string
  url: string
  descripcion: string
  created_at: string
  archivo_roles: {
    role_id: string
    roles: Role
  }[]
}

export default function ArchivosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [archivos, setArchivos] = useState<Archivo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArchivos() {
      try {
        const response = await fetch('/api/archivos')
        if (response.ok) {
          const { archivos } = await response.json()
          setArchivos(archivos || [])
        }
      } catch (error) {
        console.error('Error fetching archivos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArchivos()
  }, [])

  // Obtener todos los roles únicos de los archivos disponibles
  const availableRoles = useMemo(() => {
    const rolesMap = new Map<string, Role>()
    archivos.forEach(file => {
      file.archivo_roles?.forEach(ar => {
        if (ar.roles) {
          rolesMap.set(ar.roles.id, ar.roles)
        }
      })
    })
    return Array.from(rolesMap.values())
  }, [archivos])

  const filteredFiles = archivos.filter((file) => {
    const matchesSearch = file.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = !selectedRole || file.archivo_roles?.some(ar => ar.role_id === selectedRole)
    
    return matchesSearch && matchesRole
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const formatted = date.toLocaleDateString("es-ES", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    // Capitalizar la primera letra (el día de la semana)
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-muted/20 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Recursos y Archivos</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Materiales y documentos compartidos para tu rol
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-3 md:p-4 rounded-2xl md:rounded-xl border shadow-sm">
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 h-9 md:h-10 border-muted-foreground/10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            <Button
              variant={selectedRole === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole(null)}
              className="h-7 md:h-9 rounded-full px-3 md:px-4 text-[10px] md:text-xs"
            >
              Todos
            </Button>
            {availableRoles.map((role) => (
              <Button
                key={role.id}
                variant={selectedRole === role.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(role.id)}
                className="h-7 md:h-9 rounded-full px-3 md:px-4 border-muted-foreground/10 text-[10px] md:text-xs"
                style={selectedRole === role.id ? { backgroundColor: role.color } : {}}
              >
                {role.display_name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-2 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 border-muted-foreground/10">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", viewMode === "grid" && "bg-muted text-primary")}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", viewMode === "list" && "bg-muted text-primary")}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[240px] w-full rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="flex-1">
          {viewMode === "grid" ? (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-card rounded-3xl border border-dashed">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No se encontraron archivos con los criterios seleccionados</p>
                </div>
              ) : (
                filteredFiles.map((file) => {
                  // Determinar color de fondo basado en el primer rol
                  const firstRole = file.archivo_roles?.[0]?.roles
                  const firstColor = firstRole?.color || '#3b82f6'

                  return (
                    <Card 
                      key={file.id} 
                      className={cn(
                        "group relative border-none shadow-sm transition-all hover:shadow-md hover:-translate-y-1 rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden flex flex-col h-full min-h-[140px] md:min-h-[170px] py-2.5",
                      )}
                      style={{ backgroundColor: `${firstColor}10` }}
                    >
                      <CardHeader className="p-2.5 md:p-4 pb-0 md:pb-0">
                        <div className="flex items-start justify-between">
                          <div 
                            className="rounded-lg md:rounded-xl p-1.5 md:p-2.5 transition-colors"
                            style={{ backgroundColor: `${firstColor}20` }}
                          >
                            <Calendar className="h-4 w-4 md:h-5 md:w-5" style={{ color: firstColor }} />
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full bg-white/30 backdrop-blur-sm h-7 w-7 md:h-8 md:w-8">
                            <MoreHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-2.5 md:p-4 pt-1 md:pt-1.5 flex flex-col flex-1">
                        <div className="flex-1">
                          <h3 className="text-sm md:text-base font-bold text-foreground leading-tight mb-0.5 md:mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {file.nombre}
                          </h3>
                          <p className="text-[9px] md:text-xs text-muted-foreground font-medium flex items-center gap-1 md:gap-1.5">
                            {formatDate(file.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1.5 md:mt-2">
                          <div className="flex -space-x-1 md:-space-x-1.5 overflow-hidden">
                            {file.archivo_roles?.map((ar, idx) => (
                              <div
                                key={ar.role_id}
                                className="h-5 w-5 md:h-7 md:w-7 rounded-full border border-white flex items-center justify-center text-[7px] md:text-[9px] font-bold text-white shadow-sm shrink-0"
                                title={ar.roles?.display_name}
                                style={{ backgroundColor: ar.roles?.color, zIndex: 10 - idx }}
                              >
                                {ar.roles?.display_name.substring(0, 2).toUpperCase()}
                              </div>
                            ))}
                          </div>
                          <Button 
                            asChild 
                            size="sm" 
                            className="rounded-full h-6 md:h-8 px-2.5 md:px-3 text-[9px] md:text-xs font-semibold transition-all shadow-sm"
                            style={{ backgroundColor: firstColor }}
                          >
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                              Abrir
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          ) : (
            <Card className="rounded-3xl overflow-hidden border-none shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="py-4 pl-6">Nombre y Descripción</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                        No se encontraron archivos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFiles.map((file) => (
                      <TableRow key={file.id} className="hover:bg-muted/30 group">
                        <TableCell className="py-4 pl-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                              {file.nombre}
                            </span>
                            {file.descripcion && (
                              <span className="text-sm text-muted-foreground line-clamp-1">
                                {file.descripcion}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {file.archivo_roles?.map((ar) => (
                              <Badge
                                key={ar.role_id}
                                variant="secondary"
                                className="text-[10px] font-bold uppercase"
                                style={{
                                  backgroundColor: `${ar.roles?.color}15`,
                                  color: ar.roles?.color,
                                  borderColor: `${ar.roles?.color}30`,
                                }}
                              >
                                {ar.roles?.display_name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground font-medium">
                          {new Date(file.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" size="sm" asChild className="rounded-full px-4 group-hover:bg-primary group-hover:text-white transition-all">
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              <span>Abrir recurso</span>
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
