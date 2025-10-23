-- ============================================
-- SISTEMA DE MÚLTIPLES PROVEEDORES DE STORAGE
-- Permite usar Supabase Storage O tu propio servidor
-- ============================================

-- Agregar columna para identificar el proveedor
ALTER TABLE public.archivos
ADD COLUMN IF NOT EXISTS storage_provider VARCHAR(50) DEFAULT 'supabase';

-- Comentario
COMMENT ON COLUMN public.archivos.storage_provider IS 
  'Proveedor de almacenamiento: supabase, custom, s3, etc.';

-- Crear tabla de configuración de proveedores
CREATE TABLE IF NOT EXISTS public.storage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT false,
  
  -- Configuración JSON
  config JSONB NOT NULL DEFAULT '{}',
  -- Ejemplo para Supabase: {"bucket": "vida-storage"}
  -- Ejemplo para Custom: {"base_url": "https://storage.vidaysc.com", "api_key": "xxx"}
  
  -- Prioridad (mayor número = mayor prioridad)
  prioridad INTEGER DEFAULT 0,
  
  -- Límites
  max_file_size BIGINT, -- bytes, null = sin límite
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at
CREATE TRIGGER update_storage_config_updated_at
  BEFORE UPDATE ON public.storage_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar configuraciones por defecto
INSERT INTO public.storage_config (
  provider, 
  nombre, 
  descripcion, 
  activo, 
  config, 
  prioridad,
  max_file_size
) VALUES
  (
    'supabase',
    'Supabase Storage',
    'Almacenamiento integrado de Supabase',
    true,
    '{"bucket": "vida-storage"}',
    10,
    52428800 -- 50 MB
  ),
  (
    'custom',
    'Servidor Propio',
    'Servidor de archivos propio para archivos grandes',
    false,
    '{"base_url": "https://storage.vidaysc.com", "api_key": ""}',
    5,
    104857600 -- 100 MB
  )
ON CONFLICT (provider) DO NOTHING;

-- Función para obtener el proveedor activo
CREATE OR REPLACE FUNCTION get_active_storage_provider()
RETURNS TABLE (
  provider VARCHAR,
  config JSONB,
  max_file_size BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.provider,
    sc.config,
    sc.max_file_size
  FROM public.storage_config sc
  WHERE sc.activo = true
  ORDER BY sc.prioridad DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para seleccionar proveedor según tamaño de archivo
CREATE OR REPLACE FUNCTION select_storage_provider(file_size BIGINT)
RETURNS TABLE (
  provider VARCHAR,
  config JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.provider,
    sc.config
  FROM public.storage_config sc
  WHERE sc.activo = true
    AND (sc.max_file_size IS NULL OR file_size <= sc.max_file_size)
  ORDER BY sc.prioridad DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vista para estadísticas de storage
CREATE OR REPLACE VIEW public.storage_stats AS
SELECT 
  storage_provider,
  COUNT(*) as total_archivos,
  SUM(tamano) as espacio_usado_bytes,
  ROUND(SUM(tamano)::numeric / 1024 / 1024, 2) as espacio_usado_mb,
  ROUND(SUM(tamano)::numeric / 1024 / 1024 / 1024, 2) as espacio_usado_gb,
  AVG(tamano) as tamano_promedio,
  MIN(tamano) as archivo_mas_pequeno,
  MAX(tamano) as archivo_mas_grande,
  SUM(descargas) as total_descargas
FROM public.archivos
WHERE activo = true
GROUP BY storage_provider;

-- Función para migrar archivos entre proveedores
CREATE OR REPLACE FUNCTION migrate_file_provider(
  file_id UUID,
  new_provider VARCHAR,
  new_path TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  old_provider VARCHAR;
  old_path TEXT;
BEGIN
  -- Obtener info actual
  SELECT storage_provider, storage_path
  INTO old_provider, old_path
  FROM public.archivos
  WHERE id = file_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Archivo no encontrado';
  END IF;

  -- Actualizar registro
  UPDATE public.archivos
  SET 
    storage_provider = new_provider,
    storage_path = new_path,
    updated_at = NOW()
  WHERE id = file_id;

  -- Log de migración (opcional, crear tabla si quieres auditoría)
  -- INSERT INTO storage_migrations (file_id, from_provider, to_provider, ...)
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas RLS para storage_config
ALTER TABLE public.storage_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver configuración de storage"
  ON public.storage_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden gestionar configuración"
  ON public.storage_config FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_archivos_storage_provider 
  ON public.archivos(storage_provider);

CREATE INDEX IF NOT EXISTS idx_storage_config_activo 
  ON public.storage_config(activo);

-- Comentarios
COMMENT ON TABLE public.storage_config IS 
  'Configuración de proveedores de almacenamiento (Supabase, servidor propio, S3, etc.)';

COMMENT ON FUNCTION get_active_storage_provider IS 
  'Devuelve el proveedor de storage activo con mayor prioridad';

COMMENT ON FUNCTION select_storage_provider IS 
  'Selecciona el mejor proveedor según el tamaño del archivo';

COMMENT ON FUNCTION migrate_file_provider IS 
  'Migra un archivo de un proveedor a otro actualizando la BD';

COMMENT ON VIEW public.storage_stats IS 
  'Estadísticas de uso de almacenamiento por proveedor';

-- ============================================
-- QUERIES ÚTILES
-- ============================================

-- Ver estadísticas por proveedor
-- SELECT * FROM public.storage_stats;

-- Ver archivos grandes que deberían migrar
-- SELECT id, nombre, tamano, storage_provider
-- FROM public.archivos
-- WHERE tamano > 5242880 AND storage_provider = 'supabase'
-- ORDER BY tamano DESC;

-- Cambiar proveedor activo
-- UPDATE public.storage_config SET activo = false;
-- UPDATE public.storage_config SET activo = true WHERE provider = 'custom';

-- Migrar archivo específico
-- SELECT migrate_file_provider(
--   'uuid-del-archivo',
--   'custom',
--   'nuevo-path-en-servidor'
-- );

