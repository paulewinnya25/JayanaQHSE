-- =============================================
-- Script d'initialisation Supabase pour Jayana QHSE
-- Exécutez ce script dans le SQL Editor de Supabase
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  chantier_id INTEGER,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chantiers table
CREATE TABLE IF NOT EXISTS chantiers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risks table
CREATE TABLE IF NOT EXISTS risks (
  id SERIAL PRIMARY KEY,
  chantier_id INTEGER REFERENCES chantiers(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  probability INTEGER DEFAULT 1,
  severity INTEGER DEFAULT 1,
  criticality INTEGER,
  status VARCHAR(50) DEFAULT 'open',
  responsible_user_id INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id SERIAL PRIMARY KEY,
  chantier_id INTEGER REFERENCES chantiers(id),
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  inspector_id INTEGER REFERENCES users(id),
  date_planned DATE,
  date_realized DATE,
  status VARCHAR(50) DEFAULT 'planned',
  findings TEXT,
  photos TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id SERIAL PRIMARY KEY,
  chantier_id INTEGER REFERENCES chantiers(id),
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date_incident TIMESTAMP NOT NULL,
  location VARCHAR(255),
  severity VARCHAR(50),
  reported_by INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'reported',
  photos TEXT[],
  medical_report TEXT,
  investigation TEXT,
  root_cause TEXT,
  corrective_actions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trainings table
CREATE TABLE IF NOT EXISTS trainings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  duration INTEGER,
  provider VARCHAR(255),
  date_planned DATE,
  date_realized DATE,
  status VARCHAR(50) DEFAULT 'planned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training participants table
CREATE TABLE IF NOT EXISTS training_participants (
  id SERIAL PRIMARY KEY,
  training_id INTEGER REFERENCES trainings(id),
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'registered',
  certificate_url TEXT,
  completed_at TIMESTAMP,
  expires_at DATE
);

-- Non conformities table
CREATE TABLE IF NOT EXISTS non_conformities (
  id SERIAL PRIMARY KEY,
  chantier_id INTEGER REFERENCES chantiers(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  severity VARCHAR(50),
  detected_by INTEGER REFERENCES users(id),
  responsible_user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'open',
  corrective_action TEXT,
  due_date DATE,
  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Environmental data table
CREATE TABLE IF NOT EXISTS environmental_data (
  id SERIAL PRIMARY KEY,
  chantier_id INTEGER REFERENCES chantiers(id),
  type VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  value DECIMAL(10,2),
  unit VARCHAR(50),
  date_recorded DATE NOT NULL,
  recorded_by INTEGER REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  chantier_id INTEGER REFERENCES chantiers(id),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  category VARCHAR(100),
  file_url TEXT,
  version VARCHAR(50),
  status VARCHAR(50) DEFAULT 'draft',
  uploaded_by INTEGER REFERENCES users(id),
  validated_by INTEGER REFERENCES users(id),
  validated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  chantier_id INTEGER REFERENCES chantiers(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  serial_number VARCHAR(100),
  manufacturer VARCHAR(255),
  purchase_date DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  status VARCHAR(50) DEFAULT 'active',
  responsible_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance records table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER REFERENCES equipment(id),
  type VARCHAR(100),
  description TEXT,
  performed_by INTEGER REFERENCES users(id),
  date_performed DATE NOT NULL,
  next_due_date DATE,
  cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contractors table
CREATE TABLE IF NOT EXISTS contractors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  chantier_id INTEGER REFERENCES chantiers(id),
  type VARCHAR(100),
  certifications TEXT[],
  access_level VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Note: Le mot de passe doit être hashé avec bcrypt
-- Vous pouvez le faire via l'API d'authentification ou manuellement

-- Insert default chantier
INSERT INTO chantiers (name, address, city, status)
VALUES ('Chantier Principal', '123 Rue du Chantier', 'Paris', 'active')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformities ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (vous pouvez les ajuster selon vos besoins)
-- Pour l'instant, nous créons des politiques permissives pour le développement
-- ATTENTION: À modifier pour la production selon vos besoins de sécurité

-- Policy pour users (tous peuvent lire, seuls les admins peuvent modifier)
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Admins can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update users" ON users FOR UPDATE USING (true);

-- Répétez pour les autres tables selon vos besoins
-- Pour le développement, vous pouvez désactiver temporairement RLS

-- Note: Pour désactiver RLS temporairement (DÉVELOPPEMENT UNIQUEMENT):
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

