"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useUserRoles } from "@/hooks/use-user-roles"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function DashboardLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </div>
    </div>
  )
}

function NoAccessMessage() {
  const router = useRouter()
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
        <div className="rounded-full bg-muted p-6">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-8a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Sin acceso al Dashboard</h2>
        <p className="text-muted-foreground">
          Aún no tienes un rol asignado. Contacta a un administrador para que te
          asigne un rol y puedas acceder a las funcionalidades del dashboard.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: authLoading } = useAuth()
  const { hasDashboardAccess, loading: rolesLoading } = useUserRoles()
  const router = useRouter()
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Inicio"
    if (pathname.includes("/archivos")) return "Archivos"
    if (pathname.includes("/calendario")) return "Calendario"
    if (pathname.includes("/gestion")) return "Gestión"
    if (pathname.includes("/reportes")) return "Reportes"
    if (pathname.includes("/cursos")) return "Cursos"
    if (pathname.includes("/notificaciones")) return "Notificaciones"
    if (pathname.includes("/configuracion")) return "Configuración"
    return "Dashboard"
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  // Mostrar loading mientras carga
  if (authLoading || rolesLoading) {
    return <DashboardLoading />
  }

  // Si no hay usuario, no mostrar nada (se redirige)
  if (!user) {
    return null
  }

  // Si no tiene acceso al dashboard, mostrar mensaje
  if (!hasDashboardAccess) {
    return <NoAccessMessage />
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
