import { Route, Routes, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import { ForgotPassword } from './components/ForgotPassword';
import Login from './components/Login';
import { AuthLayout } from './AuthLayout';
import { ResetPassword } from './components/ResetPassword';

const AuthPage = () => {
  return (
    <Routes>
      
      <Route element={<AuthLayout />}>
        
        <Route index element={<Navigate to="login" replace />} />
        
        <Route path="registration" element={<Registration />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

      </Route>
    </Routes>
  );
};

export { AuthPage };
