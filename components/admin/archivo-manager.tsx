"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  FilePlus, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Check,
  Plus
} from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

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
  archivo_roles: { role_id: string }[]
}

export function ArchivoManager() {
  const [archivos, setArchivos] = useState<Archivo[]>([])
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [archivoToDelete, setArchivoToDelete] = useState<Archivo | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    url: "",
    descripcion: "",
    role_ids: [] as string[]
  })
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [archivosRes, rolesRes] = await Promise.all([
        fetch('/api/admin/archivos'),
        fetch('/api/admin/roles')
      ])

      if (archivosRes.ok) {
        const { archivos } = await archivosRes.json()
        setArchivos(archivos || [])
      }

      if (rolesRes.ok) {
        const { roles } = await rolesRes.json()
        setAvailableRoles(roles || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!formData.nombre || !formData.url) {
      toast.error("Nombre y URL son requeridos")
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/archivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success("Archivo creado exitosamente")
        setDialogOpen(false)
        setFormData({ nombre: "", url: "", descripcion: "", role_ids: [] })
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al guardar")
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!archivoToDelete) return

    try {
      const response = await fetch(`/api/admin/archivos?id=${archivoToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("Archivo eliminado")
        fetchData()
      } else {
        toast.error("Error al eliminar")
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor")
    } finally {
      setDeleteDialogOpen(false)
      setArchivoToDelete(null)
    }
  }

  const toggleRole = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter(id => id !== roleId)
        : [...prev.role_ids, roleId]
    }))
  }

  if (loading && archivos.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Gestión de Archivos y Recursos</h3>
          <p className="text-sm text-muted-foreground">
            Crea links a archivos o recursos externos y define quién puede verlos.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Archivo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Roles con Acceso</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archivos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No hay archivos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                archivos.map((archivo) => (
                  <TableRow key={archivo.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{archivo.nombre}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{archivo.url}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {archivo.archivo_roles?.length > 0 ? (
                          archivo.archivo_roles.map((ar) => {
                            const role = availableRoles.find(r => r.id === ar.role_id)
                            return role ? (
                              <Badge 
                                key={role.id} 
                                variant="secondary"
                                style={{
                                  backgroundColor: `${role.color}20`,
                                  color: role.color,
                                  borderColor: `${role.color}40`,
                                }}
                              >
                                {role.display_name}
                              </Badge>
                            ) : null
                          })
                        ) : (
                          <span className="text-xs text-muted-foreground">Ningún rol</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {new Date(archivo.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={archivo.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setArchivoToDelete(archivo)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para crear */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuevo Recurso</DialogTitle>
            <DialogDescription>
              Agrega un link a un archivo o sitio web para compartir con los usuarios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input 
                id="nombre" 
                placeholder="Ej: Manual de Bienvenida" 
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL (Link)</Label>
              <Input 
                id="url" 
                placeholder="https://docs.google.com/..." 
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea 
                id="descripcion" 
                placeholder="Mensaje o notas sobre este archivo..." 
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Roles que podrán ver este archivo</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableRoles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`role-${role.id}`} 
                      checked={formData.role_ids.includes(role.id)}
                      onCheckedChange={() => toggleRole(role.id)}
                    />
                    <label 
                      htmlFor={`role-${role.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: role.color}} />
                      {role.display_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar Archivo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el acceso a <strong>{archivoToDelete?.nombre}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-white">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
