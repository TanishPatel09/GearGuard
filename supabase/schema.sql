# GearGuard - Supabase Database Schema

Run this SQL in your Supabase SQL Editor to create all tables, policies, and indexes.

---

## 1. Enable UUID Extension

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 2. Create Tables

### Equipment Table

```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  department TEXT,
  employee TEXT,
  team TEXT,
  technician TEXT,
  purchase_date DATE,
  warranty_expiration DATE,
  location TEXT,
  company TEXT NOT NULL DEFAULT 'My Company (San Francisco)',
  status TEXT DEFAULT 'Active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### Teams Table

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  members TEXT[] DEFAULT '{}',
  company TEXT NOT NULL DEFAULT 'My Company (San Francisco)',
  specialization TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### Maintenance Requests Table

```sql
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  equipment TEXT NOT NULL,
  category TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_date DATE DEFAULT CURRENT_DATE,
  request_date DATE NOT NULL,
  maintenance_for TEXT DEFAULT 'Equipment',
  maintenance_type TEXT DEFAULT 'Corrective',
  team TEXT,
  technician TEXT,
  scheduled_date DATE,
  scheduled_time TEXT,
  duration TEXT DEFAULT '00:00',
  priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
  stage TEXT DEFAULT 'New' CHECK (stage IN ('New', 'In Progress', 'Repaired', 'Scrap')),
  company TEXT NOT NULL DEFAULT 'My Company (San Francisco)',
  notes TEXT,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);
```

---

## 3. Create Indexes

```sql
-- Equipment indexes
CREATE INDEX idx_equipment_user ON equipment(user_id);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_status ON equipment(status);

-- Teams indexes
CREATE INDEX idx_teams_user ON teams(user_id);

-- Maintenance Requests indexes
CREATE INDEX idx_requests_user ON maintenance_requests(user_id);
CREATE INDEX idx_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX idx_requests_stage ON maintenance_requests(stage);
CREATE INDEX idx_requests_scheduled ON maintenance_requests(scheduled_date);
```

---

## 4. Enable Row Level Security

```sql
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
```

---

## 5. Create RLS Policies

### Equipment Policies

```sql
-- SELECT policy
CREATE POLICY "Users can view their own equipment"
  ON equipment FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert their own equipment"
  ON equipment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own equipment"
  ON equipment FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete their own equipment"
  ON equipment FOR DELETE
  USING (auth.uid() = user_id);
```

### Teams Policies

```sql
-- SELECT policy
CREATE POLICY "Users can view their own teams"
  ON teams FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert their own teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own teams"
  ON teams FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete their own teams"
  ON teams FOR DELETE
  USING (auth.uid() = user_id);
```

### Maintenance Requests Policies

```sql
-- SELECT policy
CREATE POLICY "Users can view their own requests"
  ON maintenance_requests FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert their own requests"
  ON maintenance_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own requests"
  ON maintenance_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete their own requests"
  ON maintenance_requests FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 6. Create Updated_At Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to equipment
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to teams
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to maintenance_requests
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON maintenance_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 7. Seed Sample Data (Optional)

```sql
-- Insert sample teams
INSERT INTO teams (name, members, company, specialization, user_id)
VALUES 
  (
    'Internal Maintenance',
    ARRAY['Anas Maskari', 'Mitchell Aldrin', 'Marc Deco', 'Aka Foster'],
    'My Company (San Francisco)',
    'General Maintenance',
    auth.uid()
  ),
  (
    'Metrology',
    ARRAY['Marc Deco', 'Sarah Connor'],
    'My Company (San Francisco)',
    'Precision Equipment',
    auth.uid()
  ),
  (
    'Subcontractor',
    ARRAY['Maggie Davidson', 'Tom Hardy'],
    'My Company (San Francisco)',
    'External Services',
    auth.uid()
  );

-- Insert sample equipment
INSERT INTO equipment (name, serial_number, category, department, employee, team, technician, purchase_date, warranty_expiration, location, status, user_id)
VALUES 
  (
    'Samsung Monitor 15"',
    'MT/125/22779837',
    'Monitors',
    'Admin',
    'Tejas Medi',
    'Internal Maintenance',
    'Mitchell Aldrin',
    '2022-01-15',
    '2025-01-15',
    'Building A, Floor 2, Room 205',
    'Active',
    auth.uid()
  ),
  (
    'Acer Laptop',
    'LP/203/19281928',
    'Computers',
    'Technician',
    'Bhavik P',
    'Internal Maintenance',
    'Marc Deco',
    '2023-03-20',
    '2026-03-20',
    'Building B, Floor 1, Desk 12',
    'Active',
    auth.uid()
  ),
  (
    'CNC Machine 1',
    'CNC/001/88776655',
    'Machinery',
    'Production',
    NULL,
    'Metrology',
    'Anas Maskari',
    '2021-06-10',
    '2024-06-10',
    'Factory Floor, Zone A',
    'Active',
    auth.uid()
  );

-- Insert sample maintenance requests
INSERT INTO maintenance_requests (subject, equipment_id, equipment, category, created_by, request_date, maintenance_type, team, technician, scheduled_date, scheduled_time, priority, stage, user_id)
SELECT 
  'Monitor flickering issue',
  id,
  'Samsung Monitor 15"',
  'Monitors',
  'Mitchell Admin',
  '2025-12-20',
  'Corrective',
  'Internal Maintenance',
  'Mitchell Aldrin',
  '2025-12-22',
  '10:00',
  2,
  'New',
  auth.uid()
FROM equipment WHERE serial_number = 'MT/125/22779837';
```

---

## Verification Queries

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('equipment', 'teams', 'maintenance_requests');

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('equipment', 'teams', 'maintenance_requests');

-- Check policies exist
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- Count records
SELECT 
  (SELECT COUNT(*) FROM equipment) as equipment_count,
  (SELECT COUNT(*) FROM teams) as teams_count,
  (SELECT COUNT(*) FROM maintenance_requests) as requests_count;
```
