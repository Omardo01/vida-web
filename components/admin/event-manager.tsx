"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  MapPin,
  Clock,
  X,
} from "lucide-react"
import { toast } from "sonner"

interface Role {
  id: string
  name: string
  display_name: string
  color: string
}

interface EventRole {
  role_id: string
  roles: Role
}

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  start_date: string
  end_date: string | null
  all_day: boolean
  event_type: string
  color: string
  is_public: boolean
  visible_to_all_roles: boolean
  is_active: boolean
  is_cancelled: boolean
  created_at: string
  event_roles: EventRole[]
}

const eventTypes = [
  { value: "general", label: "General", color: "#3B82F6" },
  { value: "servicio", label: "Servicio", color: "#F59E0B" },
  { value: "celula", label: "Célula", color: "#10B981" },
  { value: "reunion", label: "Reunión", color: "#8B5CF6" },
  { value: "ensayo", label: "Ensayo", color: "#EC4899" },
  { value: "curso", label: "Curso", color: "#06B6D4" },
  { value: "actividad", label: "Actividad", color: "#EF4444" },
  { value: "conferencia", label: "Conferencia", color: "#6366F1" },
]

const defaultColors = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
  "#8B5CF6", "#EC4899", "#06B6D4", "#6366F1",
]

export function EventManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    all_day: false,
    event_type: "general",
    color: "#3B82F6",
    is_public: false,
    visible_to_all_roles: true,
    role_ids: [] as string[],
  })

  useEffect(() => {
    fetchEvents()
    fetchRoles()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events?includeInactive=true")
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        toast.error("Error al cargar eventos")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Error al cargar eventos")
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles")
      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles || [])
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      all_day: false,
      event_type: "general",
      color: "#3B82F6",
      is_public: false,
      visible_to_all_roles: true,
      role_ids: [],
    })
    setEditingEvent(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (event: Event) => {
    const startDate = new Date(event.start_date)
    const endDate = event.end_date ? new Date(event.end_date) : null

    setFormData({
      title: event.title,
      description: event.description || "",
      location: event.location || "",
      start_date: startDate.toISOString().split("T")[0],
      start_time: event.all_day ? "" : startDate.toTimeString().slice(0, 5),
      end_date: endDate ? endDate.toISOString().split("T")[0] : "",
      end_time: endDate && !event.all_day ? endDate.toTimeString().slice(0, 5) : "",
      all_day: event.all_day,
      event_type: event.event_type,
      color: event.color,
      is_public: event.is_public,
      visible_to_all_roles: event.visible_to_all_roles,
      role_ids: event.event_roles?.map((er) => er.role_id) || [],
    })
    setEditingEvent(event)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.start_date) {
      toast.error("Título y fecha de inicio son requeridos")
      return
    }

    setSaving(true)

    try {
      // Construir fecha/hora de inicio
      let startDateTime = formData.start_date
      if (!formData.all_day && formData.start_time) {
        startDateTime = `${formData.start_date}T${formData.start_time}:00`
      } else {
        startDateTime = `${formData.start_date}T00:00:00`
      }

      // Construir fecha/hora de fin
      let endDateTime = null
      if (formData.end_date) {
        if (!formData.all_day && formData.end_time) {
          endDateTime = `${formData.end_date}T${formData.end_time}:00`
        } else {
          endDateTime = `${formData.end_date}T23:59:59`
        }
      }

      const payload = {
        id: editingEvent?.id,
        title: formData.title,
        description: formData.description || null,
        location: formData.location || null,
        start_date: startDateTime,
        end_date: endDateTime,
        all_day: formData.all_day,
        event_type: formData.event_type,
        color: formData.color,
        is_public: formData.is_public,
        visible_to_all_roles: formData.visible_to_all_roles,
        role_ids: formData.visible_to_all_roles ? [] : formData.role_ids,
      }

      const response = await fetch("/api/admin/events", {
        method: editingEvent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(editingEvent ? "Evento actualizado" : "Evento creado")
        setDialogOpen(false)
        resetForm()
        fetchEvents()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al guardar evento")
      }
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("Error al guardar evento")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return

    try {
      const response = await fetch(`/api/admin/events?id=${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Evento eliminado")
        fetchEvents()
      } else {
        toast.error("Error al eliminar evento")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Error al eliminar evento")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEventTypeLabel = (type: string) => {
    return eventTypes.find((t) => t.value === type)?.label || type
  }

  const toggleRoleSelection = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((id) => id !== roleId)
        : [...prev.role_ids, roleId],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Gestión de Eventos
            </CardTitle>
            <CardDescription>
              Crea y administra eventos del calendario
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Cargando eventos...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin eventos</h3>
            <p className="text-muted-foreground mb-4">
              No hay eventos creados. Crea el primer evento.
            </p>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Evento
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Evento</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Visibilidad</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: event.color }}
                        />
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {getEventTypeLabel(event.event_type)}
                            </Badge>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(event.start_date)}</p>
                        {!event.all_day && (
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(event.start_date)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.is_public ? (
                        <Badge variant="default" className="gap-1">
                          <Eye className="h-3 w-3" />
                          Público
                        </Badge>
                      ) : event.visible_to_all_roles ? (
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          Todos los roles
                        </Badge>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {event.event_roles?.slice(0, 2).map((er) => (
                            <Badge
                              key={er.role_id}
                              variant="outline"
                              style={{
                                borderColor: er.roles?.color,
                                color: er.roles?.color,
                              }}
                            >
                              {er.roles?.display_name}
                            </Badge>
                          ))}
                          {event.event_roles?.length > 2 && (
                            <Badge variant="outline">
                              +{event.event_roles.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {event.is_cancelled ? (
                        <Badge variant="destructive">Cancelado</Badge>
                      ) : !event.is_active ? (
                        <Badge variant="secondary">Inactivo</Badge>
                      ) : (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          Activo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(event)}
                          title="Editar evento"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(event.id)}
                          title="Eliminar evento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialog para crear/editar evento */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}
              </DialogTitle>
              <DialogDescription>
                {editingEvent
                  ? "Modifica los detalles del evento"
                  : "Completa los detalles del nuevo evento"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Nombre del evento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe el evento"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Lugar del evento"
                  />
                </div>
              </div>

              {/* Fecha y hora */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="all_day"
                    checked={formData.all_day}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, all_day: checked })
                    }
                  />
                  <Label htmlFor="all_day">Todo el día</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Fecha de inicio *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                    />
                  </div>
                  {!formData.all_day && (
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Hora de inicio</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) =>
                          setFormData({ ...formData, start_time: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Fecha de fin</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                    />
                  </div>
                  {!formData.all_day && (
                    <div className="space-y-2">
                      <Label htmlFor="end_time">Hora de fin</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) =>
                          setFormData({ ...formData, end_time: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tipo y color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de evento</Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        event_type: value,
                        color:
                          eventTypes.find((t) => t.value === value)?.color ||
                          formData.color,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: type.color }}
                            />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {defaultColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-md border-2 transition-all ${
                          formData.color === color
                            ? "border-primary scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Visibilidad */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Visibilidad del evento</h4>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        is_public: checked,
                        visible_to_all_roles: checked ? true : formData.visible_to_all_roles,
                      })
                    }
                  />
                  <Label htmlFor="is_public">
                    Evento público (visible para todos, incluso sin cuenta)
                  </Label>
                </div>

                {!formData.is_public && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="visible_to_all_roles"
                        checked={formData.visible_to_all_roles}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, visible_to_all_roles: checked })
                        }
                      />
                      <Label htmlFor="visible_to_all_roles">
                        Visible para todos los usuarios con rol asignado
                      </Label>
                    </div>

                    {!formData.visible_to_all_roles && (
                      <div className="space-y-2">
                        <Label>Roles que pueden ver este evento</Label>
                        <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg max-h-48 overflow-y-auto">
                          {roles.map((role) => (
                            <div
                              key={role.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`role-${role.id}`}
                                checked={formData.role_ids.includes(role.id)}
                                onCheckedChange={() => toggleRoleSelection(role.id)}
                              />
                              <label
                                htmlFor={`role-${role.id}`}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: role.color }}
                                />
                                {role.display_name}
                              </label>
                            </div>
                          ))}
                        </div>
                        {formData.role_ids.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Selecciona al menos un rol
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
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
              <Button onClick={handleSubmit} disabled={saving}>
                {saving
                  ? "Guardando..."
                  : editingEvent
                  ? "Actualizar"
                  : "Crear Evento"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
