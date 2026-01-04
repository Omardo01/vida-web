"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useScroll, useSpring } from "motion/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import rehypeRaw from "rehype-raw"
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

            <div className="flex items-center gap-4 md:gap-8">
              {/* Icono de categoría */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-shrink-0"
              >
                <div 
                  className="inline-flex p-4 md:p-6 rounded-2xl"
                  style={{ 
                    backgroundColor: categoryColor + "15",
                    boxShadow: `0 10px 30px -10px ${categoryColor}25`
                  }}
                >
                  <CategoryIcon 
                    className="h-10 w-10 md:h-16 md:w-16" 
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
                className="max-w-none"
                style={{ 
                  '--tw-prose-headings': categoryColor,
                  '--tw-prose-links': categoryColor,
                  '--tw-prose-quote-borders': categoryColor,
                  '--tw-prose-bullets': categoryColor,
                  '--tw-prose-counters': categoryColor,
                } as React.CSSProperties}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
                      <h1 {...props} className="text-3xl md:text-4xl font-bold mt-12 mb-6 tracking-tight" style={{ color: categoryColor }}>{children}</h1>
                    ),
                    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
                      <h2 {...props} className="text-2xl md:text-3xl font-bold mt-10 mb-4 pb-2 border-b border-border tracking-tight" style={{ color: categoryColor }}>{children}</h2>
                    ),
                    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
                      <h3 {...props} className="text-xl md:text-2xl font-bold mt-8 mb-3 tracking-tight" style={{ color: categoryColor }}>{children}</h3>
                    ),
                    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }) => (
                      <p {...props} className="text-[17px] md:text-lg leading-[1.8] text-foreground/85 mb-6 last:mb-0">
                        {children}
                      </p>
                    ),
                    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement> & { children?: React.ReactNode }) => (
                      <blockquote 
                        {...props} 
                        style={{ 
                          borderColor: categoryColor,
                          backgroundColor: categoryColor + "08"
                        }}
                        className="border-l-4 pl-6 py-2 my-8 rounded-r-lg italic text-foreground/80 text-lg"
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
                        className="font-medium underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
                        style={{ color: categoryColor }}
                      >
                        {children}
                      </a>
                    ),
                    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement> & { children?: React.ReactNode }) => (
                      <ul {...props} className="my-6 space-y-3 list-none">
                        {children}
                      </ul>
                    ),
                    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement> & { children?: React.ReactNode }) => (
                      <li {...props} className="flex items-start gap-3 text-[17px] leading-relaxed text-foreground/85">
                        <span 
                          className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoryColor }}
                        />
                        <span>{children}</span>
                      </li>
                    ),
                    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement> & { children?: React.ReactNode }) => (
                      <ol {...props} className="my-6 space-y-3 list-decimal pl-6 text-[17px] leading-relaxed text-foreground/85">
                        {children}
                      </ol>
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
                    img: ({ ...props }) => (
                      <img 
                        {...props} 
                        className="rounded-2xl shadow-xl my-10 mx-auto max-w-full h-auto border border-border" 
                        loading="lazy"
                      />
                    ),
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                    em: ({ children }) => <em className="italic opacity-90">{children}</em>,
                    code: ({ inline, children, ...props }: any) => (
                      inline ? (
                        <code {...props} className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono text-primary">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-muted p-4 rounded-xl overflow-x-auto my-6 border border-border shadow-inner">
                          <code {...props} className="text-sm font-mono">
                            {children}
                          </code>
                        </pre>
                      )
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
