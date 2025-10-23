-- ============================================
-- SISTEMA DE ROLES Y PERMISOS - VIDA SC
-- ============================================

-- 1. Tabla de roles
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT '#3B82F6', -- Color para el badge en la UI
  is_system BOOLEAN DEFAULT false, -- true para roles predefinidos que no se pueden eliminar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de relación usuarios-roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 3. Tabla de permisos (para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  module VARCHAR(50), -- ej: dashboard, users, content, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de relación roles-permisos
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para roles
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIONES DE UTILIDAD
-- ============================================

-- Función para obtener roles de un usuario
CREATE OR REPLACE FUNCTION get_user_roles(user_uuid UUID)
RETURNS TABLE (
  role_id UUID,
  role_name VARCHAR,
  display_name VARCHAR,
  description TEXT,
  color VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.display_name,
    r.description,
    r.color
  FROM public.roles r
  INNER JOIN public.user_roles ur ON ur.role_id = r.id
  WHERE ur.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION user_has_role(user_uuid UUID, role_name_param VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    INNER JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_uuid
    AND r.name = role_name_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_role(user_uuid, 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas para roles: solo admins pueden modificar
CREATE POLICY "Todos pueden ver roles"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden crear roles"
  ON public.roles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden actualizar roles"
  ON public.roles FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden eliminar roles no-sistema"
  ON public.roles FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()) AND is_system = false);

-- Políticas para user_roles
CREATE POLICY "Usuarios pueden ver sus propios roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden asignar roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden remover roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Políticas para permissions
CREATE POLICY "Todos pueden ver permisos"
  ON public.permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden gestionar permisos"
  ON public.permissions FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Políticas para role_permissions
CREATE POLICY "Todos pueden ver role_permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden gestionar role_permissions"
  ON public.role_permissions FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- INSERTAR ROLES PREDEFINIDOS
-- ============================================

INSERT INTO public.roles (name, display_name, description, color, is_system) VALUES
  ('admin', 'Administrador', 'Acceso completo al sistema', '#EF4444', true),
  ('pastor', 'Pastor', 'Líder espiritual con permisos extendidos', '#8B5CF6', true),
  ('lider', 'Líder', 'Líder de ministerio o grupo', '#3B82F6', true),
  ('celula', 'Célula', 'Líder de célula', '#10B981', true),
  ('curso', 'Curso', 'Acceso a cursos y materiales', '#F59E0B', true),
  ('usuario', 'Usuario', 'Usuario regular sin permisos especiales', '#6B7280', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- INSERTAR PERMISOS BÁSICOS
-- ============================================

INSERT INTO public.permissions (name, display_name, description, module) VALUES
  ('dashboard.view', 'Ver Dashboard', 'Acceso al panel de administración', 'dashboard'),
  ('dashboard.manage', 'Gestionar Dashboard', 'Configurar el dashboard', 'dashboard'),
  ('users.view', 'Ver Usuarios', 'Ver lista de usuarios', 'users'),
  ('users.manage', 'Gestionar Usuarios', 'Crear, editar y eliminar usuarios', 'users'),
  ('roles.view', 'Ver Roles', 'Ver roles del sistema', 'roles'),
  ('roles.manage', 'Gestionar Roles', 'Crear y modificar roles', 'roles'),
  ('content.view', 'Ver Contenido', 'Ver contenido del sitio', 'content'),
  ('content.manage', 'Gestionar Contenido', 'Crear y editar contenido', 'content')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- ASIGNAR PERMISOS A ROLES
-- ============================================

-- Admin tiene todos los permisos
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Pastor tiene permisos de visualización y gestión de contenido
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'pastor'
AND p.name IN ('dashboard.view', 'users.view', 'content.view', 'content.manage')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Líder tiene permisos de visualización
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'lider'
AND p.name IN ('dashboard.view', 'users.view', 'content.view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE public.roles IS 'Tabla de roles del sistema';
COMMENT ON TABLE public.user_roles IS 'Relación entre usuarios y roles';
COMMENT ON TABLE public.permissions IS 'Permisos disponibles en el sistema';
COMMENT ON TABLE public.role_permissions IS 'Permisos asignados a cada rol';
COMMENT ON FUNCTION get_user_roles IS 'Obtiene todos los roles de un usuario';
COMMENT ON FUNCTION user_has_role IS 'Verifica si un usuario tiene un rol específico';
COMMENT ON FUNCTION is_admin IS 'Verifica si un usuario es administrador';

