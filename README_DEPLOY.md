# BarberPro - Frontend

Sistema de gestión para barberías desarrollado con React, TypeScript y Vite.

## 🚀 Despliegue

### Netlify (Recomendado)

1. Conecta tu repositorio de GitHub a Netlify
2. Configuración automática:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

### Variables de Entorno

- `VITE_API_URL`: URL del backend (opcional, por defecto usa la de Render)

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa del build
npm run preview
```

## 📦 Tecnologías

- **React 19** + **TypeScript**  
- **Vite** para build y desarrollo
- **TailwindCSS** para estilos
- **TanStack React Query** para manejo de estado servidor
- **Zustand** para estado local
- **React Router** para navegación
- **Axios** para peticiones HTTP

## 🌐 API Backend

El frontend se conecta automáticamente a:
- **Desarrollo**: `https://localhost:8443/api`
- **Producción**: `https://appwwii-gestionbarberias.onrender.com/api`

## 📱 Funcionalidades

- ✅ Autenticación y autorización por roles
- ✅ Gestión de usuarios, barberos y servicios
- ✅ Sistema de citas y reservas
- ✅ Dashboard con estadísticas
- ✅ Interfaz responsive y moderna
- ✅ Manejo de errores y loading states
- ✅ Validación de formularios

## 📄 Estructura

```
src/
├── components/    # Componentes reutilizables
├── hooks/         # Custom hooks para lógica de negocio
├── pages/         # Páginas de la aplicación
├── router/        # Configuración de rutas
├── config/        # Configuración general
└── lib/           # Utilidades
```

## 🔧 Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter ESLint

---

**Desarrollado con ❤️ para la gestión moderna de barberías**
