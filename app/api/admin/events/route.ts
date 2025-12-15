import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Listar eventos (para admin)
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

    // Verificar si el usuario es admin
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const isAdmin = userRoles?.some((role: any) => role.role_name === 'admin')
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const fromDate = searchParams.get('from')
    const toDate = searchParams.get('to')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Obtener eventos con sus roles asignados
    let query = supabase
      .from('events')
      .select(`
        *,
        event_roles (
          role_id,
          roles:role_id (
            id,
            name,
            display_name,
            color
          )
        )
      `)
      .order('start_date', { ascending: true })

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    if (fromDate) {
      query = query.gte('start_date', fromDate)
    }

    if (toDate) {
      query = query.lte('start_date', toDate)
    }

    const { data: events, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.error('Error in events API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nuevo evento
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
    const {
      title,
      description,
      location,
      start_date,
      end_date,
      all_day,
      event_type,
      color,
      is_public,
      visible_to_all_roles,
      role_ids, // Array de IDs de roles que pueden ver el evento
    } = body

    if (!title || !start_date) {
      return NextResponse.json(
        { error: 'Título y fecha de inicio son requeridos' },
        { status: 400 }
      )
    }

    // Crear el evento
    const { data: newEvent, error: eventError } = await supabase
      .from('events')
      .insert({
        title,
        description: description || null,
        location: location || null,
        start_date,
        end_date: end_date || null,
        all_day: all_day || false,
        event_type: event_type || 'general',
        color: color || '#3B82F6',
        is_public: is_public || false,
        visible_to_all_roles: visible_to_all_roles !== false,
        created_by: user.id,
      })
      .select()
      .single()

    if (eventError) {
      console.error('Error creating event:', eventError)
      return NextResponse.json({ error: eventError.message }, { status: 500 })
    }

    // Si hay roles específicos, crear las relaciones
    if (role_ids && role_ids.length > 0 && !visible_to_all_roles) {
      const eventRoles = role_ids.map((roleId: string) => ({
        event_id: newEvent.id,
        role_id: roleId,
      }))

      const { error: rolesError } = await supabase
        .from('event_roles')
        .insert(eventRoles)

      if (rolesError) {
        console.error('Error assigning roles to event:', rolesError)
        // No fallamos, el evento ya fue creado
      }
    }

    // Obtener el evento con sus roles
    const { data: eventWithRoles } = await supabase
      .from('events')
      .select(`
        *,
        event_roles (
          role_id,
          roles:role_id (
            id,
            name,
            display_name,
            color
          )
        )
      `)
      .eq('id', newEvent.id)
      .single()

    return NextResponse.json({ event: eventWithRoles }, { status: 201 })
  } catch (error) {
    console.error('Error in create event API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Actualizar evento
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
    const {
      id,
      title,
      description,
      location,
      start_date,
      end_date,
      all_day,
      event_type,
      color,
      is_public,
      visible_to_all_roles,
      is_cancelled,
      role_ids,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'ID del evento es requerido' }, { status: 400 })
    }

    // Actualizar el evento
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({
        title,
        description,
        location,
        start_date,
        end_date,
        all_day,
        event_type,
        color,
        is_public,
        visible_to_all_roles,
        is_cancelled,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating event:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Actualizar roles si se proporcionaron
    if (role_ids !== undefined) {
      // Eliminar roles anteriores
      await supabase.from('event_roles').delete().eq('event_id', id)

      // Insertar nuevos roles
      if (role_ids.length > 0 && !visible_to_all_roles) {
        const eventRoles = role_ids.map((roleId: string) => ({
          event_id: id,
          role_id: roleId,
        }))

        await supabase.from('event_roles').insert(eventRoles)
      }
    }

    // Obtener el evento actualizado con sus roles
    const { data: eventWithRoles } = await supabase
      .from('events')
      .select(`
        *,
        event_roles (
          role_id,
          roles:role_id (
            id,
            name,
            display_name,
            color
          )
        )
      `)
      .eq('id', id)
      .single()

    return NextResponse.json({ event: eventWithRoles }, { status: 200 })
  } catch (error) {
    console.error('Error in update event API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar evento (soft delete)
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
    const eventId = searchParams.get('id')
    const permanent = searchParams.get('permanent') === 'true'

    if (!eventId) {
      return NextResponse.json({ error: 'ID del evento requerido' }, { status: 400 })
    }

    if (permanent) {
      // Eliminación permanente
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      // Soft delete
      const { error } = await supabase
        .from('events')
        .update({ is_active: false })
        .eq('id', eventId)

      if (error) {
        console.error('Error deactivating event:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Evento eliminado exitosamente' }, { status: 200 })
  } catch (error) {
    console.error('Error in delete event API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
