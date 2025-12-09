import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Listar categorías de blog
export async function GET() {
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

    // Obtener categorías de tipo blog
    const { data: categories, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('tipo', 'blog')
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ categories: categories || [] }, { status: 200 })
  } catch (error) {
    console.error('Error in categories API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nueva categoría
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

    // Verificar si el usuario es admin
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const isAdmin = userRoles?.some((role: any) => role.role_name === 'admin')
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 })
    }

    const body = await request.json()
    const { nombre, descripcion, color, icono } = body

    if (!nombre) {
      return NextResponse.json(
        { error: 'Nombre de categoría es requerido' },
        { status: 400 }
      )
    }

    // Generar slug
    const slug = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Crear la categoría
    const { data: newCategory, error } = await supabase
      .from('categorias')
      .insert({
        nombre,
        slug,
        descripcion: descripcion || null,
        tipo: 'blog',
        color: color || '#3B82F6',
        icono: icono || 'FileText',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Ya existe una categoría con ese nombre' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ category: newCategory }, { status: 201 })
  } catch (error) {
    console.error('Error in create category API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Actualizar categoría
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

    // Verificar si el usuario es admin
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const isAdmin = userRoles?.some((role: any) => role.role_name === 'admin')
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 })
    }

    const body = await request.json()
    const { id, nombre, descripcion, color, icono } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de categoría requerido' }, { status: 400 })
    }

    const { data: updatedCategory, error } = await supabase
      .from('categorias')
      .update({
        nombre,
        descripcion,
        color,
        icono,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ category: updatedCategory }, { status: 200 })
  } catch (error) {
    console.error('Error in update category API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar categoría
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

    // Verificar si el usuario es admin
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const isAdmin = userRoles?.some((role: any) => role.role_name === 'admin')
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('id')

    if (!categoryId) {
      return NextResponse.json({ error: 'ID de categoría requerido' }, { status: 400 })
    }

    // Verificar que no haya posts usando esta categoría
    const { data: postsCount } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact' })
      .eq('categoria_id', categoryId)

    if (postsCount && postsCount.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría que tiene posts asociados' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Categoría eliminada exitosamente' }, { status: 200 })
  } catch (error) {
    console.error('Error in delete category API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

