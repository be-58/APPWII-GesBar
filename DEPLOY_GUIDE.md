# 🚀 Guía de Despliegue - BarberPro Frontend

## Configuración Lista para Netlify

El proyecto está completamente configurado para desplegarse en Netlify. Solo necesitas:

### 1. Conectar a Netlify

1. Ve a [Netlify](https://netlify.com) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Netlify detectará automáticamente la configuración desde `netlify.toml`

### 2. Configuración Automática

✅ **Build Command**: `npm run build`  
✅ **Publish Directory**: `dist`  
✅ **Node Version**: 18  
✅ **Redirects**: Configurados para SPA  
✅ **Headers de seguridad**: Incluidos  
✅ **Cache de assets**: Optimizado  

### 3. Variables de Entorno (Opcional)

Si quieres usar una URL de API diferente:
- `VITE_API_URL`: URL personalizada del backend

**Por defecto usa**: `https://appwwii-gestionbarberias.onrender.com/api`

## 🔧 Configuraciones Aplicadas

### ✅ API Configuration
- Desarrollo: `https://localhost:8443/api`
- Producción: `https://appwwii-gestionbarberias.onrender.com/api`

### ✅ Routing (SPA)
- `public/_redirects`: Configurado para React Router
- Todas las rutas redirigen a `/index.html`

### ✅ Build Optimization
- Sourcemaps deshabilitados para producción
- Minificación con esbuild
- Assets optimizados

### ✅ Security Headers
- CSP configurado para permitir la API de Render
- Headers de seguridad estándar
- Cache de assets a largo plazo

### ✅ SEO Ready
- Meta tags configurados
- Título y descripción optimizados
- Lang en español

---

## 🎯 Pasos para Desplegar

1. **Push tu código** a GitHub
2. **Conecta el repo** a Netlify
3. **Deploy automático** - ¡Listo!

### URL del sitio en Netlify:
`https://tu-sitio.netlify.app`

---

## 🧪 Testing Local

```bash
# Build local
npm run build

# Preview del build
npm run preview
```

## 📱 Compatibilidad

- ✅ Responsive design
- ✅ Navegadores modernos
- ✅ Mobile-first
- ✅ PWA-ready (si se necesita)

---

**¡El proyecto está listo para producción! 🎉**
