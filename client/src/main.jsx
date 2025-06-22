// main.jsx or index.js (your entry file)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.jsx';
import './index.css';

import { Provider } from 'react-redux';           // ✅ Redux
import { store } from './store/store';            // ✅ Your Redux store

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>                      {/* ✅ Wrap entire app in Redux */}
      <Router>
        <App />
        <ToastContainer />
      </Router>
    </Provider>
  </StrictMode>
);
