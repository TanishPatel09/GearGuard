import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import { Search, ChevronDown, Plus, Filter, Star, AlertCircle } from 'lucide-react'
import MaintenanceRequest from './MaintenanceRequest'

const WorkCenter = () => {
  const { requests, moveRequestToStage, isOverdue } = useMaintenanceContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [filterTeam, setFilterTeam] = useState('All')

  const stages = ['New', 'In Progress', 'Repaired', 'Scrap']

  // Group requests by stage
  const requestsByStage = stages.reduce((acc, stage) => {
    acc[stage] = requests.filter(req => {
      const matchesStage = req.stage === stage
      const matchesSearch = req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           req.equipment.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTeam = filterTeam === 'All' || req.team === filterTeam
      return matchesStage && matchesSearch && matchesTeam
    })
    return acc
  }, {})

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId !== destination.droppableId) {
      const requestId = parseInt(draggableId.replace('request-', ''))
      moveRequestToStage(requestId, destination.droppableId)
    }
  }

  const handleCardClick = (request) => {
    setSelectedRequest(request)
    setShowForm(true)
  }

  const handleNewRequest = () => {
    setSelectedRequest(null)
    setShowForm(true)
  }

  const stageColors = {
    'New': 'bg-status-new-bg border-status-new-text',
    'In Progress': 'bg-status-progress-bg border-status-progress-text',
    'Repaired': 'bg-status-repaired-bg border-status-repaired-text',
    'Scrap': 'bg-status-danger-bg border-status-danger-text'
  }

  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      
      {/* Action Bar */}
      <div className="px-6 py-4 border-b border-border bg-surface sticky top-0 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button 
            onClick={handleNewRequest}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            <span>New Request</span>
          </button>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub" size={18} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-1.5 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option>All</option>
                <option>Internal Maintenance</option>
                <option>Metrology</option>
                <option>Subcontractor</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 min-w-max">
            {stages.map(stage => (
              <div key={stage} className="flex-1 min-w-[300px]">
                {/* Column Header */}
                <div className={`px-4 py-3 rounded-t-lg border-t-4 ${stageColors[stage]} flex items-center justify-between`}>
                  <h3 className="font-semibold text-text-main">{stage}</h3>
                  <span className="bg-surface px-2 py-0.5 rounded-full text-xs font-medium text-text-sub">
                    {requestsByStage[stage].length}
                  </span>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-gray-50 rounded-b-lg border border-t-0 border-border min-h-[500px] p-3 space-y-3 ${
                        snapshot.isDraggingOver ? 'bg-primary/5' : ''
                      }`}
                    >
                      {requestsByStage[stage].map((request, index) => (
                        <Draggable 
                          key={request.id} 
                          draggableId={`request-${request.id}`} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleCardClick(request)}
                              className={`cursor-pointer ${snapshot.isDragging ? 'opacity-50' : ''}`}
                            >
                              <RequestCard request={request} isOverdue={isOverdue(request)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {requestsByStage[stage].length === 0 && (
                        <div className="text-center py-8 text-text-sub text-sm">
                          No requests in this stage
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Maintenance Request Form Modal */}
      {showForm && (
        <MaintenanceRequest 
          onClose={() => {
            setShowForm(false)
            setSelectedRequest(null)
          }}
          initialData={selectedRequest}
        />
      )}
    </div>
  )
}

// Request Card Component
function RequestCard({ request, isOverdue }) {
  const priorityStars = Array(request.priority).fill(0)

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header with Priority and Overdue */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1">
          {priorityStars.map((_, i) => (
            <Star key={i} size={14} fill="#714B67" className="text-primary" />
          ))}
        </div>
        {isOverdue && (
          <div className="flex items-center gap-1 bg-status-danger-bg text-status-danger-text px-2 py-0.5 rounded text-xs font-medium">
            <AlertCircle size={12} />
            Overdue
          </div>
        )}
      </div>

      {/* Subject */}
      <h4 className="font-semibold text-text-main mb-1 line-clamp-2">
        {request.subject}
      </h4>

      {/* Equipment */}
      <p className="text-sm text-text-sub mb-3">
        {request.equipment}
      </p>

      {/* Category Tag */}
      <div className="mb-3">
        <span className="bg-primary-subtle text-primary px-2 py-0.5 rounded text-xs font-medium border border-primary/20">
          {request.category}
        </span>
      </div>

      {/* Technician */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
          {request.technician.charAt(0)}
        </div>
        <span className="text-sm text-text-main">{request.technician}</span>
      </div>

      {/* Scheduled Date */}
      {request.scheduledDate && (
        <div className="mt-2 text-xs text-text-sub">
          📅 {new Date(request.scheduledDate).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}

export default WorkCenter