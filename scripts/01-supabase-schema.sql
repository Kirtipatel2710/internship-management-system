-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'tp_officer', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow new users to create their profile (after Google OAuth)
CREATE POLICY "Allow authenticated users to insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Super-Admin can view all profiles
CREATE POLICY "Super-Admin can view all profiles" ON public.profiles
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');

-- Policy: Super-Admin can update all profiles
CREATE POLICY "Super-Admin can update all profiles" ON public.profiles
  FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');

-- Policy: Super-Admin can insert profiles
CREATE POLICY "Super-Admin can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');

-- Policy: Super-Admin can delete profiles
CREATE POLICY "Super-Admin can delete profiles" ON public.profiles
  FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');


-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT,
  stipend TEXT,
  application_deadline DATE,
  posted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- T&P Officer or Super-Admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for opportunities table
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view opportunities
CREATE POLICY "All authenticated users can view opportunities" ON public.opportunities
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: T&P Officers and Super-Admins can create opportunities
CREATE POLICY "T&P Officers and Super-Admins can create opportunities" ON public.opportunities
  FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tp_officer', 'super_admin'));

-- Policy: T&P Officers and Super-Admins can update opportunities
CREATE POLICY "T&P Officers and Super-Admins can update opportunities" ON public.opportunities
  FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tp_officer', 'super_admin'));

-- Policy: T&P Officers and Super-Admins can delete opportunities
CREATE POLICY "T&P Officers and Super-Admins can delete opportunities" ON public.opportunities
  FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tp_officer', 'super_admin'));


-- Create noc_requests table
CREATE TABLE public.noc_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  file_url TEXT, -- URL to the NOC request document in storage
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- T&P Officer or Super-Admin
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Set up RLS for noc_requests table
ALTER TABLE public.noc_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view/insert/update their own NOC requests
CREATE POLICY "Students can manage their own NOC requests" ON public.noc_requests
  FOR ALL USING (auth.uid() = student_id);

-- Policy: T&P Officers and Super-Admins can view all NOC requests
CREATE POLICY "T&P Officers and Super-Admins can view all NOC requests" ON public.noc_requests
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tp_officer', 'super_admin'));

-- Policy: T&P Officers and Super-Admins can update NOC request status
CREATE POLICY "T&P Officers and Super-Admins can update NOC requests" ON public.noc_requests
  FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tp_officer', 'super_admin'));


-- Create weekly_reports table
CREATE TABLE public.weekly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_no INTEGER NOT NULL,
  file_url TEXT NOT NULL, -- URL to the report document in storage
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed')),
  comment TEXT, -- Teacher's comment
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Teacher or Super-Admin
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (student_id, week_no) -- Ensure only one report per student per week
);

-- Set up RLS for weekly_reports table
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Students can manage their own weekly reports
CREATE POLICY "Students can manage their own weekly reports" ON public.weekly_reports
  FOR ALL USING (auth.uid() = student_id);

-- Policy: Teachers can view and update reports of students they supervise (assuming a supervision link, for now all students)
CREATE POLICY "Teachers can view and update weekly reports" ON public.weekly_reports
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'teacher');
CREATE POLICY "Teachers can update weekly reports" ON public.weekly_reports
  FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'teacher');

-- Policy: Super-Admins can view and update all weekly reports
CREATE POLICY "Super-Admins can manage all weekly reports" ON public.weekly_reports
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');


-- Create certificates table
CREATE TABLE public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL, -- URL to the certificate document in storage
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Teacher or Super-Admin
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Set up RLS for certificates table
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Students can manage their own certificates
CREATE POLICY "Students can manage their own certificates" ON public.certificates
  FOR ALL USING (auth.uid() = student_id);

-- Policy: Teachers can view and update certificates
CREATE POLICY "Teachers can view and update certificates" ON public.certificates
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'teacher');
CREATE POLICY "Teachers can update certificates" ON public.certificates
  FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'teacher');

-- Policy: Super-Admins can manage all certificates
CREATE POLICY "Super-Admins can manage all certificates" ON public.certificates
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');


-- Create companies table
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  website TEXT,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- T&P Officer or Super-Admin
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Set up RLS for companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view companies
CREATE POLICY "All authenticated users can view companies" ON public.companies
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: T&P Officers and Super-Admins can manage companies
CREATE POLICY "T&P Officers and Super-Admins can manage companies" ON public.companies
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tp_officer', 'super_admin'));


-- Create Storage Buckets
-- You'll need to create these manually in Supabase Storage UI or via CLI
-- Buckets: reports, certificates, noc_files
-- Set public access to FALSE for all of them.

-- RLS for Storage (Example for 'reports' bucket)
-- You'll need to create these policies in Supabase Storage -> Policies
/*
-- Policy for 'reports' bucket:
CREATE POLICY "Allow authenticated users to upload reports" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reports' AND auth.uid() = (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Allow authenticated users to view their own reports" ON storage.objects
  FOR SELECT USING (bucket_id = 'reports' AND auth.uid() = (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Allow teachers and admins to view all reports" ON storage.objects
  FOR SELECT USING (bucket_id = 'reports' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'super_admin'));

-- Similar policies for 'certificates' and 'noc_files' buckets
*/

-- Initial data for T&P Officer and Super-Admin (ensure these emails match your Google accounts for testing)
INSERT INTO public.profiles (id, email, name, role) VALUES
  ('YOUR_TP_OFFICER_AUTH_UID', 'tp.officer@charusat.ac.in', 'T&P Officer', 'tp_officer'),
  ('YOUR_SUPER_ADMIN_AUTH_UID', 'admin@charusat.ac.in', 'Super Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- IMPORTANT: Replace 'YOUR_TP_OFFICER_AUTH_UID' and 'YOUR_SUPER_ADMIN_AUTH_UID'
-- with the actual `id` (UUID) from `auth.users` table after they sign in once.
-- Supabase Auth creates the user in `auth.users` first, then you link it to `public.profiles`.
-- For pre-defined roles, you'll need to manually update the `id` in `public.profiles`
-- after the first sign-in of those specific email addresses.
-- Alternatively, you can use a Supabase Function to automatically create the profile
-- and assign a role based on email domain on `auth.users` insert.
