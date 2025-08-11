-- Consistent Database Schema for Internship & NOC Management System
-- This script ensures all tables follow consistent naming conventions

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS internship_applications CASCADE;
DROP TABLE IF EXISTS internship_opportunities CASCADE;
DROP TABLE IF EXISTS noc_requests CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with consistent naming
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'tp_officer', 'super_admin')),
    enrollment_no TEXT UNIQUE,
    branch TEXT,
    year TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    contact_person TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    address TEXT,
    description TEXT,
    employee_count TEXT,
    founded_year TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    documents JSONB DEFAULT '[]',
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES profiles(id),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create internship_opportunities table
CREATE TABLE internship_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    mode TEXT CHECK (mode IN ('onsite', 'remote', 'hybrid')),
    duration TEXT,
    stipend TEXT,
    start_date DATE,
    end_date DATE,
    skills_required TEXT[],
    eligibility_criteria TEXT,
    max_applicants INTEGER DEFAULT 50,
    current_applicants INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    posted_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create noc_requests table
CREATE TABLE noc_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_address TEXT,
    company_contact_email TEXT,
    company_contact_phone TEXT,
    internship_role TEXT NOT NULL,
    internship_duration TEXT NOT NULL,
    internship_location TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    stipend TEXT,
    description TEXT,
    documents JSONB DEFAULT '[]',
    status TEXT DEFAULT 'pending_teacher' CHECK (status IN ('pending_teacher', 'approved_teacher', 'rejected_teacher', 'pending_tpo', 'approved', 'rejected')),
    teacher_approval_at TIMESTAMP WITH TIME ZONE,
    teacher_rejection_at TIMESTAMP WITH TIME ZONE,
    teacher_signature TEXT,
    tpo_approval_at TIMESTAMP WITH TIME ZONE,
    tpo_rejection_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create internship_applications table
CREATE TABLE internship_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES internship_opportunities(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    additional_documents JSONB DEFAULT '[]',
    status TEXT DEFAULT 'pending_teacher' CHECK (status IN ('pending_teacher', 'approved_teacher', 'rejected_teacher', 'pending_tpo', 'approved', 'rejected')),
    teacher_approval_at TIMESTAMP WITH TIME ZONE,
    teacher_rejection_at TIMESTAMP WITH TIME ZONE,
    tpo_approval_at TIMESTAMP WITH TIME ZONE,
    tpo_rejection_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_internship_opportunities_status ON internship_opportunities(status);
CREATE INDEX idx_internship_opportunities_company ON internship_opportunities(company_id);
CREATE INDEX idx_noc_requests_student ON noc_requests(student_id);
CREATE INDEX idx_noc_requests_status ON noc_requests(status);
CREATE INDEX idx_internship_applications_student ON internship_applications(student_id);
CREATE INDEX idx_internship_applications_opportunity ON internship_applications(opportunity_id);
CREATE INDEX idx_internship_applications_status ON internship_applications(status);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE noc_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Teachers and TP Officers can view student profiles" ON profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'tp_officer', 'super_admin')
    )
);

-- Companies policies
CREATE POLICY "Anyone can view verified companies" ON companies FOR SELECT USING (status = 'verified');
CREATE POLICY "TP Officers can manage companies" ON companies FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('tp_officer', 'super_admin')
    )
);

-- Internship opportunities policies
CREATE POLICY "Anyone can view active opportunities" ON internship_opportunities FOR SELECT USING (status = 'active');
CREATE POLICY "TP Officers can manage opportunities" ON internship_opportunities FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('tp_officer', 'super_admin')
    )
);

-- NOC requests policies
CREATE POLICY "Students can manage their own NOC requests" ON noc_requests FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Teachers and TP Officers can view all NOC requests" ON noc_requests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'tp_officer', 'super_admin')
    )
);
CREATE POLICY "Teachers and TP Officers can update NOC requests" ON noc_requests FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'tp_officer', 'super_admin')
    )
);

-- Internship applications policies
CREATE POLICY "Students can manage their own applications" ON internship_applications FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Teachers and TP Officers can view all applications" ON internship_applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'tp_officer', 'super_admin')
    )
);
CREATE POLICY "Teachers and TP Officers can update applications" ON internship_applications FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'tp_officer', 'super_admin')
    )
);
