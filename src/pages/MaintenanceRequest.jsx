import React, { useState } from 'react'
import { X, ChevronDown, Calendar, Star } from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'

const MaintenanceRequest = ({ onClose, initialData = null }) => {
  const { equipment, teams, addRequest, updateRequest } = useMaintenanceContext()
  const [formData, setFormData] = useState({
    subject: initialData?.subject || '',
    createdBy: 'Mitchell Admin',
    maintenanceFor: initialData?.maintenanceFor || 'Equipment',
    equipment: initialData?.equipment || '',
    category: initialData?.category || '',
    requestDate: initialData?.requestDate || new Date().toISOString().split('T')[0],
    maintenanceType: initialData?.maintenanceType || 'Corrective',
    team: initialData?.team || '',
    technician: initialData?.technician || '',
    scheduledDate: initialData?.scheduledDate || '',
    scheduledTime: initialData?.scheduledTime || '',
    duration: initialData?.duration || '00:00',
    priority: initialData?.priority || 2,
    company: initialData?.company || '',
    stage: initialData?.stage || 'New',
    notes: initialData?.notes || '',
    instructions: initialData?.instructions || ''
  })

  const [activeTab, setActiveTab] = useState('notes')

  // Auto-fill logic when equipment is selected
  const handleEquipmentChange = (equipmentName) => {
    const selected = equipment.find(eq => eq.name === equipmentName)
    if (selected) {
      setFormData(prev => ({
        ...prev,
        equipment: equipmentName,
        equipmentId: selected.id,
        category: selected.category,
        team: selected.team
      }))
    }
  }


  const handleTeamChange = (teamName) => {
    const selectedTeam = teams.find(t => t.name === teamName)
    setFormData(prev => ({
      ...prev,
      team: teamName,
      technician: selectedTeam && selectedTeam.members.length > 0 ? selectedTeam.members[0] : ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (initialData && initialData.id) {
      // Update existing request
      updateRequest(initialData.id, formData)
    } else {
      // Create new request
      addRequest(formData)
    }
    
    if (onClose) onClose()
  }

  const stages = ['New', 'In Progress', 'Repaired', 'Scrap']
  const currentStageIndex = stages.indexOf(formData.stage)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-text-sub text-sm">Maintenance Requests</span>
                <span className="bg-status-new-bg text-status-new-text px-2 py-0.5 rounded text-xs font-medium border border-status-new-text/20">
                  {formData.stage}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-text-main mt-1">
                {formData.subject || 'New Maintenance Request'}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-text-sub hover:text-text-main transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stage Progress */}
        <div className="px-6 py-3 border-b border-border bg-surface">
          <div className="flex items-center justify-between max-w-2xl">
            {stages.map((stage, index) => (
              <React.Fragment key={stage}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    index <= currentStageIndex 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-text-sub'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm font-medium ${
                    index <= currentStageIndex ? 'text-primary' : 'text-text-sub'
                  }`}>
                    {stage}
                  </span>
                </div>
                {index < stages.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    index < currentStageIndex ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-4">
              
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Subject? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter subject"
                  required
                />
              </div>

              {/* Created By */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Created By
                </label>
                <input
                  type="text"
                  value={formData.createdBy}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded bg-gray-50 text-text-sub cursor-not-allowed"
                />
              </div>

              {/* Maintenance For */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Maintenance For
                </label>
                <div className="relative">
                  <select
                    value={formData.maintenanceFor}
                    onChange={(e) => setFormData(prev => ({ ...prev, maintenanceFor: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option>Equipment</option>
                    <option>Facility</option>
                    <option>Vehicle</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Equipment <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.equipment}
                    onChange={(e) => handleEquipmentChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                    required
                  >
                    <option value="">Select equipment...</option>
                    {equipment.map(eq => (
                      <option key={eq.id} value={eq.name}>
                        {eq.name} / {eq.serialNumber}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Category (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded bg-gray-50 text-text-sub cursor-not-allowed"
                  placeholder="Auto-filled from equipment"
                />
              </div>

              {/* Request Date */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Request Date?
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Maintenance Type */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">
                  Maintenance Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="maintenanceType"
                      value="Corrective"
                      checked={formData.maintenanceType === 'Corrective'}
                      onChange={(e) => setFormData(prev => ({ ...prev, maintenanceType: e.target.value }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-text-main">Corrective</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="maintenanceType"
                      value="Preventive"
                      checked={formData.maintenanceType === 'Preventive'}
                      onChange={(e) => setFormData(prev => ({ ...prev, maintenanceType: e.target.value }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-text-main">Preventive</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              
              {/* Team (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Team
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

              {/* Technician */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Technician
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

              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Scheduled Date?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-32 px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-24 px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-center"
                    placeholder="00:00"
                  />
                  <span className="text-sm text-text-sub">hours</span>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: level }))}
                      className={`p-2 rounded border transition-colors ${
                        formData.priority >= level
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-gray-100 border-border text-text-sub'
                      }`}
                    >
                      <Star size={20} fill={formData.priority >= level ? 'currentColor' : 'none'} />
                    </button>
                  ))}
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
                  disabled
                  className="w-full px-3 py-2 border border-border rounded bg-gray-50 text-text-sub cursor-not-allowed"
                />
              </div>

            </div>
          </div>

          {/* Notes/Instructions Tabs */}
          <div className="px-6 pb-6">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex border-b border-border bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'notes'
                      ? 'bg-surface text-primary border-b-2 border-primary'
                      : 'text-text-sub hover:text-text-main'
                  }`}
                >
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('instructions')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'instructions'
                      ? 'bg-surface text-primary border-b-2 border-primary'
                      : 'text-text-sub hover:text-text-main'
                  }`}
                >
                  Instructions
                </button>
              </div>
              <div className="p-4 bg-surface">
                {activeTab === 'notes' ? (
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary min-h-32 resize-y"
                    placeholder="Add notes about this maintenance request..."
                  />
                ) : (
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary min-h-32 resize-y"
                    placeholder="Add specific instructions for the technician..."
                  />
                )}
              </div>
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
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors shadow-sm"
            >
              Save Request
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default MaintenanceRequest
