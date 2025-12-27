import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { MaintenanceProvider } from './context/MaintenanceContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MaintenanceProvider>
        <App />
      </MaintenanceProvider>
    </AuthProvider>
  </StrictMode>,
)
