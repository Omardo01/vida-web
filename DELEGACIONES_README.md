# Sistema de Delegaciones - VIDA SC

## 📋 Descripción General

Se ha implementado un sistema completo de gestión de delegaciones para VIDA Santa Cruz. Este sistema permite:

- ✅ **Administración dinámica**: Los administradores pueden crear, editar y eliminar delegaciones desde el panel de admin
- ✅ **Página pública**: Los usuarios pueden ver todas las delegaciones activas
- ✅ **Páginas de detalle**: Cada delegación tiene su propia página con información completa
- ✅ **Integración con mapas**: Muestra la ubicación en Google Maps
- ✅ **Horarios de reunión**: Sistema flexible para mostrar diferentes días y horarios
- ✅ **Redes sociales y contacto**: Enlaces a redes sociales, teléfono, email y WhatsApp

## 🗄️ Base de Datos

### Migración Creada
`supabase/migrations/004_create_delegaciones_system.sql`

Esta migración crea:
- Tabla `delegaciones` con todos los campos necesarios
- Políticas RLS (Row Level Security) para control de acceso
- Funciones automáticas para generar slugs
- Índices para optimización
- 2 delegaciones de ejemplo

### Estructura de la Tabla

```sql
delegaciones {
  id: UUID (primary key)
  nombre: VARCHAR(200) - Nombre de la delegación
  slug: VARCHAR(200) - URL amigable (auto-generado)
  descripcion: TEXT - Descripción de la delegación
  
  // Ubicación
  ciudad: VARCHAR(100)
  estado: VARCHAR(100)
  direccion: TEXT
  latitud: DECIMAL(10,8)
  longitud: DECIMAL(11,8)
  
  // Días de reunión (JSON)
  dias_reunion: JSONB - [{dia, hora, tipo}]
  
  // Redes sociales
  facebook: VARCHAR(255)
  instagram: VARCHAR(255)
  youtube: VARCHAR(255)
  twitter: VARCHAR(255)
  whatsapp: VARCHAR(20)
  email: VARCHAR(255)
  telefono: VARCHAR(20)
  
  // Información adicional
  pastor_encargado: VARCHAR(200)
  imagen_portada: TEXT
  logo: TEXT
  
  // Control
  activa: BOOLEAN
  orden: INTEGER
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

## 🔌 API Routes

### Rutas Públicas
- `GET /api/delegaciones` - Obtener todas las delegaciones activas
- `GET /api/delegaciones/[slug]` - Obtener una delegación específica

### Rutas Administrativas (requieren autenticación como admin)
- `GET /api/admin/delegaciones` - Obtener todas las delegaciones (incluye inactivas)
- `POST /api/admin/delegaciones` - Crear nueva delegación
- `PUT /api/admin/delegaciones` - Actualizar delegación existente
- `DELETE /api/admin/delegaciones?id=[id]` - Eliminar delegación

## 🎨 Componentes

### 1. Panel de Administración
**Ubicación**: `/components/admin/delegacion-manager.tsx`

Componente completo con:
- Tabla de todas las delegaciones
- Formulario modal para crear/editar
- Gestión de días de reunión
- Campos para redes sociales
- Control de activación/desactivación
- Orden de aparición

### 2. Página de Lista
**Ubicación**: `/app/delegaciones/page.tsx`

- Grid responsivo de tarjetas
- Filtrado de delegaciones activas
- Vista previa de información
- Animaciones con motion
- Enlaces a página de detalle

### 3. Página de Detalle
**Ubicación**: `/app/delegaciones/[slug]/page.tsx`

- Información completa de la delegación
- Mapa de ubicación integrado (Google Maps)
- Horarios de reunión organizados
- Botones de contacto directo
- Enlaces a redes sociales

## 🚀 Cómo Usar

### Para Administradores

1. **Acceder al Panel de Administración**
   - Ir a `/admin`
   - Click en la pestaña "Delegaciones"

2. **Crear Nueva Delegación**
   - Click en "Nueva Delegación"
   - Completar información obligatoria:
     - Nombre
     - Ciudad
     - Estado
     - Dirección
   - Agregar información opcional:
     - Pastor encargado
     - Descripción
     - Coordenadas (lat/lng)
     - Días de reunión
     - Redes sociales
     - Imágenes
   - Click en "Crear"

3. **Editar Delegación**
   - Click en el ícono de lápiz en la tabla
   - Modificar la información
   - Click en "Actualizar"

4. **Eliminar Delegación**
   - Click en el ícono de basura
   - Confirmar eliminación

5. **Activar/Desactivar**
   - Al editar, usar el switch "Delegación Activa"
   - Las delegaciones inactivas no se muestran al público

### Para Usuarios Públicos

1. **Ver Todas las Delegaciones**
   - Ir a `/delegaciones` o usar el menú de navegación
   - Ver tarjetas con información resumida

2. **Ver Detalle de Delegación**
   - Click en "Ver más información" en cualquier tarjeta
   - Ver información completa, mapa y contacto

## 🗺️ Integración de Mapas

### Google Maps (Recomendado)

Para habilitar mapas completos, agrega tu API key de Google Maps:

1. Obtén una API key en [Google Cloud Console](https://console.cloud.google.com/)
2. Agrega al archivo `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```

Sin API key, el sistema usará:
- Enlaces directos a Google Maps (siempre funciona)
- Botón "Abrir en Google Maps"

### Alternativa: Coordenadas

Si proporcionas latitud y longitud:
- Se muestra un mapa embebido
- Búsqueda más precisa

Si solo proporcionas dirección:
- Se genera búsqueda por dirección completa

## 📱 Navegación

El enlace "Delegaciones" se agregó al menú principal en:
- Header desktop
- Menú móvil (hamburger)

## 🎨 Estilos y Animaciones

- Uso de `motion` para animaciones suaves
- Diseño responsivo (mobile-first)
- Cards con hover effects
- Gradientes y efectos visuales modernos
- Iconos de Lucide React

## 🔒 Seguridad

- RLS (Row Level Security) habilitado
- Solo administradores pueden crear/editar/eliminar
- Usuarios públicos solo ven delegaciones activas
- Validación en frontend y backend

## 📝 Datos de Ejemplo

La migración incluye 2 delegaciones de ejemplo:
1. VIDA Santa Cruz - Querétaro Centro
2. VIDA Santa Cruz - Juriquilla

Puedes editarlas o eliminarlas según necesites.

## 🔄 Próximas Mejoras Sugeridas

- [ ] Sistema de filtrado por ciudad/estado
- [ ] Búsqueda de delegación más cercana (geolocalización)
- [ ] Galería de fotos para cada delegación
- [ ] Testimonios por delegación
- [ ] Estadísticas de asistencia
- [ ] Integración con calendario de eventos por delegación

## 🐛 Solución de Problemas

### Error al cargar delegaciones
- Verifica que la migración se haya ejecutado correctamente
- Revisa la conexión a Supabase
- Comprueba las políticas RLS

### Mapas no se muestran
- Verifica que las coordenadas sean correctas (formato decimal)
- Agrega GOOGLE_MAPS_API_KEY si quieres mapas embebidos
- Los enlaces a Google Maps siempre funcionarán

### Slug duplicado
- El sistema genera slugs automáticamente
- Si hay conflicto, edita manualmente el slug

## 📞 Soporte

Para dudas o problemas, contacta al equipo de desarrollo.

---

**¡Listo para usar! 🎉**

El sistema de delegaciones está completamente funcional y listo para producción.

