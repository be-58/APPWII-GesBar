// src/hooks/useBarberosPage.ts
import { useState } from 'react';
import { useBarberos } from './useBarberos';
import { useAuthStore } from './useAuth';
import useApiClient from './useApiClient';

export const useBarberosPage = () => {
  const { user } = useAuthStore();
  const {
    barberos,
    stats,
    isLoading,
    createBarbero,
    isCreating,
    createError
  } = useBarberos();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const apiClient = useApiClient();

  const isAdmin = user?.role?.nombre === 'admin';
  const isDueno = user?.role?.nombre === 'dueño';
  const canManageBarberos = isAdmin || isDueno;

  const handleCreateBarbero = async (data: any) => {
    try {
      const barberoResponse = await new Promise<any>((resolve, reject) => {
        createBarbero(data, {
          onSuccess: (result: any) => resolve(result),
          onError: reject
        });
      });
      const barbero = barberoResponse?.data;
      if (data.horarios && Array.isArray(data.horarios)) {
        await Promise.all(data.horarios.map((h: any) =>
          apiClient.post('/horarios', {
            barbero_id: barbero.id,
            dia_semana: h.dia_semana,
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin,
          })
        ));
      }
      setShowCreateModal(false);
      if (data.onClose) data.onClose();
    } catch (err) {
      if (data.onError) data.onError();
    }
  };

  return {
    barberos,
    stats,
    isLoading,
    createBarbero,
    isCreating,
    createError,
    showCreateModal,
    setShowCreateModal,
    canManageBarberos,
    handleCreateBarbero,
  };
};
