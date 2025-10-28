"use client"

import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export function ResumenSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Conoce Vida SCMX
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una organización comprometida con la transformación del entorno
          </p>
        </motion.div>

        {/* Gráfico Mental - Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          
          {/* Columna Izquierda - Valores */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-primary hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px] flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✨</span>
                  </div>
                  <h3 className="font-bold text-base text-primary">Nuestros Valores</h3>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                    <span>Dignidad</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></span>
                    <span>Integridad</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></span>
                    <span>Libertad</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-secondary hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px] flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-base text-secondary">Nuestro Propósito</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  Formación de líderes que transformen la cultura
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-accent hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px] flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📖</span>
                  </div>
                  <h3 className="font-bold text-base text-accent">Base Bíblica</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  Principios ético-morales de la fe bíblica
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px] flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⛪</span>
                  </div>
                  <h3 className="font-bold text-base text-green-700">Iglesia Celular</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  #UnaIglesiaEnCadaCasa
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Columna Central - Proceso Principal */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Card className="p-8 bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-2xl border-4 border-white/20">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 p-4">
                    <Image
                      src="/images/logo-corto.png"
                      alt="Vida SCMX Logo"
                      width={80}
                      height={80}
                      className="brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">VIDA SCMX</h3>
                  <p className="text-sm text-white/90">Sociedad Cultural MX</p>
</div>
                
                <div className="space-y-3">
                  <div className="bg-white/20 backdrop-blur p-3 rounded-lg text-center">
                    <p className="font-bold text-sm">🎯 ALCANZAR</p>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-2xl">↓</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur p-3 rounded-lg text-center">
                    <p className="font-bold text-sm">🏗️ EDIFICAR</p>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-2xl">↓</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur p-3 rounded-lg text-center">
                    <p className="font-bold text-sm">✨ MULTIPLICAR</p>
                  </div>
                </div>

                <Link href="/nosotros">
                  <button className="mt-6 w-full bg-white text-primary hover:bg-white/90 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg">
                    Conocer más →
                  </button>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-t-4 border-indigo-500 hover:shadow-xl transition-all">
                <div className="text-center">
                  <p className="text-sm font-semibold text-indigo-700 mb-2">Formando lideres</p>
                  <p className="text-xs text-muted-foreground">
                    Con base bíblica y principios ético-morales para transformar la cultura.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Columna Derecha - Misión, Visión e Influencia */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-500 hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px] flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌍</span>
                  </div>
                  <h3 className="font-bold text-base text-yellow-700">Áreas de Influencia</h3>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <span className="bg-white/50 px-2 py-1 rounded text-center">👨‍👩‍👧 Familia</span>
                  <span className="bg-white/50 px-2 py-1 rounded text-center">⛪ Iglesia</span>
                  <span className="bg-white/50 px-2 py-1 rounded text-center">📚 Educación</span>
                  <span className="bg-white/50 px-2 py-1 rounded text-center">🏛️ Gobierno</span>
                  <span className="bg-white/50 px-2 py-1 rounded text-center">💼 Economía</span>
                  <span className="bg-white/50 px-2 py-1 rounded text-center">🏥 Salud</span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-orange-500 hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px] flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-base text-orange-700">Misión</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Implantar los principios ético-morales de la fe bíblica, facilitando la transformación de la cultura
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-l-4 border-teal-500 hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px] flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔭</span>
                  </div>
                  <h3 className="font-bold text-base text-teal-700">Visión</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ser reconocida por su participación en la formación de liderazgo que incida en la transformación de la cultura
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 border-l-4 border-rose-500 hover:shadow-xl transition-all hover:-translate-y-1 min-h-[160px] flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌟</span>
                  </div>
                  <h3 className="font-bold text-base text-rose-700">Influencia en Sociedad</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Desarrollamos el potencial del liderazgo en cada persona para satisfacer las necesidades de su entorno
                </p>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Estadísticas o Datos Rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { icon: "🎓", label: "Formación de Líderes", color: "from-blue-500 to-cyan-500" },
            { icon: "❤️", label: "Transformación Cultural", color: "from-red-500 to-pink-500" },
            { icon: "🏠", label: "Iglesias Celulares", color: "from-green-500 to-emerald-500" },
            { icon: "🌟", label: "Servicio de Excelencia", color: "from-yellow-500 to-orange-500" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className={`p-4 text-center bg-gradient-to-br ${item.color} text-white hover:shadow-xl transition-all hover:scale-105 cursor-pointer`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-xs font-semibold">{item.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

