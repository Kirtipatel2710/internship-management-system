-- Create T&P Officer specific tables

-- NOC Requests table
CREATE TABLE IF NOT EXISTS noc_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    enrollment_no VARCHAR(50) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    internship_role VARCHAR(255) NOT NULL,
    internship_duration VARCHAR(100) NOT NULL,
    internship_location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    stipend VARCHAR(100),
    description TEXT,
    company_contact_email VARCHAR(255),
    company_contact_phone VARCHAR(20),
    documents JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES auth.users(id),
    rejected_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table for verification
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    website VARCHAR(255),
    industry VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    employee_count VARCHAR(50),
    founded_year INTEGER,
    description TEXT,
    documents JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    previous_internships INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    verified_by UUID REFERENCES auth.users(id),
    verified_date TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES auth.users(id),
    rejected_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Internship opportunities table
CREATE TABLE IF NOT EXISTS internship_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('full-time', 'part-time', 'remote', 'hybrid')),
    duration VARCHAR(100) NOT NULL,
    stipend VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    skills_required TEXT[],
    eligibility_criteria TEXT,
    max_applicants INTEGER NOT NULL,
    current_applicants INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    posted_by UUID REFERENCES auth.users(id),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Internship applications table
CREATE TABLE IF NOT EXISTS internship_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    internship_id UUID REFERENCES internship_opportunities(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    enrollment_no VARCHAR(50) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    cgpa DECIMAL(3,2),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    resume_url VARCHAR(500),
    cover_letter TEXT,
    skills TEXT[],
    projects JSONB DEFAULT '[]',
    experience TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES auth.users(id),
    rejected_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_noc_requests_status ON noc_requests(status);
CREATE INDEX IF NOT EXISTS idx_noc_requests_student_id ON noc_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_noc_requests_created_at ON noc_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_internship_opportunities_status ON internship_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_internship_opportunities_company_id ON internship_opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_internship_opportunities_created_at ON internship_opportunities(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_internship_applications_status ON internship_applications(status);
CREATE INDEX IF NOT EXISTS idx_internship_applications_internship_id ON internship_applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_internship_applications_student_id ON internship_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_internship_applications_created_at ON internship_applications(created_at DESC);

-- Enable RLS
ALTER TABLE noc_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for T&P Officer access
CREATE POLICY "T&P Officers can view all NOC requests" ON noc_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'tp_officer'
        )
    );

CREATE POLICY "T&P Officers can update NOC requests" ON noc_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'tp_officer'
        )
    );

CREATE POLICY "T&P Officers can view all companies" ON companies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'tp_officer'
        )
    );

CREATE POLICY "T&P Officers can manage internship opportunities" ON internship_opportunities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'tp_officer'
        )
    );

CREATE POLICY "T&P Officers can view all applications" ON internship_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'tp_officer'
        )
    );

-- Insert sample data
INSERT INTO companies (name, website, industry, contact_person, designation, email, phone, address, employee_count, founded_year, description, status, previous_internships, rating) VALUES
('TechNova Solutions', 'https://technova.com', 'Software Development', 'Mr. Arjun Mehta', 'CTO', 'internships@technova.com', '+91 9876543212', 'IT Hub, Pune, Maharashtra', '100-200', 2020, 'Fast-growing tech startup specializing in full-stack development and digital transformation solutions.', 'verified', 18, 4.7),
('DataMind Analytics', 'https://datamind.com', 'Data Science', 'Dr. Priya Sharma', 'Head of Research', 'research@datamind.com', '+91 9876543213', 'Research Center, Hyderabad, Telangana', '50-100', 2019, 'Data analytics and AI research company providing insights and solutions for various industries.', 'verified', 8, 4.2),
('InnovateTech Solutions', 'https://innovatetech.com', 'Software Development', 'Mr. Rajesh Kumar', 'HR Manager', 'hr@innovatetech.com', '+91 9876543210', 'Tech Park, Bangalore, Karnataka', '500-1000', 2015, 'Leading software development company specializing in web and mobile applications, AI/ML solutions, and cloud services.', 'pending', 25, 4.5),
('GreenEnergy Corp', 'https://greenenergy.com', 'Renewable Energy', 'Ms. Sneha Gupta', 'Talent Acquisition Lead', 'careers@greenenergy.com', '+91 9876543211', 'Green Tower, Mumbai, Maharashtra', '200-500', 2018, 'Renewable energy company focused on solar and wind power solutions with a commitment to sustainable development.', 'pending', 12, 4.2);

INSERT INTO internship_opportunities (company_id, title, description, location, type, duration, stipend, start_date, end_date, skills_required, eligibility_criteria, max_applicants, posted_by) VALUES
((SELECT id FROM companies WHERE name = 'TechNova Solutions'), 'Full Stack Developer Intern', 'Join our dynamic team to build next-generation web applications using modern technologies. You will work on real projects and gain hands-on experience in full-stack development.', 'Mumbai, Maharashtra', 'full-time', '6 months', '₹35,000/month', '2024-02-15', '2024-08-15', ARRAY['React', 'Node.js', 'MongoDB', 'TypeScript'], '3rd/4th year CS/IT students with CGPA > 7.0', 50, (SELECT id FROM user_profiles WHERE role = 'tp_officer' LIMIT 1)),
((SELECT id FROM companies WHERE name = 'DataMind Analytics'), 'AI/ML Research Intern', 'Work on cutting-edge AI projects and contribute to breakthrough research in machine learning and data analytics.', 'Bangalore, Karnataka', 'remote', '4 months', '₹40,000/month', '2024-02-20', '2024-06-20', ARRAY['Python', 'TensorFlow', 'Machine Learning', 'Data Science'], 'Final year students with background in AI/ML', 30, (SELECT id FROM user_profiles WHERE role = 'tp_officer' LIMIT 1));

-- Insert sample NOC requests
INSERT INTO noc_requests (student_name, enrollment_no, branch, year, email, phone, company_name, internship_role, internship_duration, internship_location, start_date, end_date, stipend, description, company_contact_email, company_contact_phone, status, priority) VALUES
('Rahul Sharma', 'CS2021001', 'Computer Science', '3rd Year', 'rahul.sharma@college.edu', '+91 9876543210', 'TechNova Solutions', 'Full Stack Developer Intern', '6 months', 'Mumbai, Maharashtra', '2024-02-15', '2024-08-15', '₹35,000/month', 'Full-stack web development internship focusing on React, Node.js, and cloud technologies.', 'hr@technova.com', '+91 9876543211', 'pending', 'high'),
('Priya Patel', 'IT2021045', 'Information Technology', '3rd Year', 'priya.patel@college.edu', '+91 9876543212', 'DataMind Analytics', 'AI/ML Research Intern', '4 months', 'Bangalore, Karnataka', '2024-02-20', '2024-06-20', '₹40,000/month', 'Research internship in machine learning and data science applications.', 'research@datamind.com', '+91 9876543213', 'pending', 'medium'),
('Amit Kumar', 'CS2021023', 'Computer Science', '4th Year', 'amit.kumar@college.edu', '+91 9876543214', 'AppCraft Studios', 'Mobile App Developer', '5 months', 'Pune, Maharashtra', '2024-01-15', '2024-06-15', '₹28,000/month', 'Mobile application development using Flutter and React Native.', 'hr@appcraft.com', '+91 9876543215', 'approved', 'low');

-- Insert sample applications
INSERT INTO internship_applications (internship_id, student_name, enrollment_no, branch, year, cgpa, email, phone, cover_letter, skills, experience, status) VALUES
((SELECT id FROM internship_opportunities WHERE title = 'Full Stack Developer Intern'), 'Rahul Sharma', 'CS2021001', 'Computer Science', '3rd Year', 8.5, 'rahul.sharma@college.edu', '+91 9876543210', 'I am excited to apply for the Full Stack Developer internship at TechNova Solutions. With my strong foundation in React, Node.js, and database management, I believe I can contribute effectively to your team while gaining valuable industry experience.', ARRAY['React', 'Node.js', 'JavaScript', 'MongoDB', 'Git'], '6 months freelance web development', 'pending'),
((SELECT id FROM internship_opportunities WHERE title = 'AI/ML Research Intern'), 'Priya Patel', 'IT2021045', 'Information Technology', '4th Year', 9.2, 'priya.patel@college.edu', '+91 9876543211', 'As a final year IT student with a passion for artificial intelligence and machine learning, I am thrilled to apply for the AI/ML Research Intern position. My academic projects and research experience in deep learning make me a strong candidate for this role.', ARRAY['Python', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy'], 'Research assistant for 1 year', 'pending');
