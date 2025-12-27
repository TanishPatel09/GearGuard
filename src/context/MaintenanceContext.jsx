import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const MaintenanceContext = createContext()

export const useMaintenanceContext = () => {
  const context = useContext(MaintenanceContext)
  if (!context) {
    throw new Error('useMaintenanceContext must be used within MaintenanceProvider')
  }
  return context
}

export const MaintenanceProvider = ({ children }) => {
  const { user } = useAuth()
  const [equipment, setEquipment] = useState([])
  const [teams, setTeams] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch all data when user logs in
  useEffect(() => {
    if (user) {
      fetchAllData()
    } else {
      // Clear data when user logs out
      setEquipment([])
      setTeams([])
      setRequests([])
      setLoading(false)
    }
  }, [user])

  const fetchAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchEquipment(),
      fetchTeams(),
      fetchRequests()
    ])
    setLoading(false)
  }

  // ========== EQUIPMENT ==========
  
  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setEquipment(data || [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
    }
  }

  const addEquipment = async (equipmentData) => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .insert([{ ...equipmentData, user_id: user.id }])
        .select()
      
      if (error) throw error
      setEquipment([data[0], ...equipment])
      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error adding equipment:', error)
      return { data: null, error }
    }
  }

  const updateEquipment = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      setEquipment(equipment.map(eq => eq.id === id ? data[0] : eq))
      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error updating equipment:', error)
      return { data: null, error }
    }
  }

  const deleteEquipment = async (id) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setEquipment(equipment.filter(eq => eq.id !== id))
      return { error: null }
    } catch (error) {
      console.error('Error deleting equipment:', error)
      return { error }
    }
  }

  // ========== TEAMS ==========
  
  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const addTeam = async (teamData) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ ...teamData, user_id: user.id }])
        .select()
      
      if (error) throw error
      setTeams([data[0], ...teams])
      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error adding team:', error)
      return { data: null, error }
    }
  }

  const updateTeam = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      setTeams(teams.map(team => team.id === id ? data[0] : team))
      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error updating team:', error)
      return { data: null, error }
    }
  }

  const deleteTeam = async (id) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setTeams(teams.filter(team => team.id !== id))
      return { error: null }
    } catch (error) {
      console.error('Error deleting team:', error)
      return { error }
    }
  }

  // ========== MAINTENANCE REQUESTS ==========
  
  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  const addRequest = async (requestData) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([{ ...requestData, user_id: user.id }])
        .select()
      
      if (error) throw error
      setRequests([data[0], ...requests])
      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error adding request:', error)
      return { data: null, error }
    }
  }

  const updateRequest = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      setRequests(requests.map(req => req.id === id ? data[0] : req))
      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error updating request:', error)
      return { data: null, error }
    }
  }

  const deleteRequest = async (id) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setRequests(requests.filter(req => req.id !== id))
      return { error: null }
    } catch (error) {
      console.error('Error deleting request:', error)
      return { error }
    }
  }

  const moveRequestToStage = async (id, newStage) => {
    return await updateRequest(id, { stage: newStage })
  }

  // ========== HELPER FUNCTIONS ==========
  
  const isOverdue = useCallback((request) => {
    if (!request.scheduled_date || request.stage === 'Repaired' || request.stage === 'Scrap') {
      return false
    }
    const scheduled = new Date(request.scheduled_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return scheduled < today
  }, [])

  const getEquipmentById = useCallback((id) => {
    return equipment.find(eq => eq.id === id)
  }, [equipment])

  const getRequestsByEquipment = useCallback((equipmentId) => {
    return requests.filter(req => req.equipment_id === equipmentId)
  }, [requests])

  const getOpenRequestsCount = useCallback((equipmentId) => {
    return requests.filter(
      req => req.equipment_id === equipmentId && 
      (req.stage === 'New' || req.stage === 'In Progress')
    ).length
  }, [requests])

  const getDashboardMetrics = useCallback(() => {
    const openRequests = requests.filter(r => r.stage === 'New' || r.stage === 'In Progress')
    const overdueRequests = requests.filter(isOverdue)
    const criticalEquipment = equipment.filter(eq => {
      const eqRequests = getRequestsByEquipment(eq.id)
      const hasOverdue = eqRequests.some(isOverdue)
      return hasOverdue || eqRequests.length > 2
    })

    // Calculate technician load
    const technicianWorkload = {}
    requests.filter(r => r.stage === 'In Progress').forEach(req => {
      technicianWorkload[req.technician] = (technicianWorkload[req.technician] || 0) + 1
    })
    const totalTechnicians = [...new Set(teams.flatMap(t => t.members || []))].length
    const activeTechnicians = Object.keys(technicianWorkload).length
    const technicianLoad = totalTechnicians > 0 
      ? Math.round((activeTechnicians / totalTechnicians) * 100) 
      : 0

    return {
      criticalEquipment: criticalEquipment.length,
      technicianLoad,
      openRequests: openRequests.length,
      overdueRequests: overdueRequests.length
    }
  }, [requests, equipment, teams, isOverdue, getRequestsByEquipment])

  const getReportingMetrics = useCallback(() => {
    const totalRequests = requests.length
    const completedRequests = requests.filter(r => r.stage === 'Repaired')
    
    // Calculate average resolution time
    const avgResolutionTime = completedRequests.length > 0
      ? completedRequests.reduce((sum, req) => {
          const created = new Date(req.created_date)
          const scheduled = new Date(req.scheduled_date)
          const days = Math.abs((scheduled - created) / (1000 * 60 * 60 * 24))
          return sum + days
        }, 0) / completedRequests.length
      : 0

    // Calculate compliance rate (preventive maintenance completion)
    const preventiveRequests = requests.filter(r => r.maintenance_type === 'Preventive')
    const completedPreventive = preventiveRequests.filter(r => r.stage === 'Repaired')
    const complianceRate = preventiveRequests.length > 0
      ? Math.round((completedPreventive.length / preventiveRequests.length) * 100)
      : 0

    const criticalPending = requests.filter(r => 
      (r.stage === 'New' || r.stage === 'In Progress') && 
      (isOverdue(r) || r.priority === 3)
    ).length

    return {
      totalRequests,
      avgResolutionTime: avgResolutionTime.toFixed(1),
      complianceRate,
      criticalPending
    }
  }, [requests, isOverdue])

  const value = {
    equipment,
    teams,
    requests,
    loading,
    isOverdue,
    getEquipmentById,
    getRequestsByEquipment,
    getOpenRequestsCount,
    addRequest,
    updateRequest,
    deleteRequest,
    moveRequestToStage,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addTeam,
    updateTeam,
    deleteTeam,
    getDashboardMetrics,
    getReportingMetrics,
    refreshData: fetchAllData
  }

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  )
}
