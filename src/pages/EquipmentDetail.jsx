import React, { useState } from 'react'
import { X, ChevronDown, Calendar, Wrench, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import { toast } from 'react-toastify'

const EquipmentDetail = ({ onClose, initialData = null }) => {
  const navigate = useNavigate()
  const { teams, workCenters, addEquipment, updateEquipment, getOpenRequestsCount } = useMaintenanceContext()
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    serial_number: initialData?.serial_number || '',
    category: initialData?.category || '',
    department: initialData?.department || '',
    employee: initialData?.employee || '',
    team: initialData?.team || '',
    technician: initialData?.technician || '',
    purchase_date: initialData?.purchase_date || '',
    warranty_expiration: initialData?.warranty_expiration || '',
    location: initialData?.location || '',
    company: initialData?.company || '',
    work_center: initialData?.work_center || '',
    assigned_date: initialData?.assigned_date || '',
    scrap_date: initialData?.scrap_date || '',
    status: initialData?.status || 'Active',
    notes: initialData?.notes || ''
  })

  const [loading, setLoading] = useState(false)

  const categories = ['Computers', 'Monitors', 'Machinery', 'Vehicles', 'Tools', 'Other']
  const departments = ['Admin', 'Production', 'Technician', 'IT', 'Maintenance', 'Other']
  const statuses = ['Active', 'Under Maintenance', 'Scrapped']

  const handleTeamChange = (teamName) => {
    const selectedTeam = teams.find(t => t.name === teamName)
    setFormData(prev => ({
      ...prev,
      team: teamName,
      technician: selectedTeam && selectedTeam.members.length > 0 ? selectedTeam.members[0] : ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let result
      if (initialData && initialData.id) {
        result = await updateEquipment(initialData.id, formData)
      } else {
        result = await addEquipment(formData)
      }
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to save equipment')
        setLoading(false)
        return
      }
      
      toast.success(initialData ? 'Equipment updated' : 'Equipment added')
      onClose()
    } catch (err) {
      toast.error(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  const requestCount = initialData?.id ? getOpenRequestsCount(initialData.id) : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-semibold text-text-main">
              {initialData ? 'Edit Equipment' : 'New Equipment'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             {requestCount > 0 && (
               <button 
                 onClick={() => {
                   navigate(`/maintenance-requests?equipment=${initialData.name}`)
                   onClose()
                 }}
                 className="hidden md:flex flex-col items-center justify-center w-32 h-12 bg-surface hover:bg-gray-50 border border-border rounded shadow-sm transition-colors text-primary overflow-hidden relative"
               >
                 <div className="flex items-center gap-2 font-medium">
                   <Wrench size={16} />
                   <span>Requests</span>
                 </div>
                 <span className="text-xs text-text-sub">{requestCount} Active</span>
               </button>
             )}
            <button 
              onClick={onClose}
              className="text-text-sub hover:text-text-main transition-colors ml-4"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-4">
              
              {/* Equipment Name */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Equipment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter equipment name"
                  required
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serial_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm"
                  placeholder="e.g., MT/125/22779837"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="">Select department...</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Assigned Employee */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Assigned Employee
                </label>
                <input
                  type="text"
                  value={formData.employee}
                  onChange={(e) => setFormData(prev => ({ ...prev, employee: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Employee name"
                />
              </div>

              {/* Physical Location */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Physical Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Building A, Floor 2, Room 205"
                />
              </div>

              {/* Work Center */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Work Center
                </label>
                <div className="relative">
                  <select
                    value={formData.work_center || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, work_center: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="">Select work center...</option>
                    {workCenters && workCenters.map(wc => (
                      <option key={wc.id} value={wc.name}>{wc.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Assigned Date */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Assigned Date
                </label>
                <input
                  type="date"
                  value={formData.assigned_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigned_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Scrap Date */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Scrap Date
                </label>
                <input
                  type="date"
                  value={formData.scrap_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, scrap_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              
              {/* Maintenance Team */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Maintenance Team
                </label>
                <div className="relative">
                  <select
                    value={formData.team}
                    onChange={(e) => handleTeamChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="">Select team...</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>{team.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Default Technician */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Default Technician
                </label>
                <div className="relative">
                  <select
                    value={formData.technician}
                    onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="">Select technician...</option>
                    {formData.team && teams.find(t => t.name === formData.team)?.members.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Warranty Expiration
                </label>
                <input
                  type="date"
                  value={formData.warranty_expiration}
                  onChange={(e) => setFormData(prev => ({ ...prev, warranty_expiration: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Company name"
                />
              </div>

            </div>

            {/* Notes (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-main mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary min-h-24 resize-y"
                placeholder="Additional notes about this equipment..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-border bg-gray-50/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded bg-surface text-text-main hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Equipment'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default EquipmentDetail
