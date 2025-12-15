"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CalendarDays,
  Info,
  X,
} from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  description: string | null
  location: string | null
  start_date: string
  end_date: string | null
  all_day: boolean
  event_type: string
  color: string
  is_cancelled: boolean
}

const eventTypeLabels: Record<string, string> = {
  general: "General",
  servicio: "Servicio",
  celula: "Célula",
  reunion: "Reunión",
  ensayo: "Ensayo",
  curso: "Curso",
  actividad: "Actividad",
  conferencia: "Conferencia",
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString)
  return {
    day: date.getDate(),
    month: date.toLocaleDateString("es-ES", { month: "short" }),
    weekday: date.toLocaleDateString("es-ES", { weekday: "short" }),
  }
}

function EventCard({
  event,
  onClick,
}: {
  event: CalendarEvent
  onClick: () => void
}) {
  const dateInfo = formatShortDate(event.start_date)

  return (
    <Card
      className={`hover:shadow-md transition-all cursor-pointer ${
        event.is_cancelled ? "opacity-60" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div
            className="flex flex-col items-center justify-center w-14 h-14 rounded-lg text-white flex-shrink-0"
            style={{ backgroundColor: event.color }}
          >
            <span className="text-xl font-bold">{dateInfo.day}</span>
            <span className="text-xs uppercase">{dateInfo.month}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3
                  className={`font-semibold truncate ${
                    event.is_cancelled ? "line-through" : ""
                  }`}
                >
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: event.color, color: event.color }}
                  >
                    {eventTypeLabels[event.event_type] || event.event_type}
                  </Badge>
                  {event.is_cancelled && (
                    <Badge variant="destructive" className="text-xs">
                      Cancelado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              {!event.all_day && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(event.start_date)}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EventDetailDialog({
  event,
  open,
  onClose,
}: {
  event: CalendarEvent | null
  open: boolean
  onClose: () => void
}) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <div>
              <DialogTitle
                className={event.is_cancelled ? "line-through" : ""}
              >
                {event.title}
              </DialogTitle>
              <DialogDescription className="mt-1">
                <Badge
                  variant="outline"
                  style={{ borderColor: event.color, color: event.color }}
                >
                  {eventTypeLabels[event.event_type] || event.event_type}
                </Badge>
                {event.is_cancelled && (
                  <Badge variant="destructive" className="ml-2">
                    Cancelado
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Fecha y hora */}
          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{formatDate(event.start_date)}</p>
              {!event.all_day && (
                <p className="text-sm text-muted-foreground">
                  {formatTime(event.start_date)}
                  {event.end_date && ` - ${formatTime(event.end_date)}`}
                </p>
              )}
              {event.all_day && (
                <p className="text-sm text-muted-foreground">Todo el día</p>
              )}
            </div>
          </div>

          {/* Ubicación */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Ubicación</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>
          )}

          {/* Descripción */}
          {event.description && (
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Descripción</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CalendarioPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetchEvents()
  }, [currentMonth])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      // Obtener eventos del mes actual y los próximos 2 meses
      const fromDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const toDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 3, 0)

      const response = await fetch(
        `/api/events?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`
      )

      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setDialogOpen(true)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  // Agrupar eventos por fecha
  const groupEventsByDate = (events: CalendarEvent[]) => {
    const grouped: Record<string, CalendarEvent[]> = {}

    events.forEach((event) => {
      const dateKey = new Date(event.start_date).toISOString().split("T")[0]
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })

    return grouped
  }

  // Filtrar eventos próximos (desde hoy)
  const upcomingEvents = events.filter(
    (event) => new Date(event.start_date) >= new Date(new Date().setHours(0, 0, 0, 0))
  )

  const groupedEvents = groupEventsByDate(upcomingEvents)
  const sortedDates = Object.keys(groupedEvents).sort()

  const monthName = currentMonth.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">
            Visualiza los próximos eventos y actividades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mes actual */}
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold capitalize">{monthName}</h2>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-14 w-14 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : upcomingEvents.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12">
          <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sin eventos próximos</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No hay eventos programados para los próximos días. Los eventos
            aparecerán aquí cuando sean creados por los administradores.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateKey) => {
            const dayEvents = groupedEvents[dateKey]
            const date = new Date(dateKey)
            const isToday =
              date.toDateString() === new Date().toDateString()
            const isTomorrow =
              date.toDateString() ===
              new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()

            let dateLabel = date.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })

            if (isToday) dateLabel = "Hoy"
            if (isTomorrow) dateLabel = "Mañana"

            return (
              <div key={dateKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-sm font-medium capitalize ${
                      isToday ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {dateLabel}
                  </h3>
                  {isToday && (
                    <Badge variant="default" className="text-xs">
                      Hoy
                    </Badge>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {dayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Estadísticas rápidas */}
      {upcomingEvents.length > 0 && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {upcomingEvents.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Eventos próximos
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {
                    upcomingEvents.filter(
                      (e) =>
                        new Date(e.start_date).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Hoy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {
                    upcomingEvents.filter(
                      (e) =>
                        new Date(e.start_date) <=
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Esta semana</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {new Set(upcomingEvents.map((e) => e.event_type)).size}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tipos de evento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de detalles */}
      <EventDetailDialog
        event={selectedEvent}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setSelectedEvent(null)
        }}
      />
    </div>
  )
}
