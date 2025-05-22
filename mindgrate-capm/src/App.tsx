// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProtectedRoute from './ProtectedRoute';
import MainAppLayout from './MainAppLayout';

// Componente de carga reutilizable
const LoadingScreen: React.FC = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

// Componente interno para manejar la redirección de la ruta raíz
function RootRedirect(): JSX.Element {
  const { user, loading } = useAuth();

  // Si está cargando el estado de autenticación, mostrar loader
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirección inteligente basada en el estado de autenticación
  return user ? (
    <Navigate to="/app/hub" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

// Componente para manejar rutas no encontradas (404)
function NotFoundRedirect(): JSX.Element {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Redirigir a la página apropiada según el estado de autenticación
  return user ? (
    <Navigate to="/app/hub" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta raíz con redirección inteligente */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Rutas públicas de autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Rutas protegidas de la aplicación principal */}
          <Route 
            path="/app/*" 
            element={
              <ProtectedRoute>
                <MainAppLayout />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta catch-all para URLs no reconocidas */}
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;