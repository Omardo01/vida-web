import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image src="/images/vida-sc-logo.png" alt="Vida SC Logo" width={40} height={40} className="h-10 w-auto" />
          <div>
            <h1 className="font-bold text-xl text-foreground">VIDA SC</h1>
            <p className="text-xs text-muted-foreground">Alcanzar • Edificar • Multiplicar</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#inicio" className="text-foreground hover:text-primary transition-colors">
            Inicio
          </a>
          <a href="#nosotros" className="text-foreground hover:text-primary transition-colors">
            Nosotros
          </a>
          <a href="#blog" className="text-foreground hover:text-primary transition-colors">
            Blog
          </a>
          <a href="#contacto" className="text-foreground hover:text-primary transition-colors">
            Contacto
          </a>
        </nav>

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Únete</Button>
      </div>
    </header>
  )
}
