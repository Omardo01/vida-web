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
                          href="#" 
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                        >
                          <span className="text-lg">▶️</span>
                        </a>
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                        >
                          <span className="text-lg">📘</span>
                        </a>
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                        >
                          <span className="text-lg">📷</span>
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

