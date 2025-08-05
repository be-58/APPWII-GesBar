// src/hooks/useAuth.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- INTERFACES COMPLETAS ---
interface Role {
  id: number;
  nombre: string;
}

interface Barbero {
  id: number;
  user_id: number;
  barberia_id: number;
  foto_url: string | null;
  biografia: string | null;
  estado: string;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  cedula: string | null;
  bloqueado: boolean;
  role_id: number;
  role: Role;
  barbero?: Barbero; // <- opcional, solo si es barbero
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// --- HOOK CON ZUSTAND ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => {
        console.log('🔧 useAuth.login() llamado con:', {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          tokenPreview: token ? `${token.substring(0, 10)}...` : 'NULL',
          hasUser: !!user,
          userName: user?.nombre,
          userRole: user?.role?.nombre
        });
        
        // Validar que tenemos datos válidos
        if (!token || token.trim() === '') {
          console.error('❌ Error: Token vacío o nulo');
          return;
        }
        
        if (!user) {
          console.error('❌ Error: Usuario vacío o nulo');
          return;
        }
        
        // Actualizar el estado
        set({ 
          token: token.trim(), 
          user, 
          isAuthenticated: true 
        });
        
        // Verificar que se guardó correctamente
        setTimeout(() => {
          const newState = useAuthStore.getState();
          console.log('✅ Estado después de login:', {
            isAuthenticated: newState.isAuthenticated,
            hasToken: !!newState.token,
            tokenLength: newState.token?.length || 0,
            hasUser: !!newState.user
          });
          
          // Verificar localStorage
          const localData = localStorage.getItem('auth-storage');
          console.log('💾 LocalStorage después de login:', localData);
        }, 100);
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // Clave en localStorage
    }
  )
);
