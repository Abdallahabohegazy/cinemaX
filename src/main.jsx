import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store'
import { I18nProvider } from './context/I18nContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <I18nProvider>
          <App />
          <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(15,15,25,0.95)',
              color: '#f0f0f0',
              border: '1px solid rgba(220,38,38,0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              zIndex: 99999,
            },
            success: {
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        </I18nProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
