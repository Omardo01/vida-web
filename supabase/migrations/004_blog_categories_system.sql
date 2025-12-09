-- ============================================
-- SISTEMA DE BLOG COMPLETO - VIDA SC
-- Incluye categorías y posts de blog
-- ============================================

-- ============================================
-- 1. TABLA DE CATEGORÍAS
-- ============================================

CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL DEFAULT 'blog', -- 'blog', 'archivo', 'delegacion'
  color VARCHAR(20) DEFAULT '#3B82F6',
  icono VARCHAR(50) DEFAULT 'FileText',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver categorías (incluso anónimos)
DROP POLICY IF EXISTS "Todos pueden ver categorías" ON public.categorias;
CREATE POLICY "Todos pueden ver categorías"
  ON public.categorias FOR SELECT
  USING (true);

-- Política: Solo admins pueden gestionar categorías
DROP POLICY IF EXISTS "Solo admins pueden gestionar categorías" ON public.categorias;
CREATE POLICY "Solo admins pueden gestionar categorías"
  ON public.categorias FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      INNER JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- ============================================
-- 2. TABLA DE BLOG POSTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(300) NOT NULL,
  slug VARCHAR(300) UNIQUE NOT NULL,
  contenido TEXT NOT NULL,
  resumen TEXT,
  autor_id UUID NOT NULL REFERENCES auth.users(id),
  categoria_id UUID REFERENCES public.categorias(id),
  publicado BOOLEAN DEFAULT false,
  fecha_publicacion TIMESTAMP WITH TIME ZONE,
  vistas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver posts publicados (incluso anónimos)
DROP POLICY IF EXISTS "Todos pueden ver posts publicados" ON public.blog_posts;
CREATE POLICY "Todos pueden ver posts publicados"
  ON public.blog_posts FOR SELECT
  USING (publicado = true);

-- Política: Autores pueden ver sus propios borradores
DROP POLICY IF EXISTS "Autores pueden ver sus propios borradores" ON public.blog_posts;
CREATE POLICY "Autores pueden ver sus propios borradores"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (autor_id = auth.uid() OR publicado = true);

-- Política: Admins, pastores y líderes pueden crear posts
DROP POLICY IF EXISTS "Roles autorizados pueden crear posts" ON public.blog_posts;
CREATE POLICY "Roles autorizados pueden crear posts"
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

-- Política: Autores y admins pueden editar posts
DROP POLICY IF EXISTS "Autores y admins pueden editar posts" ON public.blog_posts;
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

-- Política: Solo admins pueden eliminar posts
DROP POLICY IF EXISTS "Solo admins pueden eliminar posts" ON public.blog_posts;
CREATE POLICY "Solo admins pueden eliminar posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      INNER JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- ============================================
-- 3. TRIGGER PARA UPDATED_AT
-- ============================================

-- Función para actualizar updated_at (si no existe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ÍNDICES PARA RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_categorias_tipo ON public.categorias(tipo);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON public.categorias(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_autor ON public.blog_posts(autor_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publicado ON public.blog_posts(publicado);
CREATE INDEX IF NOT EXISTS idx_blog_posts_fecha ON public.blog_posts(fecha_publicacion);
CREATE INDEX IF NOT EXISTS idx_blog_posts_categoria ON public.blog_posts(categoria_id);

-- ============================================
-- 5. DATOS INICIALES - CATEGORÍAS DE BLOG
-- ============================================

INSERT INTO public.categorias (nombre, slug, descripcion, tipo, color, icono) VALUES
  ('Predicación', 'predicacion', 'Mensajes y predicaciones', 'blog', '#8B5CF6', 'Mic'),
  ('Blog General', 'blog-general', 'Artículos generales', 'blog', '#3B82F6', 'FileText'),
  ('Estudio Bíblico', 'estudio-biblico', 'Estudios de la Palabra', 'blog', '#059669', 'BookMarked'),
  ('Devocionales', 'devocionales', 'Posts devocionales', 'blog', '#F59E0B', 'BookOpen'),
  ('Reflexiones', 'reflexiones', 'Reflexiones espirituales', 'blog', '#EC4899', 'Lightbulb'),
  ('Testimonios', 'testimonios', 'Testimonios de fe', 'blog', '#EF4444', 'Heart'),
  ('Noticias', 'noticias', 'Noticias de la iglesia', 'blog', '#06B6D4', 'Newspaper'),
  ('Anuncios', 'anuncios', 'Anuncios importantes', 'blog', '#F97316', 'Bell')
ON CONFLICT (slug) DO UPDATE 
SET icono = EXCLUDED.icono,
    color = EXCLUDED.color,
    descripcion = EXCLUDED.descripcion;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE public.categorias IS 'Categorías para organizar contenido del blog';
COMMENT ON TABLE public.blog_posts IS 'Posts del blog';
COMMENT ON COLUMN public.categorias.icono IS 'Nombre del icono de Lucide (FileText, Mic, BookOpen, etc)';
COMMENT ON COLUMN public.blog_posts.categoria_id IS 'Referencia a la categoría del post';
