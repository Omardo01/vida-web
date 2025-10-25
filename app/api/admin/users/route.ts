import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Forzar renderizado dinámico (esta ruta usa cookies)
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Verificar autenticación del usuario usando Supabase SSR
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

    // Verificar que el usuario tenga un rol que permita ver el dashboard
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    // Roles permitidos: todos excepto 'usuario'
    const hasAccess = userRoles?.some((role: any) => role.role_name !== 'usuario')
    
    if (!hasAccess || !userRoles || userRoles.length === 0) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder al dashboard' },
        { status: 403 }
      )
    }

    // Crear cliente de Supabase con credenciales de servicio
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Configuración de servidor incompleta' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Obtener todos los usuarios
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtener roles de cada usuario
    const usersWithRoles = await Promise.all(
      users.users.map(async (authUser) => {
        const { data: roles } = await supabase
          .rpc('get_user_roles', { user_uuid: authUser.id })
        
        return {
          id: authUser.id,
          email: authUser.email || 'Sin email',
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at || null,
          email_confirmed_at: authUser.email_confirmed_at || null,
          roles: roles || [],
        }
      })
    )

    return NextResponse.json({ users: usersWithRoles }, { status: 200 })
  } catch (error) {
    console.error('Error in admin users API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

