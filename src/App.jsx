import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Dashboard from './pages/Dashboard'
import WorkCenter from './pages/WorkCenter'
import MaintenanceRequests from './pages/MaintenanceRequests'
import Team from './pages/Team'
import Equipment from './pages/Equipment'
import EquimentCategory from './pages/EquimentCategory'
import Activity from './pages/Activity'
import Reporting from './pages/Reporting'
import Login from './pages/Login'
import Register from './pages/Register'
import StyleGuide from './pages/StyleGuide'
import MaintenanceRequestDemo from './pages/MaintenanceRequestDemo'
import NotFound from './pages/NotFound'

import './App.css'

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
)

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text-main font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected/App Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/maintenance-requests" element={<MaintenanceRequests />} />
            <Route path="/work-center" element={<WorkCenter />} />
            <Route path="/team" element={<Team />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment-category" element={<EquimentCategory />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="/maintenance-request-demo" element={<MaintenanceRequestDemo />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  )
}

export default App
