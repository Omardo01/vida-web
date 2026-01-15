"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileBarChart,
  Settings,
  ChevronDown,
  LogOut,
  Home,
  BookOpen,
  Calendar,
  Bell,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useUserRoles } from "@/hooks/use-user-roles"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Definición de elementos del menú
const mainMenuItems = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "pastor", "lider", "celula", "curso", "usuario"],
  },
  {
    title: "Archivos",
    url: "/dashboard/archivos",
    icon: FolderOpen,
    roles: ["admin", "pastor", "lider", "celula", "curso", "usuario"],
  },
  {
    title: "Calendario",
    url: "/dashboard/calendario",
    icon: Calendar,
    roles: ["admin", "pastor", "lider", "celula", "curso", "usuario"],
  },
]

const managementMenuItems = [
  {
    title: "Gestión (futuro)",
    url: "/dashboard/gestion",
    icon: Users,
    roles: ["admin", "pastor", "lider"],
    subItems: [
      { title: "Mi Equipo", url: "/dashboard/gestion/equipo" },
      { title: "Células", url: "/dashboard/gestion/celulas", roles: ["admin", "pastor", "lider"] },
      { title: "Asistencia", url: "/dashboard/gestion/asistencia" },
    ],
  },
  {
    title: "Reportes (futuro)",
    url: "/dashboard/reportes",
    icon: FileBarChart,
    roles: ["admin", "pastor", "lider"],
    subItems: [
      { title: "Resumen General", url: "/dashboard/reportes/resumen" },
      { title: "Estadísticas", url: "/dashboard/reportes/estadisticas" },
      { title: "Exportar", url: "/dashboard/reportes/exportar" },
    ],
  },
  {
    title: "Cursos (futuro)",
    url: "/dashboard/cursos",
    icon: BookOpen,
    roles: ["admin", "pastor", "lider", "curso"],
  },
]

interface NavItemProps {
  item: {
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    roles?: string[]
    subItems?: { title: string; url: string; roles?: string[] }[]
  }
  userRoles: string[]
}

function NavItem({ item, userRoles }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
  const [isOpen, setIsOpen] = React.useState(isActive)
  
  // Verificar si el usuario tiene acceso a este ítem
  if (item.roles && !item.roles.some(role => userRoles.includes(role))) {
    return null
  }

  const Icon = item.icon

  if (item.subItems) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.title}
              size="lg"
            >
              <Icon />
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                  isOpen && "rotate-180"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems
                .filter(
                  (subItem) =>
                    !subItem.roles ||
                    subItem.roles.some((role) => userRoles.includes(role))
                )
                .map((subItem) => (
                  <SidebarMenuSubItem key={subItem.url}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === subItem.url}
                    >
                      <Link href={subItem.url}>{subItem.title}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} size="lg">
        <Link href={item.url}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function DashboardSidebar() {
  const { user, signOut } = useAuth()
  const { roles, primaryRole, hasManagementRole } = useUserRoles()
  
  const userRoleNames = roles.map((r) => r.role_name)

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-16 border-b border-sidebar-border p-0 px-2 flex flex-col justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Inicio">
              <Link href="/" className="flex items-center justify-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0 transition-all">
                  <Home className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                  <span className="truncate font-semibold">VIDA SC</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Panel de Usuario
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Menú Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <NavItem
                  key={item.url}
                  item={item}
                  userRoles={userRoleNames}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menú de Gestión (solo para roles con permisos) */}
        {hasManagementRole && (
          <SidebarGroup className="opacity-50 grayscale-[0.5] pointer-events-none select-none">
            <SidebarGroupLabel>Gestión (Próximamente)</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementMenuItems.map((item) => (
                  <NavItem
                    key={item.url}
                    item={item}
                    userRoles={userRoleNames}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Notificaciones */}
        <SidebarGroup className="opacity-50 grayscale-[0.5] pointer-events-none select-none">
          <SidebarGroupLabel>Notificaciones (Próximamente)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Notificaciones">
                  <Link href="/dashboard/notificaciones">
                    <Bell />
                    <span>Notificaciones</span>
                    <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">
                      3
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="h-16 border-t border-sidebar-border p-0 px-2 flex flex-col justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center shrink-0">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt={user?.email || "Usuario"}
                      />
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        {user?.email ? getInitials(user.email) : "US"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                    <span className="truncate font-semibold">
                      {user?.email?.split("@")[0] || "Usuario"}
                    </span>
                    <span className="truncate text-xs">
                      {primaryRole ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0"
                          style={{ borderColor: primaryRole.color, color: primaryRole.color }}
                        >
                          {primaryRole.display_name}
                        </Badge>
                      ) : (
                        user?.email
                      )}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        alt={user?.email || "Usuario"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.email ? getInitials(user.email) : "US"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.email?.split("@")[0]}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/configuracion">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
