# 🗄️ Almacenamiento Propio para Archivos - VIDA SC

## 🎯 Escenario

Tienes más de 1 GB de archivos y quieres usar tu propio servidor en lugar de pagar más en Supabase.

---

## 📊 Comparación de Opciones

| Opción | Costo Mensual | Storage | Ventajas | Desventajas |
|--------|---------------|---------|----------|-------------|
| **Supabase Free** | $0 | 1 GB | Fácil, integrado | Límite bajo |
| **Supabase Pro** | $25 | 100 GB | Sin código extra | Más caro al crecer |
| **VPS Propio** | $5-10 | 50-100 GB | Barato, flexible | Requiere configuración |
| **Híbrido** | $5-25 | Ilimitado | Lo mejor de ambos | Más complejo |

---

## 🏗️ Arquitectura Híbrida (Recomendada)

### Concepto:
- **Supabase**: Base de datos + autenticación + metadata
- **Tu Servidor**: Solo almacenamiento de archivos grandes
- **Configuración dinámica**: Puedes cambiar entre uno y otro

### Diagrama:

```
Usuario sube archivo
    ↓
Frontend → Next.js API
    ↓
¿Archivo grande? (>5MB)
    ↓ SÍ              ↓ NO
Tu Servidor      Supabase Storage
    ↓                 ↓
Registro en BD Supabase
storage_provider: 'custom' o 'supabase'
storage_path: '/uploads/...' o 'vida-storage/...'
```

---

## 🔧 Implementación: Sistema Flexible

### 1. Actualizar Tabla de Archivos

Ejecuta en Supabase SQL Editor:

```sql
-- Agregar columna para identificar dónde está almacenado
ALTER TABLE public.archivos
ADD COLUMN IF NOT EXISTS storage_provider VARCHAR(50) DEFAULT 'supabase';
-- Valores: 'supabase', 'custom', 's3', etc.

-- Agregar configuración
CREATE TABLE IF NOT EXISTS public.storage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL, -- 'supabase', 'custom'
  nombre VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT false,
  
  -- Configuración específica
  config JSONB, -- URLs, credenciales, etc.
  
  -- Solo un provider activo a la vez
  UNIQUE(activo) WHERE activo = true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración por defecto
INSERT INTO public.storage_config (provider, nombre, activo, config) VALUES
  ('supabase', 'Supabase Storage', true, '{"bucket": "vida-storage"}'),
  ('custom', 'Servidor Propio', false, '{"base_url": "https://tu-servidor.com/uploads"}')
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.storage_config IS 'Configuración de proveedores de almacenamiento';
```

### 2. Crear Servicio de Almacenamiento

```typescript
// vida-web/lib/storage-service.ts

import { createClient } from '@/lib/supabase-browser'

export type StorageProvider = 'supabase' | 'custom'

interface StorageConfig {
  provider: StorageProvider
  config: {
    bucket?: string // Para Supabase
    base_url?: string // Para custom
    api_key?: string // Para custom (si usas autenticación)
  }
}

class StorageService {
  private config: StorageConfig | null = null

  async initialize() {
    const supabase = createClient()
    const { data } = await supabase
      .from('storage_config')
      .select('*')
      .eq('activo', true)
      .single()

    if (data) {
      this.config = {
        provider: data.provider,
        config: data.config
      }
    }
  }

  async upload(file: File, path: string, options?: any): Promise<string> {
    if (!this.config) await this.initialize()

    if (this.config?.provider === 'supabase') {
      return this.uploadToSupabase(file, path, options)
    } else {
      return this.uploadToCustom(file, path, options)
    }
  }

  private async uploadToSupabase(
    file: File, 
    path: string, 
    options?: any
  ): Promise<string> {
    const supabase = createClient()
    const bucket = this.config?.config.bucket || 'vida-storage'

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      })

    if (error) throw error

    return data.path
  }

  private async uploadToCustom(
    file: File, 
    path: string, 
    options?: any
  ): Promise<string> {
    const baseUrl = this.config?.config.base_url
    const apiKey = this.config?.config.api_key

    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)

    const headers: HeadersInit = {}
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const response = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      throw new Error('Error al subir archivo al servidor propio')
    }

    const result = await response.json()
    return result.path
  }

  async getDownloadUrl(storagePath: string, provider: StorageProvider): Promise<string> {
    if (provider === 'supabase') {
      const supabase = createClient()
      const bucket = this.config?.config.bucket || 'vida-storage'

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(storagePath, 60)

      if (error) throw error
      return data.signedUrl
    } else {
      // Para servidor propio, devolver URL directa o firmada
      const baseUrl = this.config?.config.base_url
      return `${baseUrl}/download/${storagePath}`
    }
  }

  async delete(storagePath: string, provider: StorageProvider): Promise<void> {
    if (provider === 'supabase') {
      const supabase = createClient()
      const bucket = this.config?.config.bucket || 'vida-storage'

      const { error } = await supabase.storage
        .from(bucket)
        .remove([storagePath])

      if (error) throw error
    } else {
      const baseUrl = this.config?.config.base_url
      const apiKey = this.config?.config.api_key

      await fetch(`${baseUrl}/delete/${storagePath}`, {
        method: 'DELETE',
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
      })
    }
  }
}

export const storageService = new StorageService()
```

### 3. API de Upload Actualizada

```typescript
// vida-web/app/api/archivos/upload/route.ts

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { storageService } from '@/lib/storage-service'

const MAX_SIZE_SUPABASE = 5 * 1024 * 1024 // 5 MB
const MAX_SIZE_CUSTOM = 100 * 1024 * 1024 // 100 MB

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

    // Verificar permisos
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

    // Decidir dónde almacenar según el tamaño
    const useCustomStorage = file.size > MAX_SIZE_SUPABASE
    const provider: 'supabase' | 'custom' = useCustomStorage ? 'custom' : 'supabase'

    // Validar tamaño máximo
    const maxSize = useCustomStorage ? MAX_SIZE_CUSTOM : MAX_SIZE_SUPABASE
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Archivo demasiado grande. Máximo: ${maxSize / 1024 / 1024} MB` },
        { status: 400 }
      )
    }

    // Construir path
    const folder = rolMinimo === 'admin' ? 'admin' : 
                   rolMinimo === 'pastor' ? 'pastor' :
                   rolMinimo === 'lider' ? 'lider' :
                   rolMinimo === 'celula' ? 'celula' : 'general'
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const storagePath = `${folder}/${fileName}`

    // Subir usando el servicio
    let uploadedPath: string
    try {
      uploadedPath = await storageService.upload(file, storagePath)
    } catch (uploadError: any) {
      console.error('Error uploading:', uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    // Crear registro en BD
    const { data: archivoData, error: dbError } = await supabase
      .from('archivos')
      .insert({
        nombre: file.name,
        descripcion,
        tipo_archivo: file.type,
        tamano: file.size,
        storage_path: uploadedPath,
        storage_provider: provider, // NUEVO
        storage_bucket: provider === 'supabase' ? 'vida-storage' : null,
        rol_minimo: rolMinimo,
        categoria,
        subido_por: user.id,
      })
      .select()
      .single()

    if (dbError) {
      // Si falla la BD, intentar eliminar el archivo subido
      try {
        await storageService.delete(uploadedPath, provider)
      } catch (deleteError) {
        console.error('Error cleaning up file:', deleteError)
      }
      
      console.error('Error creating database record:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      archivo: archivoData,
      provider,
      message: `Archivo subido exitosamente a ${provider}` 
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

## 🖥️ Configurar Tu Propio Servidor

### Opción A: Servidor Node.js Simple

```javascript
// server.js - Servidor Express simple para archivos

const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 3001

// Configuración de Multer para almacenar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads')
    // Crear directorio si no existe
    fs.mkdirSync(uploadPath, { recursive: true })
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB max
})

// Middleware de autenticación (opcional)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  try {
    // Verificar token (usa tu clave secreta)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

// Endpoint para subir archivos
app.post('/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se proporcionó archivo' })
  }

  const filePath = req.file.path.replace(__dirname + '/', '')
  
  res.json({
    message: 'Archivo subido exitosamente',
    path: filePath,
    filename: req.file.filename,
    size: req.file.size
  })
})

// Endpoint para descargar archivos
app.get('/download/:filename', authenticate, (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(__dirname, 'uploads', filename)

  // Verificar que el archivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' })
  }

  // Enviar archivo
  res.download(filePath)
})

// Endpoint para eliminar archivos
app.delete('/delete/:filename', authenticate, (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(__dirname, 'uploads', filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' })
  }

  fs.unlinkSync(filePath)
  res.json({ message: 'Archivo eliminado' })
})

app.listen(PORT, () => {
  console.log(`Servidor de archivos ejecutándose en puerto ${PORT}`)
})
```

### Instalar dependencias:

```bash
npm init -y
npm install express multer jsonwebtoken dotenv
```

### Configurar en servidor (VPS):

```bash
# 1. Conectar a tu VPS
ssh root@tu-servidor.com

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Crear directorio
mkdir /var/www/vida-storage
cd /var/www/vida-storage

# 4. Copiar tu server.js
# 5. Crear .env con JWT_SECRET

# 6. Instalar PM2 (para mantener corriendo)
npm install -g pm2

# 7. Iniciar servidor
pm2 start server.js --name vida-storage
pm2 startup
pm2 save

# 8. Configurar Nginx como proxy inverso
sudo nano /etc/nginx/sites-available/storage

# Contenido:
server {
    listen 80;
    server_name storage.vidaysc.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activar sitio
sudo ln -s /etc/nginx/sites-available/storage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 9. Instalar SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d storage.vidaysc.com
```

---

## 🔄 Estrategia de Migración

### Fase 1: Dual Mode (Ambos activos)
```typescript
// Configurar para usar ambos
// Archivos pequeños → Supabase
// Archivos grandes → Tu servidor
```

### Fase 2: Migración Gradual
```sql
-- Migrar archivos antiguos
UPDATE public.archivos
SET storage_provider = 'custom',
    storage_path = 'nuevo-path-en-servidor'
WHERE tamano > 5242880; -- 5MB
```

### Fase 3: Solo Servidor Propio
```typescript
// Actualizar configuración
UPDATE storage_config
SET activo = false
WHERE provider = 'supabase';

UPDATE storage_config
SET activo = true
WHERE provider = 'custom';
```

---

## 💾 Proveedores de Hosting Recomendados

### VPS (Virtual Private Server)

| Proveedor | Precio/mes | Storage | RAM | Tráfico |
|-----------|------------|---------|-----|---------|
| **Hetzner** | €4.5 (~$5) | 40 GB SSD | 2 GB | 20 TB |
| **DigitalOcean** | $6 | 25 GB SSD | 1 GB | 1 TB |
| **Vultr** | $5 | 25 GB SSD | 1 GB | 1 TB |
| **Contabo** | €5 | 100 GB | 4 GB | 32 TB |

### Storage Dedicado

| Proveedor | Precio/mes | Storage |
|-----------|------------|---------|
| **Wasabi** | $6.99 | 1 TB |
| **Backblaze B2** | $0.005/GB | ~$5 por 1 TB |
| **AWS S3** | Variable | ~$23 por 1 TB |

**Recomendación:** Hetzner o Contabo (mejor relación precio/rendimiento)

---

## 🎯 Plan Recomendado por Etapas

### Etapa 1: 0-1 GB (Actual)
- ✅ **Usa Supabase Storage** (gratis)
- Sin configuración adicional
- Todo integrado

### Etapa 2: 1-10 GB (Cerca del límite)
- 🔄 **Implementa sistema híbrido**
- Archivos >5MB → Tu servidor
- Archivos pequeños → Supabase
- Costo: $5-10/mes

### Etapa 3: 10+ GB (Escalando)
- 🖥️ **Migra todo a tu servidor**
- Solo BD en Supabase
- Costo: $10-15/mes
- 100% de control

---

## 📝 Resumen

### ¿Cuándo cambiar a servidor propio?

- ✅ Más de 1 GB de archivos
- ✅ Muchos archivos grandes (>10MB)
- ✅ Más de 10,000 descargas/mes
- ✅ Quieres más control
- ✅ Presupuesto ajustado

### ¿Qué necesitas?

1. **VPS** ($5-10/mes) - Hetzner o DigitalOcean
2. **Dominio** (opcional) - storage.vidaysc.com
3. **Servidor Node.js** (te di el código)
4. **Sistema híbrido** (te di el código)

### Ventajas:

- 💰 **Más barato** al crecer
- 🎯 **Control total** de tus archivos
- 📈 **Escalable** sin límites
- 🔒 **Seguro** (tú controlas todo)

### Desventajas:

- ⚙️ Requiere configuración inicial
- 🛠️ Mantenimiento del servidor
- 📚 Más código que mantener

---

## 🎉 Conclusión

**Mi recomendación:**

1. **Ahora**: Usa Supabase (gratis, simple)
2. **Al llegar a 500MB**: Implementa sistema híbrido
3. **Al llegar a 2GB**: Migra todo a tu servidor

El código que te di te permite hacer la transición sin cambiar tu aplicación. Solo cambias la configuración en la BD y listo. 🚀

¿Necesitas ayuda con alguna parte específica de la implementación?

