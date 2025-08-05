# 🐳 Deployment con Docker

Este proyecto está listo para ser desplegado usando Docker con detección automática de la URL del backend.

## Configuración Automática del Backend

El frontend automáticamente detecta la URL del backend basándose en el entorno:

### Desarrollo Local
```bash
# Si el backend está en localhost:8000, se conectará automáticamente
npm run dev
```

### Docker (Contenedor único)
```bash
# Construir la imagen
npm run docker:build

# Ejecutar el contenedor (puerto 3000)
npm run docker:run
```

### Docker Compose (Stack completo)
```bash
# Desarrollo con hot reload
npm run docker:dev

# Producción (detached mode)
npm run docker:prod

# Detener todos los servicios
npm run docker:stop
```

## Variables de Entorno

### Modo Manual (Opcional)
Si necesitas especificar manualmente la URL del backend:

```bash
# En desarrollo
VITE_API_URL=http://localhost:8000 npm run dev

# En Docker
VITE_API_URL=http://backend:8000 docker-compose up
```

### Detección Automática
El sistema detecta automáticamente:

1. **Localhost**: `http://localhost:8000`
2. **Docker**: `http://${hostname}:8000`
3. **Variable de entorno**: `VITE_API_URL` (tiene prioridad)

## Estructura de Archivos Docker

```
├── Dockerfile              # Multi-stage build (Node.js + Nginx)
├── docker-compose.yml      # Orquestación de servicios
├── .dockerignore           # Archivos excluidos del build
└── nginx.conf              # Configuración del servidor web
```

## Características de la Imagen

- **Multi-stage build**: Optimizada para producción
- **Nginx Alpine**: Servidor web ligero y seguro
- **Gzip compression**: Compresión automática de assets
- **SPA routing**: Soporte completo para React Router
- **Security headers**: Headers de seguridad configurados
- **Static caching**: Cache optimizado para assets estáticos

## Puertos

- **Frontend**: `3000:80` (Docker) / `5173` (Vite dev)
- **Backend**: `8000:80` (ajustar según tu backend)

## Comandos Útiles

```bash
# Ver logs del contenedor
docker logs gesbar-frontend

# Entrar al contenedor
docker exec -it gesbar-frontend /bin/sh

# Ver servicios activos
docker-compose ps

# Reconstruir sin cache
docker-compose build --no-cache

# Ver logs de todos los servicios
docker-compose logs -f
```

## Configuración de Producción

Para un entorno de producción, ajusta:

1. **docker-compose.yml**: Configura tu imagen de backend real
2. **Variables de entorno**: Define `VITE_API_URL` si es necesario
3. **Reverse proxy**: Considera usar Traefik o Nginx como proxy
4. **SSL/HTTPS**: Configura certificados para producción

## Troubleshooting

### El frontend no se conecta al backend
1. Verifica que el backend esté corriendo en el puerto 8000
2. Revisa las variables de entorno con `docker-compose config`
3. Verifica la red Docker con `docker network ls`

### Error de CORS
El backend debe permitir requests desde el origen del frontend:
- Desarrollo: `http://localhost:3000`
- Docker: `http://localhost:3000` o el dominio correspondiente

### Assets no cargan
Verifica que la configuración de Nginx en `nginx.conf` sea correcta y que el build de Vite se haya completado exitosamente.
