import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Listar archivos permitidos para el usuario actual
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

    // La política RLS ya filtra los archivos basados en los roles del usuario
    const { data: archivos, error } = await supabase
      .from('archivos')
      .select(`
        *,
        archivo_roles(
          role_id,
          roles(id, name, display_name, color)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user files:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ archivos }, { status: 200 })
  } catch (error) {
    console.error('Error in user files API:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
