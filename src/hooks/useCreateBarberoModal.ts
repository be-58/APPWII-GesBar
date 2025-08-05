import { useState, useEffect } from 'react';
import { useServicios } from './useServicios';

interface Props {
  isOpen: boolean;
  onSubmit: (data: any) => void;
}

export function useCreateBarberoModal({ isOpen, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    password_confirmation: '',
    biografia: '',
    barberia_id: 1,
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [selectedServicios, setSelectedServicios] = useState<number[]>([]);
  const { servicios = [] } = useServicios(1);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        password_confirmation: '',
        biografia: '',
        barberia_id: 1,
      });
      setPasswordError(null);
      setSelectedServicios([]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (formData.password !== formData.password_confirmation) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    onSubmit({ ...formData, servicios: selectedServicios });
  };

  return {
    formData,
    setFormData,
    passwordError,
    servicios,
    selectedServicios,
    setSelectedServicios,
    handleSubmit,
  };
}
