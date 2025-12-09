"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileText,
  Tag,
  Eye,
  EyeOff,
  Mic,
  BookOpen,
  Heart,
  Lightbulb,
  Bell,
  Newspaper,
  BookMarked,
  MessageSquare,
  Music,
  Video,
  Users,
  Calendar,
  Star,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import { BlogCategoryEditor } from "./blog-category-editor"
import Link from "next/link"

// Mapa de iconos
const ICON_MAP: Record<string, any> = {
  FileText,
  Mic,
  BookOpen,
  BookMarked,
  Heart,
  Lightbulb,
  Bell,
  Newspaper,
  MessageSquare,
  Music,
  Video,
  Users,
  Calendar,
  Star,
}

interface Category {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  color: string
  icono: string
}

interface Post {
  id: string
  titulo: string
  slug: string
  contenido: string
  resumen: string
  autor_id: string
  autor_email: string
  categoria_id: string | null
  categoria_nombre: string | null
  categoria_slug: string | null
  categoria_color: string | null
  categoria_icono: string | null
  publicado: boolean
  fecha_publicacion: string | null
  vistas: number
  created_at: string
  updated_at: string
}

export function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'post' | 'category', id: string, name: string } | null>(null)

  // Cargar datos
  const fetchData = async () => {
    setLoading(true)
    try {
      const [postsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/blog/posts'),
        fetch('/api/admin/blog/categories'),
      ])

      if (postsRes.ok) {
        const { posts: fetchedPosts } = await postsRes.json()
        setPosts(fetchedPosts || [])
      }

      if (categoriesRes.ok) {
        const { categories: fetchedCategories } = await categoriesRes.json()
        setCategories(fetchedCategories || [])
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

  // Handlers
  const handleNewCategory = () => {
    setEditingCategory(null)
    setCategoryEditorOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryEditorOpen(true)
  }

  const handleDeleteConfirm = (type: 'post' | 'category', id: string, name: string) => {
    setItemToDelete({ type, id, name })
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      const url = itemToDelete.type === 'post' 
        ? `/api/admin/blog/posts?id=${itemToDelete.id}`
        : `/api/admin/blog/categories?id=${itemToDelete.id}`

      const response = await fetch(url, { method: 'DELETE' })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar')
      }

      toast.success(
        itemToDelete.type === 'post' 
          ? 'Post eliminado exitosamente'
          : 'Categoría eliminada exitosamente'
      )
      fetchData()
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error(error instanceof Error ? error.message : 'Error al eliminar')
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getIconComponent = (iconName: string | null) => {
    if (!iconName || !ICON_MAP[iconName]) return FileText
    return ICON_MAP[iconName]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="posts" className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="posts" className="gap-2">
              <FileText className="h-4 w-4" />
              Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tag className="h-4 w-4" />
              Categorías ({categories.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab de Posts */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Gestiona los posts publicados y borradores
            </p>
            <Button asChild className="gap-2">
              <Link href="/admin/blog/nuevo">
                <Plus className="h-4 w-4" />
                Nuevo Post
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-lg border-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Título</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden md:table-cell">Fecha</TableHead>
                      <TableHead className="hidden lg:table-cell">Vistas</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground mb-4">No hay posts aún. ¡Crea el primero!</p>
                          <Button asChild>
                            <Link href="/admin/blog/nuevo">
                              <Plus className="h-4 w-4 mr-2" />
                              Crear Post
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      posts.map((post) => {
                        const CategoryIcon = getIconComponent(post.categoria_icono)
                        return (
                          <TableRow key={post.id} className="hover:bg-muted/30">
                            <TableCell>
                              <Link 
                                href={`/admin/blog/${post.id}/editar`}
                                className="hover:text-primary transition-colors"
                              >
                                <div className="font-medium line-clamp-1">{post.titulo}</div>
                                <div className="text-xs text-muted-foreground hidden sm:block">
                                  /{post.slug}
                                </div>
                              </Link>
                            </TableCell>
                            <TableCell>
                              {post.categoria_nombre ? (
                                <Badge
                                  variant="secondary"
                                  className="gap-1"
                                  style={{
                                    backgroundColor: post.categoria_color + "20",
                                    color: post.categoria_color || undefined,
                                  }}
                                >
                                  <CategoryIcon className="h-3 w-3" />
                                  {post.categoria_nombre}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Sin categoría</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {post.publicado ? (
                                <Badge className="bg-green-500/10 text-green-600 gap-1">
                                  <Eye className="h-3 w-3" />
                                  Publicado
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  <EyeOff className="h-3 w-3" />
                                  Borrador
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              {formatDate(post.fecha_publicacion || post.created_at)}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground">
                              {post.vistas}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/blog/${post.id}/editar`}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Editar
                                    </Link>
                                  </DropdownMenuItem>
                                  {post.publicado && (
                                    <DropdownMenuItem asChild>
                                      <Link href={`/blog/${post.slug}`} target="_blank">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Ver en Blog
                                      </Link>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteConfirm('post', post.id, post.titulo)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Categorías */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Organiza los posts por categorías con iconos personalizados
            </p>
            <Button onClick={handleNewCategory} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Categoría
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">No hay categorías. ¡Crea la primera!</p>
                  <Button onClick={handleNewCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Categoría
                  </Button>
                </CardContent>
              </Card>
            ) : (
              categories.map((category) => {
                const CategoryIcon = getIconComponent(category.icono)
                return (
                  <Card key={category.id} className="relative group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2.5 rounded-lg shrink-0"
                          style={{ backgroundColor: category.color + "20" }}
                        >
                          <CategoryIcon
                            className="h-5 w-5"
                            style={{ color: category.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{category.nombre}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.descripcion || "Sin descripción"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteConfirm('category', category.id, category.nombre)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Editor de categorías (modal) */}
      <BlogCategoryEditor
        open={categoryEditorOpen}
        onOpenChange={setCategoryEditorOpen}
        category={editingCategory}
        onSaved={fetchData}
      />

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente
              {itemToDelete?.type === 'post' ? ' el post' : ' la categoría'}{" "}
              <strong>"{itemToDelete?.name}"</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
