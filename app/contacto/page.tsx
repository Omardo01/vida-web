"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

export default function ContactoPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    mensaje: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío (aquí puedes integrar con tu backend)
    setTimeout(() => {
      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      })
      setFormData({ nombre: "", telefono: "", correo: "", mensaje: "" })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
                Contáctanos
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Estamos aquí para escucharte. Envíanos un mensaje y nos pondremos en contacto contigo pronto.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Información de Contacto */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-8 md:p-10 bg-white shadow-2xl border-t-4 border-primary h-full">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Información de Contacto
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Dirección</h3>
                        <p className="text-muted-foreground">
                          AVENIDA CENTRAL #153<br />
                          COL. SAN JOAQUÍN CP. 24157<br />
                          CIUDAD DEL CARMEN, CAMPECHE
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📞</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">✉️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Correo Electrónico</h3>
                        <a 
                          href="mailto:info@vidasc.mx" 
                          className="text-primary hover:text-secondary transition-colors hover:underline cursor-pointer"
                        >
                          info@vidasc.mx
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🌐</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Sitio Web</h3>
                        <a 
                          href="http://www.vidasc.mx" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-secondary transition-colors hover:underline cursor-pointer"
                        >
                          www.vidasc.mx
                        </a>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <h3 className="font-semibold text-lg mb-4">Síguenos en Redes Sociales</h3>
                      <div className="flex gap-3">
                        <a 
                          href="https://facebook.com/VidaSCMX" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                          aria-label="Facebook"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                        <a 
                          href="https://instagram.com/VidaSCMX" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                          aria-label="Instagram"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                        <a 
                          href="https://youtube.com/c/VidaSCMX" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                          aria-label="YouTube"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Formulario de Contacto */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-8 md:p-10 bg-white shadow-2xl border-t-4 border-secondary">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    Envíanos un Mensaje
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-base font-semibold">
                        Nombre Completo *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="h-12 text-base border-2 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-base font-semibold">
                        Teléfono *
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        placeholder="Tu número de teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        className="h-12 text-base border-2 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="correo" className="text-base font-semibold">
                        Correo Electrónico *
                      </Label>
                      <Input
                        id="correo"
                        name="correo"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        className="h-12 text-base border-2 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensaje" className="text-base font-semibold">
                        Mensaje *
                      </Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        placeholder="Escribe tu mensaje aquí..."
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="text-base border-2 focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      * Todos los campos son obligatorios
                    </p>
                  </form>
                </Card>
              </motion.div>
            </div>

            {/* Mapa o Información Adicional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <Card className="p-8 md:p-12 bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-2xl">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    ¿Tienes alguna pregunta?
                  </h2>
                  <p className="text-lg md:text-xl mb-6 text-white/90 max-w-2xl mx-auto">
                    Nuestro equipo está listo para ayudarte. No dudes en contactarnos por cualquier medio.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="tel:+15551234567"
                      className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer inline-block"
                    >
                      📞 Llámanos Ahora
                    </a>
                    <a
                      href="mailto:info@vidasc.mx"
                      className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer inline-block"
                    >
                      ✉️ Enviar Email
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

