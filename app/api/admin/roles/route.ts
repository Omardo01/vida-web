import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Forzar renderizado dinámico (esta ruta usa cookies)
export const dynamic = 'force-dynamic'

// GET - Listar todos los roles
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

    // Obtener todos los roles con conteo de usuarios
    const { data: roles, error } = await supabase
      .from('roles')
      .select(`
        *,
        user_roles (count)
      `)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching roles:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ roles }, { status: 200 })
  } catch (error) {
    console.error('Error in roles API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nuevo rol
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
    const { name, display_name, description, color } = body

    if (!name || !display_name) {
      return NextResponse.json(
        { error: 'Nombre y nombre a mostrar son requeridos' },
        { status: 400 }
      )
    }

    // Crear el rol
    const { data: newRole, error } = await supabase
      .from('roles')
      .insert({
        name: name.toLowerCase().replace(/\s+/g, '_'),
        display_name,
        description: description || null,
        color: color || '#3B82F6',
        is_system: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating role:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ role: newRole }, { status: 201 })
  } catch (error) {
    console.error('Error in create role API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar rol
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
    const roleId = searchParams.get('id')

    if (!roleId) {
      return NextResponse.json({ error: 'ID de rol requerido' }, { status: 400 })
    }

    // Verificar que no sea un rol del sistema
    const { data: role } = await supabase
      .from('roles')
      .select('is_system')
      .eq('id', roleId)
      .single()

    if (role?.is_system) {
      return NextResponse.json(
        { error: 'No se pueden eliminar roles del sistema' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId)

    if (error) {
      console.error('Error deleting role:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Rol eliminado exitosamente' }, { status: 200 })
  } catch (error) {
    console.error('Error in delete role API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

