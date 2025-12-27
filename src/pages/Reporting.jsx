import React from 'react'
import { 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'

const Reporting = () => {
  const { requests, getReportingMetrics, isOverdue } = useMaintenanceContext()
  const metrics = getReportingMetrics()
  
  // Get recent requests for process tracker
  const trackerRequests = requests.slice(0, 10)
  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      
      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 pb-6 space-y-6 bg-background">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ReportCard 
            title="Total Requests" 
            value={metrics.totalRequests.toString()} 
            trend="+12%" 
            icon={<FileTextIcon />}
            color="blue"
          />
          <ReportCard 
            title="Avg Resolution Time" 
            value={`${metrics.avgResolutionTime} Days`} 
            trend="-8%" 
            trendPositive={true}
            icon={<Clock size={20} />} 
            color="orange"
          />
          <ReportCard 
            title="Compliance Rate" 
            value={`${metrics.complianceRate}%`} 
            trend="+2%" 
            icon={<CheckCircle size={20} />} 
            color="green"
          />
          <ReportCard 
            title="Critical Pending" 
            value={metrics.criticalPending.toString()} 
            subtext="Needs Attention"
            icon={<AlertCircle size={20} />} 
            color="red"
          />
        </div>

        {/* Process Tracking Table */}
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-base text-text-main">Request Process Tracker</h2>
            <button className="text-text-sub hover:text-primary transition-colors">
              <Filter size={18} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-text-sub font-medium border-b border-border">
                <tr>
                   <th className="px-4 py-3">Request ID</th>
                   <th className="px-4 py-3">Equipment</th>
                   <th className="px-4 py-3">Request Date</th>
                   <th className="px-4 py-3">Assigned To</th>
                   <th className="px-4 py-3">Stage</th>
                   <th className="px-4 py-3">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                 {trackerRequests.map((request) => (
                   <TrackingRow 
                      key={request.id}
                      id={`#REQ-${request.id}`}
                      equipment={request.equipment}
                      date={new Date(request.request_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      assignee={request.technician || 'Unassigned'}
                      stage={request.stage}
                      progress={request.stage === 'Repaired' ? 100 : request.stage === 'In Progress' ? 65 : request.stage === 'New' ? 10 : 0}
                      isOverdue={isOverdue(request)}
                   />
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportCard({ title, value, trend, trendPositive, color, icon, subtext }) {
    const colorClasses = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
        green: "text-green-600 bg-green-50 border-green-100",
        red: "text-red-600 bg-red-50 border-red-100",
    }
    
    // Default trend logic: up is green unless trendPositive is false (e.g. for time, down is good)
    const isGood = trendPositive ?? (!trend?.startsWith('-')); 
    const trendColor = isGood ? 'text-green-600' : 'text-red-600';

    return (
        <div className={`p-4 rounded-lg border bg-surface flex flex-col justify-between h-32 hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start">
               <div>
                   <p className="text-text-sub text-sm font-medium">{title}</p>
                   <h3 className="text-xl font-bold mt-1 text-text-main">{value}</h3>
               </div>
               <div className={`p-2 rounded-full ${colorClasses[color]}`}>
                   {icon}
               </div>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
                {trend && (
                    <span className={`flex items-center ${trendColor} bg-gray-50 px-1.5 py-0.5 rounded text-xs font-semibold`}>
                        {trend.startsWith('+') ? <TrendingUp size={12} className="mr-1"/> : <TrendingUp size={12} className="mr-1 rotate-180"/>}
                        {trend}
                    </span>
                )}
                {subtext && <span className="text-text-sub text-xs">{subtext}</span>}
                {!subtext && !trend && <span className="text-text-sub text-xs">No change</span>}
            </div>
        </div>
    )
}

function TrackingRow({ id, equipment, date, assignee, stage, progress, isOverdue }) {
    const stageColors = {
        'New': 'bg-status-new-bg text-status-new-text border-status-new-text/20',
        'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'Repaired': 'bg-status-repaired-bg text-status-repaired-text border-status-repaired-text/20',
        'Critical': 'bg-status-danger-bg text-status-danger-text border-status-danger-text/20',
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 font-medium text-primary">{id}</td>
            <td className="px-4 py-3 text-text-main">{equipment}</td>
            <td className="px-4 py-3 text-text-sub">
                {date}
                {isOverdue && <span className="block text-[10px] font-bold text-red-600 uppercase">Overdue</span>}
            </td>
            <td className="px-4 py-3 text-text-main flex items-center gap-2">
                {assignee !== 'Unassigned' && <div className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center font-bold text-gray-600">{assignee.charAt(0)}</div>}
                {assignee}
            </td>
            <td className="px-4 py-3">
                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${stageColors[stage] || 'bg-gray-100 text-gray-600'}`}>
                   {stage}
                 </span>
            </td>
            <td className="px-4 py-3 w-48">
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : progress > 50 ? 'bg-blue-500' : progress > 0 ? 'bg-orange-400' : 'bg-gray-300'}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-text-sub w-8 text-right">{progress}%</span>
                </div>
            </td>
        </tr>
    )
}

function FileTextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
    )
}

export default Reporting
