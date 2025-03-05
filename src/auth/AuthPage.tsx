import { Route, Routes, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import { ForgotPassword } from './components/ForgotPassword';
import Login from './components/Login';
import { AuthLayout } from './AuthLayout';


const AuthPage = () => {
  return (
    <Routes>
      {/* Utilisez AuthLayout pour envelopper les sous-routes */}
      <Route element={<AuthLayout />}>
        {/* Redirigez l'index vers /auth/login par défaut */}
        <Route index element={<Navigate to="login" replace />} />
        {/* Définissez les sous-routes */}
        <Route path="registration" element={<Registration />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        
      </Route>
    </Routes>
  );
};

export { AuthPage };
