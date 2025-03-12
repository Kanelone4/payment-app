import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthPage } from './auth/AuthPage';
import NewSubscription from './subscription/NewSubscription';
import Dashboard from './dashboard/Dashboard';
 // Assurez-vous que le chemin d'importation est correct

const App = () => {
  
  return (
    <Provider store={store}>
      <Routes>
        <Route path="auth/*" element={<AuthPage />} />
          <Route path="dashboard" element={ <Dashboard />} />
        <Route path="add-new" element={<NewSubscription  />} /> 
      </Routes>
    </Provider>
  );
};

export default App;
