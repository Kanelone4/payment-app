import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { AuthPage } from './auth';
import Login from './auth/components/Login';

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </Provider>
  );
};

export default App;
