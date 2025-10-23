# 🛡️ Sistema de Roles y Permisos - VIDA SC

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Configuración Inicial](#configuración-inicial)
3. [Roles Predefinidos](#roles-predefinidos)
4. [Gestión de Roles](#gestión-de-roles)
5. [Asignación de Roles a Usuarios](#asignación-de-roles-a-usuarios)
6. [API Endpoints](#api-endpoints)
7. [Permisos y Restricciones](#permisos-y-restricciones)
8. [Desarrollo Futuro](#desarrollo-futuro)

---

## 🎯 Descripción General

El sistema de roles y permisos de VIDA SC es un framework completo y escalable que permite:

- ✅ Gestionar múltiples roles de usuario
- ✅ Asignar roles a usuarios de forma dinámica
- ✅ Crear nuevos roles desde el dashboard
- ✅ Controlar acceso al panel de administración basado en roles
- ✅ Sistema de permisos granular (preparado para futuras funcionalidades)
- ✅ Políticas de seguridad RLS (Row Level Security) en Supabase

## 🔧 Configuración Inicial

### Paso 1: Ejecutar Migración SQL

El archivo `supabase/migrations/001_create_roles_system.sql` contiene todo el esquema necesario.

**Opciones para ejecutar:**

#### Opción A: Desde Supabase Dashboard
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a: **SQL Editor**
3. Crea una nueva query
4. Copia y pega todo el contenido del archivo `001_create_roles_system.sql`
5. Ejecuta la query

#### Opción B: Usando CLI de Supabase
```bash
# Si tienes Supabase CLI instalado
supabase migration up
```

### Paso 2: Verificar Tablas Creadas

Las siguientes tablas deberían estar creadas:

- `public.roles` - Roles del sistema
- `public.user_roles` - Asignación de roles a usuarios
- `public.permissions` - Permisos disponibles
- `public.role_permissions` - Permisos asignados a roles

### Paso 3: Asignar Rol de Admin

**⚠️ IMPORTANTE:** Después de ejecutar la migración, necesitas asignar el rol de administrador a tu usuario.

```sql
-- Reemplaza 'tu-email@ejemplo.com' con tu email de usuario
INSERT INTO public.user_roles (user_id, role_id)
SELECT 
  auth.users.id,
  roles.id
FROM auth.users
CROSS JOIN public.roles
WHERE auth.users.email = 'tu-email@ejemplo.com'
AND roles.name = 'admin';
```

---

## 🎭 Roles Predefinidos

El sistema viene con 6 roles predefinidos:

| Rol | Nombre Interno | Color | Descripción | Acceso Dashboard |
|-----|---------------|-------|-------------|------------------|
| 👑 **Administrador** | `admin` | Rojo | Acceso completo al sistema | ✅ Sí |
| 🙏 **Pastor** | `pastor` | Morado | Líder espiritual con permisos extendidos | ✅ Sí |
| 👥 **Líder** | `lider` | Azul | Líder de ministerio o grupo | ✅ Sí |
| 🏠 **Célula** | `celula` | Verde | Líder de célula | ✅ Sí |
| 📚 **Curso** | `curso` | Amarillo | Acceso a cursos y materiales | ✅ Sí |
| 👤 **Usuario** | `usuario` | Gris | Usuario regular sin permisos especiales | ❌ No |

### Características de los Roles:

- **Roles del Sistema**: Los roles predefinidos son marcados como `is_system = true`, lo que significa que no se pueden eliminar (solo el admin puede modificarlos).
  
- **Roles Personalizados**: Puedes crear nuevos roles desde el dashboard que serán marcados como `is_system = false` y podrán ser eliminados.

---

## 🛠️ Gestión de Roles

### Acceder a la Gestión de Roles

1. Inicia sesión con una cuenta que tenga rol de **admin**
2. Ve al Panel de Administración
3. Haz clic en la pestaña **"Roles"**

### Crear un Nuevo Rol

1. En la sección de Gestión de Roles, haz clic en **"Crear Rol"**
2. Completa el formulario:
   - **Nombre del Rol (interno)**: Sin espacios, minúsculas (ej: `coordinador`)
   - **Nombre a Mostrar**: Como se verá en la UI (ej: `Coordinador`)
   - **Descripción**: Opcional, describe las funciones del rol
   - **Color**: Selecciona un color para identificar el rol visualmente
3. Haz clic en **"Crear Rol"**

### Eliminar un Rol

- Solo puedes eliminar roles **personalizados** (no los del sistema)
- Haz clic en el ícono de eliminar 🗑️ junto al rol
- Confirma la eliminación
- ⚠️ **Nota**: Esto removerá todas las asignaciones de este rol a usuarios

---

## 👥 Asignación de Roles a Usuarios

### Desde el Panel de Administración

1. Ve a la pestaña **"Resumen"**
2. En la tabla de usuarios, verás una columna de **"Roles"**
3. Cada usuario muestra sus roles actuales como badges de colores
4. Haz clic en el botón **+** junto a los roles de un usuario
5. Selecciona el rol que deseas asignar
6. Haz clic en **"Asignar"**

### Remover un Rol

- Haz clic en la **X** en el badge del rol que deseas remover
- El rol se quitará inmediatamente

### Desde SQL (Manual)

```sql
-- Asignar rol a usuario
INSERT INTO public.user_roles (user_id, role_id, assigned_by)
VALUES (
  'uuid-del-usuario',
  'uuid-del-rol',
  'uuid-del-admin'
);

-- Remover rol de usuario
DELETE FROM public.user_roles
WHERE user_id = 'uuid-del-usuario'
AND role_id = 'uuid-del-rol';
```

---

## 🔌 API Endpoints

### 1. Obtener todos los roles
```http
GET /api/admin/roles
```

**Respuesta:**
```json
{
  "roles": [
    {
      "id": "uuid",
      "name": "admin",
      "display_name": "Administrador",
      "description": "Acceso completo al sistema",
      "color": "#EF4444",
      "is_system": true,
      "created_at": "2024-...",
      "user_roles": [{ "count": 5 }]
    }
  ]
}
```

### 2. Crear nuevo rol
```http
POST /api/admin/roles
Content-Type: application/json

{
  "name": "moderador",
  "display_name": "Moderador",
  "description": "Modera contenido y usuarios",
  "color": "#3B82F6"
}
```

### 3. Eliminar rol
```http
DELETE /api/admin/roles?id=uuid-del-rol
```

### 4. Obtener roles de un usuario
```http
GET /api/admin/user-roles?userId=uuid-del-usuario
```

### 5. Asignar rol a usuario
```http
POST /api/admin/user-roles
Content-Type: application/json

{
  "userId": "uuid-del-usuario",
  "roleId": "uuid-del-rol"
}
```

### 6. Remover rol de usuario
```http
DELETE /api/admin/user-roles?userId=uuid&roleId=uuid
```

### 7. Listar usuarios (incluye roles)
```http
GET /api/admin/users
```

**Respuesta:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "created_at": "2024-...",
      "roles": [
        {
          "role_id": "uuid",
          "role_name": "admin",
          "display_name": "Administrador",
          "color": "#EF4444"
        }
      ]
    }
  ]
}
```

---

## 🔒 Permisos y Restricciones

### Control de Acceso al Dashboard

El acceso al panel de administración está controlado por roles:

```typescript
// En /api/admin/users/route.ts
const hasAccess = userRoles?.some((role: any) => role.role_name !== 'usuario')
```

**Regla actual:**
- ✅ **Permitidos**: Todos los roles EXCEPTO `usuario`
- ❌ **Bloqueados**: Solo el rol `usuario`

### Permisos Predefinidos

El sistema incluye permisos básicos preparados para funcionalidades futuras:

| Permiso | Módulo | Descripción |
|---------|--------|-------------|
| `dashboard.view` | dashboard | Ver el panel de administración |
| `dashboard.manage` | dashboard | Configurar el dashboard |
| `users.view` | users | Ver lista de usuarios |
| `users.manage` | users | Gestionar usuarios |
| `roles.view` | roles | Ver roles del sistema |
| `roles.manage` | roles | Crear y modificar roles |
| `content.view` | content | Ver contenido del sitio |
| `content.manage` | content | Crear y editar contenido |

### Asignación Actual de Permisos

- **Admin**: Todos los permisos
- **Pastor**: `dashboard.view`, `users.view`, `content.view`, `content.manage`
- **Líder**: `dashboard.view`, `users.view`, `content.view`
- **Otros roles**: Sin permisos asignados por defecto

---

## 🚀 Desarrollo Futuro

### Implementar Verificación Granular de Permisos

Actualmente, el sistema verifica solo si el usuario tiene acceso al dashboard. Para implementar verificación de permisos específicos:

```typescript
// Función de utilidad
async function userHasPermission(userId: string, permission: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_roles')
    .select(`
      role:roles!inner (
        role_permissions!inner (
          permission:permissions!inner (
            name
          )
        )
      )
    `)
    .eq('user_id', userId)
  
  return data?.some(ur => 
    ur.role.role_permissions.some(rp => 
      rp.permission.name === permission
    )
  ) || false
}

// Uso
if (await userHasPermission(user.id, 'content.manage')) {
  // Permitir editar contenido
}
```

### Agregar Nuevos Módulos

1. Define permisos en la tabla `permissions`:
```sql
INSERT INTO public.permissions (name, display_name, description, module) 
VALUES 
  ('events.view', 'Ver Eventos', 'Acceso a ver eventos', 'events'),
  ('events.manage', 'Gestionar Eventos', 'Crear y editar eventos', 'events');
```

2. Asigna permisos a roles:
```sql
-- Dar permisos de eventos al pastor
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'pastor'
AND p.module = 'events';
```

### UI para Gestión de Permisos

Considera agregar una interfaz para:
- Ver todos los permisos disponibles
- Asignar/remover permisos a roles visualmente
- Crear nuevos permisos desde el dashboard

---

## 🧪 Funciones SQL Útiles

### Verificar roles de un usuario
```sql
SELECT * FROM get_user_roles('uuid-del-usuario');
```

### Verificar si usuario tiene un rol
```sql
SELECT user_has_role('uuid-del-usuario', 'admin');
```

### Verificar si usuario es admin
```sql
SELECT is_admin('uuid-del-usuario');
```

### Ver todos los usuarios con sus roles
```sql
SELECT 
  u.email,
  r.display_name as rol,
  ur.assigned_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.roles r ON r.id = ur.role_id
ORDER BY u.email, r.display_name;
```

### Ver roles sin asignar a ningún usuario
```sql
SELECT r.*
FROM public.roles r
LEFT JOIN public.user_roles ur ON ur.role_id = r.id
WHERE ur.id IS NULL;
```

---

## 📝 Notas Importantes

### Seguridad

- ✅ Todas las tablas tienen RLS (Row Level Security) habilitado
- ✅ Solo los admins pueden crear/modificar roles
- ✅ Las funciones SQL usan `SECURITY DEFINER` para acceso controlado
- ✅ Las APIs verifican autenticación y permisos antes de ejecutar acciones

### Rendimiento

- Índices creados en columnas clave para búsquedas rápidas
- Las consultas usan JOINs eficientes
- Los roles se cachean en el cliente para reducir llamadas a la API

### Escalabilidad

- Sistema preparado para cientos de roles
- Soporte para miles de usuarios
- Arquitectura modular que permite agregar nuevos permisos fácilmente

---

## 🆘 Solución de Problemas

### No puedo acceder al dashboard
- Verifica que tengas al menos un rol asignado
- Asegúrate de que tu rol NO sea `usuario`
- Verifica tu sesión (cierra sesión y vuelve a entrar)

### Error al crear roles
- Solo los administradores pueden crear roles
- Verifica que tengas el rol `admin` asignado
- Revisa la consola del navegador para más detalles

### Los roles no se muestran
- Verifica que las migraciones SQL se ejecutaron correctamente
- Comprueba que las funciones RPC estén creadas en Supabase
- Revisa los logs de la API en la consola del servidor

### No puedo eliminar un rol del sistema
- Los roles con `is_system = true` no se pueden eliminar
- Solo los roles personalizados pueden ser eliminados
- Esto es por diseño para mantener la integridad del sistema

---

## 🎓 Próximos Pasos Recomendados

1. **Asignar el rol de admin a tu usuario** (ver Configuración Inicial)
2. **Probar crear un rol personalizado** desde el dashboard
3. **Asignar roles a usuarios de prueba** para verificar restricciones
4. **Implementar verificación de permisos granular** según necesidades
5. **Agregar nuevos permisos** conforme crece la aplicación

---

**¿Necesitas ayuda?** Revisa los logs de Supabase y la consola del navegador para errores específicos.

