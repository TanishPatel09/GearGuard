import { supabase } from '../lib/supabase'

export const seedDatabase = async () => {
  console.log('Starting seed...')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('You must be logged in to seed data.')
    return
  }
  const userId = user.id

  // 1. Teams
  const teamsData = [
    { name: 'Electrical Maintenance', members: ['Rajesh Kumar', 'Amit Patel', 'Sanjay Gupta'], specialization: 'Electrical', user_id: userId },
    { name: 'Mechanical Crew', members: ['Vikram Singh', 'Suresh Reddy', 'Mohan Lal'], specialization: 'Mechanical', user_id: userId },
    { name: 'IT Support', members: ['Priya Sharma', 'Anjali Desai', 'Rahul Verma'], specialization: 'Software/Hardware', user_id: userId },
    { name: 'Facility Ops', members: ['Mohammed Rafiq', 'John Fernandes'], specialization: 'HVAC/Plumbing', user_id: userId }
  ]
  
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .insert(teamsData)
    .select()

  if (teamsError) {
    console.error('Teams Seed Error:', teamsError)
    alert('Error seeding teams')
    return
  }

  // 2. Work Centers
  const workCenterData = [
    { name: 'Drill Station 1', code: 'DS-001', tag: 'Drilling', alternative: '', cost: 45.00, capacity: 50, efficiency: 95, oee_target: 90, user_id: userId },
    { name: 'Assembly Line 1', code: 'AL-001', tag: 'Assembly', alternative: 'Assembly Line 2', cost: 120.00, capacity: 100, efficiency: 88, oee_target: 85, user_id: userId },
    { name: 'Packaging Unit', code: 'PK-001', tag: 'Packaging', alternative: '', cost: 60.00, capacity: 80, efficiency: 98, oee_target: 95, user_id: userId },
    { name: 'Painting Booth', code: 'PB-001', tag: 'Finishing', alternative: '', cost: 85.00, capacity: 40, efficiency: 92, oee_target: 90, user_id: userId }
  ]

  const { data: workCenters, error: wcError } = await supabase
    .from('work_centers')
    .insert(workCenterData)
    .select()

  if (wcError) {
    console.error('Work Center Seed Error:', wcError)
    alert('Error seeding work centers')
    return
  }

  // 3. Equipment
  const equipmentData = [
    { name: 'CNC Lathe M1', serial_number: 'CNC-2023-001', category: 'Machinery', department: 'Production', location: 'Shop Floor A', team: 'Mechanical Crew', technician: 'Vikram Singh', status: 'Active', user_id: userId },
    { name: 'Hydraulic Press HP-50', serial_number: 'HYD-2022-X5', category: 'Machinery', department: 'Production', location: 'Shop Floor B', team: 'Mechanical Crew', technician: 'Suresh Reddy', status: 'Under Maintenance', user_id: userId },
    { name: 'Dell Latitude 7420', serial_number: 'DL-IT-992', category: 'Computers', department: 'IT', location: 'Server Room', team: 'IT Support', technician: 'Priya Sharma', status: 'Active', user_id: userId },
    { name: 'HP LaserJet Pro', serial_number: 'HP-PRT-44', category: 'Computers', department: 'Admin', location: 'Office 101', team: 'IT Support', technician: 'Rahul Verma', status: 'Active', user_id: userId },
    { name: 'Forklift Toyota 3T', serial_number: 'FL-LOG-88', category: 'Vehicles', department: 'Logistics', location: 'Warehouse 1', team: 'Mechanical Crew', technician: 'Mohan Lal', status: 'Active', user_id: userId },
    { name: 'Main Server Rack', serial_number: 'SRV-001', category: 'Computers', department: 'IT', location: 'Data Center', team: 'IT Support', technician: 'Anjali Desai', status: 'Active', user_id: userId },
    { name: 'HVAC Unit - Roof', serial_number: 'AC-RF-02', category: 'Other', department: 'Facility', location: 'Rooftop', team: 'Facility Ops', technician: 'Mohammed Rafiq', status: 'Active', user_id: userId },
    { name: 'Assembly Line Belt', serial_number: 'AS-BLT-99', category: 'Machinery', department: 'Production', location: 'Line 3', team: 'Mechanical Crew', technician: 'Vikram Singh', status: 'Scrapped', user_id: userId },
  ]

  const { data: equipment, error: equipError } = await supabase
    .from('equipment')
    .insert(equipmentData)
    .select()

  if (equipError) {
    console.error('Equipment Seed Error:', equipError)
    alert('Error seeding equipment')
    return
  }

  // Helper to get ID
  const getEq = (name) => equipment.find(e => e.name === name)

  // Dates
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  const overdueDate = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]

  // 3. Requests
  const requestsData = [
    {
      subject: 'Oil Leakage in Hydraulic Pump',
      equipment: 'Hydraulic Press HP-50',
      equipment_id: getEq('Hydraulic Press HP-50')?.id,
      category: 'Machinery',
      created_by: 'Amit Patel',
      request_date: lastWeek,
      maintenance_type: 'Corrective',
      team: 'Mechanical Crew',
      technician: 'Suresh Reddy',
      priority: 3,
      stage: 'In Progress',
      scheduled_date: today,
      scheduled_time: '14:00',
      duration: '02:30',
      user_id: userId,
      worksheet: [{id: 1, title: 'Check seal integrity', isDone: true}, {id: 2, title: 'Drain old oil', isDone: true}, {id: 3, title: 'Replace filter', isDone: false}]
    },
    {
      subject: 'Server Overheating Alarm',
      equipment: 'Main Server Rack',
      equipment_id: getEq('Main Server Rack')?.id,
      category: 'Computers',
      created_by: 'System monitor',
      request_date: yesterday,
      maintenance_type: 'Corrective',
      team: 'IT Support',
      technician: 'Anjali Desai',
      priority: 3,
      stage: 'New',
      scheduled_date: today,
      user_id: userId,
      worksheet: [{id: 1, title: 'Check cooling fans', isDone: false}]
    },
    {
      subject: 'Monthly Forklift Battery Check',
      equipment: 'Forklift Toyota 3T',
      equipment_id: getEq('Forklift Toyota 3T')?.id,
      category: 'Vehicles',
      created_by: 'Logistics Manager',
      request_date: today,
      maintenance_type: 'Preventive',
      team: 'Mechanical Crew',
      technician: 'Mohan Lal',
      priority: 2,
      stage: 'New',
      scheduled_date: nextWeek,
      user_id: userId
    },
    {
      subject: 'AC Unit Noise Complaint',
      equipment: 'HVAC Unit - Roof',
      equipment_id: getEq('HVAC Unit - Roof')?.id,
      category: 'Other',
      created_by: 'Office Admin',
      request_date: overdueDate,
      maintenance_type: 'Corrective',
      team: 'Facility Ops',
      technician: 'Mohammed Rafiq',
      priority: 1,
      stage: 'New',
      scheduled_date: overdueDate, 
      user_id: userId,
      notes: 'Loud rattling noise reported by 3rd floor staff.'
    },
    {
      subject: 'Replace Conveyor Belt',
      equipment: 'Assembly Line Belt',
      equipment_id: getEq('Assembly Line Belt')?.id,
      category: 'Machinery',
      created_by: 'Production Lead',
      request_date: lastWeek,
      maintenance_type: 'Corrective',
      team: 'Mechanical Crew',
      technician: 'Vikram Singh',
      priority: 2,
      stage: 'Scrap',
      scheduled_date: yesterday,
      user_id: userId,
      notes: 'Belt snapped beyond repair. Equipment scrapped.'
    },
    {
      subject: 'Keyboard not working',
      equipment: 'Dell Latitude 7420',
      equipment_id: getEq('Dell Latitude 7420')?.id,
      category: 'Computers',
      created_by: 'Priya Sharma',
      request_date: lastWeek,
      maintenance_type: 'Corrective',
      team: 'IT Support',
      technician: 'Priya Sharma',
      priority: 1,
      stage: 'Repaired',
      scheduled_date: yesterday,
      duration: '00:45',
      user_id: userId
    },
    {
       subject: 'Routine CNC Calibration',
       equipment: 'CNC Lathe M1',
       equipment_id: getEq('CNC Lathe M1')?.id,
       category: 'Machinery',
       created_by: 'Quality Control',
       request_date: today,
       maintenance_type: 'Preventive',
       team: 'Mechanical Crew',
       technician: 'Vikram Singh',
       priority: 2,
       stage: 'In Progress',
       scheduled_date: today,
       user_id: userId
    }
  ]

  const { error: reqError } = await supabase
    .from('maintenance_requests')
    .insert(requestsData)

  if (reqError) {
    console.error('Requests Seed Error:', reqError)
    alert('Error seeding requests')
    return
  }

  alert('Database seeded successfully with test data!')
  window.location.reload()
}
