"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Shield, Users as UsersIcon } from "lucide-react"
import { toast } from "sonner"

interface Role {
  id: string
  name: string
  display_name: string
  description: string | null
  color: string
  is_system: boolean
  created_at: string
  user_roles: { count: number }[]
}

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newRole, setNewRole] = useState({
    name: "",
    display_name: "",
    description: "",
    color: "#3B82F6",
  })

  const colors = [
    { name: "Azul", value: "#3B82F6" },
    { name: "Rojo", value: "#EF4444" },
    { name: "Verde", value: "#10B981" },
    { name: "Amarillo", value: "#F59E0B" },
    { name: "Morado", value: "#8B5CF6" },
    { name: "Rosa", value: "#EC4899" },
    { name: "Cyan", value: "#06B6D4" },
    { name: "Gris", value: "#6B7280" },
  ]

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles")
      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles)
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al cargar roles")
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast.error("Error al cargar roles")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.display_name) {
      toast.error("Nombre y nombre a mostrar son requeridos")
      return
    }

    setCreating(true)
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole),
      })

      if (response.ok) {
        toast.success("Rol creado exitosamente")
        setDialogOpen(false)
        setNewRole({ name: "", display_name: "", description: "", color: "#3B82F6" })
        fetchRoles()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al crear rol")
      }
    } catch (error) {
      console.error("Error creating role:", error)
      toast.error("Error al crear rol")
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el rol "${roleName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/roles?id=${roleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Rol eliminado exitosamente")
        fetchRoles()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al eliminar rol")
      }
    } catch (error) {
      console.error("Error deleting role:", error)
      toast.error("Error al eliminar rol")
    }
  }

  const getUserCount = (role: Role) => {
    return role.user_roles?.[0]?.count || 0
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Gestión de Roles
            </CardTitle>
            <CardDescription>
              Crea y administra roles del sistema
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Crear Rol
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Rol</DialogTitle>
                <DialogDescription>
                  Define un nuevo rol para el sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Rol (interno)</Label>
                  <Input
                    id="name"
                    placeholder="ej: moderador"
                    value={newRole.name}
                    onChange={(e) =>
                      setNewRole({ ...newRole, name: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Usado internamente, sin espacios
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Nombre a Mostrar</Label>
                  <Input
                    id="display_name"
                    placeholder="ej: Moderador"
                    value={newRole.display_name}
                    onChange={(e) =>
                      setNewRole({ ...newRole, display_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe las funciones del rol"
                    value={newRole.description}
                    onChange={(e) =>
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewRole({ ...newRole, color: color.value })}
                        className={`h-10 rounded-md border-2 transition-all ${
                          newRole.color === color.value
                            ? "border-primary scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={creating}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateRole} disabled={creating}>
                  {creating ? "Creando..." : "Crear Rol"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Cargando roles...
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Rol</TableHead>
                  <TableHead className="font-semibold">Descripción</TableHead>
                  <TableHead className="font-semibold text-center">
                    <UsersIcon className="h-4 w-4 inline mr-1" />
                    Usuarios
                  </TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay roles creados
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: role.color }}
                          />
                          <span className="font-medium">{role.display_name}</span>
                          <code className="text-xs bg-muted px-2 py-0.5 rounded">
                            {role.name}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {role.description || "Sin descripción"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{getUserCount(role)}</Badge>
                      </TableCell>
                      <TableCell>
                        {role.is_system ? (
                          <Badge variant="default">Sistema</Badge>
                        ) : (
                          <Badge variant="outline">Personalizado</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!role.is_system && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id, role.display_name)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

