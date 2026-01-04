"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Eye, EyeOff, Loader2, FileText, Mic, BookOpen, Heart, Lightbulb, Bell, Newspaper, BookMarked, MessageSquare, Music, Video, Users, Calendar, Star } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const ICON_MAP: Record<string, any> = {
  FileText, Mic, BookOpen, BookMarked, Heart, Lightbulb, Bell, Newspaper, MessageSquare, Music, Video, Users, Calendar, Star,
}

interface Category {
  id: string
  nombre: string
  slug: string
  color: string
  icono: string
}

export default function NuevoPostPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  // Form state
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [resumen, setResumen] = useState("")
  const [categoriaId, setCategoriaId] = useState<string>("none")
  const [publicado, setPublicado] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/blog/categories')
        if (res.ok) {
          const { categories } = await res.json()
          setCategories(categories || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!titulo.trim() || !contenido.trim()) {
      toast.error("El título y contenido son obligatorios")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.trim(),
          contenido: contenido.trim(),
          resumen: resumen.trim() || contenido.substring(0, 200).trim() + '...',
          categoria_id: categoriaId === "none" ? null : categoriaId,
          publicado,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear el post')
      }

      toast.success('Post creado exitosamente')
      router.push('/admin?tab=blog')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear el post')
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = categories.find(c => c.id === categoriaId)
  const CategoryIcon = selectedCategory ? ICON_MAP[selectedCategory.icono] || FileText : FileText

  if (authLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin?tab=blog">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Nuevo Post</h1>
                <p className="text-sm text-muted-foreground">Crea un nuevo artículo para el blog</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={publicado ? "default" : "secondary"} className="gap-1">
                {publicado ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {publicado ? "Publicar" : "Borrador"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Editor Principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contenido</CardTitle>
                  <CardDescription>Escribe el contenido de tu post</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Título */}
                  <div className="space-y-2">
                    <Label htmlFor="titulo" className="text-base font-semibold">Título *</Label>
                    <Input
                      id="titulo"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Escribe un título llamativo..."
                      className="text-xl h-14 font-semibold"
                      required
                    />
                  </div>

                  {/* Resumen */}
                  <div className="space-y-2">
                    <Label htmlFor="resumen" className="text-base font-semibold">Resumen</Label>
                    <Textarea
                      id="resumen"
                      value={resumen}
                      onChange={(e) => setResumen(e.target.value)}
                      placeholder="Breve descripción que aparecerá en la vista previa..."
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Si lo dejas vacío, se usarán los primeros 200 caracteres del contenido.
                    </p>
                  </div>

                  {/* Contenido */}
                  <div className="space-y-2">
                    <Label htmlFor="contenido" className="text-base font-semibold">Contenido * (Markdown)</Label>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
                      <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">💡 Importante para Markdown:</p>
                      <ul className="text-amber-700 dark:text-amber-300 text-xs space-y-0.5">
                        <li>• Usa <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded"># Título</code> con espacio después del #</li>
                        <li>• Cada elemento de lista en su propia línea</li>
                        <li>• Deja una línea en blanco entre secciones</li>
                        <li>• Usa <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">&lt;br /&gt;</code> para saltos de línea extra</li>
                      </ul>
                    </div>
                    <Textarea
                      id="contenido"
                      value={contenido}
                      onChange={(e) => setContenido(e.target.value)}
                      placeholder={`# Título Principal

Este es un párrafo normal con **texto en negrita** y *texto en cursiva*.

## Subtítulo

Otro párrafo aquí. Recuerda dejar líneas en blanco entre secciones.

### Lista de puntos:

- Primer elemento
- Segundo elemento  
- Tercer elemento

### Lista numerada:

1. Paso uno
2. Paso dos
3. Paso tres

> Esto es una cita o texto destacado.
> Puede tener varias líneas.

[Texto del enlace](https://ejemplo.com)

---

Texto después del separador.`}
                      rows={20}
                      className="font-mono text-sm leading-relaxed resize-none"
                      required
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Soporta formato Markdown</span>
                      <span>{contenido.split(/\s+/).filter(Boolean).length} palabras</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">
              {/* Publicación */}
              <Card>
                <CardHeader>
                  <CardTitle>Publicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="publicado" className="text-base font-medium">
                        Publicar ahora
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {publicado 
                          ? "El post será visible para todos"
                          : "Guardar como borrador"
                        }
                      </p>
                    </div>
                    <Switch
                      id="publicado"
                      checked={publicado}
                      onCheckedChange={setPublicado}
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {publicado ? "Publicar Post" : "Guardar Borrador"}
                  </Button>
                </CardContent>
              </Card>

              {/* Categoría */}
              <Card>
                <CardHeader>
                  <CardTitle>Categoría</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={categoriaId} onValueChange={setCategoriaId}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          Sin categoría
                        </div>
                      </SelectItem>
                      {categories.map((cat) => {
                        const Icon = ICON_MAP[cat.icono] || FileText
                        return (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" style={{ color: cat.color }} />
                              {cat.nombre}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

                  {/* Preview de categoría */}
                  {selectedCategory && (
                    <div 
                      className="p-4 rounded-lg flex items-center gap-3"
                      style={{ backgroundColor: selectedCategory.color + "15" }}
                    >
                      <CategoryIcon 
                        className="h-8 w-8" 
                        style={{ color: selectedCategory.color }}
                      />
                      <div>
                        <p className="font-medium">{selectedCategory.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          Este icono se mostrará en la tarjeta
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guía Markdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Guía Markdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded">**negrita**</code>
                    <span className="text-muted-foreground">→ <strong>negrita</strong></span>
                    
                    <code className="bg-muted px-2 py-1 rounded">*cursiva*</code>
                    <span className="text-muted-foreground">→ <em>cursiva</em></span>
                    
                    <code className="bg-muted px-2 py-1 rounded"># Título</code>
                    <span className="text-muted-foreground">→ Título grande</span>
                    
                    <code className="bg-muted px-2 py-1 rounded">## Subtítulo</code>
                    <span className="text-muted-foreground">→ Subtítulo</span>
                    
                    <code className="bg-muted px-2 py-1 rounded">- item</code>
                    <span className="text-muted-foreground">→ • Lista</span>
                    
                    <code className="bg-muted px-2 py-1 rounded">1. item</code>
                    <span className="text-muted-foreground">→ 1. Numerada</span>
                    
                    <code className="bg-muted px-2 py-1 rounded">&gt; cita</code>
                    <span className="text-muted-foreground">→ Cita</span>
                    
                    <code className="bg-muted px-2 py-1 rounded">[texto](url)</code>
                    <span className="text-muted-foreground">→ Enlace</span>
                    
                    <code className="bg-muted px-2 py-1 rounded">---</code>
                    <span className="text-muted-foreground">→ Separador</span>

                    <code className="bg-muted px-2 py-1 rounded">&lt;br /&gt;</code>
                    <span className="text-muted-foreground">→ Salto extra</span>
                  </div>
                </CardContent>
              </Card>

              {/* Vista Previa */}
              <Card>
                <CardHeader>
                  <CardTitle>Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <div 
                      className="aspect-video flex items-center justify-center"
                      style={{ 
                        background: selectedCategory 
                          ? `linear-gradient(135deg, ${selectedCategory.color}15 0%, ${selectedCategory.color}05 100%)`
                          : 'linear-gradient(135deg, #3B82F615 0%, #3B82F605 100%)'
                      }}
                    >
                      <div 
                        className="p-4 rounded-xl"
                        style={{ 
                          backgroundColor: (selectedCategory?.color || "#3B82F6") + "20" 
                        }}
                      >
                        <CategoryIcon 
                          className="h-12 w-12" 
                          style={{ color: selectedCategory?.color || "#3B82F6" }}
                        />
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="font-semibold line-clamp-2">
                        {titulo || "Título del post"}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resumen || contenido.substring(0, 100) || "Resumen del post..."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

