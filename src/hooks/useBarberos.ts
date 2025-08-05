// src/hooks/useBarberos.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApiClient from './useApiClient';
import { useAuthStore } from './useAuth';

// Interfaces
export interface Barbero {
  id: number;
  user_id: number;
  barberia_id: number;
  foto_url: string | null;
  biografia: string | null;
  estado: 'activo' | 'inactivo';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    cedula: string | null;
    role_id: number;
    bloqueado: number;
  };
  servicios?: Servicio[];
  barberia: {
    id: number;
    nombre: string;
    descripcion: string;
    direccion: string;
    telefono: string;
    email: string;
    estado: string;
  };
}

export interface Servicio {
  id: number;
  barberia_id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
  created_at: string;
  updated_at: string;
  pivot?: {
    barbero_id: number;
    servicio_id: number;
  };
}

export interface BarberoStats {
  total: number;
  activos: number;
  inactivos: number;
  nuevos: number; // Barberos creados este mes
}

export interface CreateBarberoData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  biografia?: string;
  barberia_id: number;
}

export const useBarberos = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  // Función para calcular si un barbero es nuevo (creado este mes)
  const isNuevo = (created_at: string): boolean => {
    const fechaCreacion = new Date(created_at);
    const ahora = new Date();
    return fechaCreacion.getMonth() === ahora.getMonth() && 
           fechaCreacion.getFullYear() === ahora.getFullYear();
  };

  // Calcular estadísticas de barberos
  const calculateStats = (barberos: Barbero[]): BarberoStats => {
    const total = barberos.length;
    const activos = barberos.filter(b => b.estado === 'activo').length;
    const inactivos = barberos.filter(b => b.estado === 'inactivo').length;
    const nuevos = barberos.filter(b => isNuevo(b.created_at)).length;

    return { total, activos, inactivos, nuevos };
  };

  // Obtener lista de barberos
  const getBarberos = async (): Promise<Barbero[]> => {
    const response = await apiClient.get<Barbero[]>('/barberos');
    return response.data;
  };

  // Crear nuevo barbero
  const createBarbero = async (data: CreateBarberoData): Promise<Barbero> => {
    const response = await apiClient.post<Barbero>('/barberos', data);
    return response.data;
  };

  // Actualizar barbero
  const updateBarbero = async ({ id, data }: { id: number; data: Partial<CreateBarberoData> }): Promise<Barbero> => {
    const response = await apiClient.put<Barbero>(`/barberos/${id}`, data);
    return response.data;
  };

  // Eliminar barbero
  const deleteBarbero = async (id: number): Promise<void> => {
    await apiClient.delete(`/barberos/${id}`);
  };

  // Queries
  const barberosQuery = useQuery({
    queryKey: ['barberos'],
    queryFn: getBarberos,
    enabled: isAuthenticated && !!user,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createBarbero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberos'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBarbero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBarbero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberos'] });
    },
  });

  const barberos = barberosQuery.data || [];
  const stats = calculateStats(barberos);

  return {
    barberos,
    stats,
    isLoading: barberosQuery.isLoading,
    error: barberosQuery.error,
    refetch: barberosQuery.refetch,
    
    // Mutations
    createBarbero: createMutation.mutate,
    updateBarbero: updateMutation.mutate,
    deleteBarbero: deleteMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Mutation errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
