import React, { useState } from 'react'
import { Search, ChevronDown, Plus, Filter } from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'

const WorkCenter = () => {
  const { workCenters, loading } = useMaintenanceContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedWorkCenter, setSelectedWorkCenter] = useState(null)

  const filteredWorkCenters = workCenters.filter(wc => 
    wc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (wc.code && wc.code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleRowClick = (wc) => {
    // Placeholder for form view
    setSelectedWorkCenter(wc)
    alert(`Open form for ${wc.name}`) 
    // In real app, would set showForm(true) and pass data
  }

  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      
      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 pb-6">
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          
          {/* Action Bar */}
          <div className="px-4 py-3 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
            <button 
              className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              <span>New</span>
            </button>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-1.5 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Work Center Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-text-sub font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Work Center</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Alternative Workcenters</th>
                  <th className="px-4 py-3 text-right">Cost per hour</th>
                  <th className="px-4 py-3 text-right">Capacity</th>
                  <th className="px-4 py-3 text-right">Time Efficiency</th>
                  <th className="px-4 py-3 text-right">OEE Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {filteredWorkCenters.map((wc) => (
                  <tr 
                    key={wc.id} 
                    onClick={() => handleRowClick(wc)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-text-main">{wc.name}</td>
                    <td className="px-4 py-3 text-text-sub">{wc.code}</td>
                    <td className="px-4 py-3 text-text-sub">{wc.tag}</td>
                    <td className="px-4 py-3 text-text-sub">{wc.alternative}</td>
                    <td className="px-4 py-3 text-right text-text-main">{wc.cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-text-main">{wc.capacity.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-text-main">{wc.efficiency.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-right text-text-main">{wc.oee_target.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkCenter