# APPWII-GesBar - Sistema de Gestión de Barberías

Sistema web para la gestión integral de barberías, desarrollado con React, TypeScript, TailwindCSS y TanStack Query.

## 🚀 Características

- **Autenticación y autorización** con roles (admin, barbero, cliente)
- **Gestión de citas** con diferentes estados y métodos de pago
- **Catálogo de servicios** con precios y duraciones
- **Gestión de barberos** (solo administradores)
- **Perfiles de usuario** editables
- **Interfaz responsiva** con TailwindCSS
- **Estado global** con Zustand
- **Manejo de datos** con TanStack React Query

## 🛠️ Tecnologías

- **Frontend:** React 19, TypeScript, Vite
- **Estilos:** TailwindCSS v4
- **Componentes UI:** Radix UI
- **Estado:** Zustand (persistente)
- **Datos:** TanStack React Query
- **Routing:** React Router v6
- **HTTP Client:** Axios

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd APPWII-GesBar
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Actualiza la URL de la API en `src/config/index.ts`

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en [http://localhost:5173](http://localhost:5173)

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes UI base
├── config/             # Configuración de la aplicación
├── hooks/              # Custom hooks para API y estado
├── lib/                # Utilidades y helpers
├── pages/              # Páginas de la aplicación
├── router/             # Configuración de rutas
└── assets/             # Recursos estáticos
```

## 🔐 Roles y Permisos

### Cliente
- Ver servicios disponibles
- Crear y gestionar sus propias citas
- Editar su perfil

### Barbero
- Ver sus citas asignadas
- Ver servicios disponibles
- Editar su perfil

### Administrador
- Gestión completa de citas
- Gestión de barberos
- Gestión de servicios
- Ver estadísticas (próximamente)

## 📱 Páginas

- **Login/Register** - Autenticación de usuarios
- **Dashboard** - Panel principal con resumen
- **Citas** - Gestión de citas (crear, ver, editar)
- **Servicios** - Catálogo de servicios disponibles
- **Barberos** - Gestión de barberos (solo admin)
- **Perfil** - Gestión del perfil personal
- **Unauthorized** - Página de acceso denegado

## 🔧 Configuración

### API Base URL
Actualiza la URL de la API en `src/config/index.ts`:

```typescript
export const API_URL = 'http://localhost:8000/api'; // Cambia por tu URL
```

### TailwindCSS
El proyecto usa TailwindCSS v4 con el nuevo plugin de Vite. La configuración está en:
- `vite.config.ts` - Plugin de Vite
- `src/index.css` - Importación de Tailwind

## 🔄 Estado de la Aplicación

### Zustand Store (useAuthStore)
- Token de autenticación
- Información del usuario
- Estado de autenticación
- Persistencia en localStorage

### TanStack Query
- Cache de datos del servidor
- Manejo de estados de carga
- Invalidación automática
- Reintento de peticiones

## 🚀 Despliegue

1. Construye la aplicación:
```bash
npm run build
```

2. Los archivos generados estarán en la carpeta `dist/`

3. Sirve los archivos estáticos con tu servidor web preferido

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor crea un issue en el repositorio con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado
- Screenshots (si aplica)

## 📞 Soporte

Para soporte técnico o consultas, contacta a través de:
- Issues del repositorio
- Email: [tu-email@example.com]

---

⭐ Si este proyecto te fue útil, no olvides darle una estrella en GitHub!
