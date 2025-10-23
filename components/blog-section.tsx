"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TextAnimate } from "@/components/ui/text-animate"

const blogPosts = [
  {
    id: 1,
    title: "Ejemplo número 1 de Blog",
    excerpt: "Este es un ejemplo de contenido para el blog número 1. Aquí se mostrará una breve descripción del tema a tratar.",
    date: "15 de Enero, 2025",
    category: "General",
    image: "/placeholder.svg",
    author: "Autor Ejemplo",
  },
  {
    id: 2,
    title: "Ejemplo número 2 de Blog",
    excerpt: "Este es un ejemplo de contenido para el blog número 2. Aquí se mostrará una breve descripción del tema a tratar.",
    date: "12 de Enero, 2025",
    category: "General",
    image: "/placeholder.svg",
    author: "Autor Ejemplo",
  },
  {
    id: 3,
    title: "Ejemplo número 3 de Blog",
    excerpt: "Este es un ejemplo de contenido para el blog número 3. Aquí se mostrará una breve descripción del tema a tratar.",
    date: "10 de Enero, 2025",
    category: "General",
    image: "/placeholder.svg",
    author: "Autor Ejemplo",
  },
  {
    id: 4,
    title: "Ejemplo número 4 de Blog",
    excerpt: "Este es un ejemplo de contenido para el blog número 4. Aquí se mostrará una breve descripción del tema a tratar.",
    date: "8 de Enero, 2025",
    category: "General",
    image: "/placeholder.svg",
    author: "Autor Ejemplo",
  },
  {
    id: 5,
    title: "Ejemplo número 5 de Blog",
    excerpt: "Este es un ejemplo de contenido para el blog número 5. Aquí se mostrará una breve descripción del tema a tratar.",
    date: "5 de Enero, 2025",
    category: "General",
    image: "/placeholder.svg",
    author: "Autor Ejemplo",
  },
  {
    id: 6,
    title: "Ejemplo número 6 de Blog",
    excerpt: "Este es un ejemplo de contenido para el blog número 6. Aquí se mostrará una breve descripción del tema a tratar.",
    date: "3 de Enero, 2025",
    category: "General",
    image: "/placeholder.svg",
    author: "Autor Ejemplo",
  },
]

export function BlogSection() {
  return (
    <section id="blog" className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Título de la sección con animación */}
        <div className="text-center mb-10 md:mb-16">
          <TextAnimate
            animation="blurInUp"
            by="word"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-balance"
          >
            Reflexiones y Enseñanzas
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            by="word"
            delay={0.3}
            as="p"
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4"
          >
            Comparte nuestro caminar de fe a través de reflexiones enseñanzas y testimonios que edifican y fortalecen nuestra comunidad
          </TextAnimate>
        </div>

        {/* Grid de posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-xs md:text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors text-balance">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-4 md:p-6 md:pt-0">
                <p className="text-sm md:text-base text-muted-foreground mb-4 text-pretty leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs md:text-sm font-medium text-primary">{post.author}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs md:text-sm text-primary hover:text-primary-foreground hover:bg-primary"
                  >
                    Leer más →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botón para ver todos */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto px-8 py-5 md:py-6 text-sm md:text-base"
          >
            Ver Todos los Posts
          </Button>
        </div>
      </div>
    </section>
  )
}
