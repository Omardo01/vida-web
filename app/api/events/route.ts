import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Obtener eventos visibles para el usuario actual
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

    const { searchParams } = new URL(request.url)
    const fromDate = searchParams.get('from') || new Date().toISOString()
    const toDate = searchParams.get('to') || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 días

    // Obtener los roles del usuario
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })

    const userRoleIds = userRoles?.map((r: any) => r.role_id) || []

    // Construir query para eventos visibles
    let query = supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        location,
        start_date,
        end_date,
        all_day,
        event_type,
        color,
        is_cancelled,
        is_public,
        visible_to_all_roles,
        event_roles (
          role_id
        )
      `)
      .eq('is_active', true)
      .gte('start_date', fromDate)
      .lte('start_date', toDate)
      .order('start_date', { ascending: true })

    const { data: events, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filtrar eventos según visibilidad
    const visibleEvents = events?.filter(event => {
      // Eventos públicos
      if (event.is_public) return true

      // Si el usuario no tiene roles, solo puede ver eventos públicos
      if (userRoleIds.length === 0) return false

      // Visible para todos los usuarios con rol
      if (event.visible_to_all_roles) return true

      // Verificar si el usuario tiene alguno de los roles del evento
      const eventRoleIds = event.event_roles?.map((er: any) => er.role_id) || []
      return eventRoleIds.some((roleId: string) => userRoleIds.includes(roleId))
    })

    // Limpiar la respuesta
    const cleanEvents = visibleEvents?.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      start_date: event.start_date,
      end_date: event.end_date,
      all_day: event.all_day,
      event_type: event.event_type,
      color: event.color,
      is_cancelled: event.is_cancelled,
    }))

    return NextResponse.json({ events: cleanEvents }, { status: 200 })
  } catch (error) {
    console.error('Error in events API:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
