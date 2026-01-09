"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TextAnimate } from "@/components/ui/text-animate"
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
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// Mapa de iconos para renderizar dinámicamente
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

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog?limit=3')
        if (response.ok) {
          const { posts: fetchedPosts } = await response.json()
          setPosts(fetchedPosts || [])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
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

  // Skeleton de carga
  if (loading) {
    return (
      <section id="blog" className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 md:p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Sin posts
  if (posts.length === 0) {
    return (
      <section id="blog" className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <TextAnimate
              animation="blurInUp"
              by="word"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-balance"
            >
              Reflexiones y Enseñanzas
            </TextAnimate>
            <TextAnimate
              animation="fadeIn"
              by="word"
              delay={0.3}
              as="p"
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4"
            >
              Comparte nuestro caminar de fe a través de reflexiones, enseñanzas y testimonios que edifican y fortalecen nuestra comunidad
            </TextAnimate>
          </div>
          
          <Card className="max-w-md mx-auto text-center p-8">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Próximamente tendremos contenido para ti.
            </p>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Título de la sección con animación */}
        <div className="text-center mb-10 md:mb-16">
          <TextAnimate
            animation="blurInUp"
            by="word"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-balance"
          >
            Reflexiones y Enseñanzas
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            by="word"
            delay={0.3}
            as="p"
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4"
          >
            Comparte nuestro caminar de fe a través de reflexiones, enseñanzas y testimonios que edifican y fortalecen nuestra comunidad
          </TextAnimate>
        </div>

        {/* Grid de posts - Estilo tarjeta con icono */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
          {posts.slice(0, 3).map((post) => {
            const CategoryIcon = getIconComponent(post.categoria?.icono)
            const categoryColor = post.categoria?.color || "#3B82F6"

            return (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card 
                  className="group h-full relative overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-card cursor-pointer"
                >
                  {/* Header con icono de categoría - Estilo similar a la imagen */}
                  <div 
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${categoryColor}15 0%, ${categoryColor}05 100%)` 
                    }}
                  >
                    {/* Patrón decorativo de fondo */}
                    <div className="absolute inset-0 opacity-[0.03]">
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `radial-gradient(${categoryColor} 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}
                      />
                    </div>
                    
                    {/* Icono central grande */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="p-6 rounded-2xl transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundColor: categoryColor + "20" }}
                      >
                        <CategoryIcon 
                          className="h-16 w-16 md:h-20 md:w-20 transition-all duration-500" 
                          style={{ color: categoryColor }}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Badge de categoría en esquina */}
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

                    {/* Botón de flecha - Estilo de la imagen */}
                    <div className="absolute bottom-4 right-4">
                      <div
                        className="flex items-center justify-center rounded-full h-10 w-10 bg-white/90 group-hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                      >
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <CardContent className="p-5 md:p-6 space-y-3">
                    <h3 className="text-lg md:text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {post.titulo}
                    </h3>
                    
                    <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.resumen}
                    </p>

                    {/* Footer con fecha */}
                    <div className="pt-2 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatDate(post.fecha_publicacion || post.created_at)}</span>
                      <div
                        className="text-primary font-medium flex items-center gap-1 group-hover:underline decoration-2 underline-offset-4"
                      >
                        Leer más
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Botón para ver todos */}
        <div className="text-center">
          <Link href="/blog">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto px-8 py-5 md:py-6 text-sm md:text-base gap-2"
            >
              Ver Todos los Posts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
