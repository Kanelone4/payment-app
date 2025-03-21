import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthPage } from './auth/AuthPage';
import NewSubscription from './subscription/NewSubscription';
import Dashboard from './dashboard/Dashboard';
import ProtectedRoute from './auth/ProtectedRoute';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          {/* Route publique */}
          <Route path="auth/*" element={<AuthPage />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
          <Route path="add-new" element={<NewSubscription />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
};

export default App;
