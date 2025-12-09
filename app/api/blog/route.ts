import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Obtener posts públicos
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {},
        },
      }
    )

    // Consulta para posts publicados con información de categoría
    let query = supabase
      .from('blog_posts')
      .select(`
        id,
        titulo,
        slug,
        contenido,
        resumen,
        autor_id,
        publicado,
        fecha_publicacion,
        vistas,
        created_at,
        categoria_id,
        categorias (
          id,
          nombre,
          slug,
          color,
          icono
        )
      `)
      .eq('publicado', true)
      .order('fecha_publicacion', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1)

    const { data: posts, error } = await query

    if (error) {
      console.error('Error fetching public posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Formatear posts para el frontend
    const formattedPosts = (posts || []).map(post => ({
      id: post.id,
      titulo: post.titulo,
      slug: post.slug,
      resumen: post.resumen,
      contenido: post.contenido,
      autor_id: post.autor_id,
      publicado: post.publicado,
      fecha_publicacion: post.fecha_publicacion,
      vistas: post.vistas,
      created_at: post.created_at,
      categoria: post.categorias ? {
        id: (post.categorias as any).id,
        nombre: (post.categorias as any).nombre,
        slug: (post.categorias as any).slug,
        color: (post.categorias as any).color,
        icono: (post.categorias as any).icono,
      } : null
    }))

    return NextResponse.json({ posts: formattedPosts }, { status: 200 })
  } catch (error) {
    console.error('Error in public blog API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

