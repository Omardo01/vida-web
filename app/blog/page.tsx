"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import {
  FileText,
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
  ArrowRight,
  Search,
  ExternalLink,
} from "lucide-react"

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

interface BlogPost {
  id: string
  titulo: string
  slug: string
  resumen: string
  contenido: string
  fecha_publicacion: string | null
  created_at: string
  vistas: number
  categoria: {
    id: string
    nombre: string
    slug: string
    color: string
    icono: string
  } | null
}

interface Category {
  id: string
  nombre: string
  slug: string
  color: string
  icono: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          fetch('/api/blog?limit=50'),
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
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getIconComponent = (iconName: string | null | undefined) => {
    if (!iconName || !ICON_MAP[iconName]) return FileText
    return ICON_MAP[iconName]
  }

  // Filtrar posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.resumen.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.categoria?.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
          <div className="absolute inset-0 bg-[url('/images/fondo.jpg')] bg-cover bg-center bg-no-repeat opacity-15"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Blog
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Reflexiones, enseñanzas y testimonios que edifican y fortalecen nuestra comunidad
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Filtros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10 space-y-4"
            >
              {/* Búsqueda */}
              <div className="relative max-w-md mx-auto md:mx-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-2 focus:border-primary"
                />
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >
                  Todos
                </Button>
                {categories.map((category) => {
                  const CategoryIcon = getIconComponent(category.icono)
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="gap-1.5 rounded-full"
                      style={selectedCategory === category.id ? {
                        backgroundColor: category.color,
                        borderColor: category.color,
                      } : undefined}
                    >
                      <CategoryIcon className="h-3.5 w-3.5" />
                      {category.nombre}
                    </Button>
                  )
                })}
              </div>
            </motion.div>

            {/* Grid de posts */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-16"
              >
                <Card className="max-w-md mx-auto p-8">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-xl font-medium mb-2">No se encontraron posts</p>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory 
                      ? "Intenta con otros términos de búsqueda o categoría"
                      : "Próximamente tendremos contenido para ti"
                    }
                  </p>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosts.map((post, index) => {
                  const CategoryIcon = getIconComponent(post.categoria?.icono)
                  const categoryColor = post.categoria?.color || "#3B82F6"

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-card h-full">
                          {/* Header con icono */}
                          <div 
                            className="relative aspect-[4/3] overflow-hidden"
                            style={{ 
                              background: `linear-gradient(135deg, ${categoryColor}15 0%, ${categoryColor}05 100%)` 
                            }}
                          >
                            <div className="absolute inset-0 opacity-[0.03]">
                              <div 
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: `radial-gradient(${categoryColor} 1px, transparent 1px)`,
                                  backgroundSize: '20px 20px'
                                }}
                              />
                            </div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div 
                                className="p-6 rounded-2xl transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundColor: categoryColor + "20" }}
                              >
                                <CategoryIcon 
                                  className="h-16 w-16 md:h-20 md:w-20" 
                                  style={{ color: categoryColor }}
                                  strokeWidth={1.5}
                                />
                              </div>
                            </div>

                            {post.categoria && (
                              <div className="absolute top-4 left-4">
                                <Badge 
                                  variant="secondary"
                                  className="backdrop-blur-sm font-medium shadow-sm"
                                  style={{
                                    backgroundColor: categoryColor + "90",
                                    color: "white",
                                  }}
                                >
                                  {post.categoria.nombre}
                                </Badge>
                              </div>
                            )}

                            <div className="absolute bottom-4 right-4">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full h-10 w-10 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <CardContent className="p-5 md:p-6 space-y-3">
                            <h3 className="text-lg md:text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                              {post.titulo}
                            </h3>
                            
                            <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                              {post.resumen}
                            </p>

                            <div className="pt-2 flex items-center justify-between text-sm text-muted-foreground">
                              <span>{formatDate(post.fecha_publicacion || post.created_at)}</span>
                              <span className="text-primary font-medium flex items-center gap-1">
                                Leer más
                                <ExternalLink className="h-3 w-3" />
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
