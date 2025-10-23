-- ============================================
-- SISTEMA DE CONTENIDO - VIDA SC
-- Delegaciones, Blog y Archivos
-- ============================================

-- ============================================
-- 1. TABLA DE DELEGACIONES
-- ============================================

CREATE TABLE IF NOT EXISTS public.delegaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  ubicacion VARCHAR(300),
  direccion TEXT,
  telefono VARCHAR(50),
  email VARCHAR(255),
  responsable_id UUID REFERENCES auth.users(id),
  activa BOOLEAN DEFAULT true,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TABLA DE BLOG
-- ============================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(300) NOT NULL,
  slug VARCHAR(300) UNIQUE NOT NULL, -- Para URLs amigables
  contenido TEXT NOT NULL,
  resumen TEXT,
  imagen_portada TEXT, -- URL de Supabase Storage
  autor_id UUID NOT NULL REFERENCES auth.users(id),
  categoria VARCHAR(100),
  tags TEXT[], -- Array de tags
  publicado BOOLEAN DEFAULT false,
  fecha_publicacion TIMESTAMP WITH TIME ZONE,
  vistas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. TABLA DE ARCHIVOS (PDFs, documentos)
-- ============================================

CREATE TABLE IF NOT EXISTS public.archivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(300) NOT NULL,
  descripcion TEXT,
  tipo_archivo VARCHAR(50) NOT NULL, -- pdf, doc, xlsx, etc.
  tamano BIGINT, -- Tamaño en bytes
  
  -- Ruta en Supabase Storage
  storage_path TEXT NOT NULL,
  storage_bucket VARCHAR(100) DEFAULT 'vida-storage',
  
  -- Control de acceso
  rol_minimo VARCHAR(50) REFERENCES public.roles(name), -- rol mínimo requerido
  delegacion_id UUID REFERENCES public.delegaciones(id), -- null = para todos
  
  -- Metadata
  categoria VARCHAR(100),
  tags TEXT[],
  subido_por UUID NOT NULL REFERENCES auth.users(id),
  descargas INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. TABLA DE MIEMBROS POR DELEGACIÓN
-- ============================================

CREATE TABLE IF NOT EXISTS public.delegacion_miembros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delegacion_id UUID NOT NULL REFERENCES public.delegaciones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rol_en_delegacion VARCHAR(100), -- líder, miembro, coordinador, etc.
  fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activo BOOLEAN DEFAULT true,
  UNIQUE(delegacion_id, user_id)
);

-- ============================================
-- 5. TABLA DE CATEGORÍAS
-- ============================================

CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL, -- 'blog', 'archivo', 'delegacion'
  color VARCHAR(20) DEFAULT '#3B82F6',
  icono VARCHAR(50), -- Nombre del ícono
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. TABLA DE HISTORIAL DE DESCARGAS
-- ============================================

CREATE TABLE IF NOT EXISTS public.archivo_descargas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archivo_id UUID NOT NULL REFERENCES public.archivos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  descargado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================

CREATE TRIGGER update_delegaciones_updated_at
  BEFORE UPDATE ON public.delegaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_archivos_updated_at
  BEFORE UPDATE ON public.archivos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función para verificar si un usuario puede acceder a un archivo
CREATE OR REPLACE FUNCTION user_can_access_file(
  user_uuid UUID,
  file_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  file_record RECORD;
  user_roles_list TEXT[];
  role_hierarchy INTEGER;
BEGIN
  -- Obtener información del archivo
  SELECT * INTO file_record
  FROM public.archivos
  WHERE id = file_id AND activo = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Si no requiere rol específico, cualquiera autenticado puede acceder
  IF file_record.rol_minimo IS NULL THEN
    RETURN true;
  END IF;
  
  -- Verificar si el usuario tiene el rol requerido o uno superior
  SELECT ARRAY_AGG(r.name) INTO user_roles_list
  FROM public.user_roles ur
  INNER JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = user_uuid;
  
  -- Si es admin, puede acceder a todo
  IF 'admin' = ANY(user_roles_list) THEN
    RETURN true;
  END IF;
  
  -- Verificar rol específico
  IF file_record.rol_minimo = ANY(user_roles_list) THEN
    RETURN true;
  END IF;
  
  -- Jerarquía de roles (admin > pastor > lider > celula > curso > usuario)
  -- Puedes ajustar esto según tu lógica
  IF file_record.rol_minimo = 'pastor' AND 'admin' = ANY(user_roles_list) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar contador de descargas
CREATE OR REPLACE FUNCTION increment_download_count(file_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.archivos
  SET descargas = descargas + 1
  WHERE id = file_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar slug único
CREATE OR REPLACE FUNCTION generate_unique_slug(titulo TEXT, tabla TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generar slug base
  base_slug := LOWER(REGEXP_REPLACE(titulo, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
  final_slug := base_slug;
  
  -- Verificar unicidad
  LOOP
    IF tabla = 'blog_posts' THEN
      IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = final_slug) THEN
        EXIT;
      END IF;
    END IF;
    
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- POLÍTICAS RLS
-- ============================================

-- Delegaciones
ALTER TABLE public.delegaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver delegaciones activas"
  ON public.delegaciones FOR SELECT
  TO authenticated
  USING (activa = true);

CREATE POLICY "Solo admins y pastores pueden gestionar delegaciones"
  ON public.delegaciones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      INNER JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'pastor')
    )
  );

-- Blog Posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver posts publicados"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (publicado = true);

CREATE POLICY "Autores pueden ver sus propios borradores"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (autor_id = auth.uid() OR publicado = true);

CREATE POLICY "Admins, pastores y líderes pueden crear posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      INNER JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'pastor', 'lider')
    )
  );

CREATE POLICY "Autores y admins pueden editar posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (
    autor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      INNER JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'pastor')
    )
  );

-- Archivos
ALTER TABLE public.archivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver archivos según su rol"
  ON public.archivos FOR SELECT
  TO authenticated
  USING (
    activo = true AND
    user_can_access_file(auth.uid(), id)
  );

CREATE POLICY "Admins y pastores pueden subir archivos"
  ON public.archivos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      INNER JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'pastor')
    )
  );

CREATE POLICY "Admins pueden gestionar todos los archivos"
  ON public.archivos FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Delegacion Miembros
ALTER TABLE public.delegacion_miembros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver miembros de su delegación"
  ON public.delegacion_miembros FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.delegacion_miembros dm
      WHERE dm.user_id = auth.uid() AND dm.delegacion_id = delegacion_miembros.delegacion_id
    ) OR
    is_admin(auth.uid())
  );

-- Categorías (público)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver categorías"
  ON public.categorias FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden gestionar categorías"
  ON public.categorias FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Historial de descargas (solo admins)
ALTER TABLE public.archivo_descargas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admins pueden ver historial de descargas"
  ON public.archivo_descargas FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Sistema puede registrar descargas"
  ON public.archivo_descargas FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- ÍNDICES PARA RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_delegaciones_activa ON public.delegaciones(activa);
CREATE INDEX IF NOT EXISTS idx_delegaciones_responsable ON public.delegaciones(responsable_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_autor ON public.blog_posts(autor_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publicado ON public.blog_posts(publicado);
CREATE INDEX IF NOT EXISTS idx_blog_posts_fecha ON public.blog_posts(fecha_publicacion);

CREATE INDEX IF NOT EXISTS idx_archivos_rol_minimo ON public.archivos(rol_minimo);
CREATE INDEX IF NOT EXISTS idx_archivos_delegacion ON public.archivos(delegacion_id);
CREATE INDEX IF NOT EXISTS idx_archivos_activo ON public.archivos(activo);
CREATE INDEX IF NOT EXISTS idx_archivos_categoria ON public.archivos(categoria);

CREATE INDEX IF NOT EXISTS idx_delegacion_miembros_delegacion ON public.delegacion_miembros(delegacion_id);
CREATE INDEX IF NOT EXISTS idx_delegacion_miembros_user ON public.delegacion_miembros(user_id);

CREATE INDEX IF NOT EXISTS idx_categorias_tipo ON public.categorias(tipo);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON public.categorias(slug);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Categorías de ejemplo
INSERT INTO public.categorias (nombre, slug, descripcion, tipo, color) VALUES
  ('Enseñanzas', 'ensenanzas', 'Material de enseñanzas bíblicas', 'archivo', '#8B5CF6'),
  ('Administrativo', 'administrativo', 'Documentos administrativos', 'archivo', '#3B82F6'),
  ('Eventos', 'eventos', 'Material de eventos', 'archivo', '#10B981'),
  ('Devocionales', 'devocionales', 'Posts devocionales', 'blog', '#F59E0B'),
  ('Noticias', 'noticias', 'Noticias de la iglesia', 'blog', '#EF4444'),
  ('Testimonios', 'testimonios', 'Testimonios de fe', 'blog', '#EC4899')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE public.delegaciones IS 'Delegaciones o sedes de la iglesia';
COMMENT ON TABLE public.blog_posts IS 'Posts del blog';
COMMENT ON TABLE public.archivos IS 'Archivos y documentos con control de acceso por rol';
COMMENT ON TABLE public.delegacion_miembros IS 'Miembros asignados a cada delegación';
COMMENT ON TABLE public.categorias IS 'Categorías para organizar contenido';
COMMENT ON TABLE public.archivo_descargas IS 'Historial de descargas de archivos';

COMMENT ON FUNCTION user_can_access_file IS 'Verifica si un usuario puede acceder a un archivo según su rol';
COMMENT ON FUNCTION increment_download_count IS 'Incrementa el contador de descargas de un archivo';

