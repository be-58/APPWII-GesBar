// src/pages/TestBackend.tsx
import { useState } from 'react';
import useApiClient from '../hooks/useApiClient';
import { Button } from '../components/ui/Button';

const TestBackend = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const apiClient = useApiClient();

  const testConnection = async () => {
    setStatus('loading');
    setMessage('');

    try {
      // Intentar conectar a diferentes endpoints
      const healthResponse = await apiClient.get('/health');
      setStatus('success');
      setMessage(`Conexión exitosa: ${JSON.stringify(healthResponse.data)}`);
    } catch (error: any) {
      setStatus('error');
      if (error.code === 'ECONNREFUSED') {
        setMessage('Error: No se puede conectar al servidor backend. Asegúrate de que esté ejecutándose en http://localhost:8000');
      } else {
        setMessage(`Error de conexión: ${error.message || 'Error desconocido'}`);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Test de Conexión Backend</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            Esta página te permite verificar si el frontend puede conectarse correctamente al backend.
          </p>
          
          <div className="space-y-2 text-sm">
            <p><strong>URL de la API:</strong> http://localhost:8000/api</p>
            <p><strong>Endpoint de prueba:</strong> /health</p>
          </div>
        </div>

        <Button 
          onClick={testConnection}
          disabled={status === 'loading'}
          className="mb-4"
        >
          {status === 'loading' ? 'Probando conexión...' : 'Probar Conexión'}
        </Button>

        {status !== 'idle' && (
          <div className={`p-4 rounded-lg ${
            status === 'success' ? 'bg-green-50 border border-green-200' :
            status === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-start">
              {status === 'success' && (
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === 'error' && (
                <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <div>
                <p className={`font-medium ${
                  status === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {status === 'success' ? 'Conexión Exitosa' : 'Error de Conexión'}
                </p>
                <p className={`text-sm mt-1 ${
                  status === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Posibles soluciones:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Asegúrate de que el servidor backend esté ejecutándose</li>
              <li>• Verifica que esté en el puerto 8000</li>
              <li>• Comprueba que no haya problemas de CORS</li>
              <li>• Revisa la consola del navegador para más detalles</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestBackend;
