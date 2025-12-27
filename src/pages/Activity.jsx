import React, { useState, useMemo } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import MaintenanceRequest from './MaintenanceRequest'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Activity = () => {
  const { requests, isOverdue } = useMaintenanceContext()
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [view, setView] = useState('month')

  // Convert requests to calendar events
  const events = useMemo(() => {
    return requests
      .filter(req => req.scheduledDate)
      .map(req => {
        const startDate = new Date(req.scheduledDate)
        if (req.scheduledTime) {
          const [hours, minutes] = req.scheduledTime.split(':')
          startDate.setHours(parseInt(hours), parseInt(minutes))
        }

        // Calculate end time based on duration
        const endDate = new Date(startDate)
        if (req.duration && req.duration !== '00:00') {
          const [hours, minutes] = req.duration.split(':')
          endDate.setHours(endDate.getHours() + parseInt(hours))
          endDate.setMinutes(endDate.getMinutes() + parseInt(minutes))
        } else {
          endDate.setHours(endDate.getHours() + 1) // Default 1 hour
        }

        return {
          id: req.id,
          title: req.subject,
          start: startDate,
          end: endDate,
          resource: req
        }
      })
  }, [requests])

  // Event style getter for color coding
  const eventStyleGetter = (event) => {
    const request = event.resource
    let backgroundColor = '#714B67' // primary
    
    if (isOverdue(request)) {
      backgroundColor = '#B91C1C' // danger
    } else if (request.stage === 'Repaired') {
      backgroundColor = '#15803D' // success
    } else if (request.stage === 'In Progress') {
      backgroundColor = '#D97706' // warning
    } else if (request.stage === 'New') {
      backgroundColor = '#2563EB' // info
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.875rem',
        padding: '2px 5px'
      }
    }
  }

  // Handle slot selection (clicking on a date)
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start.toISOString().split('T')[0])
    setSelectedRequest(null)
    setShowForm(true)
  }

  // Handle event selection (clicking on an existing event)
  const handleSelectEvent = (event) => {
    setSelectedRequest(event.resource)
    setSelectedDate(null)
    setShowForm(true)
  }

  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text-main">Maintenance Calendar</h1>
            <p className="text-sm text-text-sub mt-1">Schedule and view preventive maintenance</p>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#2563EB]"></div>
              <span className="text-text-sub">New</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#D97706]"></div>
              <span className="text-text-sub">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#15803D]"></div>
              <span className="text-text-sub">Repaired</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#B91C1C]"></div>
              <span className="text-text-sub">Overdue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 p-6">
        <div className="bg-surface border border-border rounded-lg p-4 h-[calc(100vh-200px)]">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            view={view}
            onView={setView}
            views={['month', 'week', 'day', 'agenda']}
            popup
            tooltipAccessor={(event) => `${event.title} - ${event.resource.equipment}`}
          />
        </div>
      </div>

      {/* Maintenance Request Form Modal */}
      {showForm && (
        <MaintenanceRequest 
          onClose={() => {
            setShowForm(false)
            setSelectedRequest(null)
            setSelectedDate(null)
          }}
          initialData={selectedRequest || (selectedDate ? { scheduledDate: selectedDate, maintenanceType: 'Preventive' } : null)}
        />
      )}

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          padding: 10px 3px;
          font-weight: 600;
          color: #1F2937;
          border-bottom: 2px solid #714B67;
          background: #F2EAF0;
        }
        .rbc-today {
          background-color: #F2EAF0;
        }
        .rbc-off-range-bg {
          background: #F9FAFB;
        }
        .rbc-event {
          padding: 2px 5px;
          font-size: 0.875rem;
        }
        .rbc-event:focus {
          outline: 2px solid #714B67;
        }
        .rbc-toolbar button {
          color: #1F2937;
          border: 1px solid #E5E7EB;
          padding: 6px 12px;
          border-radius: 4px;
          background: white;
        }
        .rbc-toolbar button:hover {
          background: #F3F4F6;
        }
        .rbc-toolbar button.rbc-active {
          background: #714B67;
          color: white;
          border-color: #714B67;
        }
        .rbc-toolbar button.rbc-active:hover {
          background: #5E3E55;
        }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
        }
        .rbc-time-slot {
          border-top: 1px solid #F3F4F6;
        }
        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid #F3F4F6;
        }
        .rbc-current-time-indicator {
          background-color: #714B67;
        }
      `}</style>
    </div>
  )
}

export default Activity