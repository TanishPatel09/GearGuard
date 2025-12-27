import React, { useState } from 'react'
import MaintenanceRequest from './MaintenanceRequest'

const MaintenanceRequestDemo = () => {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center font-sans text-text-main bg-background p-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-primary">Maintenance Request Form Demo</h1>
        <p className="text-text-sub">Click the button below to open the maintenance request form</p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          Open Maintenance Request Form
        </button>
      </div>

      {showForm && (
        <MaintenanceRequest 
          onClose={() => setShowForm(false)}
          initialData={{
            subject: 'Test activity',
            equipment: 'Acer Laptop',
            category: 'Computers',
            maintenanceType: 'Corrective',
            team: 'Internal Maintenance',
            technician: 'Aka Foster',
            scheduledDate: '2025-12-28',
            scheduledTime: '14:30',
            priority: 2,
            stage: 'New'
          }}
        />
      )}
    </div>
  )
}

export default MaintenanceRequestDemo
