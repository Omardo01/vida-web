"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, Mail, Facebook, Instagram, Youtube, MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react"
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
  dias_reunion: DiaReunion[]
  telefono: string | null
  email: string | null
  pastor_encargado: string | null
  imagen_portada: string | null
}

export default function DelegacionesPage() {
  const [delegaciones, setDelegaciones] = useState<Delegacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDelegaciones()
  }, [])

  const fetchDelegaciones = async () => {
    try {
      const response = await fetch("/api/delegaciones")
      if (response.ok) {
        const data = await response.json()
        setDelegaciones(data.delegaciones)
      }
    } catch (error) {
      console.error("Error fetching delegaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="mb-4" variant="outline">
              <MapPin className="h-3 w-3 mr-1" />
              Nuestras Delegaciones
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Encuéntranos Cerca de Ti
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Contamos con múltiples delegaciones para servirte mejor. 
              Encuentra la más cercana a tu ubicación y únete a nuestra comunidad.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Delegaciones Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando delegaciones...</p>
          </div>
        ) : delegaciones.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No hay delegaciones disponibles</CardTitle>
              <CardDescription>
                Próximamente agregaremos más delegaciones
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {delegaciones.map((delegacion) => (
              <motion.div key={delegacion.id} variants={item}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group overflow-hidden">
                  {/* Imagen de portada */}
                  {delegacion.imagen_portada && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={delegacion.imagen_portada}
                        alt={delegacion.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-background/90 backdrop-blur">
                        {delegacion.ciudad}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {delegacion.nombre}
                    </CardTitle>
                    {delegacion.pastor_encargado && (
                      <CardDescription>
                        Pastor: {delegacion.pastor_encargado}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Descripción */}
                    {delegacion.descripcion && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {delegacion.descripcion}
                      </p>
                    )}

                    {/* Ubicación */}
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{delegacion.ciudad}, {delegacion.estado}</p>
                        <p className="text-muted-foreground text-xs">{delegacion.direccion}</p>
                      </div>
                    </div>

                    {/* Horarios */}
                    {delegacion.dias_reunion && delegacion.dias_reunion.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="h-4 w-4 text-primary" />
                          Horarios
                        </div>
                        <div className="space-y-1 pl-6">
                          {delegacion.dias_reunion.slice(0, 2).map((dia, index) => (
                            <p key={index} className="text-xs text-muted-foreground">
                              {dia.dia} {dia.hora} - {dia.tipo}
                            </p>
                          ))}
                          {delegacion.dias_reunion.length > 2 && (
                            <p className="text-xs text-primary">
                              +{delegacion.dias_reunion.length - 2} más
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contacto rápido */}
                    <div className="flex gap-2 pt-2">
                      {delegacion.telefono && (
                        <a
                          href={`tel:${delegacion.telefono}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors text-xs"
                        >
                          <Phone className="h-3 w-3" />
                          Llamar
                        </a>
                      )}
                      {delegacion.email && (
                        <a
                          href={`mailto:${delegacion.email}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors text-xs"
                        >
                          <Mail className="h-3 w-3" />
                          Email
                        </a>
                      )}
                    </div>

                    {/* Botón ver más */}
                    <Link href={`/delegaciones/${delegacion.slug}`} className="block">
                      <Button className="w-full group/btn" variant="default">
                        Ver más información
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿No encuentras una delegación cerca de ti?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contáctanos y te ayudaremos a encontrar la mejor opción para ti
            </p>
            <Link href="/contacto">
              <Button size="lg" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Contáctanos
              </Button>
            </Link>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}

