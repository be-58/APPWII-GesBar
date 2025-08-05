// src/hooks/useDashboard.ts

import { useQuery } from '@tanstack/react-query';
import useApiClient from './useApiClient';
import { useAuthStore } from './useAuth';

// Interfaces para las estadísticas del dashboard
export interface DashboardStats {
  citasHoy: number;
  citasPendientes: number;
  citasCompletadas: number;
  totalServicios: number;
  crecimientoCitas?: number; // Porcentaje de crecimiento respecto al día anterior
}

export interface CitaResumen {
  id: number;
  cliente_nombre: string;
  servicio_nombre: string;
  hora: string;
  estado: string;
}

export const useDashboard = () => {
  const apiClient = useApiClient();
  const { isAuthenticated, user } = useAuthStore();

  // Obtener estadísticas del dashboard
  const getStats = async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStats>('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      // Datos de fallback en caso de error
      return {
        citasHoy: 0,
        citasPendientes: 0,
        citasCompletadas: 0,
        totalServicios: 0,
        crecimientoCitas: 0,
      };
    }
  };

  // Obtener citas próximas
  const getCitasProximas = async (): Promise<CitaResumen[]> => {
    try {
      const response = await apiClient.get<CitaResumen[]>('/dashboard/citas-proximas');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo citas próximas:', error);
      return [];
    }
  };

  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats', user?.id],
    queryFn: getStats,
    enabled: isAuthenticated && !!user,
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
    staleTime: 2 * 60 * 1000, // Considerar datos obsoletos después de 2 minutos
  });

  const citasProximasQuery = useQuery({
    queryKey: ['dashboard', 'citas-proximas', user?.id],
    queryFn: getCitasProximas,
    enabled: isAuthenticated && !!user,
    refetchInterval: 2 * 60 * 1000, // Refrescar cada 2 minutos
  });

  return {
    stats: statsQuery.data,
    citasProximas: citasProximasQuery.data,
    isLoadingStats: statsQuery.isLoading,
    isLoadingCitas: citasProximasQuery.isLoading,
    errorStats: statsQuery.error,
    errorCitas: citasProximasQuery.error,
    refetchStats: statsQuery.refetch,
    refetchCitas: citasProximasQuery.refetch,
  };
};
