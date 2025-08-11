-- Complete Database Setup for Internship & NOC Management System
-- This script creates all necessary tables, policies, and functions

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS internship_applications CASCADE;
DROP TABLE IF EXISTS weekly_reports CASCADE;
DROP TABLE IF EXISTS internship_opportunities CASCADE;
DROP TABLE IF EXISTS noc_requests CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'tp_officer', 'super_admin')),
    enrollment_no TEXT UNIQUE,
    branch TEXT,
    year TEXT,
    phone TEXT,
    avatar_url TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    documents JSONB DEFAULT '[]'::jsonb,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    mode TEXT DEFAULT 'onsite' CHECK (mode IN ('onsite', 'remote', 'hybrid')),
    duration TEXT,
    stipend TEXT,
    start_date DATE,
    end_date DATE,
    skills_required TEXT[] DEFAULT '{}',
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    documents JSONB DEFAULT '[]'::jsonb,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES internship_opportunities(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    additional_documents JSONB DEFAULT '[]'::jsonb,
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

-- Create weekly_reports table
CREATE TABLE weekly_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES internship_applications(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    tasks_completed TEXT NOT NULL,
    learning_outcomes TEXT,
    challenges_faced TEXT,
    mentor_feedback TEXT,
    student_reflection TEXT,
    hours_worked INTEGER DEFAULT 0,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_enrollment ON profiles(enrollment_no);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_internship_opportunities_status ON internship_opportunities(status);
CREATE INDEX idx_internship_opportunities_company ON internship_opportunities(company_id);
CREATE INDEX idx_noc_requests_student ON noc_requests(student_id);
CREATE INDEX idx_noc_requests_status ON noc_requests(status);
CREATE INDEX idx_internship_applications_student ON internship_applications(student_id);
CREATE INDEX idx_internship_applications_opportunity ON internship_applications(opportunity_id);
CREATE INDEX idx_internship_applications_status ON internship_applications(status);
CREATE INDEX idx_weekly_reports_student ON weekly_reports(student_id);
CREATE INDEX idx_weekly_reports_application ON weekly_reports(application_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE noc_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Teachers and TP Officers can view student profiles" ON profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'tp_officer', 'super_admin')
    )
);

-- Create RLS policies for companies
CREATE POLICY "Anyone can view verified companies" ON companies FOR SELECT USING (status = 'verified');
CREATE POLICY "TP Officers can manage companies" ON companies FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('tp_officer', 'super_admin')
    )
);

-- Create RLS policies for internship opportunities
CREATE POLICY "Anyone can view active opportunities" ON internship_opportunities FOR SELECT USING (status = 'active');
CREATE POLICY "TP Officers can manage opportunities" ON internship_opportunities FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('tp_officer', 'super_admin')
    )
);

-- Create RLS policies for NOC requests
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

-- Create RLS policies for internship applications
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

-- Create RLS policies for weekly reports
CREATE POLICY "Students can manage their own reports" ON weekly_reports FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Teachers and TP Officers can view all reports" ON weekly_reports FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'tp_officer', 'super_admin')
    )
);
CREATE POLICY "Teachers and TP Officers can update reports" ON weekly_reports FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'tp_officer', 'super_admin')
    )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    user_email TEXT;
BEGIN
    user_email := NEW.email;
    
    -- Determine role based on email domain
    IF user_email = 'tp.officer@charusat.ac.in' THEN
        user_role := 'tp_officer';
    ELSIF user_email = 'admin@charusat.ac.in' THEN
        user_role := 'super_admin';
    ELSIF user_email LIKE '%@charusat.ac.in' THEN
        user_role := 'teacher';
    ELSIF user_email LIKE '%@charusat.edu.in' THEN
        user_role := 'student';
    ELSE
        user_role := 'student'; -- default
    END IF;

    INSERT INTO public.profiles (id, email, name, avatar_url, role)
    VALUES (
        NEW.id,
        user_email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', user_email),
        NEW.raw_user_meta_data->>'avatar_url',
        user_role
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the auth process
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample companies
INSERT INTO companies (name, industry, contact_person, contact_email, status, description) VALUES
    ('TechCorp Solutions', 'Information Technology', 'HR Manager', 'hr@techcorp.com', 'verified', 'Leading software development company'),
    ('InnovateLabs', 'Software Development', 'Recruitment Team', 'careers@innovatelabs.com', 'verified', 'Innovative technology solutions provider'),
    ('DataSystems Inc', 'Data Analytics', 'Talent Acquisition', 'jobs@datasystems.com', 'pending', 'Data analytics and business intelligence');

-- Insert sample internship opportunities
INSERT INTO internship_opportunities (company_id, title, description, location, mode, duration, stipend, skills_required, status) VALUES
    ((SELECT id FROM companies WHERE name = 'TechCorp Solutions'), 'Software Development Intern', 'Work on web applications using React and Node.js', 'Ahmedabad', 'hybrid', '3 months', '₹15,000/month', ARRAY['React', 'Node.js', 'JavaScript'], 'active'),
    ((SELECT id FROM companies WHERE name = 'InnovateLabs'), 'Data Science Intern', 'Analyze data and build machine learning models', 'Remote', 'remote', '6 months', '₹20,000/month', ARRAY['Python', 'Machine Learning', 'SQL'], 'active');
