// src/hooks/useBarberiasPage.ts
import { useState } from 'react';
import { useBarberías } from './useBarberías';
import { useAuthStore } from './useAuth';

export const useBarberiasPage = () => {
  const { user } = useAuthStore();
  const {
    barberías,
    isLoading,
    createBarbería,
    aprobarBarbería,
    rechazarBarbería,
    isCreating,
    isApproving,
    isRejecting,
    createError
  } = useBarberías();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = user?.role?.nombre === 'admin';

  const handleCreateBarbería = (data: any) => {
    createBarbería(data, {
      onSuccess: () => {
        setShowCreateModal(false);
      }
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    barberías,
    isLoading,
    createBarbería,
    aprobarBarbería,
    rechazarBarbería,
    isCreating,
    isApproving,
    isRejecting,
    createError,
    showCreateModal,
    setShowCreateModal,
    isAdmin,
    handleCreateBarbería,
    getEstadoColor,
  };
};
