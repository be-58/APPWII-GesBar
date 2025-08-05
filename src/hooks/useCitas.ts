// src/hooks/useCitas.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApiClient from './useApiClient';

// --- INTERFACES COMPLETAS ---
export interface Cita {
  id: number;
  cliente_id: number;
  barberia_id: number;
  barbero_id: number;
  servicio_id: number;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio' | 'reprogramada';
  metodo_pago: 'en_local' | 'transferencia' | 'payphone';
  estado_pago: 'pendiente' | 'verificado' | 'pagado_en_local' | 'rechazado';
  codigo_transaccion: string | null;
  comprobante_url: string | null;
  total: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCitaDto {
  barberia_id: number;
  barbero_id: number;
  servicio_id: number;
  fecha: string; // 'YYYY-MM-DD'
  hora: string;  // 'HH:mm'
  metodo_pago: 'en_local' | 'transferencia' | 'payphone';
}

export const useCitas = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const getMisCitas = async () => {
    const response = await apiClient.get<Cita[]>('/citas');
    return response.data;
  };

  const misCitasQuery = useQuery({
    queryKey: ['citas', 'mis-citas'],
    queryFn: getMisCitas,
  });

  const createCitaMutation = useMutation({
    mutationFn: (newCita: CreateCitaDto) => apiClient.post('/citas', newCita),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });
  
  const uploadComprobanteMutation = useMutation({
    mutationFn: ({ citaId, formData }: { citaId: number, formData: FormData }) =>
      apiClient.post(`/citas/${citaId}/upload-comprobante`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
  });

  return { 
    misCitas: misCitasQuery.data, 
    isLoading: misCitasQuery.isLoading, 
    crearCita: createCitaMutation.mutateAsync,
    subirComprobante: uploadComprobanteMutation.mutateAsync,
  };
};
