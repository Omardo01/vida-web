import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GET - Obtener una delegación por slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Crear cliente fresco en cada request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { slug } = params

    const { data: delegacion, error } = await supabase
      .from('delegaciones')
      .select(`
        *,
        mapa_embed_url
      `)
      .eq('slug', slug)
      .eq('activa', true)
      .single()

    console.log('Supabase response:', delegacion)
    console.log('Has mapa_embed_url?', delegacion?.hasOwnProperty('mapa_embed_url'))
    console.log('Mapa embed value:', (delegacion as any)?.mapa_embed_url)

    if (error || !delegacion) {
      return NextResponse.json(
        { error: 'Delegación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ delegacion }, { status: 200 })
  } catch (error) {
    console.error('Error in delegacion detail API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

