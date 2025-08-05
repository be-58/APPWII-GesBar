// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <Outlet /> {/* Aquí se renderizarán las páginas hijas */}
      </main>
      <footer className="bg-white text-center p-4 mt-auto">
        © {new Date().getFullYear()} Gestión de Barberías. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default MainLayout;
