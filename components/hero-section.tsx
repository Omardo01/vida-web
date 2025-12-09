"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TextAnimate } from "@/components/ui/text-animate"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { WordRotate } from "@/components/ui/word-rotate"
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
          <WordRotate
            words={[
              "#UnaIglesíaEnCadaCasa",
              "#FormandoLideres",
              "TransformandoLaCultura"
            ]}
            duration={3000}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-balance leading-tight"
          />
          
          <AnimatedGradientText
            colorFrom="#000000"
            colorTo="#456E7A"
            speed={1.5}
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
            Enseñamos la palabra de Dios y compartimos la fe bíblica para ser agentes de trasnformación cultural con un impacto tangible en nuestra comunidad.
          </TextAnimate>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4">
            <Link href="/nosotros" className="inline-block">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-base md:text-lg lg:text-xl px-8 md:px-12 py-6 md:py-7 h-auto shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer w-full sm:w-auto font-bold border-2 border-transparent"
              >
                Conoce Más
              </Button>
            </Link>
            <Link href="/contacto" className="inline-block">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary text-base md:text-lg lg:text-xl px-8 md:px-12 py-6 md:py-7 h-auto bg-transparent shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer w-full sm:w-auto font-bold"
              >
                Contáctanos
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
