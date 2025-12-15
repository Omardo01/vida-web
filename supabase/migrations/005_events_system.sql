-- ============================================
-- SISTEMA DE EVENTOS Y CALENDARIO - VIDA SC
-- ============================================

-- 1. Tabla de eventos
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location VARCHAR(300),
  
  -- Fechas y horarios
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN DEFAULT false,
  
  -- Recurrencia (para futuro)
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- Formato iCal RRULE
  
  -- Categorización
  event_type VARCHAR(50) DEFAULT 'general', -- general, servicio, celula, reunion, ensayo, curso, etc.
  color VARCHAR(20) DEFAULT '#3B82F6',
  
  -- Visibilidad y roles
  is_public BOOLEAN DEFAULT false, -- true = visible para todos, false = solo roles específicos
  visible_to_all_roles BOOLEAN DEFAULT true, -- Si es false, usar event_roles
  
  -- Metadatos
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  is_cancelled BOOLEAN DEFAULT false
);

-- 2. Tabla de relación eventos-roles (qué roles pueden ver cada evento)
CREATE TABLE IF NOT EXISTS public.event_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, role_id)
);

-- 3. Tabla de confirmación de asistencia (opcional, para futuro)
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, declined, maybe
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- TRIGGER PARA UPDATED_AT
-- ============================================

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIONES DE UTILIDAD
-- ============================================

-- Función para obtener eventos visibles para un usuario
CREATE OR REPLACE FUNCTION get_user_visible_events(
  user_uuid UUID,
  from_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  to_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  location VARCHAR,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN,
  event_type VARCHAR,
  color VARCHAR,
  is_cancelled BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    e.id,
    e.title,
    e.description,
    e.location,
    e.start_date,
    e.end_date,
    e.all_day,
    e.event_type,
    e.color,
    e.is_cancelled
  FROM public.events e
  LEFT JOIN public.event_roles er ON er.event_id = e.id
  LEFT JOIN public.user_roles ur ON ur.role_id = er.role_id AND ur.user_id = user_uuid
  WHERE e.is_active = true
    AND e.start_date >= from_date
    AND e.start_date <= to_date
    AND (
      e.is_public = true -- Eventos públicos
      OR e.visible_to_all_roles = true -- Visible para todos los usuarios con rol
      OR ur.user_id IS NOT NULL -- Usuario tiene un rol que puede ver el evento
    )
  ORDER BY e.start_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario puede ver un evento
CREATE OR REPLACE FUNCTION can_user_see_event(user_uuid UUID, event_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  event_record RECORD;
BEGIN
  SELECT is_public, visible_to_all_roles INTO event_record
  FROM public.events
  WHERE id = event_uuid AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Evento público
  IF event_record.is_public THEN
    RETURN true;
  END IF;
  
  -- Visible para todos los roles (usuario debe tener al menos un rol)
  IF event_record.visible_to_all_roles THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = user_uuid
    );
  END IF;
  
  -- Verificar si el usuario tiene un rol específico para el evento
  RETURN EXISTS (
    SELECT 1
    FROM public.event_roles er
    INNER JOIN public.user_roles ur ON ur.role_id = er.role_id
    WHERE er.event_id = event_uuid AND ur.user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Políticas para events
CREATE POLICY "Usuarios pueden ver eventos permitidos"
  ON public.events FOR SELECT
  TO authenticated
  USING (
    is_active = true AND (
      is_public = true
      OR visible_to_all_roles = true
      OR EXISTS (
        SELECT 1 FROM public.event_roles er
        INNER JOIN public.user_roles ur ON ur.role_id = er.role_id
        WHERE er.event_id = events.id AND ur.user_id = auth.uid()
      )
      OR created_by = auth.uid()
      OR is_admin(auth.uid())
    )
  );

CREATE POLICY "Solo admins pueden crear eventos"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden actualizar eventos"
  ON public.events FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden eliminar eventos"
  ON public.events FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Políticas para event_roles
CREATE POLICY "Usuarios pueden ver event_roles"
  ON public.event_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo admins pueden gestionar event_roles"
  ON public.event_roles FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Políticas para event_attendees
CREATE POLICY "Usuarios pueden ver asistencias de eventos que pueden ver"
  ON public.event_attendees FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id AND can_user_see_event(auth.uid(), e.id)
    )
  );

CREATE POLICY "Usuarios pueden registrar su propia asistencia"
  ON public.event_attendees FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id AND can_user_see_event(auth.uid(), e.id)
    )
  );

CREATE POLICY "Usuarios pueden actualizar su propia asistencia"
  ON public.event_attendees FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON public.events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON public.events(is_public);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_roles_event_id ON public.event_roles(event_id);
CREATE INDEX IF NOT EXISTS idx_event_roles_role_id ON public.event_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON public.event_attendees(user_id);

-- ============================================
-- TIPOS DE EVENTOS PREDEFINIDOS
-- ============================================

COMMENT ON TABLE public.events IS 'Tabla de eventos del calendario';
COMMENT ON TABLE public.event_roles IS 'Roles que pueden ver cada evento';
COMMENT ON TABLE public.event_attendees IS 'Registro de asistencia a eventos';
COMMENT ON COLUMN public.events.event_type IS 'Tipos: general, servicio, celula, reunion, ensayo, curso, actividad, conferencia';
COMMENT ON COLUMN public.events.visible_to_all_roles IS 'Si es true, todos los usuarios con algún rol pueden ver el evento';
