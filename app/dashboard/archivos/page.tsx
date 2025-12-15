"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FolderOpen,
  FileText,
  FileImage,
  FileVideo,
  FilePlus,
  Upload,
  Search,
  MoreVertical,
  Download,
  Trash2,
  Share2,
  Eye,
  Grid,
  List,
  Filter,
  FolderPlus,
} from "lucide-react"

// Datos de ejemplo
const mockFiles = [
  {
    id: "1",
    name: "Guía de Estudio - Romanos",
    type: "document",
    size: "2.4 MB",
    modified: "2024-12-10",
    shared: false,
  },
  {
    id: "2",
    name: "Notas de la reunión",
    type: "document",
    size: "156 KB",
    modified: "2024-12-08",
    shared: true,
  },
  {
    id: "3",
    name: "Foto del evento",
    type: "image",
    size: "4.2 MB",
    modified: "2024-12-05",
    shared: false,
  },
  {
    id: "4",
    name: "Video testimonio",
    type: "video",
    size: "45 MB",
    modified: "2024-12-01",
    shared: true,
  },
  {
    id: "5",
    name: "Planificación mensual",
    type: "document",
    size: "890 KB",
    modified: "2024-11-28",
    shared: false,
  },
]

const mockFolders = [
  { id: "1", name: "Estudios Bíblicos", items: 12 },
  { id: "2", name: "Recursos de Liderazgo", items: 8 },
  { id: "3", name: "Materiales de Célula", items: 15 },
  { id: "4", name: "Documentos Personales", items: 5 },
]

function getFileIcon(type: string) {
  switch (type) {
    case "document":
      return FileText
    case "image":
      return FileImage
    case "video":
      return FileVideo
    default:
      return FileText
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function ArchivosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Archivos</h1>
          <p className="text-muted-foreground">
            Gestiona tus documentos y recursos personales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Nueva Carpeta
          </Button>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Subir Archivo
          </Button>
        </div>
      </div>

      {/* Tabs de navegación */}
      <Tabs defaultValue="todos" className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="compartidos">Compartidos</TabsTrigger>
            <TabsTrigger value="recientes">Recientes</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar archivos..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="todos" className="space-y-4">
          {/* Carpetas */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Carpetas</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {mockFolders.map((folder) => (
                <Card
                  key={folder.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{folder.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {folder.items} elementos
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Archivos */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Archivos</h2>
            {viewMode === "list" ? (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden md:table-cell">Tamaño</TableHead>
                      <TableHead className="hidden md:table-cell">Modificado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No se encontraron archivos
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFiles.map((file) => {
                        const FileIcon = getFileIcon(file.type)
                        return (
                          <TableRow key={file.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-muted p-2">
                                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  {file.shared && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                      Compartido
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              {file.size}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              {formatDate(file.modified)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Compartir
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type)
                  return (
                    <Card
                      key={file.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="rounded-lg bg-muted p-4">
                            <FileIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm truncate w-full">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file.size}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <Card className="flex flex-col items-center justify-center p-12">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documentos</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Aquí encontrarás todos tus documentos de texto, PDFs y presentaciones.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="compartidos">
          <Card className="flex flex-col items-center justify-center p-12">
            <Share2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Archivos Compartidos</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Visualiza los archivos que han sido compartidos contigo por otros miembros.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="recientes">
          <Card className="flex flex-col items-center justify-center p-12">
            <FolderOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Archivos Recientes</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Accede rápidamente a los archivos que has utilizado recientemente.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
