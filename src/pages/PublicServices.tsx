// src/pages/PublicServices.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useServicios } from '../hooks/useServicios';
import { useBarberos } from '../hooks/useBarberos';
import { useAuthStore } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

interface SelectedService {
  id: number;
  nombre: string;
  precio: string;
  duracion: number;
}

interface BookingData {
  barberiaId: number;
  barberoId: number;
  servicioId: number;
  fecha: string;
  hora: string;
  metodoPago: 'en_local' | 'transferencia' | 'payphone';
  servicio: SelectedService;
}

const PublicServices = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Estado para la barbería seleccionada
  const [selectedBarberiaId, setSelectedBarberiaId] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Datos del formulario de reserva
  const [bookingData, setBookingData] = useState({
    barberoId: '',
    fecha: '',
    hora: '',
    metodoPago: 'en_local' as const,
  });

  // Hooks para datos
  const { servicios, isLoading: serviciosLoading } = useServicios(selectedBarberiaId || undefined);
  const { barberos, isLoading: barberosLoading } = useBarberos(); // Sin parámetros

  // Lista de barberías (simulada - en un caso real vendría de un hook)
  const barberias = [
    { id: 1, nombre: "BarberPro Centro", direccion: "Av. Principal 123", telefono: "+593 99 123 4567" },
    { id: 2, nombre: "BarberPro Norte", direccion: "Av. Norte 456", telefono: "+593 99 765 4321" },
    { id: 3, nombre: "BarberPro Sur", direccion: "Av. Sur 789", telefono: "+593 99 555 1234" },
  ];

  // Guardar datos en localStorage para persistir después del login
  useEffect(() => {
    if (selectedService && bookingData.barberoId && bookingData.fecha && bookingData.hora) {
      const pendingBooking: BookingData = {
        barberiaId: selectedBarberiaId!,
        barberoId: parseInt(bookingData.barberoId),
        servicioId: selectedService.id,
        fecha: bookingData.fecha,
        hora: bookingData.hora,
        metodoPago: bookingData.metodoPago,
        servicio: selectedService,
      };
      localStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));
    }
  }, [selectedService, bookingData, selectedBarberiaId]);

  const handleServiceSelect = (servicio: any) => {
    setSelectedService({
      id: servicio.id,
      nombre: servicio.nombre,
      precio: servicio.precio,
      duracion: servicio.duracion,
    });
    setShowBookingForm(true);
  };

  const handleBookingSubmit = () => {
    if (!isAuthenticated) {
      // Guardar datos y redirigir al login
      const pendingBooking: BookingData = {
        barberiaId: selectedBarberiaId!,
        barberoId: parseInt(bookingData.barberoId),
        servicioId: selectedService!.id,
        fecha: bookingData.fecha,
        hora: bookingData.hora,
        metodoPago: bookingData.metodoPago,
        servicio: selectedService!,
      };
      localStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));
      navigate('/login?redirect=/complete-booking');
    }
  };

  const resetForm = () => {
    setSelectedService(null);
    setShowBookingForm(false);
    setBookingData({
      barberoId: '',
      fecha: '',
      hora: '',
      metodoPago: 'en_local',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link to="/">← Volver al Inicio</Link>
          </Button>
          <div className="text-2xl font-bold text-white">
            BarberPro
          </div>
          <div className="space-x-4">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Título principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explora Nuestros Servicios
          </h1>
          <p className="text-xl text-gray-300">
            Selecciona una barbería para ver servicios disponibles y hacer tu reserva
          </p>
        </div>

        {/* Selección de Barbería */}
        {!selectedBarberiaId && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Elige tu barbería preferida
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {barberias.map((barberia) => (
                <div 
                  key={barberia.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedBarberiaId(barberia.id)}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{barberia.nombre}</h3>
                  <p className="text-gray-300 mb-2">📍 {barberia.direccion}</p>
                  <p className="text-gray-300 mb-4">📞 {barberia.telefono}</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Seleccionar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Servicios de la barbería seleccionada */}
        {selectedBarberiaId && !showBookingForm && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Servicios - {barberias.find(b => b.id === selectedBarberiaId)?.nombre}
                </h2>
                <p className="text-gray-300">Selecciona el servicio que deseas</p>
              </div>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setSelectedBarberiaId(null)}
              >
                Cambiar Barbería
              </Button>
            </div>

            {serviciosLoading ? (
              <div className="text-center py-12">
                <div className="text-xl text-white">Cargando servicios...</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicios?.map((servicio: any) => (
                  <div 
                    key={servicio.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white mb-2">{servicio.nombre}</h3>
                      {servicio.descripcion && (
                        <p className="text-gray-300 text-sm mb-3">{servicio.descripcion}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold text-purple-400">${servicio.precio}</div>
                      <div className="text-sm text-gray-300">{servicio.duracion} min</div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => handleServiceSelect(servicio)}
                    >
                      Seleccionar Servicio
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {servicios && servicios.length === 0 && (
              <div className="text-center py-12">
                <div className="text-xl text-gray-300">
                  No hay servicios disponibles en esta barbería
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulario de reserva */}
        {showBookingForm && selectedService && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Reservar Cita</h2>
                <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                  <h3 className="text-lg font-semibold text-white">{selectedService.nombre}</h3>
                  <p className="text-gray-300">
                    Precio: <span className="font-bold text-purple-400">${selectedService.precio}</span> | 
                    Duración: <span className="font-bold">{selectedService.duracion} min</span>
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha" className="text-white">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={bookingData.fecha}
                      onChange={(e) => setBookingData({...bookingData, fecha: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora" className="text-white">Hora</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={bookingData.hora}
                      onChange={(e) => setBookingData({...bookingData, hora: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="barberoId" className="text-white">Barbero</Label>
                  <select
                    id="barberoId"
                    value={bookingData.barberoId}
                    onChange={(e) => setBookingData({...bookingData, barberoId: e.target.value})}
                    className="mt-1 block w-full rounded-md bg-white/10 border border-white/20 text-white px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  >
                    <option value="" className="text-gray-900">Seleccionar barbero</option>
                    {barberosLoading ? (
                      <option className="text-gray-900">Cargando...</option>
                    ) : (
                      barberos?.map((barbero: any) => (
                        <option key={barbero.id} value={barbero.id} className="text-gray-900">
                          {barbero.user?.nombre || barbero.nombre || `Barbero #${barbero.id}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <Label htmlFor="metodoPago" className="text-white">Método de Pago</Label>
                  <select
                    id="metodoPago"
                    value={bookingData.metodoPago}
                    onChange={(e) => setBookingData({...bookingData, metodoPago: e.target.value as any})}
                    className="mt-1 block w-full rounded-md bg-white/10 border border-white/20 text-white px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="en_local" className="text-gray-900">Pago en Local</option>
                    <option value="transferencia" className="text-gray-900">Transferencia</option>
                    <option value="payphone" className="text-gray-900">Payphone</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">
                    💡 Para completar tu reserva necesitas tener una cuenta. Si no tienes una, puedes crearla en el siguiente paso.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={handleBookingSubmit}
                    disabled={!bookingData.barberoId || !bookingData.fecha || !bookingData.hora}
                  >
                    Continuar con Reserva
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicServices;
