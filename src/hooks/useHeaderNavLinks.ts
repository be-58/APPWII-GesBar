// src/hooks/useHeaderNavLinks.ts
import { useAuthStore } from './useAuth';

export const useHeaderNavLinks = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return [];

  if (user?.role?.nombre === 'dueño') {
    return [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/citas', label: 'Citas' },
      { to: '/servicios', label: 'Servicios' },
      { to: '/barberos', label: 'Barberos' },
      { to: '/perfil', label: 'Perfil' },
    ];
  }
  if (user?.role?.nombre === 'admin') {
    return [
      { to: '/dashboard', label: 'Dashboard' },
      //{ to: '/usuarios', label: 'Usuarios' },
      // { to: '/barberías', label: 'Barberías' }, // Ruta válida pero oculta
      { to: '/perfil', label: 'Perfil' },
    ];
  }
  // Barbero y cliente
  return [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/citas', label: 'Citas' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/perfil', label: 'Perfil' },
  ];
};
