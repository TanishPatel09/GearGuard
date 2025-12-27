import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-text-main mb-2">404</h1>
        <h2 className="text-xl font-semibold text-text-main mb-4">Page Not Found</h2>
        
        <p className="text-text-sub mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Home size={18} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound
