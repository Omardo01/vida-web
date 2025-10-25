# 🚧 Modo Construcción - Guía de Configuración

## ✅ ¿Qué se implementó?

Se creó un sistema de middleware que redirige automáticamente todas las visitas a la página de construcción (`/construyendo`) cuando está activado, manteniendo el código completo intacto.

## 🎯 Cómo Activar/Desactivar

### **Opción 1: Configurar en Vercel (Recomendado para Producción)**

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega una nueva variable:
   - **Name:** `NEXT_PUBLIC_UNDER_CONSTRUCTION`
   - **Value:** `true` (para activar) o `false` (para desactivar)
   - **Environments:** Marca "Production" (y opcionalmente Preview/Development)
5. Haz clic en **Save**
6. **Importante:** Necesitas hacer un nuevo deploy para que tome efecto:
   - Ve a **Deployments**
   - Haz clic en los tres puntos del último deployment
   - Selecciona **Redeploy**

### **Opción 2: Variable Local (Para Testing)**

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_UNDER_CONSTRUCTION=true
```

Luego reinicia el servidor de desarrollo:
```bash
npm run dev
```

## 🔒 Rutas Protegidas (Excepciones)

Las siguientes rutas **NO se redirigen** incluso con el modo construcción activado:

✅ `/construyendo` - La página de construcción misma
✅ `/api/*` - Todas las APIs
✅ `/_next/*` - Assets de Next.js
✅ `/images/*` - Imágenes públicas
✅ `/favicon.ico` - Favicon

### Rutas Opcionales (Deshabilitadas por defecto)

En `middleware.ts` encontrarás rutas comentadas que puedes habilitar:

```typescript
const optionalAllowedPaths = [
  // '/admin',      // Descomentar para permitir acceso al admin
  // '/auth',       // Descomentar para permitir autenticación
  // '/test-auth',  // Descomentar para tests
]
```

**Para habilitar el admin durante construcción:**
1. Abre `middleware.ts`
2. Descomenta la línea `// '/admin',`
3. Guarda y haz commit + push

## 📋 Pasos para Poner en Producción

### 1️⃣ Hacer Push del Código

```bash
git add .
git commit -m "feat: agregar sistema de modo construcción con middleware"
git push origin main
```

### 2️⃣ Configurar Variable en Vercel

Sigue los pasos de **Opción 1** arriba

### 3️⃣ Verificar

Visita tu sitio en producción. Deberías ver la página de construcción.

### 4️⃣ Para Desactivar (Cuando el sitio esté listo)

En Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Encuentra `NEXT_PUBLIC_UNDER_CONSTRUCTION`
3. Cambia el valor a `false`
4. Haz **Redeploy**

## 🎨 Personalizar la Página de Construcción

La página de construcción está en:
```
app/construyendo/page.tsx
```

Puedes editarla cuando quieras. Los cambios se reflejarán automáticamente.

## 🔧 Troubleshooting

### El modo construcción no se activa
- Verifica que la variable sea exactamente `NEXT_PUBLIC_UNDER_CONSTRUCTION`
- El valor debe ser `true` (sin comillas en Vercel)
- Asegúrate de hacer Redeploy después de cambiar la variable

### Necesito acceder al admin en producción
- Descomenta `'/admin'` en `optionalAllowedPaths`
- Haz commit y push
- O accede directamente cambiando temporalmente la variable a `false`

### Quiero probar localmente primero
- Usa `.env.local` con `NEXT_PUBLIC_UNDER_CONSTRUCTION=true`
- Reinicia el servidor
- Prueba navegando a diferentes rutas

## 📱 Comandos Útiles

```bash
# Desarrollo local con modo construcción activado
echo "NEXT_PUBLIC_UNDER_CONSTRUCTION=true" > .env.local
npm run dev

# Desarrollo local normal
echo "NEXT_PUBLIC_UNDER_CONSTRUCTION=false" > .env.local
npm run dev

# Ver el sitio de construcción directamente
# Navega a: http://localhost:3000/construyendo
```

## ✨ Ventajas de Este Sistema

✅ **No pierdes código** - Todo está intacto
✅ **Reversible instantáneamente** - Solo cambia una variable
✅ **Profesional** - Control total desde Vercel
✅ **Flexible** - Puedes permitir rutas específicas
✅ **Sin branches** - Todo en `main`
✅ **SEO friendly** - Redirects 302 (temporales)

---

**¿Preguntas o problemas?** Revisa el archivo `middleware.ts` para más detalles técnicos.

