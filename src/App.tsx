import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthPage } from './auth/AuthPage';
import Layout from './dashboard/layout/layout';
import Dashboard from './dashboard/dashboard/dashboard';

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="auth/*" element={<AuthPage />} />
        <Route path="dashboard/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Provider>
  );
};

export default App;