// src/hooks/useUsuarios.ts
import { useQuery } from '@tanstack/react-query';
import useApiClient from './useApiClient';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export const useUsuarios = () => {
  const apiClient = useApiClient();

  const getUsuarios = async (): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>('/users');
    return response.data;
  };

  const usuariosQuery = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  });

  return {
    usuarios: usuariosQuery.data || [],
    isLoading: usuariosQuery.isLoading,
    error: usuariosQuery.error,
    refetch: usuariosQuery.refetch,
  };
};
