import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthPage } from './auth/AuthPage';
import NewSubscription from './subscription/NewSubscription';
import Dashboard from './dashboard/Dashboard';
import ProtectedRoute from './auth/ProtectedRoute';
import ListOfSubscription from './subscription/ListOfSubscription';
import Factures from './layout/facture/factures';
import Notification from './layout/notification/notifs';
import Settings from './layout/settings/settings';

const App = () => {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="auth/*" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
          <Route path="add-new" element={<NewSubscription />} />
          <Route path="list" element={<ListOfSubscription />} />
          <Route path="factures" element={<Factures />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
};

export default App;
