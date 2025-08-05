// src/pages/Servicios.tsx
import { useState } from 'react';
import { useServicios } from '../hooks/useServicios';
import { useBarberos } from '../hooks/useBarberos';
import useApiClient from '../hooks/useApiClient';
import { useAuthStore } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

// Modal para crear servicio
const CreateServicioModal = ({ isOpen, onClose, onSubmit, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: 30,
    precio: 0,
    barberia_id: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Agregar Nuevo Servicio</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Servicio</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="duracion">Duración (minutos)</Label>
            <Input
              id="duracion"
              type="number"
              value={formData.duracion}
              onChange={(e) => setFormData({ ...formData, duracion: parseInt(e.target.value) })}
              required
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="precio">Precio ($)</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
              required
              min="0"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creando...' : 'Crear Servicio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Servicios = () => {
  const { user } = useAuthStore();
  const { servicios, isLoading, createServicio, isCreating, createError } = useServicios(1);
  // Only fetch barberos for 'dueño' role
  const { barberos, isLoading: isLoadingBarberos } = useBarberos();
  const apiClient = useApiClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  // const [selectedServicio, setSelectedServicio] = useState<any>(null); // Removed unused variable
  const [selectedBarberoId, setSelectedBarberoId] = useState<number | null>(null);
  const [selectedServicioIds, setSelectedServicioIds] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const isAdmin = user?.role?.nombre === 'admin';
  const isDueno = user?.role?.nombre === 'dueño';
  const canCreateServices = isDueno || isAdmin;

  const handleCreateServicio = (data: any) => {
    createServicio(data, {
      onSuccess: () => {
        setShowCreateModal(false);
      }
    });
  };

  // Asignar servicios a barbero (PUT /barberos/{barbero})
  const handleAssign = async () => {
    if (!selectedBarberoId || selectedServicioIds.length === 0) return;
    setAssigning(true);
    setAssignError(null);
    try {
      await apiClient.put(`/barberos/${selectedBarberoId}`, {
        servicios: selectedServicioIds
      });
      setShowAssignModal(false);
      setSelectedServicioIds([]);
    } catch (err: any) {
      setAssignError('Error al asignar servicios');
    } finally {
      setAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <div className="text-lg text-gray-600">Cargando servicios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nuestros Servicios</h1>
            <p className="text-indigo-100">Descubre todos los servicios premium que ofrecemos</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{servicios?.length || 0}</div>
                <div className="text-sm text-indigo-100">Servicios Disponibles</div>
              </div>
            </div>
            {canCreateServices && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-indigo-600 hover:bg-gray-50"
              >
                + Nuevo Servicio
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Servicios Grid */}
      {(!servicios || servicios.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios disponibles</h3>
          <p className="text-gray-600 mb-6">
            {canCreateServices ? 'Agrega el primer servicio a tu barbería' : 'Los servicios se cargarán pronto.'}
          </p>
          {canCreateServices && (
            <Button onClick={() => setShowCreateModal(true)}>
              + Agregar Primer Servicio
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio: any) => (
            <div key={servicio.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{servicio.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-3">{servicio.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">${servicio.precio}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {servicio.duracion} min
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Barbería
                  </div>
                </div>

                <div className="flex space-x-2">
                  {/* <Button className="flex-1" size="sm">
                    Reservar
                  </Button> */}
                  {/* <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalles
                  </Button> */}
                  {/* Only dueño can assign services to barberos */}
                  {isDueno && (
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowAssignModal(true)}>
                      Asignar a barbero
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
      {/* Modal para asignar servicio a barbero: solo dueño */}
      {isDueno && showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Asignar servicios a barbero</h2>
            <div className="mb-4">
              <Label htmlFor="barbero-select">Selecciona un barbero</Label>
              <select
                id="barbero-select"
                className="w-full border rounded-lg px-3 py-2 mt-2"
                value={selectedBarberoId ?? ''}
                onChange={e => setSelectedBarberoId(Number(e.target.value))}
                disabled={isLoadingBarberos}
              >
                <option value="">Selecciona un barbero</option>
                {barberos.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.user?.nombre || b.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <Label>Selecciona servicios</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {servicios.map((servicio: any) => (
                  <label key={servicio.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedServicioIds.includes(servicio.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedServicioIds([...selectedServicioIds, servicio.id]);
                        } else {
                          setSelectedServicioIds(selectedServicioIds.filter(id => id !== servicio.id));
                        }
                      }}
                    />
                    <span>{servicio.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAssignModal(false)} className="flex-1">Cancelar</Button>
              <Button type="button" onClick={handleAssign} className="flex-1" disabled={assigning || !selectedBarberoId || selectedServicioIds.length === 0}>
                {assigning ? 'Asignando...' : 'Asignar'}
              </Button>
            </div>
            {assignError && <div className="text-red-600 mt-2">{assignError}</div>}
          </div>
        </div>
      )}
        </div>
      )}

      {/* Modal */}
      <CreateServicioModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateServicio}
        isLoading={isCreating}
      />

      {/* Error handling */}
      {createError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error al crear servicio: {createError.message}
        </div>
      )}
    </div>
  );
};

export default Servicios;
