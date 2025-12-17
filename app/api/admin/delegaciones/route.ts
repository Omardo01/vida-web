import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Obtener todas las delegaciones (admin - incluye inactivas)
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
          setAll(cookiesToSet) {
            // No necesitamos setear cookies en una route de solo lectura
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario sea admin
    const { data: isAdmin } = await supabase
      .rpc('is_admin', { user_uuid: user.id })
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a esta funcionalidad' },
        { status: 403 }
      )
    }

    // Obtener todas las delegaciones (incluye inactivas)
    const { data: delegaciones, error } = await supabase
      .from('delegaciones')
      .select('*')
      .order('orden', { ascending: true })

    if (error) {
      console.error('Error fetching delegaciones:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ delegaciones }, { status: 200 })
  } catch (error) {
    console.error('Error in admin delegaciones API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva delegación
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
          setAll(cookiesToSet) {
            // No necesitamos setear cookies en POST
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario sea admin
    const { data: isAdmin } = await supabase
      .rpc('is_admin', { user_uuid: user.id })
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear delegaciones' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Crear la delegación
    const { data: delegacion, error } = await supabase
      .from('delegaciones')
      .insert([
        {
          ...body,
          created_by: user.id,
          updated_by: user.id,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating delegacion:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ delegacion }, { status: 201 })
  } catch (error) {
    console.error('Error in create delegacion API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar delegación
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
          setAll(cookiesToSet) {
            // No necesitamos setear cookies
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario sea admin
    const { data: isAdmin } = await supabase
      .rpc('is_admin', { user_uuid: user.id })
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar delegaciones' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de delegación requerido' },
        { status: 400 }
      )
    }

    // Actualizar la delegación
    const { data: delegacion, error } = await supabase
      .from('delegaciones')
      .update({
        ...updates,
        updated_by: user.id,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating delegacion:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ delegacion }, { status: 200 })
  } catch (error) {
    console.error('Error in update delegacion API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar delegación
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
          setAll(cookiesToSet) {
            // No necesitamos setear cookies
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario sea admin
    const { data: isAdmin } = await supabase
      .rpc('is_admin', { user_uuid: user.id })
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar delegaciones' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de delegación requerido' },
        { status: 400 }
      )
    }

    // Eliminar la delegación
    const { error } = await supabase
      .from('delegaciones')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting delegacion:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in delete delegacion API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

