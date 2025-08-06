// src/pages/Citas.tsx
import React, { useState } from 'react';
import useApiClient from '../hooks/useApiClient';
import { useCompletarCita } from '../hooks/useCompletarCita';
import { useCitas, type CreateCitaDto } from '../hooks/useCitas';
import { useServicios } from '../hooks/useServicios';
import { useAuthStore } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
// Toast modal
const ToastModal = ({ type, message, onClose }: { type: 'success' | 'error'; message: string; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 ${type === 'success' ? 'bg-green-100 border border-green-400 text-green-800' : 'bg-red-100 border border-red-400 text-red-800'}`}>
    <span>
      {type === 'success' ? (
        <svg className="w-6 h-6 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ) : (
        <svg className="w-6 h-6 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      )}
    </span>
    <span className="font-medium">{message}</span>
    <button className="ml-4 text-lg font-bold" onClick={onClose}>&times;</button>
  </div>
);
const Citas = () => {
  const { user } = useAuthStore();
  const { misCitas, isLoading, crearCita } = useCitas();
  const { servicios } = useServicios(1);

  // Determinar roles
  const isBarbero = user?.role?.nombre === 'barbero';
  const isDueno = user?.role?.nombre === 'dueño';
  const isCliente = user?.role?.nombre === 'cliente';

  // Estados del formulario (solo para clientes)
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    barberia_id: 1,
    fecha: '',
    hora: '',
    servicio_id: '',
    barbero_id: '',
    metodo_pago: 'en_local' as const,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estados para modales y filtros
  const [selectedCita, setSelectedCita] = useState<any | null>(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showFiltro, setShowFiltro] = useState(false);
  const [filtro, setFiltro] = useState<{ estado?: string; barbero_id?: string }>({});

  // Lógica para obtener barberos del servicio seleccionado (solo para clientes)
  const selectedServicio = isCliente ? (servicios as any[] | undefined)?.find((s) => s.id === parseInt(formData.servicio_id)) : null;
  const barberosDelServicio = selectedServicio?.barberos || [];

  // Handlers del formulario (solo para clientes)
  const handleServicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isCliente) return;
    const servicioId = e.target.value;
    setFormData({ ...formData, servicio_id: servicioId, barbero_id: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCliente) return;
    setFormError(null);
    // Validar fecha no pasada
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(formData.fecha);
    if (fechaSeleccionada < hoy) {
      setToast({ type: 'error', message: 'No puedes agendar citas en fechas pasadas.' });
      return;
    }
    try {
      const citaData: CreateCitaDto = {
        barberia_id: formData.barberia_id,
        fecha: formData.fecha,
        hora: formData.hora,
        servicio_id: parseInt(formData.servicio_id),
        barbero_id: parseInt(formData.barbero_id),
        metodo_pago: formData.metodo_pago,
      };
      await crearCita(citaData);
      setShowForm(false);
      setFormData({
        barberia_id: 1,
        fecha: '',
        hora: '',
        servicio_id: '',
        barbero_id: '',
        metodo_pago: 'en_local',
      });
      setToast({ type: 'success', message: '¡Cita creada exitosamente!' });
    } catch (error) {
      setToast({ type: 'error', message: 'Error al crear cita.' });
      console.error('Error al crear cita:', error);
    }

  };

  const getStatusBadgeColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <div className="text-lg text-gray-600">Cargando citas...</div>
        </div>
      </div>
    );
  }

  // Filtrado de citas
  let citas = misCitas || [];
  if (filtro.estado) {
    citas = citas.filter((c: any) => c.estado === filtro.estado);
  }
  if (filtro.barbero_id) {
    citas = citas.filter((c: any) => String(c.barbero_id) === filtro.barbero_id);
  }

  // Modal de detalles de cita
  const DetalleCitaModal = ({ cita, onClose }: { cita: any, onClose: () => void }) => {
    const { completarCita, loading, error } = useCompletarCita();
    const api = useApiClient();
    const [showCalificar, setShowCalificar] = useState(false);
    const [calificacion, setCalificacion] = useState(5);
    const [comentario, setComentario] = useState('');
    const [calificando, setCalificando] = useState(false);
    const [calificarError, setCalificarError] = useState<string | null>(null);

    if (!cita) return null;

    // El backend retorna barbero_id (id del barbero), y el usuario logueado tiene user.barbero.id
    const esBarbero = user?.role?.nombre === 'barbero' && user?.barbero?.id === cita.barbero_id;
    const esCliente = user?.role?.nombre === 'cliente' && (cita.cliente_id === user?.id || cita.user_id === user?.id);
    const puedeTerminar = esBarbero && cita.estado === 'confirmada';
    const puedeCalificar = esCliente && cita.estado === 'completada' && !cita.calificacion;

    const [localError, setLocalError] = useState<string | null>(null);
    const [localLoading, setLocalLoading] = useState(false);

    const handleCompletar = async () => {
      setLocalError(null);
      setLocalLoading(true);
      const ok = await completarCita(cita.id);
      setLocalLoading(false);
      if (ok) {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        onClose();
      } else {
        setLocalError(error || 'No se pudo completar la cita');
      }
    };

    const handleEnviarCalificacion = async (e: React.FormEvent) => {
      e.preventDefault();
      setCalificarError(null);
      setCalificando(true);
      try {
        await api.post('/calificaciones', {
          cita_id: cita.id,
          puntuacion: calificacion,
          comentario,
        });
        setShowCalificar(false);
        if (typeof window !== 'undefined') window.location.reload();
        onClose();
      } catch (err: any) {
        setCalificarError(err?.response?.data?.message || 'Error al enviar calificación');
      } finally {
        setCalificando(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-4">Detalle de Cita #{cita.id}</h2>
          <div className="space-y-2 mb-4">
            <div><b>Fecha:</b> {new Date(cita.fecha).toLocaleDateString('es-ES')}</div>
            <div><b>Hora:</b> {cita.hora}</div>
            <div><b>Servicio:</b> {cita.servicio?.nombre || cita.servicio_id}</div>
            <div><b>Barbero:</b> {cita.barbero?.user?.nombre || cita.barbero_id}</div>
            {/* Solo mostrar Cliente si el usuario es dueño */}
            {user?.role?.nombre === 'dueño' && (
              <div><b>Cliente:</b> {cita.cliente?.nombre || cita.user?.nombre || 'Sin nombre'}</div>
            )}
            <div><b>Estado:</b> <span className="capitalize">{cita.estado}</span></div>
            <div><b>Método de pago:</b> <span className="capitalize">{cita.metodo_pago}</span></div>
            {cita.calificacion && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                <div className="flex items-center mb-1">
                  <b>Calificación:</b>
                  <span className="ml-2 text-yellow-500 font-bold">
                    {Array.from({ length: cita.calificacion.puntuacion }).map((_, i) => (
                      <svg key={i} className="inline w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    ))}
                  </span>
                </div>
                <div className="text-gray-700"><b>Comentario:</b> {cita.calificacion.comentario}</div>
              </div>
            )}
          </div>
          {/* Botón para barbero: marcar como terminada */}
          {puedeTerminar && (
            <Button className="w-full mb-2 bg-green-600 hover:bg-green-700" onClick={handleCompletar} disabled={localLoading || loading}>
              {localLoading || loading ? 'Completando...' : 'Marcar como terminada'}
            </Button>
          )}
          {localError && <div className="text-red-600 text-sm mb-2">{localError}</div>}
          {/* Botón para cliente: calificar */}
          {puedeCalificar && (
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600" onClick={() => setShowCalificar(true)}>Calificar</Button>
          )}
          {/* Modal de calificación */}
          {showCalificar && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowCalificar(false)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-xl font-bold mb-4">Calificar Servicio</h3>
                <form onSubmit={handleEnviarCalificacion} className="space-y-4">
                  <div>
                    <Label>Puntuación</Label>
                    <div className="flex space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setCalificacion(star)}
                          className={star <= calificacion ? 'text-yellow-400' : 'text-gray-300'}
                          aria-label={`Puntuación ${star}`}
                        >
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Comentario</Label>
                    <textarea
                      rows={3}
                      value={comentario}
                      onChange={e => setComentario(e.target.value)}
                      placeholder="¿Cómo fue tu experiencia?"
                      className="w-full border rounded px-2 py-2 mt-1 resize-none"
                    />
                  </div>
                  {calificarError && <div className="text-red-600 text-sm">{calificarError}</div>}
                  <div className="flex space-x-2 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCalificar(false)}>Cancelar</Button>
                    <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600" disabled={calificando}>
                      {calificando ? 'Enviando...' : 'Enviar Calificación'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Función para obtener el título del header según el rol
  const getHeaderTitle = () => {
    if (isBarbero) return 'Mis Citas Asignadas';
    if (isDueno) return 'Gestión de Citas';
    return 'Mis Citas';
  };

  // Función para obtener la descripción del header según el rol
  const getHeaderDescription = () => {
    if (isBarbero) return 'Administra las citas que tienes asignadas';
    if (isDueno) return 'Supervisa todas las citas de la barbería';
    return 'Gestiona todas tus citas de manera eficiente';
  };

  return (
    <div className="space-y-8">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">
              {getHeaderTitle()}
            </h1>
            <p className="text-blue-100">{getHeaderDescription()}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total", value: citas.length, color: "bg-white/10" },
              { label: "Pendientes", value: citas.filter((c: any) => c.estado === 'pendiente').length, color: "bg-yellow-500/20" },
              { label: "Confirmadas", value: citas.filter((c: any) => c.estado === 'confirmada').length, color: "bg-green-500/20" },
              { label: "Completadas", value: citas.filter((c: any) => c.estado === 'completada').length, color: "bg-blue-500/20" }
            ].map((stat, index) => (
              <div key={index} className={`${stat.color} backdrop-blur-sm rounded-lg p-4 text-center`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons - Solo para cliente */}
      {isCliente && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Cita
            </Button>
            <Button variant="outline" onClick={() => setShowFiltro(true)}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filtrar
            </Button>
          </div>
        </div>
      )}

      {/* Action buttons para dueño y barbero - Solo filtrar */}
      {(isDueno || isBarbero) && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setShowFiltro(true)}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filtrar Citas
            </Button>
          </div>
        </div>
      )}

      {/* Modal de filtro - Para todos los roles */}
      {showFiltro && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xs mx-4 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setShowFiltro(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold mb-4">Filtrar Citas</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="filtro-estado">Estado</Label>
                <select
                  id="filtro-estado"
                  value={filtro.estado || ''}
                  onChange={e => setFiltro(f => ({ ...f, estado: e.target.value }))}
                  className="mt-1 block w-full border rounded px-2 py-2"
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <Label htmlFor="filtro-barbero">Barbero</Label>
                <select
                  id="filtro-barbero"
                  value={filtro.barbero_id || ''}
                  onChange={e => setFiltro(f => ({ ...f, barbero_id: e.target.value }))}
                  className="mt-1 block w-full border rounded px-2 py-2"
                >
                  <option value="">Todos</option>
                  {Array.from(new Set((misCitas || []).map((c: any) => c.barbero_id))).map((barberoId: any) => {
                    const cita = (misCitas || []).find((c: any) => c.barbero_id === barberoId) as any;
                    return (
                      <option key={barberoId} value={barberoId}>
                        {cita?.barbero?.user?.nombre || barberoId}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button type="button" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowFiltro(false)}>
                  Aplicar
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setFiltro({}); setShowFiltro(false); }}>
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de nueva cita - Solo para clientes */}
      {isCliente && showForm && (
        <div className="bg-white shadow-xl rounded-xl p-8 border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Nueva Cita</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="servicio_id">Servicio</Label>
                <select
                  id="servicio_id"
                  value={formData.servicio_id}
                  onChange={handleServicioChange}
                  required
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  <option value="">Seleccionar servicio</option>
                  {servicios?.map((servicio: any) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre} - ${servicio.precio}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="barbero_id">Barbero</Label>
                <select
                  id="barbero_id"
                  value={formData.barbero_id}
                  onChange={(e) => setFormData({ ...formData, barbero_id: e.target.value })}
                  required
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  <option value="">Seleccionar barbero</option>
                  {barberosDelServicio.map((barbero: any) => (
                    <option key={barbero.id} value={barbero.id}>
                      {barbero.user?.nombre || barbero.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="metodo_pago">Método de Pago</Label>
              <select
                id="metodo_pago"
                value={formData.metodo_pago}
                onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value as any })}
                required
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              >
                <option value="en_local">Pago en Local</option>
                <option value="transferencia">Transferencia</option>
                <option value="payphone">Payphone</option>
              </select>
            </div>

            {formError && (
              <div className="text-red-600 text-sm mb-2">{formError}</div>
            )}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Crear Cita
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de citas */}
      {citas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {isCliente ? 'No hay citas programadas' : 'No hay citas disponibles'}
          </h3>
          <p className="text-gray-600 mb-8">
            {isCliente ? '¡Programa tu primera cita para comenzar!' :
              isBarbero ? 'No tienes citas asignadas en este momento.' :
                'No hay citas registradas en el sistema.'}
          </p>
          {/* Solo mostrar botón de crear cita si es cliente */}
          {isCliente && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Programar Primera Cita
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {citas.length} cita{citas.length !== 1 ? 's' : ''} encontrada{citas.length !== 1 ? 's' : ''}
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {citas.map((cita: any) => (
              <div key={cita.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Cita #{cita.id}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{cita.hora}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="font-semibold">${cita.total}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="capitalize">{cita.metodo_pago.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span className="capitalize">{cita.estado_pago}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedCita(cita); setShowDetalleModal(true); }}>
                      Ver Detalles
                    </Button>
                    {/* Solo mostrar botón de confirmar si es dueño o barbero y la cita está pendiente */}
                    {(isDueno || (isBarbero && user?.barbero?.id === cita.barbero_id)) && cita.estado === 'pendiente' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Confirmar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de detalles de cita */}
      {showDetalleModal && selectedCita && (
        <DetalleCitaModal cita={selectedCita} onClose={() => setShowDetalleModal(false)} />
      )}
      {/* Toast modal */}
      {toast && (
        <ToastModal type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default Citas;