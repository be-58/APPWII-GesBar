// src/config/index.ts

/**
 * URL base de la API del backend.
 * Se configura automáticamente según el entorno.
 */
const getApiUrl = (): string => {
  // En desarrollo, usar localhost
  if (import.meta.env.DEV) {
    return 'https://localhost:8443/api';
  }
  
  // En producción, usar variable de entorno o la URL por defecto de Render
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // URL por defecto para producción en Render
  return 'https://appwwii-gestionbarberias.onrender.com/api';
};

export const API_URL = getApiUrl();

// Para debugging
console.log('🔗 API URL configurada:', API_URL);

