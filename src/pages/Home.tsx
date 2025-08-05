// src/pages/Home.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { useEffect } from 'react';
import { useServicios } from '../hooks/useServicios';

const Home = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Si el usuario está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);


  // Solo mostrar la landing page si no está autenticado
  if (isAuthenticated) {
    return null; // O un loading spinner
  }

  // Obtener servicios reales (sin barbería, muestra todos los públicos)
  const { servicios = [], isLoading } = useServicios();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header/Navbar */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            BarberPro
          </div>
          <div className="space-x-4">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link to="/login">Ver Servicios</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Reserva tu cita en la mejor 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {" "}barbería
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Encuentra los mejores barberos, explora servicios premium y agenda tu cita 
              de forma rápida y sencilla. Tu estilo, nuestra pasión.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4">
                <Link to="/login">Explorar Servicios</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                <Link to="/register">Crear Cuenta</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ofrecemos una experiencia única que combina tradición y modernidad
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Reservas Fáciles</h3>
              <p className="text-gray-300 leading-relaxed">
                Sistema de reservas intuitivo y rápido. Elige tu barbero, servicio y horario en pocos clics.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Profesionales Expertos</h3>
              <p className="text-gray-300 leading-relaxed">
                Nuestros barberos son artistas del cabello con años de experiencia y técnicas modernas.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Pagos Seguros</h3>
              <p className="text-gray-300 leading-relaxed">
                Múltiples métodos de pago seguros. Tranquilidad total en cada transacción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Desde cortes clásicos hasta estilos modernos, tenemos todo lo que necesitas
            </p>
          </div>
          {isLoading ? (
            <div className="text-center text-white text-lg">Cargando servicios...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {servicios.slice(0, 4).map((service) => (
                <button
                  key={service.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300 w-full focus:outline-none"
                  onClick={() => navigate('/login')}
                  type="button"
                >
                  <div className="text-4xl mb-4">💈</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{service.nombre}</h3>
                  <p className="text-gray-300 mb-2 min-h-[2.5rem]">{service.descripcion || 'Sin descripción'}</p>
                  <p className="text-2xl font-bold text-purple-400">${parseFloat(service.precio).toFixed(2)}</p>
                </button>
              ))}
            </div>
          )}
          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link to="/login">Ver Todos los Servicios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para tu nueva imagen?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Únete a miles de clientes satisfechos que confían en nosotros para lucir increíbles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
              <Link to="/login">Reservar Ahora</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/register">Crear Cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">BarberPro</div>
          <p className="text-gray-400 mb-4">La mejor experiencia en barbería</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <p className="text-gray-500 mt-4">
            © {new Date().getFullYear()} BarberPro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
