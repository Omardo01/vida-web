import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Forzar renderizado dinámico y desactivar cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Obtener todas las delegaciones activas (público)
export async function GET() {
  try {
    // Crear cliente fresco en cada request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

    const { data: delegaciones, error } = await supabase
      .from('delegaciones')
      .select('*')
      .eq('activa', true)
      .order('orden', { ascending: true })

    if (error) {
      console.error('Error fetching delegaciones:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Delegaciones encontradas:', delegaciones?.length)

    return NextResponse.json(
      { delegaciones }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  } catch (error) {
    console.error('Error in delegaciones API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

