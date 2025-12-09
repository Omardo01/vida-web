"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, FileText, Mic, BookOpen, Heart, Lightbulb, Bell, Newspaper, BookMarked, MessageSquare, Music, Video, Users, Calendar, Star } from "lucide-react"
import { toast } from "sonner"

// Iconos disponibles para categorías
const AVAILABLE_ICONS = [
  { name: "FileText", label: "Documento", icon: FileText },
  { name: "Mic", label: "Micrófono", icon: Mic },
  { name: "BookOpen", label: "Libro Abierto", icon: BookOpen },
  { name: "BookMarked", label: "Libro Marcado", icon: BookMarked },
  { name: "Heart", label: "Corazón", icon: Heart },
  { name: "Lightbulb", label: "Bombilla", icon: Lightbulb },
  { name: "Bell", label: "Campana", icon: Bell },
  { name: "Newspaper", label: "Periódico", icon: Newspaper },
  { name: "MessageSquare", label: "Mensaje", icon: MessageSquare },
  { name: "Music", label: "Música", icon: Music },
  { name: "Video", label: "Video", icon: Video },
  { name: "Users", label: "Usuarios", icon: Users },
  { name: "Calendar", label: "Calendario", icon: Calendar },
  { name: "Star", label: "Estrella", icon: Star },
]

// Colores predefinidos
const PRESET_COLORS = [
  "#8B5CF6", // Violeta
  "#3B82F6", // Azul
  "#059669", // Verde
  "#F59E0B", // Amarillo
  "#EF4444", // Rojo
  "#EC4899", // Rosa
  "#06B6D4", // Cyan
  "#F97316", // Naranja
  "#6366F1", // Índigo
  "#14B8A6", // Teal
]

interface Category {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  color: string
  icono: string
}

interface BlogCategoryEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSaved: () => void
}

export function BlogCategoryEditor({
  open,
  onOpenChange,
  category,
  onSaved,
}: BlogCategoryEditorProps) {
  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [color, setColor] = useState("#3B82F6")
  const [icono, setIcono] = useState("FileText")

  // Cargar datos cuando se edita
  useEffect(() => {
    if (category) {
      setNombre(category.nombre || "")
      setDescripcion(category.descripcion || "")
      setColor(category.color || "#3B82F6")
      setIcono(category.icono || "FileText")
    } else {
      setNombre("")
      setDescripcion("")
      setColor("#3B82F6")
      setIcono("FileText")
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre.trim()) {
      toast.error("El nombre de la categoría es obligatorio")
      return
    }

    setLoading(true)

    try {
      const url = '/api/admin/blog/categories'
      const method = category ? 'PUT' : 'POST'
      const body = {
        ...(category ? { id: category.id } : {}),
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        color,
        icono,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar la categoría')
      }

      toast.success(category ? 'Categoría actualizada' : 'Categoría creada')
      onSaved()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error(error instanceof Error ? error.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const IconPreview = AVAILABLE_ICONS.find(i => i.name === icono)?.icon || FileText

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
          <DialogDescription>
            {category 
              ? "Modifica los datos de la categoría"
              : "Crea una nueva categoría para organizar los posts"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview */}
          <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: color + "20" }}
              >
                <IconPreview className="h-8 w-8" style={{ color }} />
              </div>
              <div>
                <p className="font-semibold">{nombre || "Nombre de categoría"}</p>
                <p className="text-sm text-muted-foreground">
                  {descripcion || "Descripción de la categoría"}
                </p>
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Predicaciones"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción de la categoría"
              rows={2}
            />
          </div>

          {/* Icono */}
          <div className="space-y-2">
            <Label>Icono</Label>
            <Select value={icono} onValueChange={setIcono}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <IconPreview className="h-4 w-4" />
                    {AVAILABLE_ICONS.find(i => i.name === icono)?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ICONS.map((iconOption) => {
                  const Icon = iconOption.icon
                  return (
                    <SelectItem key={iconOption.name} value={iconOption.name}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {iconOption.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === presetColor ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Label htmlFor="customColor" className="text-sm">
                O personalizado:
              </Label>
              <Input
                id="customColor"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-8 p-0.5 cursor-pointer"
              />
              <span className="text-sm text-muted-foreground font-mono">
                {color}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

