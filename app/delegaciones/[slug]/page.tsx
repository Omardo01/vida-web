"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ArrowLeft,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import rehypeRaw from "rehype-raw"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
}

export default function DelegacionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [delegacion, setDelegacion] = useState<Delegacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchDelegacion(params.slug as string)
    }
  }, [params.slug])

  const fetchDelegacion = async (slug: string) => {
    try {
      const response = await fetch(`/api/delegaciones/${slug}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Delegacion data:', data.delegacion)
        console.log('Mapa embed URL:', (data.delegacion as any).mapa_embed_url)
        setDelegacion(data.delegacion)
      } else {
        setNotFound(true)
      }
    } catch (error) {
      console.error("Error fetching delegacion:", error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenWhatsApp = () => {
    if (delegacion?.whatsapp) {
      window.open(`https://wa.me/${delegacion.whatsapp.replace(/\D/g, "")}`, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (notFound || !delegacion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Delegación no encontrada</CardTitle>
            <CardDescription>
              La delegación que buscas no existe o no está disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/delegaciones">
              <Button className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Ver todas las delegaciones
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero con imagen de portada */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {delegacion.imagen_portada ? (
          <>
            <img
              src={delegacion.imagen_portada}
              alt={delegacion.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link href="/delegaciones">
              <Button variant="ghost" className="mb-4 text-white hover:text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a delegaciones
              </Button>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-3 bg-white/90 backdrop-blur text-primary hover:bg-white">
                <MapPin className="h-3 w-3 mr-1" />
                {delegacion.ciudad}, {delegacion.estado}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {delegacion.nombre}
              </h1>
              {delegacion.pastor_encargado && (
                <p className="text-white/90 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Pastor: {delegacion.pastor_encargado}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            {delegacion.descripcion && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre Nosotros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-[17px] leading-[1.8] text-foreground/85">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkBreaks]} 
                      rehypePlugins={[rehypeRaw]}
                      components={{
                      p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                      a: ({ children, href }) => <a href={href} className="text-primary underline hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">{children}</a>,
                    }}>
                      {delegacion.descripcion}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Horarios de reunión */}
            {delegacion.dias_reunion && delegacion.dias_reunion.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Horarios de Reunión
                  </CardTitle>
                  <CardDescription>
                    Te esperamos en nuestros servicios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {delegacion.dias_reunion.map((dia, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-semibold">{dia.dia}</p>
                          <p className="text-sm text-muted-foreground">{dia.tipo}</p>
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{dia.hora}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mapa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ubicación
                </CardTitle>
                <CardDescription>
                  {delegacion.direccion}
                  <br />
                  {delegacion.ciudad}, {delegacion.estado}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(delegacion as any).mapa_embed_url && (delegacion as any).mapa_embed_url.trim() !== '' ? (
                  <div className="rounded-lg overflow-hidden border">
                    <div 
                      className="[&_iframe]:w-full [&_iframe]:h-[300px] [&_iframe]:border-0"
                      dangerouslySetInnerHTML={{ __html: (delegacion as any).mapa_embed_url }}
                    />
                  </div>
                ) : delegacion.latitud && delegacion.longitud ? (
                  <div className="rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="300"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${delegacion.latitud},${delegacion.longitud}&zoom=15`}
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Mapa no disponible
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {delegacion.telefono && (
                  <a href={`tel:${delegacion.telefono}`} className="block">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Phone className="h-4 w-4" />
                      {delegacion.telefono}
                    </Button>
                  </a>
                )}
                
                {delegacion.email && (
                  <a href={`mailto:${delegacion.email}`} className="block">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{delegacion.email}</span>
                    </Button>
                  </a>
                )}

                {delegacion.whatsapp && (
                  <Button
                    onClick={handleOpenWhatsApp}
                    className="w-full justify-start gap-3 bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contactar por WhatsApp
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Redes sociales */}
            {(delegacion.facebook || delegacion.instagram || delegacion.youtube || delegacion.twitter) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Redes Sociales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {delegacion.facebook && (
                    <a href={delegacion.facebook} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </Button>
                    </a>
                  )}
                  
                  {delegacion.instagram && (
                    <a href={delegacion.instagram} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </Button>
                    </a>
                  )}
                  
                  {delegacion.youtube && (
                    <a href={delegacion.youtube} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Youtube className="h-4 w-4" />
                        YouTube
                      </Button>
                    </a>
                  )}
                  
                  {delegacion.twitter && (
                    <a href={delegacion.twitter} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        X (Twitter)
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">¿Primera vez?</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Te invitamos a que nos visites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 text-primary-foreground/90">
                  Nos encantaría conocerte. Ven tal como eres, aquí encontrarás una familia.
                </p>
                <Link href="/contacto">
                  <Button variant="secondary" className="w-full">
                    Más información
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}

