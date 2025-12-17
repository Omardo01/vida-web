-- ============================================
-- SISTEMA DE DELEGACIONES - VIDA SC
-- ============================================

-- 1. Tabla de delegaciones
CREATE TABLE IF NOT EXISTS public.delegaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL, -- Para URLs amigables (ej: "queretaro-centro")
  descripcion TEXT,
  
  -- Ubicación
  ciudad VARCHAR(100) NOT NULL,
  estado VARCHAR(100) NOT NULL,
  direccion TEXT NOT NULL,
  latitud DECIMAL(10, 8), -- Para Google Maps (legacy)
  longitud DECIMAL(11, 8), -- Para Google Maps (legacy)
  mapa_embed_url TEXT, -- URL de embed de Google Maps
  
  -- Días de reunión
  dias_reunion JSONB DEFAULT '[]'::jsonb, -- Array de objetos: [{dia: "Domingo", hora: "10:00 AM", tipo: "Culto Principal"}]
  
  -- Redes sociales
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  youtube VARCHAR(255),
  twitter VARCHAR(255),
  whatsapp VARCHAR(20), -- Número de WhatsApp
  email VARCHAR(255),
  telefono VARCHAR(20),
  
  -- Información adicional
  pastor_encargado VARCHAR(200),
  imagen_portada TEXT, -- URL de la imagen de portada
  logo TEXT, -- URL del logo de la delegación
  
  -- Control
  activa BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0, -- Para ordenar la lista
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Trigger para updated_at
CREATE TRIGGER update_delegaciones_updated_at
  BEFORE UPDATE ON public.delegaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para generar slug automáticamente (sin usar unaccent)
CREATE OR REPLACE FUNCTION generate_delegacion_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Genera slug a partir del nombre si no existe
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Convertir a minúsculas y reemplazar espacios por guiones
    -- Quitar caracteres especiales comunes
    NEW.slug := lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(
                      NEW.nombre,
                      'á', 'a', 'g'
                    ), 'é', 'e', 'g'
                  ), 'í', 'i', 'g'
                ), 'ó', 'o', 'g'
              ), 'ú', 'u', 'g'
            ), 'ñ', 'n', 'g'
          ), '[^a-z0-9\s-]', '', 'gi'
        ), '\s+', '-', 'g'
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar slug
CREATE TRIGGER generate_delegacion_slug_trigger
  BEFORE INSERT OR UPDATE ON public.delegaciones
  FOR EACH ROW
  EXECUTE FUNCTION generate_delegacion_slug();

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE public.delegaciones ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver delegaciones activas
CREATE POLICY "Todos pueden ver delegaciones activas"
  ON public.delegaciones FOR SELECT
  TO public
  USING (activa = true);

-- Usuarios autenticados pueden ver todas las delegaciones
CREATE POLICY "Usuarios autenticados ven todas las delegaciones"
  ON public.delegaciones FOR SELECT
  TO authenticated
  USING (true);

-- Solo admins pueden crear delegaciones
CREATE POLICY "Solo admins pueden crear delegaciones"
  ON public.delegaciones FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Solo admins pueden actualizar delegaciones
CREATE POLICY "Solo admins pueden actualizar delegaciones"
  ON public.delegaciones FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Solo admins pueden eliminar delegaciones
CREATE POLICY "Solo admins pueden eliminar delegaciones"
  ON public.delegaciones FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_delegaciones_slug ON public.delegaciones(slug);
CREATE INDEX IF NOT EXISTS idx_delegaciones_estado ON public.delegaciones(estado);
CREATE INDEX IF NOT EXISTS idx_delegaciones_ciudad ON public.delegaciones(ciudad);
CREATE INDEX IF NOT EXISTS idx_delegaciones_activa ON public.delegaciones(activa);
CREATE INDEX IF NOT EXISTS idx_delegaciones_orden ON public.delegaciones(orden);

-- ============================================
-- INSERTAR DELEGACIONES DE EJEMPLO
-- ============================================

INSERT INTO public.delegaciones (
  nombre, 
  ciudad, 
  estado, 
  direccion,
  latitud,
  longitud,
  dias_reunion,
  descripcion,
  activa,
  orden
) VALUES
  (
    'VIDA Santa Cruz - Querétaro Centro',
    'Querétaro',
    'Querétaro',
    'Av. Constituyentes 123, Centro Histórico',
    20.5888,
    -100.3899,
    '[
      {"dia": "Domingo", "hora": "10:00 AM", "tipo": "Culto Principal"},
      {"dia": "Domingo", "hora": "6:00 PM", "tipo": "Culto de Adoración"},
      {"dia": "Miércoles", "hora": "7:00 PM", "tipo": "Estudio Bíblico"}
    ]'::jsonb,
    'Delegación principal en el centro histórico de Querétaro. ¡Te esperamos con los brazos abiertos!',
    true,
    1
  ),
  (
    'VIDA Santa Cruz - Juriquilla',
    'Querétaro',
    'Querétaro',
    'Blvd. Juriquilla 456, Juriquilla',
    20.6532,
    -100.4423,
    '[
      {"dia": "Domingo", "hora": "11:00 AM", "tipo": "Culto Principal"},
      {"dia": "Jueves", "hora": "7:30 PM", "tipo": "Reunión de Jóvenes"}
    ]'::jsonb,
    'Nuestra delegación en la zona de Juriquilla, sirviendo a la comunidad con amor.',
    true,
    2
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE public.delegaciones IS 'Tabla de delegaciones de VIDA Santa Cruz';
COMMENT ON COLUMN public.delegaciones.slug IS 'Identificador único para URLs amigables';
COMMENT ON COLUMN public.delegaciones.dias_reunion IS 'Array JSON con los días y horarios de reunión';
COMMENT ON COLUMN public.delegaciones.activa IS 'Indica si la delegación está activa y visible públicamente';
COMMENT ON COLUMN public.delegaciones.orden IS 'Orden de aparición en la lista (menor primero)';

