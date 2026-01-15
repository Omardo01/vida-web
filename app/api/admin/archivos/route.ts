import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Listar todos los archivos (solo admin)
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
    if (authError || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { data: userRoles } = await supabase.rpc('get_user_roles', { user_uuid: user.id })
    const isAdmin = userRoles?.some((role: any) => role.role_name === 'admin')
    if (!isAdmin) return NextResponse.json({ error: 'Prohibido' }, { status: 403 })

    const { data: archivos, error } = await supabase
      .from('archivos')
      .select(`
        *,
        archivo_roles(role_id)
      `)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ archivos }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST - Crear archivo
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
    if (authError || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { data: userRoles } = await supabase.rpc('get_user_roles', { user_uuid: user.id })
    const isAdmin = userRoles?.some((role: any) => role.role_name === 'admin')
    if (!isAdmin) return NextResponse.json({ error: 'Prohibido' }, { status: 403 })

    const { nombre, url, descripcion, role_ids } = await request.json()

    if (!nombre || !url) return NextResponse.json({ error: 'Nombre y URL requeridos' }, { status: 400 })

    // Insertar archivo
    const { data: archivo, error: archivoError } = await supabase
      .from('archivos')
      .insert({ nombre, url, descripcion, created_by: user.id })
      .select()
      .single()

    if (archivoError) return NextResponse.json({ error: archivoError.message }, { status: 500 })

    // Insertar roles asociados
    if (role_ids && role_ids.length > 0) {
      const rolesData = role_ids.map((role_id: string) => ({
        archivo_id: archivo.id,
        role_id: role_id
      }))
      const { error: rolesError } = await supabase
        .from('archivo_roles')
        .insert(rolesData)

      if (rolesError) return NextResponse.json({ error: rolesError.message }, { status: 500 })
    }

    return NextResponse.json({ archivo }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE - Eliminar archivo
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
    if (authError || !user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { data: userRoles } = await supabase.rpc('get_user_roles', { user_uuid: user.id })
    const isAdmin = userRoles?.some((role: any) => role.role_name === 'admin')
    if (!isAdmin) return NextResponse.json({ error: 'Prohibido' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    const { error } = await supabase
      .from('archivos')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ message: 'Eliminado' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
