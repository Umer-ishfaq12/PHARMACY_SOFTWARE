import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './Authcontext/authContext';
import Login from './Login';
import Register from './register';
import Dashboard from './dashboard';
import Medicines from './Medicine';
import Sell from './sale';
import Sales from './saleHistory';
// Existing imports ke sath yeh add karo
import AIReorder from './AIReorder';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

// Public route wrapper — redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public routes */}
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/medicines" element={
        <ProtectedRoute><Medicines /></ProtectedRoute>
      } />
      <Route path="/sell" element={
        <ProtectedRoute><Sell /></ProtectedRoute>
      } />
      <Route path="/sales" element={
        <ProtectedRoute><Sales /></ProtectedRoute>
      } />
      <Route path="/ai-reorder" element={
    <ProtectedRoute><AIReorder /></ProtectedRoute>
      } />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
