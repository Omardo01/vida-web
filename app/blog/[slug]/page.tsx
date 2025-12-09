"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useScroll, useSpring } from "motion/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  ArrowLeft,
  Clock,
  Eye,
  ChevronUp,
  Share2,
} from "lucide-react"

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

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Progreso de lectura
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch('/api/blog?limit=100')
        if (response.ok) {
          const { posts } = await response.json()
          const foundPost = posts.find((p: BlogPost) => p.slug === params.slug)
          if (foundPost) {
            setPost(foundPost)
          } else {
            setError(true)
          }
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  // Mostrar botón de scroll top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getIconComponent = (iconName: string | null | undefined) => {
    if (!iconName || !ICON_MAP[iconName]) return FileText
    return ICON_MAP[iconName]
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <Skeleton className="h-[400px] w-full" />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="max-w-md text-center p-8">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Post no encontrado</h1>
              <p className="text-muted-foreground mb-6">
                El artículo que buscas no existe o ha sido eliminado.
              </p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al blog
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </>
    )
  }

  const CategoryIcon = getIconComponent(post.categoria?.icono)
  const categoryColor = post.categoria?.color || "#3B82F6"
  const readTime = calculateReadTime(post.contenido)

  return (
    <>
      <Header />
      
      {/* Barra de progreso de lectura */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
        style={{ 
          scaleX,
          backgroundColor: categoryColor,
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero/Portada compacta con Icono */}
        <section 
          className="relative py-10 md:py-14 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${categoryColor}12 0%, ${categoryColor}05 100%)` 
          }}
        >
          {/* Patrón de fondo sutil */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(${categoryColor} 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Navegación */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Volver al blog
            </Link>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Icono de categoría */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-shrink-0"
              >
                <div 
                  className="inline-flex p-5 md:p-6 rounded-2xl"
                  style={{ 
                    backgroundColor: categoryColor + "15",
                    boxShadow: `0 10px 30px -10px ${categoryColor}25`
                  }}
                >
                  <CategoryIcon 
                    className="h-12 w-12 md:h-16 md:w-16" 
                    style={{ color: categoryColor }}
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>

              {/* Info del post */}
              <div className="flex-1">
                {/* Badge de categoría */}
                {post.categoria && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mb-2"
                  >
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium"
                      style={{
                        backgroundColor: categoryColor + "20",
                        color: categoryColor,
                      }}
                    >
                      {post.categoria.nombre}
                    </Badge>
                  </motion.div>
                )}

                {/* Título */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight text-foreground"
                >
                  {post.titulo}
                </motion.h1>

                {/* Meta info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.fecha_publicacion || post.created_at)}
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {readTime} min
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    {post.vistas} vistas
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido del artículo */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              {/* Resumen destacado */}
              {post.resumen && (
                <div 
                  className="mb-12 p-6 md:p-8 rounded-2xl border-l-4"
                  style={{ 
                    borderColor: categoryColor,
                    backgroundColor: categoryColor + "08"
                  }}
                >
                  <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                    {post.resumen}
                  </p>
                </div>
              )}

              {/* Contenido Markdown con estilos mejorados */}
              <div 
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mt-12 prose-h1:mb-6
                  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
                  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-foreground/85 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-[17px]
                  prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-em:italic
                  prose-ul:my-6 prose-ul:space-y-2
                  prose-ol:my-6 prose-ol:space-y-2
                  prose-li:text-foreground/85 prose-li:leading-relaxed prose-li:text-[17px]
                  prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:my-8 prose-blockquote:rounded-r-lg
                  prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-muted prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:shadow-inner
                  prose-hr:my-12 prose-hr:border-border
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-table:border-collapse prose-table:w-full prose-table:rounded-lg prose-table:overflow-hidden
                  prose-th:border prose-th:border-border prose-th:p-4 prose-th:bg-muted prose-th:font-semibold
                  prose-td:border prose-td:border-border prose-td:p-4
                "
                style={{ 
                  '--tw-prose-headings': categoryColor,
                  '--tw-prose-links': categoryColor,
                  '--tw-prose-quote-borders': categoryColor,
                  '--tw-prose-bullets': categoryColor,
                  '--tw-prose-counters': categoryColor,
                } as React.CSSProperties}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
                      <h1 {...props} style={{ color: categoryColor }}>{children}</h1>
                    ),
                    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
                      <h2 {...props} style={{ color: categoryColor }}>{children}</h2>
                    ),
                    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
                      <h3 {...props} style={{ color: categoryColor }}>{children}</h3>
                    ),
                    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement> & { children?: React.ReactNode }) => (
                      <blockquote 
                        {...props} 
                        style={{ 
                          borderColor: categoryColor,
                          backgroundColor: categoryColor + "08"
                        }}
                        className="text-foreground/80"
                      >
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        {...props}
                        style={{ color: categoryColor }}
                      >
                        {children}
                      </a>
                    ),
                    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement> & { children?: React.ReactNode }) => (
                      <ul {...props} className="list-none space-y-3">
                        {children}
                      </ul>
                    ),
                    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement> & { children?: React.ReactNode }) => (
                      <li {...props} className="flex items-start gap-3">
                        <span 
                          className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoryColor }}
                        />
                        <span>{children}</span>
                      </li>
                    ),
                    hr: ({ ...props }) => (
                      <hr 
                        {...props} 
                        className="my-12 border-0 h-px"
                        style={{ 
                          background: `linear-gradient(to right, transparent, ${categoryColor}40, transparent)` 
                        }}
                      />
                    ),
                  }}
                >
                  {post.contenido}
                </ReactMarkdown>
              </div>

              {/* Footer del artículo */}
              <motion.footer 
                className="mt-16 pt-8 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                {/* Tags/Categoría */}
                {post.categoria && (
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-sm text-muted-foreground">Categoría:</span>
                    <Badge
                      variant="secondary"
                      className="gap-1.5"
                      style={{
                        backgroundColor: categoryColor + "15",
                        color: categoryColor,
                      }}
                    >
                      <CategoryIcon className="h-3.5 w-3.5" />
                      {post.categoria.nombre}
                    </Badge>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link href="/blog">
                    <Button variant="outline" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Volver al blog
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {post.categoria && (
                      <Button 
                        variant="ghost" 
                        className="gap-2"
                        style={{ color: categoryColor }}
                      >
                        Ver más de {post.categoria.nombre}
                        <CategoryIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.footer>
            </motion.article>
          </div>
        </section>
      </div>

      {/* Botón volver arriba */}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            size="icon"
            className="rounded-full shadow-lg h-12 w-12"
            style={{ backgroundColor: categoryColor }}
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5 text-white" />
          </Button>
        </motion.div>
      )}

      <Footer />
    </>
  )
}
