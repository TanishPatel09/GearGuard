import React, { useState } from 'react'
import { 
  Search, 
  ChevronDown, 
  AlertTriangle, 
  Wrench, 
  FileText, 
  Plus,
  Filter
} from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import MaintenanceRequest from './MaintenanceRequest'


const Dashboard = () => {
  const { requests, getDashboardMetrics, isOverdue } = useMaintenanceContext()
  const metrics = getDashboardMetrics()
  const [searchTerm, setSearchTerm] = useState('')
  const [showRequestForm, setShowRequestForm] = useState(false)

  // Get recent requests (last 10)
  const recentRequests = requests
    .filter(req => req.stage === 'New' || req.stage === 'In Progress')
    .slice(0, 10)
  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">



      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-8 bg-background">
        
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button 
            onClick={() => setShowRequestForm(true)}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            <span>New Request</span>
          </button>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-10 py-1.5 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main">
               <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Critical Equipment" 
            value={`${metrics.criticalEquipment} Units`} 
            subtext="Needs Attention" 
            icon={<AlertTriangle size={20} />} 
            theme="danger"
          />
          <MetricCard 
            title="Technician Load" 
            value={`${metrics.technicianLoad}% Utilized`} 
            subtext="(Assign Carefully)" 
            icon={<Wrench size={20} />} 
            theme="progress"
          />
          <MetricCard 
            title="Open Requests" 
            value={`${metrics.openRequests} Pending`} 
            subtext={<span className="text-status-danger-text font-medium">{metrics.overdueRequests} Overdue</span>}
            icon={<FileText size={20} />} 
            theme="repaired"
          />
        </div>

        {/* Dark Header Table Section */}
        <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-surface">
          <div className="bg-primary px-4 py-3 border-b border-primary-hover flex items-center justify-between">
             <h2 className="text-white font-semibold text-base">Recent Maintenance Requests</h2>
             <div className="flex items-center gap-2">
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-primary text-white">
                <tr>
                   <th className="px-4 py-3 font-semibold">Subjects <ChevronDown size={12} className="inline ml-1 opacity-70"/></th>
                   <th className="px-4 py-3 font-semibold">Employee <ChevronDown size={12} className="inline ml-1 opacity-70"/></th>
                   <th className="px-4 py-3 font-semibold">Technician <ChevronDown size={12} className="inline ml-1 opacity-70"/></th>
                   <th className="px-4 py-3 font-semibold">Category <ChevronDown size={12} className="inline ml-1 opacity-70"/></th>
                   <th className="px-4 py-3 font-semibold">Stage <ChevronDown size={12} className="inline ml-1 opacity-70"/></th>
                   <th className="px-4 py-3 font-semibold">Company <ChevronDown size={12} className="inline ml-1 opacity-70"/></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {recentRequests.map((request) => (
                  <TableRow 
                    key={request.id}
                    subject={request.subject} 
                    employee={request.createdBy} 
                    technician={request.technician} 
                    category={request.category} 
                    stage={request.stage} 
                    company={request.company}
                    isOverdue={isOverdue(request)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        

      </div>

      {/* Maintenance Request Form Modal */}
      {showRequestForm && (
        <MaintenanceRequest 
          onClose={() => setShowRequestForm(false)}
        />
      )}
    </div>
  )
}


function MetricCard({ title, value, subtext, icon, theme }) {
  const themes = {
    danger: 'bg-status-danger-bg border-status-danger-text/30 text-status-danger-text',
    progress: 'bg-status-new-bg border-status-new-text/30 text-status-new-text', // Using blue 'new' theme for progress aesthetics
    repaired: 'bg-status-repaired-bg border-status-repaired-text/30 text-status-repaired-text',
  }
  
  return (
    <div className={`p-5 rounded-lg border ${themes[theme]} shadow-sm flex flex-col justify-between h-32`}>
      <div className="flex items-center gap-2 font-medium opacity-90">
         {icon}
         <span>{title}</span>
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm opacity-80 mt-1">{subtext}</div>
      </div>
    </div>
  )
}

function TableRow({ subject, employee, technician, category, stage, company }) {
  return (
    <tr className="hover:bg-background transition-colors">
      <td className="px-4 py-3 text-text-main">{subject}</td>
      <td className="px-4 py-3 text-text-sub">{employee}</td>
      <td className="px-4 py-3 flex items-center gap-2 text-text-main font-medium">
         <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="avatar" className="w-6 h-6 rounded-full" />
         {technician}
      </td>
      <td className="px-4 py-3 text-text-sub">{category}</td>
      <td className="px-4 py-3">
         <span className="bg-status-new-bg text-status-new-text px-2 py-0.5 rounded-full text-xs font-medium border border-status-new-text/20">
           {stage}
         </span>
      </td>
      <td className="px-4 py-3 text-text-sub">{company}</td>
    </tr>
  )
}

export default Dashboard