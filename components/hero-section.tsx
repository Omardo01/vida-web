"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TextAnimate } from "@/components/ui/text-animate"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { motion } from "motion/react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/fondo.jpg')] bg-cover bg-center bg-no-repeat opacity-18"></div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Título principal con animación */}
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-balance leading-tight"
          >
            #UnaIglesíaEnCadaCasa
          </TextAnimate>
          
          <AnimatedGradientText
            colorFrom="#000000"
            colorTo="#7BCDF5"
            speed={0.8}
            className="block text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mt-2"
          >
            VidaSCMX
          </AnimatedGradientText>

          {/* Descripción con animación */}
          <TextAnimate
            animation="fadeIn"
            by="word"
            delay={0.3}
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-primary-foreground/90 text-pretty max-w-2xl mx-auto leading-relaxed px-4 mt-6"
          >
            Somos una institución comprometida con la enseñanza de la palabra de Dios. Amamos compartir la fe y así transformar el entorno.
          </TextAnimate>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 px-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-sm md:text-base lg:text-lg px-6 md:px-8 py-5 md:py-6 h-auto"
            >
              Conoce Más
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-sm md:text-base lg:text-lg px-6 md:px-8 py-5 md:py-6 h-auto bg-transparent"
            >
              Únete a Nosotros
            </Button>
            <Link href="/construyendo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-primary text-sm md:text-base lg:text-lg px-6 md:px-8 py-5 md:py-6 h-auto bg-transparent"
              >
                Construyendo
              </Button>
            </Link>
          </div>

          {/* Tarjetas de misión con animación escalonada */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur border-white/20 p-5 md:p-6 text-center hover:bg-white/15 transition-all">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl">🎯</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">Alcanzar</h3>
                <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
                  Llevamos el mensaje de esperanza a cada corazón necesitado
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Card className="bg-white/10 backdrop-blur border-white/20 p-5 md:p-6 text-center hover:bg-white/15 transition-all">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl">🏗️</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">Edificar</h3>
                <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
                  Construimos una comunidad sólida basada en el amor de Cristo
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <Card className="bg-white/10 backdrop-blur border-white/20 p-5 md:p-6 text-center hover:bg-white/15 transition-all">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl">✨</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">Multiplicar</h3>
                <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
                  Expandimos el Reino formando discípulos que forman discípulos
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
