import React, { useState } from 'react'
import { Search, ChevronDown, Plus } from 'lucide-react'

const EquimentCategory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mock Data
  const categories = [
    { id: 1, name: 'Computers', responsible: 'OdooBot', company: 'My Company (San Francisco)' },
    { id: 2, name: 'Software', responsible: 'OdooBot', company: 'My Company (San Francisco)' },
    { id: 3, name: 'Monitors', responsible: 'Mitchell Admin', company: 'My Company (San Francisco)' },
  ]

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      <div className="flex-1 px-6 pt-6 pb-6">
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          
          {/* Action Bar */}
          <div className="px-4 py-3 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer shadow-sm">
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
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-text-sub font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Responsible</th>
                  <th className="px-4 py-3">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-medium text-text-main">{cat.name}</td>
                    <td className="px-4 py-3 text-text-sub">{cat.responsible}</td>
                    <td className="px-4 py-3 text-text-sub">{cat.company}</td>
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

export default EquimentCategory