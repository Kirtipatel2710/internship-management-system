-- Create users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  image TEXT,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'tp_officer', 'super_admin')),
  department VARCHAR(100),
  student_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create internships table
CREATE TABLE IF NOT EXISTS internships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  description TEXT,
  supervisor_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert pre-registered T&P Officers and Super Admin
INSERT INTO users (email, name, role, department) VALUES
  ('tp.officer@charusat.ac.in', 'T&P Officer', 'tp_officer', 'Training & Placement'),
  ('admin@charusat.ac.in', 'Super Admin', 'super_admin', 'Administration')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_internships_student_id ON internships(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
