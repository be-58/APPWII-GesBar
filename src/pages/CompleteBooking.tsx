// src/pages/CompleteBooking.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import { useCitas, type CreateCitaDto } from '../hooks/useCitas';
import { Button } from '../components/ui/Button';

interface BookingData {
  barberiaId: number;
  barberoId: number;
  servicioId: number;
  fecha: string;
  hora: string;
  metodoPago: 'en_local' | 'transferencia' | 'payphone';
  servicio: {
    id: number;
    nombre: string;
    precio: string;
    duracion: number;
  };
}

const CompleteBooking = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { crearCita } = useCitas();
  
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verificar que el usuario esté autenticado
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Cargar datos de la reserva pendiente
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      setBookingData(JSON.parse(pendingBooking));
    } else {
      navigate('/services-public');
    }
  }, [isAuthenticated, navigate]);

  const handleConfirmBooking = async () => {
    if (!bookingData) return;

    setIsSubmitting(true);
    try {
      const citaData: CreateCitaDto = {
        barberia_id: bookingData.barberiaId,
        barbero_id: bookingData.barberoId,
        servicio_id: bookingData.servicioId,
        fecha: bookingData.fecha,
        hora: bookingData.hora,
        metodo_pago: bookingData.metodoPago,
      };

      await crearCita(citaData);
      
      // Limpiar datos guardados
      localStorage.removeItem('pendingBooking');
      setSuccess(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/citas');
      }, 3000);
      
    } catch (error) {
      console.error('Error al crear la cita:', error);
      // Aquí podrías mostrar un mensaje de error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-xl">Cargando...</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-4">¡Reserva Confirmada!</h1>
          <p className="text-gray-300 mb-6">
            Tu cita ha sido creada exitosamente. Te redirigiremos a tus citas en unos segundos.
          </p>
          <Button 
            onClick={() => navigate('/citas')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Ver Mis Citas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Confirmar Reserva
            </h1>
            <p className="text-gray-300">
              Revisa los detalles de tu cita antes de confirmar
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <div className="space-y-6">
              {/* Información del usuario */}
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Información del Cliente</h3>
                <div className="text-gray-300">
                  <p><strong>Nombre:</strong> {user?.nombre}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Teléfono:</strong> {user?.telefono}</p>
                </div>
              </div>

              {/* Información del servicio */}
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Servicio Seleccionado</h3>
                <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                  <h4 className="text-xl font-semibold text-white">{bookingData.servicio.nombre}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-2xl font-bold text-purple-400">${bookingData.servicio.precio}</span>
                    <span className="text-gray-300">{bookingData.servicio.duracion} minutos</span>
                  </div>
                </div>
              </div>

              {/* Información de la cita */}
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Detalles de la Cita</h3>
                <div className="grid grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <strong>Fecha:</strong> {new Date(bookingData.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div>
                    <strong>Hora:</strong> {bookingData.hora}
                  </div>
                  <div>
                    <strong>Barbero ID:</strong> {bookingData.barberoId}
                  </div>
                  <div>
                    <strong>Método de Pago:</strong> {
                      bookingData.metodoPago === 'en_local' ? 'Pago en Local' :
                      bookingData.metodoPago === 'transferencia' ? 'Transferencia' :
                      'Payphone'
                    }
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  Total a Pagar: <span className="text-purple-400">${bookingData.servicio.precio}</span>
                </div>
                {bookingData.metodoPago !== 'en_local' && (
                  <p className="text-sm text-yellow-200">
                    Se te proporcionarán las instrucciones de pago después de confirmar la reserva
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <Button 
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
            </Button>
            <Button 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/services-public')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>

          {/* Nota importante */}
          <div className="mt-6 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              📝 <strong>Nota:</strong> Una vez confirmada tu reserva, recibirás un email de confirmación. 
              Si necesitas cancelar o modificar tu cita, puedes hacerlo desde tu panel de citas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteBooking;
