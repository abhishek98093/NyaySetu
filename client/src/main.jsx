// main.jsx or index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.jsx';
import './index.css';

import { Provider } from 'react-redux';           // ✅ Redux
import { store } from './store/store';            // ✅ Your Redux store

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ✅ React Query

const queryClient = new QueryClient(); // 🔑 Create QueryClient instance

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>                      {/* ✅ Wrap entire app in Redux */}
      <QueryClientProvider client={queryClient}>  {/* ✅ React Query provider */}
        <Router>
          <App />
          <ToastContainer />
        </Router>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
