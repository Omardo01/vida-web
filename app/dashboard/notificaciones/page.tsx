"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react"

// Notificaciones de ejemplo
const mockNotifications = [
  {
    id: "1",
    title: "Nueva reunión programada",
    message: "Se ha programado una reunión de líderes para el miércoles a las 7pm.",
    type: "calendar",
    read: false,
    date: "2024-12-15T10:30:00",
  },
  {
    id: "2",
    title: "Documento compartido",
    message: "María García te ha compartido 'Guía de Estudio - Romanos'.",
    type: "file",
    read: false,
    date: "2024-12-14T15:45:00",
  },
  {
    id: "3",
    title: "Nuevo miembro en tu célula",
    message: "Carlos López se ha unido a tu célula.",
    type: "users",
    read: false,
    date: "2024-12-13T09:00:00",
  },
  {
    id: "4",
    title: "Mensaje del pastor",
    message: "El pastor ha enviado un mensaje importante para todos los líderes.",
    type: "message",
    read: true,
    date: "2024-12-12T14:20:00",
  },
  {
    id: "5",
    title: "Recordatorio de célula",
    message: "Tu célula se reúne mañana a las 8pm.",
    type: "calendar",
    read: true,
    date: "2024-12-11T18:00:00",
  },
]

const notificationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  file: FileText,
  users: Users,
  message: MessageSquare,
}

const notificationColors: Record<string, string> = {
  calendar: "bg-blue-500/10 text-blue-500",
  file: "bg-green-500/10 text-green-500",
  users: "bg-purple-500/10 text-purple-500",
  message: "bg-orange-500/10 text-orange-500",
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return "Hace unos minutos"
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays === 1) return "Ayer"
  if (diffDays < 7) return `Hace ${diffDays} días`
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: typeof mockNotifications[0]
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const Icon = notificationIcons[notification.type] || Bell

  return (
    <div
      className={`flex gap-4 p-4 rounded-lg border transition-colors ${
        notification.read
          ? "bg-background"
          : "bg-primary/5 border-primary/20"
      }`}
    >
      <div
        className={`rounded-full p-3 ${notificationColors[notification.type]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatTimeAgo(notification.date)}
            </p>
          </div>
          {!notification.read && (
            <Badge variant="default" className="shrink-0">
              Nueva
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMarkRead(notification.id)}
            title="Marcar como leída"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(notification.id)}
          title="Eliminar"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `Tienes ${unreadCount} notificaciones sin leer`
              : "Todas las notificaciones han sido leídas"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" className="gap-2" onClick={handleMarkAllRead}>
              <CheckCheck className="h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Todas
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Sin leer
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Leídas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12">
              <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin notificaciones</h3>
              <p className="text-muted-foreground text-center">
                No tienes notificaciones por el momento.
              </p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3">
          {unreadNotifications.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12">
              <CheckCheck className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Todo al día</h3>
              <p className="text-muted-foreground text-center">
                Has leído todas tus notificaciones.
              </p>
            </Card>
          ) : (
            unreadNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-3">
          {readNotifications.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12">
              <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin historial</h3>
              <p className="text-muted-foreground text-center">
                No hay notificaciones leídas.
              </p>
            </Card>
          ) : (
            readNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
