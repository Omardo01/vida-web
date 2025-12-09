"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Category {
  id: string
  nombre: string
  slug: string
  color: string
  icono: string
}

interface Post {
  id: string
  titulo: string
  slug: string
  contenido: string
  resumen: string
  categoria_id: string | null
  publicado: boolean
}

interface BlogPostEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: Post | null
  categories: Category[]
  onSaved: () => void
}

export function BlogPostEditor({
  open,
  onOpenChange,
  post,
  categories,
  onSaved,
}: BlogPostEditorProps) {
  const [loading, setLoading] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [resumen, setResumen] = useState("")
  const [categoriaId, setCategoriaId] = useState<string>("none")
  const [publicado, setPublicado] = useState(false)

  // Cargar datos del post cuando se edita
  useEffect(() => {
    if (post) {
      setTitulo(post.titulo || "")
      setContenido(post.contenido || "")
      setResumen(post.resumen || "")
      setCategoriaId(post.categoria_id || "none")
      setPublicado(post.publicado || false)
    } else {
      // Limpiar formulario para nuevo post
      setTitulo("")
      setContenido("")
      setResumen("")
      setCategoriaId("none")
      setPublicado(false)
    }
  }, [post, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!titulo.trim() || !contenido.trim()) {
      toast.error("El título y contenido son obligatorios")
      return
    }

    setLoading(true)

    try {
      const url = '/api/admin/blog/posts'
      const method = post ? 'PUT' : 'POST'
      const body = {
        ...(post ? { id: post.id } : {}),
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        resumen: resumen.trim() || contenido.substring(0, 200).trim() + '...',
        categoria_id: categoriaId === "none" ? null : categoriaId,
        publicado,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar el post')
      }

      toast.success(post ? 'Post actualizado exitosamente' : 'Post creado exitosamente')
      onSaved()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error(error instanceof Error ? error.message : 'Error al guardar el post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {post ? "Editar Post" : "Nuevo Post"}
          </DialogTitle>
          <DialogDescription>
            {post 
              ? "Modifica los campos del post y guarda los cambios"
              : "Crea un nuevo post para el blog"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del post"
              required
            />
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin categoría</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.nombre}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resumen */}
          <div className="space-y-2">
            <Label htmlFor="resumen">Resumen</Label>
            <Textarea
              id="resumen"
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="Breve descripción del post (se generará automáticamente si se deja vacío)"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Si lo dejas vacío, se usarán los primeros 200 caracteres del contenido.
            </p>
          </div>

          {/* Contenido */}
          <div className="space-y-2">
            <Label htmlFor="contenido">Contenido *</Label>
            <Textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe el contenido del post..."
              rows={12}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Puedes usar saltos de línea para separar párrafos.
            </p>
          </div>

          {/* Publicar */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="publicado" className="text-base">
                Publicar
              </Label>
              <p className="text-sm text-muted-foreground">
                {publicado 
                  ? "El post será visible para todos"
                  : "El post quedará como borrador"
                }
              </p>
            </div>
            <Switch
              id="publicado"
              checked={publicado}
              onCheckedChange={setPublicado}
            />
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
              {post ? "Guardar cambios" : "Crear post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

