-- ============================================
-- AGREGAR CAMPO MAPA_EMBED_URL
-- ============================================
-- Esta migración agrega el campo mapa_embed_url a la tabla delegaciones
-- para permitir usar iframes de Google Maps en lugar de coordenadas

-- Agregar columna si no existe
ALTER TABLE public.delegaciones 
ADD COLUMN IF NOT EXISTS mapa_embed_url TEXT;

-- Comentario
COMMENT ON COLUMN public.delegaciones.mapa_embed_url IS 'URL de embed de Google Maps (código iframe completo)';

