import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { AuthPage } from './auth';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;