import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/fondo.jpg')] bg-cover bg-center bg-no-repeat opacity-18"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
          #UnaIglesíaEnCadaCasa
            <span className="block text-accent-foreground">VidaSCMX</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 text-pretty max-w-2xl mx-auto leading-relaxed">
            Somos una institución comprometida con la enseñanza de la palabra de Dios. Amamos compartir la fe y así transformar el entorno.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3">
              Conoce Más
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3 bg-transparent"
            >
              Únete a Nosotros
            </Button>
            <Link href="/construyendo">
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-primary text-lg px-8 py-3 bg-transparent"
              >
                Construyendo
              </Button>
            </Link>
          </div>

          {/* Mission cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-white/10 backdrop-blur border-white/20 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Alcanzar</h3>
              <p className="text-primary-foreground/80">Llevamos el mensaje de esperanza a cada corazón necesitado</p>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Edificar</h3>
              <p className="text-primary-foreground/80">Construimos una comunidad sólida basada en el amor de Cristo</p>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Multiplicar</h3>
              <p className="text-primary-foreground/80">
                Expandimos el Reino formando discípulos que forman discípulos
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
