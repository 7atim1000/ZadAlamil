import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './Redux/store.js';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
   <App />
   </Provider>
    <Toaster
      toastOptions={{
        style: {
          background: 'linear-gradient(45deg, red, black)',
          color: 'white', 
          padding: '10px 20px',
          fontSize: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
      }}
     />
  </StrictMode>,
)
