# 🏗️ Arquitectura Completa - VIDA SC

## 📊 Resumen Ejecutivo

**Base de Datos Recomendada:** Supabase PostgreSQL (ya integrada)

**Almacenamiento de Archivos:** Supabase Storage

---

## 🎯 Funcionalidades a Implementar

### 1. 📍 **Delegaciones** (Sedes)
- Información de cada delegación
- Responsables y miembros
- Ubicación y contacto
- Archivos específicos por delegación

### 2. 📁 **Gestión de Archivos** (PDFs, Documentos)
- Control de acceso por rol
- Organización por categorías
- Historial de descargas
- Búsqueda y filtros

### 3. 📝 **Blog**
- Posts con imágenes
- Categorías y tags
- Control de publicación
- Vistas y estadísticas

---

## 🗄️ Arquitectura de Base de Datos

### Tablas Creadas:

| Tabla | Propósito | Acceso |
|-------|-----------|--------|
| `delegaciones` | Info de sedes | Todos autenticados |
| `blog_posts` | Posts del blog | Públicos si publicados |
| `archivos` | Metadata de archivos | Según rol |
| `delegacion_miembros` | Usuarios por delegación | Miembros y admins |
| `categorias` | Organización de contenido | Todos |
| `archivo_descargas` | Auditoría de descargas | Solo admins |

### Diagrama de Relaciones:

```
auth.users (Supabase Auth)
    ├─→ user_roles ←→ roles
    ├─→ delegacion_miembros ←→ delegaciones
    ├─→ blog_posts
    └─→ archivos
```

---

## 📁 Supabase Storage - Configuración

### Paso 1: Crear Bucket

1. Ve a Supabase Dashboard
2. Storage → New Bucket
3. Nombre: `vida-storage`
4. **Público:** NO (lo controlaremos con políticas)

### Paso 2: Políticas de Storage

Ejecuta en SQL Editor:

```sql
-- Política para subir archivos (solo admin y pastor)
CREATE POLICY "Admins y pastores pueden subir archivos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vida-storage' AND
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    INNER JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('admin', 'pastor')
  )
);

-- Política para leer archivos (según la carpeta y rol)
CREATE POLICY "Usuarios pueden descargar según su rol"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'vida-storage' AND
  (
    -- Carpeta pública
    (storage.foldername(name))[1] = 'public' OR
    -- Admin puede todo
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      INNER JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    ) OR
    -- Archivos según rol
    (
      (storage.foldername(name))[1] = 'protected' AND
      (
        ((storage.foldername(name))[2] = 'admin' AND user_has_role(auth.uid(), 'admin')) OR
        ((storage.foldername(name))[2] = 'pastor' AND user_has_role(auth.uid(), 'pastor')) OR
        ((storage.foldername(name))[2] = 'lider' AND user_has_role(auth.uid(), 'lider')) OR
        ((storage.foldername(name))[2] = 'celula' AND user_has_role(auth.uid(), 'celula'))
      )
    )
  )
);

-- Política para actualizar archivos (solo quien los subió o admin)
CREATE POLICY "Solo creador o admin pueden actualizar archivos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vida-storage' AND
  (
    owner = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      INNER JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  )
);

-- Política para eliminar archivos (solo admin)
CREATE POLICY "Solo admins pueden eliminar archivos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vida-storage' AND
  is_admin(auth.uid())
);
```

---

## 🎨 Estructura de Carpetas en Storage

```
vida-storage/
│
├── public/                      # ✅ Acceso: Todos
│   ├── blog-images/            # Imágenes del blog
│   │   ├── portadas/
│   │   └── contenido/
│   ├── delegaciones/           # Fotos de sedes
│   └── general/                # Logos, imágenes generales
│
└── protected/                   # 🔒 Acceso: Según rol
    ├── admin/                  # Solo admin
    │   ├── reportes/
    │   ├── financiero/
    │   └── confidencial/
    │
    ├── pastor/                 # Admin + Pastor
    │   ├── sermones/
    │   ├── estudios/
    │   └── planificacion/
    │
    ├── lider/                  # Admin + Pastor + Líder
    │   ├── capacitacion/
    │   ├── materiales/
    │   └── guias/
    │
    ├── celula/                 # Admin + Pastor + Líder + Célula
    │   ├── estudios-semanales/
    │   └── recursos/
    │
    └── delegaciones/           # Por delegación específica
        ├── delegacion-norte/
        ├── delegacion-sur/
        └── delegacion-centro/
```

---

## 🔄 Flujo de Subida de Archivos

### Diagrama:

```
1. Usuario (admin/pastor) selecciona archivo
   ↓
2. Frontend valida: tipo, tamaño, formato
   ↓
3. Sube a Supabase Storage (carpeta según rol_minimo)
   ↓
4. Storage devuelve: storage_path
   ↓
5. Frontend crea registro en tabla 'archivos'
   {
     nombre,
     storage_path,
     rol_minimo,
     delegacion_id (opcional),
     subido_por: user.id
   }
   ↓
6. Backend aplica RLS: verifica permisos
   ↓
7. ✅ Archivo disponible para usuarios con rol adecuado
```

---

## 💻 Ejemplo de Código para Subir Archivo

### API Route: `/api/archivos/upload`

```typescript
// vida-web/app/api/archivos/upload/route.ts

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {},
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que sea admin o pastor
    const { data: userRoles } = await supabase
      .rpc('get_user_roles', { user_uuid: user.id })
    
    const canUpload = userRoles?.some(
      (role: any) => ['admin', 'pastor'].includes(role.role_name)
    )
    
    if (!canUpload) {
      return NextResponse.json(
        { error: 'No tienes permisos para subir archivos' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const rolMinimo = formData.get('rol_minimo') as string
    const categoria = formData.get('categoria') as string
    const descripcion = formData.get('descripcion') as string
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Construir path según rol
    const folder = rolMinimo === 'admin' ? 'protected/admin' : 
                   rolMinimo === 'pastor' ? 'protected/pastor' :
                   rolMinimo === 'lider' ? 'protected/lider' :
                   rolMinimo === 'celula' ? 'protected/celula' : 'protected/general'
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const storagePath = `${folder}/${fileName}`

    // Subir a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vida-storage')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Crear registro en tabla archivos
    const { data: archivoData, error: dbError } = await supabase
      .from('archivos')
      .insert({
        nombre: file.name,
        descripcion,
        tipo_archivo: file.type,
        tamano: file.size,
        storage_path: storagePath,
        storage_bucket: 'vida-storage',
        rol_minimo: rolMinimo,
        categoria,
        subido_por: user.id,
      })
      .select()
      .single()

    if (dbError) {
      // Si falla la BD, eliminar archivo de storage
      await supabase.storage.from('vida-storage').remove([storagePath])
      console.error('Error creating database record:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      archivo: archivoData,
      message: 'Archivo subido exitosamente' 
    }, { status: 201 })

  } catch (error) {
    console.error('Error in upload API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

---

## 📥 Ejemplo de Descarga de Archivo

### API Route: `/api/archivos/download/[id]`

```typescript
// vida-web/app/api/archivos/download/[id]/route.ts

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {},
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos con la función SQL
    const { data: canAccess } = await supabase
      .rpc('user_can_access_file', {
        user_uuid: user.id,
        file_id: params.id
      })

    if (!canAccess) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a este archivo' },
        { status: 403 }
      )
    }

    // Obtener info del archivo
    const { data: archivo, error: fileError } = await supabase
      .from('archivos')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fileError || !archivo) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
    }

    // Obtener URL firmada de descarga (válida por 60 segundos)
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(archivo.storage_bucket)
      .createSignedUrl(archivo.storage_path, 60)

    if (urlError) {
      return NextResponse.json({ error: urlError.message }, { status: 500 })
    }

    // Registrar descarga
    await supabase.from('archivo_descargas').insert({
      archivo_id: params.id,
      user_id: user.id,
    })

    // Incrementar contador
    await supabase.rpc('increment_download_count', { file_id: params.id })

    return NextResponse.json({
      downloadUrl: signedUrl.signedUrl,
      archivo: {
        nombre: archivo.nombre,
        tipo: archivo.tipo_archivo,
        tamano: archivo.tamano
      }
    })

  } catch (error) {
    console.error('Error in download API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

---

## 📊 Comparación: Supabase vs Otra BD

| Aspecto | Supabase (Recomendado) | BD Separada |
|---------|------------------------|-------------|
| **Integración Auth** | ✅ Nativa | ❌ Manual |
| **Almacenamiento** | ✅ Storage incluido | ❌ Servidor FTP/S3 |
| **Seguridad RLS** | ✅ Automática | ❌ Manual en código |
| **APIs REST** | ✅ Auto-generadas | ❌ Crear desde cero |
| **Realtime** | ✅ Incluido | ❌ Websockets manual |
| **Escalabilidad** | ✅ Automática | ⚠️ Depende del hosting |
| **Costo inicial** | ✅ Gratis hasta 500MB BD | Varía |
| **Complejidad** | ✅ Baja | ⚠️ Alta |

### 🎯 Recomendación Final: **Supabase** ✅

**¿Por qué?**
- Todo integrado (Auth + BD + Storage)
- Ya lo tienes funcionando
- Menos código que mantener
- Más seguro (RLS integrado)
- Escalable sin esfuerzo

---

## 🚀 Plan de Implementación

### Fase 1: Base de Datos (1-2 días)
- ✅ Ejecutar `002_add_content_system.sql`
- ✅ Crear bucket en Storage
- ✅ Configurar políticas de Storage
- ✅ Probar subida/descarga manual

### Fase 2: APIs (3-4 días)
- Crear API de upload
- Crear API de download
- Crear API de listado de archivos
- APIs de delegaciones
- APIs de blog

### Fase 3: UI Admin (5-7 días)
- Componente de subida de archivos
- Gestor de archivos (lista, filtros, búsqueda)
- CRUD de delegaciones
- Editor de blog posts

### Fase 4: UI Pública (3-5 días)
- Página de delegaciones
- Blog público
- Descarga de archivos permitidos

---

## 📈 Límites y Escalabilidad

### Plan Gratuito de Supabase:
- ✅ 500 MB de base de datos
- ✅ 1 GB de almacenamiento
- ✅ 2 GB de transferencia/mes
- ✅ 50,000 usuarios autenticados
- ✅ 50 MB por archivo

### ¿Cuándo necesitas pagar?
- Más de 500 usuarios activos/mes
- Más de 100 archivos grandes (>10MB)
- Más de 10,000 descargas/mes

### Plan Pro ($25/mes):
- 8 GB de base de datos
- 100 GB de almacenamiento
- 200 GB de transferencia
- 100,000 usuarios

---

## 🎓 Próximos Pasos

1. **Ejecuta la migración SQL** (`002_add_content_system.sql`)
2. **Crea el bucket** en Supabase Storage
3. **Configura las políticas** de Storage
4. **Prueba subir un archivo** manualmente
5. **Crea las APIs** de upload/download
6. **Desarrolla la UI** de gestión

---

## 📞 ¿Necesitas ayuda?

Consulta los archivos:
- `ROLES_DOCUMENTATION.md` - Sistema de roles
- `002_add_content_system.sql` - Schema completo
- Este archivo - Arquitectura general

**¡Todo está listo para empezar a desarrollar!** 🚀

