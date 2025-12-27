import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="bg-surface border-b border-border px-6 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex space-x-6 overflow-x-auto">
          <TabItem to="/maintenance-requests" label="Maintenance" />
          <TabItem to="/dashboard" label="Dashboard" />
          <TabItem to="/activity" label="Maintenance Calendar" />
          <TabItem to="/equipment" label="Equipment" />
          <TabItem to="/reporting" label="Reporting" />
          <TabItem to="/work-center" label="Work Centers" />
          <TabItem to="/team" label="Teams" />
        </div>
        
        <div className="flex items-center gap-4 py-2">
          <span className="text-sm text-text-sub hidden md:block">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-sub hover:text-text-main hover:bg-gray-100 rounded transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function TabItem({ to, label }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `pb-3 px-2 border-b-2 whitespace-nowrap transition-colors pt-4 ${
          isActive 
            ? 'border-primary text-primary font-semibold' 
            : 'border-transparent text-text-sub hover:text-text-main'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default Navbar
