"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { RainbowButtonSimple } from "@/components/ui/rainbow-button-simple"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AuthDialog } from "@/components/auth-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useUserRoles } from "@/hooks/use-user-roles"

export function Header() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut, loading } = useAuth()
  const { hasAdminAccess, loading: rolesLoading } = useUserRoles()

  const navigationLinks = [
    { href: "/", label: "Inicio" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "#blog", label: "Blog" },
    { href: "/contacto", label: "Contacto" },
  ]

  return (
    <>
      <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 min-w-0 hover:opacity-80 transition-opacity">
            <Image 
              src="/images/logo-corto.png" 
              alt="Vida SCMX Logo" 
              width={80} 
              height={40} 
              className="h-8 w-auto md:h-10 object-contain flex-shrink-0" 
            />
            <div className="min-w-0">
              <h1 className="font-bold text-base md:text-xl text-foreground truncate">VIDA SCMX</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">Alcanzar • Edificar • Multiplicar</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-2">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {hasAdminAccess && !rolesLoading && (
                      <Button
                        asChild
                        variant="default"
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs md:text-sm hidden sm:flex"
                      >
                        <a href="/admin">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Admin
                        </a>
                      </Button>
                    )}
                    <span className="text-xs md:text-sm text-foreground hidden xl:block max-w-[150px] truncate">
                      {user.email}
                    </span>
                    <Button
                      onClick={() => signOut()}
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs md:text-sm"
                    >
                      Salir
                    </Button>
                  </div>
                ) : (
                  <RainbowButtonSimple 
                    onClick={() => setAuthDialogOpen(true)}
                    className="text-xs md:text-sm px-3 md:px-6 h-8 md:h-10"
                  >
                    Iniciar Sesión
                  </RainbowButtonSimple>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigationLinks.map((link) => (
                    link.href.startsWith('#') ? (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5"
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                  {user && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground px-4 mb-2">Sesión</p>
                      <p className="text-sm font-medium px-4 mb-4 break-all">{user.email}</p>
                      <div className="space-y-2">
                        {hasAdminAccess && !rolesLoading && (
                          <Button
                            asChild
                            variant="default"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <a href="/admin" onClick={() => setMobileMenuOpen(false)}>
                              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Panel de Administración
                            </a>
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            signOut()
                            setMobileMenuOpen(false)
                          }}
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          Cerrar Sesión
                        </Button>
                      </div>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  )
}
