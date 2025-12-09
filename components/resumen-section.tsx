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
            Una organización comprometida con la transformación de la cultura
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✨</span>
                  </div>
                  <h3 className="font-bold text-lg text-primary">Nuestros Valores</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-base">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                    <span>Dignidad</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></span>
                    <span>Integridad</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-lg text-secondary">Nuestro Propósito</h3>
                </div>
                <p className="text-base text-muted-foreground leading-tight">
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📖</span>
                  </div>
                  <h3 className="font-bold text-lg text-accent">Base Bíblica</h3>
                </div>
                <p className="text-base text-muted-foreground leading-tight">
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⛪</span>
                  </div>
                  <h3 className="font-bold text-lg text-green-700">Iglesia Celular</h3>
                </div>
                <p className="text-base text-muted-foreground leading-tight">
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
              <Card className="p-6 bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-2xl border-4 border-white/20 relative overflow-hidden">
                {/* Efecto de brillo de fondo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10"></div>
                
                <div className="text-center mb-4 relative z-10">
                  {/* Anillo exterior decorativo animado */}
                  <div className="relative w-40 h-40 mx-auto mb-3">
                    {/* Resplandor azul pulsante lento */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-1 bg-gradient-to-br from-blue-300 via-cyan-300 to-blue-400 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDuration: '2.5s' }}></div>
                    
                    {/* Anillo intermedio con resplandor */}
                    <div className="absolute inset-2 bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDuration: '6s' }}></div>
                    
                    {/* Círculo principal con el logo */}
                    <div className="absolute inset-4 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white-400/40 ring-offset-4 ring-offset-transparent animate-pulse" style={{ animationDuration: '3s' }}>
                      <Image
                        src="/images/sin-bg.png"
                        alt="Vida SCMX Logo"
                        width={200}
                        height={200}
                        className="object-contain p-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{ 
                          filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 40px rgba(96, 165, 250, 0.4))',
                          animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }}
                      />
                    </div>
                  </div>
                  
                  
                  <p className="text-base text-white/90 drop-shadow-md">Vida Sociedad Cultural MX</p>
</div>
                
                <div className="space-y-2 relative z-10">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl text-center border border-white/30 shadow-lg hover:bg-white/30 hover:scale-105 transition-all duration-300">
                    <p className="font-bold text-base drop-shadow">🎯 ALCANZAR</p>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-2xl drop-shadow-lg animate-bounce">↓</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl text-center border border-white/30 shadow-lg hover:bg-white/30 hover:scale-105 transition-all duration-300">
                    <p className="font-bold text-base drop-shadow">🏗️ EDIFICAR</p>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-2xl drop-shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}>↓</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl text-center border border-white/30 shadow-lg hover:bg-white/30 hover:scale-105 transition-all duration-300">
                    <p className="font-bold text-base drop-shadow">✨ MULTIPLICAR</p>
                  </div>
                </div>

                <Link href="/nosotros">
                  <button className="mt-4 w-full bg-white text-primary hover:bg-white/90 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl hover:shadow-white/50 border-2 border-white/50 relative z-10 group">
                    <span className="flex items-center justify-center gap-2">
                      Conocer más
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
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
                  <p className="text-base font-semibold text-indigo-700 mb-2">Formando lideres</p>
                  <p className="text-sm text-muted-foreground">
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌍</span>
                  </div>
                  <h3 className="font-bold text-lg text-yellow-700">Áreas de Influencia</h3>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-lg text-orange-700">Misión</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-tight">
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔭</span>
                  </div>
                  <h3 className="font-bold text-lg text-teal-700">Visión</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-tight">
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌟</span>
                  </div>
                  <h3 className="font-bold text-lg text-rose-700">Influencia en Sociedad</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-tight">
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
                <p className="text-sm font-semibold">{item.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

