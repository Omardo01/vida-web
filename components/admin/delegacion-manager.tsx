"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Trash2, MapPin, Edit2, Phone, Mail, Facebook, Instagram, Youtube, MessageCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface DiaReunion {
  dia: string
  hora: string
  tipo: string
}

interface Delegacion {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  ciudad: string
  estado: string
  direccion: string
  latitud: number | null
  longitud: number | null
  dias_reunion: DiaReunion[]
  facebook: string | null
  instagram: string | null
  youtube: string | null
  twitter: string | null
  whatsapp: string | null
  email: string | null
  telefono: string | null
  pastor_encargado: string | null
  imagen_portada: string | null
  logo: string | null
  activa: boolean
  orden: number
}

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

export function DelegacionManager() {
  const [delegaciones, setDelegaciones] = useState<Delegacion[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDelegacion, setEditingDelegacion] = useState<Delegacion | null>(null)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    ciudad: "",
    estado: "",
    direccion: "",
    mapa_embed_url: "",
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    whatsapp: "",
    email: "",
    telefono: "",
    pastor_encargado: "",
    imagen_portada: "",
    logo: "",
    activa: true,
    orden: 0,
  })

  const [diasReunion, setDiasReunion] = useState<DiaReunion[]>([])
  const [nuevoDia, setNuevoDia] = useState({ dia: "Domingo", hora: "10:00", tipo: "Culto Principal" })

  useEffect(() => {
    fetchDelegaciones()
  }, [])

  const fetchDelegaciones = async () => {
    try {
      const response = await fetch("/api/admin/delegaciones")
      if (response.ok) {
        const data = await response.json()
        setDelegaciones(data.delegaciones)
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al cargar delegaciones")
      }
    } catch (error) {
      console.error("Error fetching delegaciones:", error)
      toast.error("Error al cargar delegaciones")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      slug: "",
      descripcion: "",
      ciudad: "",
      estado: "",
      direccion: "",
      mapa_embed_url: "",
      facebook: "",
      instagram: "",
      youtube: "",
      twitter: "",
      whatsapp: "",
      email: "",
      telefono: "",
      pastor_encargado: "",
      imagen_portada: "",
      logo: "",
      activa: true,
      orden: 0,
    })
    setDiasReunion([])
    setEditingDelegacion(null)
  }

  const handleOpenDialog = (delegacion?: Delegacion) => {
    if (delegacion) {
      setEditingDelegacion(delegacion)
      setFormData({
        nombre: delegacion.nombre,
        slug: delegacion.slug,
        descripcion: delegacion.descripcion || "",
        ciudad: delegacion.ciudad,
        estado: delegacion.estado,
        direccion: delegacion.direccion,
        mapa_embed_url: (delegacion as any).mapa_embed_url || "",
        facebook: delegacion.facebook || "",
        instagram: delegacion.instagram || "",
        youtube: delegacion.youtube || "",
        twitter: delegacion.twitter || "",
        whatsapp: delegacion.whatsapp || "",
        email: delegacion.email || "",
        telefono: delegacion.telefono || "",
        pastor_encargado: delegacion.pastor_encargado || "",
        imagen_portada: delegacion.imagen_portada || "",
        logo: delegacion.logo || "",
        activa: delegacion.activa,
        orden: delegacion.orden,
      })
      setDiasReunion(delegacion.dias_reunion || [])
    } else {
      resetForm()
    }
    setDialogOpen(true)
  }

  const handleSaveDelegacion = async () => {
    if (!formData.nombre || !formData.ciudad || !formData.estado || !formData.direccion) {
      toast.error("Los campos nombre, ciudad, estado y dirección son requeridos")
      return
    }

    setSaving(true)
    try {
      const body = {
        ...formData,
        dias_reunion: diasReunion,
      }

      const url = "/api/admin/delegaciones"
      const method = editingDelegacion ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDelegacion ? { id: editingDelegacion.id, ...body } : body),
      })

      if (response.ok) {
        toast.success(editingDelegacion ? "Delegación actualizada" : "Delegación creada")
        setDialogOpen(false)
        resetForm()
        fetchDelegaciones()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al guardar delegación")
      }
    } catch (error) {
      console.error("Error saving delegacion:", error)
      toast.error("Error al guardar delegación")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDelegacion = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar la delegación "${nombre}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/delegaciones?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Delegación eliminada")
        fetchDelegaciones()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al eliminar delegación")
      }
    } catch (error) {
      console.error("Error deleting delegacion:", error)
      toast.error("Error al eliminar delegación")
    }
  }

  const handleAddDiaReunion = () => {
    if (!nuevoDia.dia || !nuevoDia.hora || !nuevoDia.tipo) {
      toast.error("Completa todos los campos del día de reunión")
      return
    }
    setDiasReunion([...diasReunion, nuevoDia])
    setNuevoDia({ dia: "Domingo", hora: "10:00", tipo: "Culto Principal" })
  }

  const handleRemoveDiaReunion = (index: number) => {
    setDiasReunion(diasReunion.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Gestión de Delegaciones
            </CardTitle>
            <CardDescription>
              Administra las delegaciones de VIDASCMX
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4" />
                Nueva Delegación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDelegacion ? "Editar Delegación" : "Nueva Delegación"}
                </DialogTitle>
                <DialogDescription>
                  {editingDelegacion ? "Actualiza la información" : "Completa la información"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Información Básica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="VIDA Santa Cruz - Ciudad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL amigable)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="ciudad-zona"
                      />
                      <p className="text-xs text-muted-foreground">
                        Si lo dejas vacío, se generará automáticamente
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pastor">Pastor/Encargado</Label>
                      <Input
                        id="pastor"
                        value={formData.pastor_encargado}
                        onChange={(e) => setFormData({ ...formData, pastor_encargado: e.target.value })}
                        placeholder="Nombre del pastor"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        placeholder="Describe la delegación..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Ubicación</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                        placeholder="Querétaro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado *</Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        placeholder="Querétaro"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        placeholder="Calle, número, colonia"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="mapa_embed_url">URL de Google Maps (Embed)</Label>
                      <Textarea
                        id="mapa_embed_url"
                        value={formData.mapa_embed_url}
                        onChange={(e) => setFormData({ ...formData, mapa_embed_url: e.target.value })}
                        placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450"...'
                        rows={3}
                        className="font-mono text-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        Ve a Google Maps → Busca tu ubicación → Click en "Compartir" → "Insertar un mapa" → Copia el código iframe completo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Días de reunión */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Días de Reunión
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <p className="text-xs text-muted-foreground">Agrega los horarios de tus reuniones</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Día</Label>
                        <select
                          value={nuevoDia.dia}
                          onChange={(e) => setNuevoDia({ ...nuevoDia, dia: e.target.value })}
                          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                        >
                          {DIAS_SEMANA.map(dia => (
                            <option key={dia} value={dia}>{dia}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Hora</Label>
                        <Input
                          type="time"
                          value={nuevoDia.hora}
                          onChange={(e) => setNuevoDia({ ...nuevoDia, hora: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tipo de reunión</Label>
                        <Input
                          value={nuevoDia.tipo}
                          onChange={(e) => setNuevoDia({ ...nuevoDia, tipo: e.target.value })}
                          placeholder="Ej: Culto Principal"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs invisible">Acción</Label>
                        <Button 
                          type="button" 
                          onClick={handleAddDiaReunion} 
                          className="w-full gap-2"
                          variant="default"
                        >
                          <Plus className="h-4 w-4" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {diasReunion.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Horarios agregados:</Label>
                      {diasReunion.map((dia, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{dia.dia} - {dia.hora}</p>
                              <p className="text-xs text-muted-foreground">{dia.tipo}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDiaReunion(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contacto */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Contacto</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="+52 442 123 4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="delegacion@vidasc.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">
                        <MessageCircle className="h-4 w-4 inline mr-1" />
                        WhatsApp
                      </Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="4421234567"
                      />
                    </div>
                  </div>
                </div>

                {/* Redes sociales */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Redes Sociales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">
                        <Facebook className="h-4 w-4 inline mr-1" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">
                        <Instagram className="h-4 w-4 inline mr-1" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube">
                        <Youtube className="h-4 w-4 inline mr-1" />
                        YouTube
                      </Label>
                      <Input
                        id="youtube"
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">
                        <svg className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        X (Twitter)
                      </Label>
                      <Input
                        id="twitter"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="https://x.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Imágenes */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Imágenes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imagen_portada">URL Imagen Portada</Label>
                      <Input
                        id="imagen_portada"
                        value={formData.imagen_portada}
                        onChange={(e) => setFormData({ ...formData, imagen_portada: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo">URL Logo</Label>
                      <Input
                        id="logo"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Configuración</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Delegación Activa</Label>
                      <p className="text-xs text-muted-foreground">
                        Mostrar en la página pública
                      </p>
                    </div>
                    <Switch
                      checked={formData.activa}
                      onCheckedChange={(checked) => setFormData({ ...formData, activa: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orden">Orden de Aparición</Label>
                    <Input
                      id="orden"
                      type="number"
                      value={formData.orden}
                      onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Menor número aparece primero
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveDelegacion} disabled={saving}>
                  {saving ? "Guardando..." : editingDelegacion ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Cargando delegaciones...
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Ubicación</TableHead>
                  <TableHead className="font-semibold">Pastor</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delegaciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay delegaciones creadas
                    </TableCell>
                  </TableRow>
                ) : (
                  delegaciones.map((delegacion) => (
                    <TableRow key={delegacion.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{delegacion.nombre}</span>
                          <code className="text-xs text-muted-foreground">/{delegacion.slug}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{delegacion.ciudad}, {delegacion.estado}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-xs">
                            {delegacion.direccion}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {delegacion.pastor_encargado || "—"}
                      </TableCell>
                      <TableCell>
                        {delegacion.activa ? (
                          <Badge variant="default">Activa</Badge>
                        ) : (
                          <Badge variant="secondary">Inactiva</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(delegacion)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDelegacion(delegacion.id, delegacion.nombre)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}

