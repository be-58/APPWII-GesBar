import { useState } from 'react';
import useApiClient from './useApiClient';

export function useCompletarCita() {
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const completarCita = async (citaId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/citas/${citaId}/completar`);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al completar cita');
      setLoading(false);
      return false;
    }
  };
  return { completarCita, loading, error };
}
