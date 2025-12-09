import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Función para generar slug único
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// GET - Listar todos los posts (admin)
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    
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

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si el usuario tiene permisos (admin, pastor, lider)
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const hasPermission = userRoles?.some((role: any) => 
      ['admin', 'pastor', 'lider'].includes(role.role_name)
    )
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'No tienes permisos para ver posts' }, { status: 403 })
    }

    // Obtener posts con información de categoría
    const { data: posts, error } = await supabase
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
        updated_at,
        categoria_id,
        categorias (
          id,
          nombre,
          slug,
          color,
          icono
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Formatear posts
    const formattedPosts = (posts || []).map(post => ({
      id: post.id,
      titulo: post.titulo,
      slug: post.slug,
      contenido: post.contenido,
      resumen: post.resumen,
      autor_id: post.autor_id,
      publicado: post.publicado,
      fecha_publicacion: post.fecha_publicacion,
      vistas: post.vistas,
      created_at: post.created_at,
      updated_at: post.updated_at,
      categoria_id: post.categoria_id,
      categoria_nombre: post.categorias ? (post.categorias as any).nombre : null,
      categoria_slug: post.categorias ? (post.categorias as any).slug : null,
      categoria_color: post.categorias ? (post.categorias as any).color : null,
      categoria_icono: post.categorias ? (post.categorias as any).icono : null,
    }))

    return NextResponse.json({ posts: formattedPosts }, { status: 200 })
  } catch (error) {
    console.error('Error in posts API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nuevo post
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    
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

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const hasPermission = userRoles?.some((role: any) => 
      ['admin', 'pastor', 'lider'].includes(role.role_name)
    )
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'No tienes permisos para crear posts' }, { status: 403 })
    }

    const body = await request.json()
    const { titulo, contenido, resumen, categoria_id, publicado } = body

    if (!titulo || !contenido) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      )
    }

    // Generar slug único
    let baseSlug = generateSlug(titulo)
    let slug = baseSlug
    let counter = 1

    // Verificar unicidad del slug
    while (true) {
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear el post
    const { data: newPost, error } = await supabase
      .from('blog_posts')
      .insert({
        titulo,
        slug,
        contenido,
        resumen: resumen || contenido.substring(0, 200) + '...',
        categoria_id: categoria_id || null,
        autor_id: user.id,
        publicado: publicado || false,
        fecha_publicacion: publicado ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: newPost }, { status: 201 })
  } catch (error) {
    console.error('Error in create post API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Actualizar post
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    
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

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const hasPermission = userRoles?.some((role: any) => 
      ['admin', 'pastor', 'lider'].includes(role.role_name)
    )
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'No tienes permisos para editar posts' }, { status: 403 })
    }

    const body = await request.json()
    const { id, titulo, contenido, resumen, categoria_id, publicado } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de post requerido' }, { status: 400 })
    }

    // Verificar que el post existe
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('autor_id, publicado, fecha_publicacion')
      .eq('id', id)
      .single()

    if (!existingPost) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
    }

    // Preparar datos de actualización
    const updateData: any = {
      titulo,
      contenido,
      resumen: resumen || contenido?.substring(0, 200) + '...',
      categoria_id: categoria_id || null,
      publicado,
      updated_at: new Date().toISOString(),
    }

    // Si se está publicando por primera vez, establecer fecha de publicación
    if (publicado && !existingPost.fecha_publicacion) {
      updateData.fecha_publicacion = new Date().toISOString()
    }

    const { data: updatedPost, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: updatedPost }, { status: 200 })
  } catch (error) {
    console.error('Error in update post API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar post
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    
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

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const isAdmin = userRoles?.some((role: any) => role.role_name === 'admin')
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar posts' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json({ error: 'ID de post requerido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId)

    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Post eliminado exitosamente' }, { status: 200 })
  } catch (error) {
    console.error('Error in delete post API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

