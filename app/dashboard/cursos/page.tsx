"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  Users,
  Play,
  CheckCircle2,
  Lock,
  Star,
  ChevronRight,
} from "lucide-react"

// Cursos de ejemplo
const myCourses = [
  {
    id: "1",
    title: "Fundamentos de Fe",
    description: "Aprende los principios básicos de la fe cristiana.",
    progress: 65,
    lessons: 6,
    completedLessons: 4,
    duration: "4 horas",
    status: "in_progress",
  },
  {
    id: "2",
    title: "Liderazgo Efectivo",
    description: "Desarrolla habilidades de liderazgo cristiano.",
    progress: 30,
    lessons: 8,
    completedLessons: 2,
    duration: "6 horas",
    status: "in_progress",
  },
  {
    id: "3",
    title: "Introducción a la Biblia",
    description: "Panorama general de las Escrituras.",
    progress: 100,
    lessons: 5,
    completedLessons: 5,
    duration: "3 horas",
    status: "completed",
  },
]

const availableCourses = [
  {
    id: "4",
    title: "Evangelismo Personal",
    description: "Aprende a compartir tu fe de manera efectiva.",
    lessons: 7,
    duration: "5 horas",
    students: 245,
    rating: 4.8,
    category: "Ministerio",
  },
  {
    id: "5",
    title: "Adoración y Alabanza",
    description: "Fundamentos para el ministerio de alabanza.",
    lessons: 10,
    duration: "8 horas",
    students: 189,
    rating: 4.9,
    category: "Música",
  },
  {
    id: "6",
    title: "Consejería Bíblica",
    description: "Principios para aconsejar según la Palabra.",
    lessons: 12,
    duration: "10 horas",
    students: 156,
    rating: 4.7,
    category: "Pastoral",
  },
  {
    id: "7",
    title: "Discipulado Práctico",
    description: "Cómo hacer discípulos de Cristo.",
    lessons: 8,
    duration: "6 horas",
    students: 312,
    rating: 4.9,
    category: "Discipulado",
  },
]

function MyCourseCard({ course }: { course: typeof myCourses[0] }) {
  const isCompleted = course.status === "completed"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </div>
          {isCompleted ? (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completado
            </Badge>
          ) : (
            <Badge variant="secondary">En progreso</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {course.completedLessons} de {course.lessons} lecciones completadas
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {course.duration}
            </div>
            <Button size="sm" className="gap-1">
              {isCompleted ? (
                <>
                  Revisar
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continuar
                  <Play className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AvailableCourseCard({ course }: { course: typeof availableCourses[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge variant="outline">{course.category}</Badge>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {course.lessons} lecciones
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.students}
          </span>
        </div>
        <Button className="w-full">Inscribirme</Button>
      </CardContent>
    </Card>
  )
}

export default function CursosPage() {
  const inProgressCourses = myCourses.filter((c) => c.status === "in_progress")
  const completedCourses = myCourses.filter((c) => c.status === "completed")

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">
            Aprende y crece con nuestros cursos de formación
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myCourses.length}</p>
                <p className="text-sm text-muted-foreground">Mis cursos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Play className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCourses.length}</p>
                <p className="text-sm text-muted-foreground">En progreso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
                <p className="text-sm text-muted-foreground">Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-courses">Mis Cursos</TabsTrigger>
          <TabsTrigger value="available">Disponibles</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
        </TabsList>

        <TabsContent value="my-courses" className="space-y-4">
          {inProgressCourses.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12">
              <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin cursos en progreso</h3>
              <p className="text-muted-foreground text-center mb-4">
                Explora los cursos disponibles y comienza tu aprendizaje.
              </p>
              <Button>Ver cursos disponibles</Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inProgressCourses.map((course) => (
                <MyCourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((course) => (
              <AvailableCourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedCourses.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12">
              <CheckCircle2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin cursos completados</h3>
              <p className="text-muted-foreground text-center">
                Aquí aparecerán los cursos que hayas terminado.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map((course) => (
                <MyCourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
