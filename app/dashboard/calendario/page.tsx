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

function formatDate(dateString: string, allDay: boolean = false) {
  const date = new Date(dateString)
  
  if (allDay) {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    })
  }

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

function formatShortDate(dateString: string, allDay: boolean = false) {
  const date = new Date(dateString)
  
  if (allDay) {
    return {
      day: parseInt(dateString.split("T")[0].split("-")[2]),
      month: date.toLocaleDateString("es-ES", { month: "short", timeZone: "UTC" }),
      weekday: date.toLocaleDateString("es-ES", { weekday: "short", timeZone: "UTC" }),
    }
  }

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
  return (
    <Card
      className={`hover:shadow-md transition-all cursor-pointer border-l-4 ${
        event.is_cancelled ? "opacity-60" : ""
      }`}
      style={{ borderLeftColor: event.color }}
      onClick={onClick}
    >
      <CardContent className="p-2 md:p-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`font-semibold text-sm md:text-base truncate ${
                event.is_cancelled ? "line-through" : ""
              }`}
            >
              {event.title}
            </h3>
            <Badge
              variant="outline"
              className="text-[10px] h-4 px-1 shrink-0"
              style={{ borderColor: event.color, color: event.color }}
            >
              {eventTypeLabels[event.event_type] || event.event_type}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-xs text-muted-foreground">
            {!event.all_day && (
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="h-3 w-3" />
                {formatTime(event.start_date)}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1 truncate max-w-full">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
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
              <p className="font-medium">{formatDate(event.start_date, event.all_day)}</p>
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
      let dateKey: string
      if (event.all_day) {
        // Para todo el día usamos la fecha UTC directamente
        dateKey = event.start_date.split("T")[0]
      } else {
        // Para eventos con hora usamos la fecha local
        const date = new Date(event.start_date)
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })

    return grouped
  }

  // Filtrar eventos próximos (desde hoy)
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.start_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Si es todo el día, comparamos con la fecha UTC
    if (event.all_day) {
      const utcEventDate = new Date(event.start_date.split("T")[0] + "T00:00:00")
      return utcEventDate >= today
    }
    
    return eventDate >= today
  })

  const groupedEvents = groupEventsByDate(upcomingEvents)
  const sortedDates = Object.keys(groupedEvents).sort()

  const monthName = currentMonth.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-6 p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight capitalize">{monthName}</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Eventos y actividades programadas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} className="h-8">
            Hoy
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
        <div className="space-y-8">
          {sortedDates.map((dateKey) => {
            const dayEvents = groupedEvents[dateKey]
            const date = new Date(dateKey + "T00:00:00") // Asegurar fecha correcta local
            const isToday =
              date.toDateString() === new Date().toDateString()
            const isTomorrow =
              date.toDateString() ===
              new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()

            const dateInfo = formatShortDate(dateKey + "T00:00:00", true)

            return (
              <div key={dateKey} className="flex flex-col md:flex-row gap-3 md:gap-6 pb-6 border-b last:border-0 border-muted/30">
                {/* Columna Fecha */}
                <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-0.5 min-w-[80px] shrink-0">
                  <span className={`text-3xl md:text-4xl font-bold leading-none ${isToday ? "text-primary" : "text-muted-foreground/40"}`}>
                    {dateInfo.day}
                  </span>
                  <div className="flex flex-col md:mt-0.5">
                    <span className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground/60 leading-none">
                      {dateInfo.month}
                    </span>
                    <span className={`text-[10px] md:text-xs font-medium capitalize ${isToday ? "text-primary font-bold" : "text-muted-foreground/40"}`}>
                      {isToday ? "Hoy" : isTomorrow ? "Mañana" : dateInfo.weekday}
                    </span>
                  </div>
                </div>
                
                {/* Columna Eventos (Stack a la derecha) */}
                <div className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <Card className="mt-4 border-muted/20 bg-muted/5">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary leading-none">
                  {upcomingEvents.length}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  Eventos próximos
                </p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary leading-none">
                  {
                    upcomingEvents.filter(
                      (e) =>
                        new Date(e.start_date).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Hoy</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary leading-none">
                  {
                    upcomingEvents.filter(
                      (e) =>
                        new Date(e.start_date) <=
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Esta semana</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary leading-none">
                  {new Set(upcomingEvents.map((e) => e.event_type)).size}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  Categorías
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
