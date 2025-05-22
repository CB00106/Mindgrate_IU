import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Importar componentes de la aplicación
import {
  Hub,
  MyMindOp,
  Data,
  Notifications
} from '../components';

// Definiciones de tipos para mejorar el tipado
interface MenuItem {
  key: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  onSignOut: () => void;
}

function Sidebar({ currentPage, setPage, onSignOut }: SidebarProps) {
  const { user } = useAuth();
  
  // Updated menu items for MVP
  const menu: MenuItem[] = [
    { key: 'Hub', label: 'Hub', icon: '💬' },
    { key: 'MyMindOp', label: 'Mi MindOp', icon: '🤖' },
    { key: 'Data', label: 'Data Sources', icon: '📁' },
    { key: 'Notifications', label: 'Notifications', icon: '🔔' },
  ];
  
  // Obtén las primeras iniciales del email del usuario
  const getUserInitials = () => {
    if (!user?.email) return "U";
    const parts = user.email.split('@')[0].split(/[._-]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };
  
  // Obtén el nombre de usuario del email
  const getUserName = () => {
    if (!user?.email) return "Usuario";
    return user.email.split('@')[0];
  };
  
  return (
    <aside className="w-60 bg-gray-800 text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <span className="text-blue-400 mr-2">🧠</span> Mindgrate
      </h1>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menu.map(item => (
            <li key={item.key}>
              <button
                onClick={() => setPage(item.key)}
                className={`w-full text-left p-3 rounded flex items-center ${
                  currentPage === item.key 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {getUserInitials()}
            </div>
            <div className="ml-2">
              <div className="text-sm">{getUserName()}</div>
              <div className="text-xs text-gray-400">Usuario</div>
            </div>
          </div>
          <button 
            onClick={onSignOut}
            className="text-gray-400 hover:text-white text-sm p-1"
          >
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}

// Componente de layout principal para la aplicación
const MainAppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  
  // Determinar la página actual basada en la URL
  const getInitialPage = () => {
    const path = location.pathname.split('/').pop() || 'hub';
    // Convertir la primera letra a mayúsculas para coincidir con los valores de MenuItem.key
    return path.charAt(0).toUpperCase() + path.slice(1);
  };
  
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  
  // Actualizar la URL cuando cambia la página
  useEffect(() => {
    navigate(`/app/${currentPage.toLowerCase()}`);
  }, [currentPage, navigate]);
  
  // Manejar cierre de sesión
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Renderizar la página actual
  const renderPage = () => {
    switch (currentPage) {
      case 'Hub':
        return <Hub />;
      case 'MyMindOp':
        return <MyMindOp />;
      case 'Data':
        return <Data />;
      case 'Notifications':
        return <Notifications />;
      default:
        return <Hub />; // Página por defecto
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        onSignOut={handleSignOut}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
};

export default MainAppLayout;
