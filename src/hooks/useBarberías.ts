// src/hooks/useBarberías.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApiClient from './useApiClient';
import { useAuthStore } from './useAuth';

// Interfaces
export interface Barbería {
  id: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  logo_url: string | null;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  owner_id: number;
  created_at: string;
  updated_at: string;
  owner?: {
    id: number;
    nombre: string;
    email: string;
  };
}

export interface CreateBarberíaData {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  owner_id: number;
}

export const useBarberías = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  // Obtener lista de barberías
  const getBarberías = async (): Promise<Barbería[]> => {
    const response = await apiClient.get<Barbería[]>('/barberias');
    return response.data;
  };

  // Crear nueva barbería
  const createBarbería = async (data: CreateBarberíaData): Promise<Barbería> => {
    const response = await apiClient.post<Barbería>('/barberias', data);
    return response.data;
  };

  // Actualizar barbería
  const updateBarbería = async ({ id, data }: { id: number; data: Partial<CreateBarberíaData> }): Promise<Barbería> => {
    const response = await apiClient.put<Barbería>(`/barberias/${id}`, data);
    return response.data;
  };

  // Eliminar barbería
  const deleteBarbería = async (id: number): Promise<void> => {
    await apiClient.delete(`/barberias/${id}`);
  };

  // Aprobar barbería
  const aprobarBarbería = async (id: number): Promise<Barbería> => {
    const response = await apiClient.post<Barbería>(`/barberias/${id}/aprobar`);
    return response.data;
  };

  // Rechazar barbería
  const rechazarBarbería = async (id: number): Promise<Barbería> => {
    const response = await apiClient.post<Barbería>(`/barberias/${id}/rechazar`);
    return response.data;
  };

  // Queries
  const barberíasQuery = useQuery({
    queryKey: ['barberías'],
    queryFn: getBarberías,
    enabled: isAuthenticated && !!user,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createBarbería,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberías'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBarbería,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberías'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBarbería,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberías'] });
    },
  });

  const aprobarMutation = useMutation({
    mutationFn: aprobarBarbería,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberías'] });
    },
  });

  const rechazarMutation = useMutation({
    mutationFn: rechazarBarbería,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberías'] });
    },
  });

  const barberías = barberíasQuery.data || [];

  return {
    barberías,
    isLoading: barberíasQuery.isLoading,
    error: barberíasQuery.error,
    refetch: barberíasQuery.refetch,
    
    // Mutations
    createBarbería: createMutation.mutate,
    updateBarbería: updateMutation.mutate,
    deleteBarbería: deleteMutation.mutate,
    aprobarBarbería: aprobarMutation.mutate,
    rechazarBarbería: rechazarMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isApproving: aprobarMutation.isPending,
    isRejecting: rechazarMutation.isPending,
    
    // Mutation errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    approveError: aprobarMutation.error,
    rejectError: rechazarMutation.error,
  };
};
