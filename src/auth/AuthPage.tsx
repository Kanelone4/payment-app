import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Registration from './components/Registration';
import { ForgotPassword } from './components/ForgotPassword';
import Login from './components/Login';
import { AuthLayout } from './AuthLayout';

const AuthPage = () => {
  const navigate = useNavigate();

navigate('/auth/login');


  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Navigate to="registration" />} />
        <Route path="registration" element={<Registration />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
    </Routes>
  );
};

export { AuthPage };
