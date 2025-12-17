"use client"

import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TextAnimate } from "@/components/ui/text-animate"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function NosotrosPage() {
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
              Acerca de...
            </h1>
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/images/logo-corto.png"
                alt="Vida SCMX Logo"
                width={120}
                height={120}
                className="h-20 w-auto md:h-28"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Vida Sociedad Cultural MX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="p-8 md:p-12 bg-white shadow-2xl border-t-4 border-primary">
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/images/logo-corto.png"
                  alt="Vida SCMX"
                  width={80}
                  height={80}
                  className="h-16 w-auto"
                />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Vida Sociedad Cultural MX
              </h2>
              <div className="flex justify-center mb-8">
                <Badge variant="outline" className="text-lg px-6 py-2 font-semibold">
                  [VIDASCMX]
                </Badge>
              </div>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p className="text-center text-xl md:text-2xl font-medium text-foreground">
                  Compartimos los principios ético-morales de la fe bíblica para la{" "}
                  <span className="text-primary font-bold">transformación del entorno</span> por medio
                  de la <span className="text-secondary font-bold">formación de liderazgo</span> en cada
                  persona.
                </p>
                
                <div className="bg-secondary/10 p-6 rounded-lg border-l-4 border-secondary mt-8">
                  <p className="text-center text-lg italic">
                    Somos una <span className="font-bold text-secondary">organización sin fines de lucro</span> que cree, 
                    practica y promueve los valores universales de{" "}
                    <span className="font-bold text-primary">dignidad, integridad y libertad</span> en el 
                    ser humano, como parte fundamental para un servicio de excelencia.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  <a 
                    href="http://www.vidasc.mx" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary font-semibold text-lg hover:underline transition-all cursor-pointer hover:scale-105"
                  >
                    www.vidasc.mx
                  </a>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                >
                  <span className="text-xl">▶️</span>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                >
                  <span className="text-xl">📘</span>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer hover:scale-110 shadow-md hover:shadow-xl"
                >
                  <span className="text-xl">📷</span>
                </a>
              </div>

              <div className="text-center mt-6 text-sm text-muted-foreground">
                <p className="font-medium">ALCANZAR + EDIFICAR + MULTIPLICAR</p>
              </div>
            </Card>
          </motion.div>

          {/* Nuestras Convicciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Nuestras convicciones
              </h2>
              <p className="text-2xl font-semibold text-foreground">Creemos...</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "✨",
                  text: "En Dios Soberano, Omnipresente, Omnisciente.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: "🙏",
                  text: "En Dios Trino: Padre, Hijo y Espíritu Santo.",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: "📖",
                  text: "En las escrituras bíblicas como la verdad absoluta.",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: "✝️",
                  text: "En el evangelio de Jesucristo, su Sacrificio y su Resurrección.",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: "🤝",
                  text: "En el Nuevo Pacto establecido por Jesucristo.",
                  color: "from-indigo-500 to-blue-500"
                },
                {
                  icon: "⚖️",
                  text: "En el pacto y su ley para establecer el Gobierno de Dios.",
                  color: "from-yellow-500 to-orange-500"
                },
                {
                  icon: "⛪",
                  text: "En la iglesia como representante del Gobierno de Dios.",
                  color: "from-teal-500 to-cyan-500"
                }
              ].map((conviction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-l-4 border-primary">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${conviction.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl">{conviction.icon}</span>
                      </div>
                      <p className="text-lg font-medium text-foreground flex-1 pt-2">
                        {conviction.text}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Brújula Visionaria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 shadow-2xl border-2 border-primary/20">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-6xl">🧭</span>
                  <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Brújula Visionaria
                  </h2>
                </div>
              </div>

              {/* Propósito */}
              <div className="mb-12 text-center">
                <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full shadow-lg mb-6">
                  <p className="text-2xl md:text-3xl font-bold">Nuestro Propósito:</p>
                  <p className="text-xl md:text-2xl font-semibold mt-2">FORMACIÓN DE LÍDERES</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Visión */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-8 h-full bg-white shadow-lg border-t-4 border-primary">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🔭</span>
                      </div>
                      <h3 className="text-3xl font-bold text-primary">Nuestra Visión:</h3>
                    </div>
                    <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                      <p>
                        Ser reconocida por su participación en la{" "}
                        <span className="font-bold text-primary">formación de liderazgo</span> en 
                        todos los niveles, que incida en la{" "}
                        <span className="font-bold text-secondary">transformación de la cultura</span>.
                      </p>
                    </div>
                  </Card>
                </motion.div>

                {/* Misión */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="p-8 h-full bg-white shadow-lg border-t-4 border-secondary">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🎯</span>
                      </div>
                      <h3 className="text-3xl font-bold text-secondary">Nuestra Misión:</h3>
                    </div>
                    <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">1.</span>
                        <p>
                          Implantar los principios ético-morales de la fe bíblica, facilitando la{" "}
                          <span className="font-bold text-secondary">transformación de la cultura</span>.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">2.</span>
                        <p>
                          Desarrollar y consolidar{" "}
                          <span className="font-bold text-primary">el potencial del liderazgo</span> en 
                          cada persona, para satisfacer las necesidades de su entorno.
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground font-medium">
                  ALCANZAR + EDIFICAR + MULTIPLICAR
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Brújula Direccional - Modelo Estratégico */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-2xl border-2 border-primary/20">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-6xl">🧭</span>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Brújula Direccional
                  </h2>
                </div>
                <p className="text-2xl font-semibold text-foreground">Modelo Estratégico</p>
              </div>

              {/* Áreas de Influencia */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-center mb-6 text-primary">Áreas de Influencia</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Familia", icon: "👨‍👩‍👧‍👦" },
                    { name: "Iglesia", icon: "⛪" },
                    { name: "Educación", icon: "📚" },
                    { name: "Gobierno Civil", icon: "🏛️" },
                    { name: "Economía y Negocios", icon: "💼" },
                    { name: "Salud y Ciencia", icon: "🏥" },
                    { name: "Comunicación", icon: "📢" },
                    { name: "Otras Disciplinas", icon: "✨" }
                  ].map((area, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="p-4 bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-center hover:scale-105 transition-transform">
                        <div className="text-3xl mb-2">{area.icon}</div>
                        <p className="font-semibold text-sm">{area.name}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Organización */}
              <div className="space-y-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-lg text-center shadow-lg">
                  <h3 className="text-2xl md:text-3xl font-bold">PROYECTOS PRODUCTIVOS</h3>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg text-center shadow-lg">
                  <h3 className="text-2xl md:text-3xl font-bold">LIDERAZGO (FORMATIVO)</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-6 bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-center">
                    <h4 className="text-xl font-bold">ESTRUCTURA DE GOBIERNO</h4>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center flex items-center justify-center">
                    <div>
                      <Image
                        src="/images/logo-corto.png"
                        alt="Vida SCMX"
                        width={60}
                        height={60}
                        className="mx-auto mb-2 brightness-0 invert"
                      />
                      <p className="text-xs font-semibold">ALCANZAR • EDIFICAR • MULTIPLICAR</p>
                    </div>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-center">
                    <h4 className="text-xl font-bold">PROCESOS</h4>
                  </Card>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg text-center shadow-lg">
                  <h3 className="text-2xl md:text-3xl font-bold">IGLESIA CELULAR</h3>
                </div>
                <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-6 rounded-lg text-center shadow-lg flex items-center justify-center gap-4">
                  <span className="text-4xl">📖</span>
                  <h3 className="text-2xl md:text-3xl font-bold">EL PACTO Y LA LEY DE DIOS</h3>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Mapa de Procesos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="p-8 md:p-12 bg-white shadow-2xl border-t-4 border-secondary">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  Mapa de Procesos VIDASCMX
                </h2>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {/* Paso 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white h-full">
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
                      1
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-center">Ante una necesidad de nuestro entorno</h3>
                    <div className="space-y-2 text-sm">
                      <p className="bg-white/20 p-2 rounded">Sociedad</p>
                      <p className="bg-white/20 p-2 rounded">Formación de personas</p>
                      <p className="bg-white/20 p-2 rounded">Falta de Productividad e innovación en todas las áreas del desarrollo humano</p>
                    </div>
                  </Card>
                </motion.div>

                {/* Paso 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white h-full">
                    <div className="w-12 h-12 bg-white text-orange-600 rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
                      2
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-center">VIDASCMX Brinda una respuesta por medio de sus</h3>
                    <p className="text-lg font-semibold text-center bg-white/20 p-4 rounded">Procesos Institucionales</p>
                  </Card>
                </motion.div>

                {/* Paso 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white h-full">
                    <div className="w-12 h-12 bg-white text-yellow-600 rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
                      3
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-center">Procesos que se basan en nuestros valores</h3>
                    <div className="space-y-2">
                      <p className="bg-white text-yellow-700 p-3 rounded font-semibold text-center">Dignidad</p>
                      <p className="bg-white text-yellow-700 p-3 rounded font-semibold text-center">Integridad</p>
                      <p className="bg-white text-yellow-700 p-3 rounded font-semibold text-center">Libertad</p>
                    </div>
                  </Card>
                </motion.div>

                {/* Paso 4 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white h-full">
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
                      4
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-center">Dan respuesta a las necesidades de nuestro entorno</h3>
                    <div className="space-y-2 text-sm">
                      <p className="bg-white/20 p-2 rounded">Sociedad</p>
                      <p className="bg-white/20 p-2 rounded">Personas ejerciendo liderazgo</p>
                      <p className="bg-white/20 p-2 rounded">Productividad e innovación en diversas áreas del quehacer humano</p>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Tipos de Procesos */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-2xl font-bold text-blue-600 mb-3">PROCESOS ESTRATÉGICOS</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="text-base px-4 py-2">Dirección</Badge>
                    <Badge variant="outline" className="text-base px-4 py-2">Planeación</Badge>
                    <Badge variant="outline" className="text-base px-4 py-2">Cuerpo de Gobierno</Badge>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-6 bg-orange-50 p-4 rounded-r-lg">
                  <h3 className="text-2xl font-bold text-orange-600 mb-3">PROCESOS ESENCIALES</h3>
                  <p className="text-lg font-semibold text-foreground">
                    Iglesia Celular = <span className="text-primary">Alcanzar</span> + <span className="text-secondary">Edificar</span> + <span className="text-accent">Multiplicar</span>
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-6">
                  <h3 className="text-2xl font-bold text-yellow-600 mb-3">PROCESOS DE APOYO</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="text-base px-4 py-2">Finanzas</Badge>
                    <Badge variant="outline" className="text-base px-4 py-2">Multimedia y alabanza</Badge>
                    <Badge variant="outline" className="text-base px-4 py-2">Logística</Badge>
                    <Badge variant="outline" className="text-base px-4 py-2">Atención general</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Brújula Misional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-6xl">🧭</span>
                  <h2 className="text-4xl md:text-5xl font-bold">
                    Brújula Misional
                  </h2>
                </div>
                <p className="text-xl italic font-semibold mb-4">Misión institucional Mateo 28:18-20</p>
                <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur p-6 rounded-lg border border-white/20">
                  <p className="text-sm italic leading-relaxed text-white/90">
                    &quot;Y Jesús se acercó y les habló diciendo: Toda potestad me es dada en el cielo y en la tierra. 
                    Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, 
                    y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado; 
                    y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.&quot;
                  </p>
                  <p className="text-xs text-cyan-300 mt-3 font-semibold">— Mateo 28:18-20 (RVR1960)</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
                <div className="bg-white/10 backdrop-blur p-8 rounded-lg border-2 border-white/30">
                  <h3 className="text-3xl font-bold mb-4 text-cyan-300">Iglesia Celular</h3>
                  <p className="text-lg leading-relaxed">
                    Evangelización de nuestro entorno y desarrollo de la iglesia
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="text-center">
                      <div className="text-6xl mb-2">❤️</div>
                      <div className="text-4xl">✝️</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-8">Nuestro proceso esencial:</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="bg-white text-blue-700 px-8 py-6 rounded-lg shadow-xl font-bold text-2xl">
                    ALCANZAR
                  </div>
                  <div className="text-4xl rotate-90 md:rotate-0">→</div>
                  <div className="bg-white text-blue-700 px-8 py-6 rounded-lg shadow-xl font-bold text-2xl">
                    EDIFICAR
                  </div>
                  <div className="text-4xl rotate-90 md:rotate-0">→</div>
                  <div className="bg-white text-blue-700 px-8 py-6 rounded-lg shadow-xl font-bold text-2xl">
                    MULTIPLICAR
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ¿Por qué somos una Iglesia Celular? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="p-8 md:p-12 bg-white shadow-2xl border-t-4 border-blue-600">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
                  ¿Por qué somos una Iglesia Celular?
                </h2>
                <p className="text-2xl text-foreground font-semibold mb-6">
                  → Porque la iglesia se reunía en casas.
                </p>
                <p className="text-xl text-muted-foreground italic">
                  Cada célula es una <span className="font-bold text-blue-600">iglesia en sí misma</span>.
                </p>
              </div>

              <div className="grid md:grid-cols-1 gap-4">
                {[
                  { 
                    ref: "Marcos 2:1-2", 
                    title: "Casa en Capernaun",
                    verse: "Y se juntaron muchos, de manera que ya no cabían ni aun a la puerta; y les predicaba la palabra."
                  },
                  { 
                    ref: "Marcos 2:15", 
                    title: "Casa de Mateo",
                    verse: "Y aconteció que estando Jesús a la mesa en casa de él, muchos publicanos y pecadores estaban también a la mesa juntamente con Jesús y sus discípulos."
                  },
                  { 
                    ref: "Lucas 19:5,6", 
                    title: "Casa de Zaqueo",
                    verse: "Cuando Jesús llegó a aquel lugar, mirando hacia arriba, le vio, y le dijo: Zaqueo, date prisa, desciende, porque hoy es necesario que pose yo en tu casa."
                  },
                  { 
                    ref: "Hechos 2:46", 
                    title: "Templo y Casa",
                    verse: "Y perseverando unánimes cada día en el templo, y partiendo el pan en las casas, comían juntos con alegría y sencillez de corazón."
                  },
                  { 
                    ref: "Hechos 5:42", 
                    title: "El Templo y Casas",
                    verse: "Y todos los días, en el templo y por las casas, no cesaban de enseñar y predicar a Jesucristo."
                  },
                  { 
                    ref: "Hechos 8:3", 
                    title: "En las Casas",
                    verse: "Y Saulo asolaba la iglesia, y entrando casa por casa, arrastraba a hombres y a mujeres, y los entregaba en la cárcel."
                  },
                  { 
                    ref: "Hechos 10:22,24", 
                    title: "Casa de Cornelio",
                    verse: "Cornelio los estaba esperando, habiendo convocado a sus parientes y amigos más íntimos."
                  },
                  { 
                    ref: "Hechos 12:12", 
                    title: "Casa de María",
                    verse: "Y habiendo considerado esto, llegó a casa de María la madre de Juan, el que tenía por sobrenombre Marcos, donde muchos estaban reunidos orando."
                  },
                  { 
                    ref: "Hechos 16:32,24", 
                    title: "Casa del Carcelero",
                    verse: "Y le hablaron la palabra del Señor a él y a todos los que estaban en su casa."
                  },
                  { 
                    ref: "Hechos 16:40", 
                    title: "Casa de Lidia",
                    verse: "Entonces, saliendo de la cárcel, entraron en casa de Lidia, y habiendo visto a los hermanos, los consolaron, y se fueron."
                  },
                  { 
                    ref: "Hechos 19:9,10", 
                    title: "Escuela de Tiranno",
                    verse: "Así continuó por espacio de dos años, de manera que todos los que habitaban en Asia, judíos y griegos, oyeron la palabra del Señor Jesús."
                  },
                  { 
                    ref: "Hechos 20:20", 
                    title: "Públicamente y las casas",
                    verse: "Y cómo nada que fuese útil he rehuido de anunciaros y enseñaros, públicamente y por las casas."
                  },
                  { 
                    ref: "Romanos 16:3-5", 
                    title: "Casa de Priscila y Aquila",
                    verse: "Saludad a Priscila y a Aquila, mis colaboradores en Cristo Jesús... Saludad también a la iglesia de su casa."
                  },
                  { 
                    ref: "Romanos 16:11", 
                    title: "Casa de Narciso",
                    verse: "Saludad a los de la casa de Narciso, los cuales están en el Señor."
                  },
                  { 
                    ref: "1 Corintios 16:19", 
                    title: "Casa de Priscila y Aquila",
                    verse: "Las iglesias de Asia os saludan. Aquila y Priscila, con la iglesia que está en su casa, os saludan mucho en el Señor."
                  },
                  { 
                    ref: "Filipenses 4:22", 
                    title: "Casa de César",
                    verse: "Todos los santos os saludan, y especialmente los de la casa de César."
                  },
                  { 
                    ref: "Colosenses 4:15", 
                    title: "Casa de Ninfas",
                    verse: "Saludad a los hermanos que están en Laodicea, y a Ninfas y a la iglesia que está en su casa."
                  },
                  { 
                    ref: "2 Timoteo 4:19", 
                    title: "Casa de Onesíforo",
                    verse: "Saluda a Prisca y a Aquila, y a la casa de Onesíforo."
                  },
                  { 
                    ref: "Filemón 1:2", 
                    title: "Casa de Filemón",
                    verse: "Y a la amada hermana Apia, y a Arquipo nuestro compañero de milicia, y a la iglesia que está en tu casa."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border-l-4 border-blue-500">
                      <span className="text-2xl flex-shrink-0 mt-1">🏠</span>
                      <div className="flex-1">
                        <p className="text-base font-bold text-blue-700 mb-1">{item.ref} - {item.title}</p>
                        <p className="text-sm text-muted-foreground italic leading-relaxed">&quot;{item.verse}&quot;</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ¿Cómo es la vida de la Iglesia? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-50 to-blue-50 shadow-2xl border-2 border-purple-300">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                  ¿Cómo es la vida de la Iglesia?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { 
                    activity: "Vida de oración", 
                    reference: "Hechos 1:14", 
                    icon: "🙏",
                    verse: "Todos éstos perseveraban unánimes en oración y ruego."
                  },
                  { 
                    activity: "Comunión entre hermanos", 
                    reference: "Hechos 2:46-47", 
                    icon: "🤝",
                    verse: "Y perseverando unánimes cada día en el templo, y partiendo el pan en las casas, comían juntos con alegría."
                  },
                  { 
                    activity: "Llenos del Espíritu Santo", 
                    reference: "Hechos 4:31", 
                    icon: "✨",
                    verse: "Cuando hubieron orado, el lugar en que estaban congregados tembló; y todos fueron llenos del Espíritu Santo."
                  },
                  { 
                    activity: "Adoradores", 
                    reference: "Juan 4:21-24", 
                    icon: "🎵",
                    verse: "Los verdaderos adoradores adorarán al Padre en espíritu y en verdad."
                  },
                  { 
                    activity: "Participan la cena del Señor", 
                    reference: "1 Corintios 11:23-25", 
                    icon: "🍞",
                    verse: "Haced esto en memoria de mí."
                  },
                  { 
                    activity: "Evangelizan", 
                    reference: "Hechos 13:47", 
                    icon: "📢",
                    verse: "Te he puesto para luz de los gentiles, a fin de que seas para salvación hasta lo último de la tierra."
                  },
                  { 
                    activity: "Se congregan", 
                    reference: "Hebreos 10:25", 
                    icon: "⛪",
                    verse: "No dejando de congregarnos, como algunos tienen por costumbre, sino exhortándonos."
                  },
                  { 
                    activity: "Mayordomos fieles", 
                    reference: "Malaquías 3:10", 
                    icon: "💝",
                    verse: "Traed todos los diezmos al alfolí y haya alimento en mi casa."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-l-4 border-purple-500">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg text-foreground mb-1">{item.activity}</p>
                          <p className="text-sm text-purple-700 font-medium mb-2">
                            → {item.reference}
                          </p>
                          <p className="text-xs text-muted-foreground italic leading-relaxed">&quot;{item.verse}&quot;</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                ¿Listo para formar parte?
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Únete a nuestra comunidad y sé parte de la transformación
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contacto"
                  className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer inline-block text-center"
                >
                  Contáctanos
                </a>
                <a
                  href="/#blog"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer inline-block text-center"
                >
                  Conoce más
                </a>
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

