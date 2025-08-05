// src/hooks/useServicios.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApiClient from './useApiClient';

// --- INTERFACES COMPLETAS ---
export interface Servicio {
  id: number;
  barberia_id: number;
  nombre: string;
  descripcion: string | null;
  duracion: number; // en minutos
  precio: string; // El ORM lo devuelve como string
}

export interface CreateServicioDto {
  barberia_id: number;
  nombre: string;
  descripcion?: string;
  duracion: number;
  precio: number;
}

export const useServicios = (barberiaId?: number) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const getServicios = async () => {
    const { data } = await apiClient.get<Servicio[]>(`/servicios?barberia_id=${barberiaId}`);
    return data;
  };

  const serviciosQuery = useQuery({
    queryKey: ['servicios', barberiaId],
    queryFn: getServicios,
    enabled: !!barberiaId, // La query solo se ejecuta si barberiaId tiene un valor
  });

  const createServicioMutation = useMutation({
    mutationFn: (newServicio: CreateServicioDto) => apiClient.post('/servicios', newServicio),
    onSuccess: () => {
      // Invalida la caché de servicios para que se actualice
      queryClient.invalidateQueries({ queryKey: ['servicios', barberiaId] });
    },
  });

  return {
    servicios: serviciosQuery.data,
    isLoading: serviciosQuery.isLoading,
    error: serviciosQuery.error,
    refetch: serviciosQuery.refetch,
    createServicio: createServicioMutation.mutate,
    isCreating: createServicioMutation.isPending,
    createError: createServicioMutation.error,
  };
};
