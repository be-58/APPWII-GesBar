// src/components/EditBarberoModal.tsx

import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { useServicios } from '../hooks/useServicios';
import useApiClient from '../hooks/useApiClient';

interface Barbero {
  id: number;
  user: {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
  };
  biografia: string;
  estado: 'activo' | 'inactivo';
  barberia_id: number;
  servicios?: any[];
  horarios?: any[];
}

interface EditBarberoModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbero: Barbero | null;
  onUpdate: () => void;
}

const EditBarberoModal = ({ isOpen, onClose, barbero, onUpdate }: EditBarberoModalProps) => {
  const apiClient = useApiClient();
  const { servicios = [] } = useServicios(barbero?.barberia_id || 1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'servicios' | 'horarios'>('info');
  
  // Form data
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    biografia: '',
    estado: 'activo' as 'activo' | 'inactivo',
  });
  
  const [selectedServicios, setSelectedServicios] = useState<number[]>([]);
  const [horarios, setHorarios] = useState([
    { dia_semana: '', hora_inicio: '', hora_fin: '' }
  ]);

  // Reset form when barbero changes
  useEffect(() => {
    if (barbero) {
      setFormData({
        nombre: barbero.user.nombre,
        email: barbero.user.email,
        telefono: barbero.user.telefono,
        biografia: barbero.biografia || '',
        estado: barbero.estado,
      });
      
      setSelectedServicios(barbero.servicios?.map(s => s.id) || []);
      setHorarios(barbero.horarios?.length > 0 ? barbero.horarios : [
        { dia_semana: '', hora_inicio: '', hora_fin: '' }
      ]);
      setActiveTab('info');
      setError(null);
    }
  }, [barbero]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServicioToggle = (servicioId: number) => {
    setSelectedServicios(prev => 
      prev.includes(servicioId)
        ? prev.filter(id => id !== servicioId)
        : [...prev, servicioId]
    );
  };

  const addHorario = () => {
    setHorarios([...horarios, { dia_semana: '', hora_inicio: '', hora_fin: '' }]);
  };

  const removeHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const updateHorario = (index: number, field: string, value: string) => {
    setHorarios(horarios.map((h, i) => 
      i === index ? { ...h, [field]: value } : h
    ));
  };

  const handleUpdateInfo = async () => {
    if (!barbero) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Actualizar información básica del barbero
      await apiClient.put(`/barberos/${barbero.id}`, {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        biografia: formData.biografia,
        estado: formData.estado,
      });
      
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la información');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateServicios = async () => {
    if (!barbero) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Asignar servicios al barbero
      await apiClient.post(`/barberos/${barbero.id}/asignacion`, {
        servicios: selectedServicios
      });
      
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar servicios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHorarios = async () => {
    if (!barbero) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Actualizar horarios del barbero
      const horariosValidos = horarios.filter(h => 
        h.dia_semana && h.hora_inicio && h.hora_fin
      );
      
      await apiClient.put(`/barberos/${barbero.id}/horarios`, {
        horarios: horariosValidos
      });
      
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar horarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    switch (activeTab) {
      case 'info':
        handleUpdateInfo();
        break;
      case 'servicios':
        handleUpdateServicios();
        break;
      case 'horarios':
        handleUpdateHorarios();
        break;
    }
  };

  if (!isOpen || !barbero) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Editar Barbero</h2>
              <p className="text-gray-600">{barbero.user.nombre}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="mt-6 flex space-x-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Información
            </button>
            <button
              onClick={() => setActiveTab('servicios')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'servicios'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => setActiveTab('horarios')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'horarios'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Horarios
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Información Básica */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="biografia">Biografía</Label>
                <textarea
                  id="biografia"
                  value={formData.biografia}
                  onChange={(e) => handleInputChange('biografia', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Descripción del barbero..."
                />
              </div>
              
              <div>
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          )}

          {/* Servicios */}
          {activeTab === 'servicios' && (
            <div className="space-y-4">
              <div>
                <Label>Servicios que puede realizar</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Selecciona los servicios que este barbero puede ofrecer
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {servicios.map((servicio: any) => (
                    <label
                      key={servicio.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServicios.includes(servicio.id)}
                        onChange={() => handleServicioToggle(servicio.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{servicio.nombre}</div>
                        {servicio.descripcion && (
                          <div className="text-sm text-gray-600">{servicio.descripcion}</div>
                        )}
                        <div className="text-sm text-purple-600 font-medium">
                          ${servicio.precio} • {servicio.duracion_minutos} min
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {servicios.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No hay servicios disponibles
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Horarios */}
          {activeTab === 'horarios' && (
            <div className="space-y-4">
              <div>
                <Label>Horarios de trabajo</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Define los días y horarios en que este barbero estará disponible
                </p>
                
                <div className="space-y-3">
                  {horarios.map((horario, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <select
                        value={horario.dia_semana}
                        onChange={(e) => updateHorario(index, 'dia_semana', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Seleccionar día</option>
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
                        value={horario.hora_inicio}
                        onChange={(e) => updateHorario(index, 'hora_inicio', e.target.value)}
                        className="w-32"
                      />
                      
                      <span className="text-gray-500">a</span>
                      
                      <Input
                        type="time"
                        value={horario.hora_fin}
                        onChange={(e) => updateHorario(index, 'hora_fin', e.target.value)}
                        className="w-32"
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeHorario(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addHorario}
                  className="mt-3"
                >
                  + Agregar horario
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBarberoModal;