import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import{ store}  from './store';
import { AuthPage } from './auth';

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="auth/*" element={<AuthPage />} />
      </Routes>
    </Provider>
  );
};

export default App;
