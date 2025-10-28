import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 md:space-x-3 mb-4">
              <div>
                <h3 className="font-bold text-lg md:text-xl">VIDA SCMX</h3>
                <p className="text-xs md:text-sm text-primary-foreground/80">Alcanzar • Edificar • Multiplicar</p>
              </div>
            </div>
            <p className="text-sm md:text-base text-primary-foreground/80 mb-4 max-w-md leading-relaxed">
              Una comunidad de fe comprometida con transformar vidas y expandir el Reino de Dios a través del amor, la
              enseñanza y el servicio.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm md:text-base text-primary-foreground/80 hover:text-primary-foreground transition-all hover:underline hover:translate-x-1 inline-block cursor-pointer"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/nosotros"
                  className="text-sm md:text-base text-primary-foreground/80 hover:text-primary-foreground transition-all hover:underline hover:translate-x-1 inline-block cursor-pointer"
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  className="text-sm md:text-base text-primary-foreground/80 hover:text-primary-foreground transition-all hover:underline hover:translate-x-1 inline-block cursor-pointer"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contacto"
                  className="text-sm md:text-base text-primary-foreground/80 hover:text-primary-foreground transition-all hover:underline hover:translate-x-1 inline-block cursor-pointer"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">Contacto</h4>
            <div className="space-y-2 text-sm md:text-base text-primary-foreground/80">
              <p className="flex items-start gap-2">
                <span>📍</span>
                <span>AVENIDA CENTRAL #153 COL.  SAN JOAQUN CP. 24157</span>
                <span> CIUDAD DEL CARMEN, CAMPECHE</span>
              </p>
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ info@vidasc.mx</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-6 md:pt-8 text-center">
          <p className="text-xs md:text-sm text-primary-foreground/60">
            © 2025 Vida SCMX. Todos los derechos reservados. Hecho con ❤️ para la gloria de Dios.
          </p>
        </div>
      </div>
    </footer>
  )
}
