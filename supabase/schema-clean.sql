CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  company TEXT,
  status TEXT DEFAULT 'Active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  members TEXT[] DEFAULT '{}',
  company TEXT,
  specialization TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

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
  company TEXT,
  notes TEXT,
  instructions TEXT,
  worksheet JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_equipment_user ON equipment(user_id);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_teams_user ON teams(user_id);
CREATE INDEX idx_requests_user ON maintenance_requests(user_id);
CREATE INDEX idx_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX idx_requests_stage ON maintenance_requests(stage);
CREATE INDEX idx_requests_scheduled ON maintenance_requests(scheduled_date);

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own equipment"
  ON equipment FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own equipment"
  ON equipment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own equipment"
  ON equipment FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own equipment"
  ON equipment FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own teams"
  ON teams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
  ON teams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams"
  ON teams FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own requests"
  ON maintenance_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own requests"
  ON maintenance_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
  ON maintenance_requests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests"
  ON maintenance_requests FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON maintenance_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE work_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  tag TEXT,
  alternative TEXT,
  cost NUMERIC DEFAULT 0,
  capacity NUMERIC DEFAULT 1,
  efficiency NUMERIC DEFAULT 100,
  oee_target NUMERIC DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_work_centers_user ON work_centers(user_id);

ALTER TABLE work_centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own work centers"
  ON work_centers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own work centers"
  ON work_centers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work centers"
  ON work_centers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work centers"
  ON work_centers FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_work_centers_updated_at BEFORE UPDATE ON work_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
