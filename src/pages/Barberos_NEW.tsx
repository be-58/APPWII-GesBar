// src/pages/Barberos.tsx

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { useBarberosPage } from '../hooks/useBarberosPage';
import { useState } from 'react';

// Modal para crear barbero (copiado de Barberos_NEW)
const CreateBarberoModal = ({ isOpen, onClose, onSubmit, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {

  const { servicios = [] } = require('../hooks/useServicios').useServicios(1);
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
  const [horarios, setHorarios] = useState([
    { dia_semana: '', hora_inicio: '', hora_fin: '' }
  ]);

  const addHorario = () => setHorarios([...horarios, { dia_semana: '', hora_inicio: '', hora_fin: '' }]);
  const removeHorario = (idx: number) => setHorarios(horarios.filter((_, i) => i !== idx));
  const updateHorario = (idx: number, field: string, value: string) => {
    setHorarios(horarios.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  const handleServicioChange = (id: number, checked: boolean) => {
    if (checked) setSelectedServicios([...selectedServicios, id]);
    else setSelectedServicios(selectedServicios.filter(sid => sid !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (formData.password !== formData.password_confirmation) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    onSubmit({ ...formData, servicios: selectedServicios, horarios });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Agregar Nuevo Barbero</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="biografia">Biografía</Label>
            <Input
              id="biografia"
              value={formData.biografia}
              onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
            />
          </div>

          {/* Selección de servicios */}
          <div>
            <Label>Servicios que puede realizar</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {servicios.map((servicio: any) => (
                <label key={servicio.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedServicios.includes(servicio.id)}
                    onChange={e => handleServicioChange(servicio.id, e.target.checked)}
                  />
                  <span>{servicio.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Horarios */}
          <div>
            <Label>Horarios de trabajo</Label>
            {horarios.map((h, idx) => (
              <div key={idx} className="flex space-x-2 mb-2">
                <select
                  value={h.dia_semana}
                  onChange={e => updateHorario(idx, 'dia_semana', e.target.value)}
                  className="border rounded px-2"
                >
                  <option value="">Día</option>
                  <option value="lunes">Lunes</option>
                  <option value="martes">Martes</option>
                  <option value="miércoles">Miércoles</option>
                  <option value="jueves">Jueves</option>
                  <option value="viernes">Viernes</option>
                  <option value="sábado">Sábado</option>
                  <option value="domingo">Domingo</option>
                </select>
                <Input
                  type="time"
                  value={h.hora_inicio}
                  onChange={e => updateHorario(idx, 'hora_inicio', e.target.value)}
                />
                <Input
                  type="time"
                  value={h.hora_fin}
                  onChange={e => updateHorario(idx, 'hora_fin', e.target.value)}
                />
                <Button type="button" variant="outline" onClick={() => removeHorario(idx)}>Quitar</Button>
              </div>
            ))}
            <Button type="button" onClick={addHorario} className="mt-2">+ Agregar horario</Button>
          </div>
          {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creando...' : 'Crear Barbero'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Barberos = () => {
  const {
    barberos,
    stats,
    isLoading,
    isCreating,
    createError,
    showCreateModal,
    setShowCreateModal,
    canManageBarberos,
    handleCreateBarbero,
  } = useBarberosPage();

  if (!canManageBarberos) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">No tienes permisos para ver esta página.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-gray-600">Cargando barberos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Barberos</h1>
            <p className="text-purple-100">Administra el equipo de profesionales</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-purple-600 hover:bg-gray-50"
          >
            + Agregar Barbero
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Barberos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Barberos Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Barberos Inactivos</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactivos}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nuevos Este Mes</p>
              <p className="text-2xl font-bold text-purple-600">{stats.nuevos}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Barberos */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Lista de Barberos</h2>
              <p className="text-gray-600">Gestiona la información de tu equipo</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          {(!barberos || barberos.length === 0) ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay barberos registrados</h3>
              <p className="text-gray-500 mb-6">Agrega el primer barbero a tu equipo</p>
              <Button onClick={() => setShowCreateModal(true)}>
                + Agregar Primer Barbero
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {barberos.map((barbero: any) => (
                <div key={barbero.id} className="bg-gray-50 rounded-lg p-6 border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-lg">
                          {barbero.user.nombre.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{barbero.user.nombre}</h3>
                        <p className="text-sm text-gray-500">{barbero.user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      barbero.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {barbero.estado}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {barbero.user.telefono}
                    </div>
                    {barbero.biografia && (
                      <p className="text-sm text-gray-600">{barbero.biografia}</p>
                    )}
                    <div className="text-sm text-gray-500">
                      Servicios: {barbero.servicios?.length || 0}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => console.log('Ver barbero', barbero.id)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => console.log('Editar barbero', barbero.id)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CreateBarberoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBarbero}
        isLoading={isCreating}
      />

      {/* Error handling */}
      {createError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error al crear barbero: {createError.message}
        </div>
      )}
    </div>
  );
};

export default Barberos;