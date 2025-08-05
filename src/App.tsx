import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './router/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Citas from './pages/Citas';
import Servicios from './pages/Servicios';
import Barberos from './pages/Barberos';
import Usuarios from './pages/Usuarios';
import Perfil from './pages/Perfil';
import Unauthorized from './pages/Unauthorized';
import PublicServices from './pages/PublicServices';
import CompleteBooking from './pages/CompleteBooking';
import TestBackend from './pages/TestBackend';
import Barberías from './pages/Barberías';
import './App.css';

// Crear instancia del Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services-public" element={<PublicServices />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/test-backend" element={<TestBackend />} />
          
          {/* Rutas protegidas con layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/citas" element={<Citas />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/barberos" element={<Barberos />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/complete-booking" element={<CompleteBooking />} />
              <Route path="/barberias" element={<Barberías />} />
            </Route>
          </Route>
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
