import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/vida-sc-logo.png"
                alt="Vida SC Logo"
                width={40}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
              <div>
                <h3 className="font-bold text-xl">VIDA SC</h3>
                <p className="text-sm text-primary-foreground/80">Alcanzar • Edificar • Multiplicar</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md leading-relaxed">
              Una comunidad de fe comprometida con transformar vidas y expandir el Reino de Dios a través del amor, la
              enseñanza y el servicio.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#inicio"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#nosotros"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#blog" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <p>📍 Calle Principal 123, Ciudad</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ info@vidasc.org</p>
              <p>🕐 Dom 9:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2025 Vida SC. Todos los derechos reservados. Hecho con ❤️ para la gloria de Dios.
          </p>
        </div>
      </div>
    </footer>
  )
}
