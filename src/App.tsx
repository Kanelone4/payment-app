import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

import { AuthPage } from './auth/AuthPage';
import ProtectedRoute from './auth/ProtectedRoute';
import Dashboard from './dashboard/Dashboard';
import NewSubscription from './subscription/NewSubscription';
import ListOfSubscription from './subscription/ListOfSubscription';
import Factures from './layout/facture/factures';
import Notification from './layout/notification/notifs';
import Settings from './layout/settings/settings';
import PaymentCallback from './fedapay/PaymentCallBack';
import PaymentSuccess from './fedapay/PaymentSuccess';
import PaymentError from './fedapay/PaymentError';

const App: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* SUPPRIMÉ : <BrowserRouter> */}
        <Routes>
          {/* PUBLIC : login / register etc. */}
          <Route path="auth/*" element={<AuthPage />} />

          {/* PROTECTED : toutes les routes enfant nécessitent d'être authentifié */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="add-new" element={<NewSubscription />} />
            <Route path="list" element={<ListOfSubscription />} />
            <Route path="factures" element={<Factures />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="settings" element={<Settings />} />
            <Route path="payment-callback" element={<PaymentCallback />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-error" element={<PaymentError />} />
          </Route>

          {/* CATCH-ALL */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      {/* SUPPRIMÉ : </BrowserRouter> */}
    </PersistGate>
  </Provider>
);

export default App;
