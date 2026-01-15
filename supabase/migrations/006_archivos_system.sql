-- ============================================
-- SISTEMA DE ARCHIVOS Y RECURSOS - VIDA SC
-- ============================================

-- 1. Tabla de archivos
CREATE TABLE IF NOT EXISTS public.archivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Tabla de relación archivos-roles (quién puede ver cada archivo)
CREATE TABLE IF NOT EXISTS public.archivo_roles (
  archivo_id UUID NOT NULL REFERENCES public.archivos(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (archivo_id, role_id)
);

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE public.archivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archivo_roles ENABLE ROW LEVEL SECURITY;

-- Políticas para archivos: admins pueden todo
CREATE POLICY "Admins pueden gestionar archivos"
  ON public.archivos FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Usuarios pueden ver archivos si tienen uno de los roles asignados al archivo
CREATE POLICY "Usuarios pueden ver archivos permitidos"
  ON public.archivos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.archivo_roles ar
      JOIN public.user_roles ur ON ur.role_id = ar.role_id
      WHERE ar.archivo_id = public.archivos.id
      AND ur.user_id = auth.uid()
    )
    OR is_admin(auth.uid())
  );

-- Políticas para archivo_roles: admins pueden todo
CREATE POLICY "Admins pueden gestionar permisos de archivos"
  ON public.archivo_roles FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Usuarios pueden ver qué roles tiene un archivo si pueden ver el archivo
CREATE POLICY "Usuarios pueden ver roles de archivos permitidos"
  ON public.archivo_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.role_id = public.archivo_roles.role_id
      AND ur.user_id = auth.uid()
    )
    OR is_admin(auth.uid())
  );

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_archivo_roles_archivo_id ON public.archivo_roles(archivo_id);
CREATE INDEX IF NOT EXISTS idx_archivo_roles_role_id ON public.archivo_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_archivos_created_by ON public.archivos(created_by);

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE public.archivos IS 'Almacena metadatos de archivos y links de recursos';
COMMENT ON TABLE public.archivo_roles IS 'Relación que define qué roles tienen acceso a qué archivos';
