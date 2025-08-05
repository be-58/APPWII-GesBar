// src/components/DebugAuth.tsx

import { useAuthStore } from '../hooks/useAuth';

/**
 * Componente de debugging para verificar el estado de autenticación
 */
export const DebugAuth = () => {
  const { token, user, isAuthenticated } = useAuthStore();

  const checkLocalStorage = () => {
    const localStorageData = localStorage.getItem('auth-storage');
    console.log('🔍 LocalStorage raw data:', localStorageData);
    
    if (localStorageData) {
      try {
        const parsed = JSON.parse(localStorageData);
        console.log('📦 LocalStorage parsed:', parsed);
      } catch (e) {
        console.error('❌ Error parsing localStorage:', e);
      }
    }
  };

  const checkZustandState = () => {
    const state = useAuthStore.getState();
    console.log('🏪 Zustand complete state:', state);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold mb-2">🔧 Debug Auth</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>isAuthenticated:</strong> {String(isAuthenticated)}
        </div>
        <div>
          <strong>hasToken:</strong> {String(!!token)}
        </div>
        <div>
          <strong>tokenLength:</strong> {token?.length || 0}
        </div>
        <div>
          <strong>user:</strong> {user?.nombre || 'null'}
        </div>
        <div>
          <strong>tokenPreview:</strong> {token ? `${token.substring(0, 20)}...` : 'null'}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <button
          onClick={checkLocalStorage}
          className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Check localStorage
        </button>
        <button
          onClick={checkZustandState}
          className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Check Zustand State
        </button>
      </div>
    </div>
  );
};
