// src/hooks/useApiClient.ts

import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { API_URL } from '../config';
import { useAuthStore } from './useAuth';

/**
 * Hook que proporciona una instancia de Axios preconfigurada.
 * Intercepta cada petición para añadir automáticamente el token de autenticación.
 */
const useApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 15000, // 15 segundos de timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor de request mejorado
  apiClient.interceptors.request.use(
    (config) => {
      // Obtenemos el token del estado global FUERA del interceptor
      const storeState = useAuthStore.getState();
      const currentToken = storeState.token;
      const currentAuth = storeState.isAuthenticated;
      
      // Agregamos más debugging para entender qué está pasando
      console.log('🔍 API Request Debug:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        storeState: {
          hasToken: !!currentToken,
          isAuthenticated: currentAuth,
          tokenLength: currentToken?.length || 0,
          tokenPreview: currentToken ? `${currentToken.substring(0, 10)}...` : 'NULL'
        },
        willAddAuth: !!currentToken
      });
      
      // Si tenemos token, lo agregamos
      if (currentToken && currentToken.trim() !== '') {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${currentToken}`;
        console.log('✅ Token agregado a headers');
      } else {
        console.warn('⚠️ No se agregó token - token está vacío o nulo');
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Error en request interceptor:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor de response
  apiClient.interceptors.response.use(
    (response) => {
      console.log('✅ API Success:', {
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        status: response.status,
        hasData: !!response.data
      });
      return response;
    },
    (error) => {
      console.error('❌ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        authState: {
          isAuthenticated: useAuthStore.getState().isAuthenticated,
          hasToken: !!useAuthStore.getState().token
        }
      });
      
      // NO hacer logout automático para evitar loops
      if (error.response?.status === 401) {
        console.warn('⚠️ 401 Unauthorized - revisa la autenticación manualmente');
      }
      
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default useApiClient;
