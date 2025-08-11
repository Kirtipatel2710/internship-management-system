-- Create the "profiles" table
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  name text NULL,
  role text NOT NULL DEFAULT 'student'::text,
  enrollment_no text NULL,
  branch text NULL,
  year text NULL,
  phone text NULL,
  avatar_url text NULL,
  department text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_email_key UNIQUE (email),
  CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'tp_officer', 'super_admin'))
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for "profiles" table
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING ((auth.uid() = id));

-- Create a function to create a profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text;
BEGIN
  -- Determine role based on email domain
  IF NEW.email = 'tp.officer@charusat.ac.in' THEN
    user_role := 'tp_officer';
  ELSIF NEW.email = 'admin@charusat.ac.in' THEN
    user_role := 'super_admin';
  ELSIF NEW.email LIKE '%@charusat.ac.in' THEN
    user_role := 'teacher';
  ELSIF NEW.email LIKE '%@charusat.edu.in' THEN
    user_role := 'student';
  ELSE
    user_role := 'student'; -- Default role
  END IF;

  INSERT INTO public.profiles (id, email, name, avatar_url, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', user_role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create the "companies" table
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text NULL,
  website text NULL,
  contact_person text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NULL,
  address text NULL,
  description text NULL,
  employee_count text NULL,
  founded_year text NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  documents text[] NULL,
  verified_by uuid NULL,
  verified_at timestamp with time zone NULL,
  rejected_by uuid NULL,
  rejected_at timestamp with time zone NULL,
  rejection_reason text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id),
  CONSTRAINT companies_contact_email_key UNIQUE (contact_email),
  CONSTRAINT companies_name_key UNIQUE (name),
  CONSTRAINT companies_status_check CHECK (status IN ('pending', 'verified', 'rejected')),
  CONSTRAINT companies_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT companies_rejected_by_fkey FOREIGN KEY (rejected_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for "companies" table
CREATE POLICY "Enable read access for all users" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Enable insert for T&P officers" ON public.companies FOR INSERT WITH CHECK (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));
CREATE POLICY "Enable update for T&P officers" ON public.companies FOR UPDATE USING (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));

-- Create the "internship_opportunities" table
CREATE TABLE public.internship_opportunities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  location text NULL,
  mode text NOT NULL DEFAULT 'onsite'::text,
  duration text NULL,
  stipend text NULL,
  start_date date NULL,
  end_date date NULL,
  skills_required text[] NULL,
  eligibility_criteria text NULL,
  max_applicants integer NOT NULL DEFAULT 0,
  current_applicants integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft'::text,
  posted_by uuid NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT internship_opportunities_pkey PRIMARY KEY (id),
  CONSTRAINT internship_opportunities_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT internship_opportunities_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT internship_opportunities_mode_check CHECK (mode IN ('onsite', 'remote', 'hybrid')),
  CONSTRAINT internship_opportunities_status_check CHECK (status IN ('active', 'closed', 'draft'))
);
ALTER TABLE public.internship_opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies for "internship_opportunities" table
CREATE POLICY "Enable read access for all users" ON public.internship_opportunities FOR SELECT USING (true);
CREATE POLICY "Enable insert for T&P officers" ON public.internship_opportunities FOR INSERT WITH CHECK (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));
CREATE POLICY "Enable update for T&P officers" ON public.internship_opportunities FOR UPDATE USING (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));

-- Create the "noc_requests" table
CREATE TABLE public.noc_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  company_name text NOT NULL,
  company_address text NULL,
  company_contact_email text NULL,
  company_contact_phone text NULL,
  internship_role text NOT NULL,
  internship_duration text NOT NULL,
  internship_location text NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  stipend text NULL,
  description text NULL,
  documents text[] NULL,
  status text NOT NULL DEFAULT 'pending_teacher'::text,
  teacher_approval_at timestamp with time zone NULL,
  teacher_rejection_at timestamp with time zone NULL,
  teacher_signature text NULL,
  tpo_approval_at timestamp with time zone NULL,
  tpo_rejection_at timestamp with time zone NULL,
  rejection_reason text NULL,
  priority text NOT NULL DEFAULT 'medium'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT noc_requests_pkey PRIMARY KEY (id),
  CONSTRAINT noc_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT noc_requests_priority_check CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT noc_requests_status_check CHECK (status IN ('pending_teacher', 'approved_teacher', 'rejected_teacher', 'pending_tpo', 'approved', 'rejected'))
);
ALTER TABLE public.noc_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for "noc_requests" table
CREATE POLICY "Students can create their own NOC requests." ON public.noc_requests FOR INSERT WITH CHECK ((auth.uid() = student_id));
CREATE POLICY "Students can view their own NOC requests." ON public.noc_requests FOR SELECT USING ((auth.uid() = student_id));
CREATE POLICY "Teachers can view NOC requests for their students." ON public.noc_requests FOR SELECT USING (((get_my_claim('role'::text)) = '"teacher"'::jsonb));
CREATE POLICY "T&P officers can view all NOC requests." ON public.noc_requests FOR SELECT USING (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));
CREATE POLICY "Teachers can update NOC requests for their students." ON public.noc_requests FOR UPDATE USING (((get_my_claim('role'::text)) = '"teacher"'::jsonb));
CREATE POLICY "T&P officers can update all NOC requests." ON public.noc_requests FOR UPDATE USING (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));

-- Create the "internship_applications" table
CREATE TABLE public.internship_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  opportunity_id uuid NOT NULL,
  cover_letter text NULL,
  resume_url text NULL,
  additional_documents text[] NULL,
  status text NOT NULL DEFAULT 'pending_teacher'::text,
  teacher_approval_at timestamp with time zone NULL,
  teacher_rejection_at timestamp with time zone NULL,
  tpo_approval_at timestamp with time zone NULL,
  tpo_rejection_at timestamp with time zone NULL,
  rejection_reason text NULL,
  applied_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT internship_applications_pkey PRIMARY KEY (id),
  CONSTRAINT internship_applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT internship_applications_opportunity_id_fkey FOREIGN KEY (opportunity_id) REFERENCES public.internship_opportunities(id) ON DELETE CASCADE,
  CONSTRAINT internship_applications_status_check CHECK (status IN ('pending_teacher', 'approved_teacher', 'rejected_teacher', 'pending_tpo', 'approved', 'rejected'))
);
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for "internship_applications" table
CREATE POLICY "Students can create their own applications." ON public.internship_applications FOR INSERT WITH CHECK ((auth.uid() = student_id));
CREATE POLICY "Students can view their own applications." ON public.internship_applications FOR SELECT USING ((auth.uid() = student_id));
CREATE POLICY "Teachers can view applications for their students." ON public.internship_applications FOR SELECT USING (((get_my_claim('role'::text)) = '"teacher"'::jsonb));
CREATE POLICY "T&P officers can view all applications." ON public.internship_applications FOR SELECT USING (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));
CREATE POLICY "Teachers can update applications for their students." ON public.internship_applications FOR UPDATE USING (((get_my_claim('role'::text)) = '"teacher"'::jsonb));
CREATE POLICY "T&P officers can update all applications." ON public.internship_applications FOR UPDATE USING (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));

-- Create the "weekly_reports" table
CREATE TABLE public.weekly_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  week_number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  file_url text NULL,
  status text NOT NULL DEFAULT 'submitted'::text,
  teacher_comments text NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone NULL,
  reviewed_by uuid NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT weekly_reports_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_reports_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT weekly_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT weekly_reports_status_check CHECK (status IN ('submitted', 'reviewed', 'approved', 'needs_revision'))
);
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for "weekly_reports" table
CREATE POLICY "Students can create their own weekly reports." ON public.weekly_reports FOR INSERT WITH CHECK ((auth.uid() = student_id));
CREATE POLICY "Students can view their own weekly reports." ON public.weekly_reports FOR SELECT USING ((auth.uid() = student_id));
CREATE POLICY "Teachers can view weekly reports for their students." ON public.weekly_reports FOR SELECT USING (((get_my_claim('role'::text)) = '"teacher"'::jsonb));
CREATE POLICY "Teachers can update weekly reports for their students." ON public.weekly_reports FOR UPDATE USING (((get_my_claim('role'::text)) = '"teacher"'::jsonb));

-- Create the "certificates" table
CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  title text NOT NULL,
  issuer text NOT NULL,
  file_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  approved_at timestamp with time zone NULL,
  approved_by uuid NULL,
  rejection_reason text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT certificates_pkey PRIMARY KEY (id),
  CONSTRAINT certificates_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT certificates_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT certificates_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for "certificates" table
CREATE POLICY "Students can create their own certificates." ON public.certificates FOR INSERT WITH CHECK ((auth.uid() = student_id));
CREATE POLICY "Students can view their own certificates." ON public.certificates FOR SELECT USING ((auth.uid() = student_id));
CREATE POLICY "T&P officers can view all certificates." ON public.certificates FOR SELECT USING (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));
CREATE POLICY "T&P officers can update all certificates." ON public.certificates FOR UPDATE USING (((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', TRUE),
  ('company_documents', 'company_documents', TRUE),
  ('noc_documents', 'noc_documents', TRUE),
  ('weekly_reports', 'weekly_reports', TRUE),
  ('certificates', 'certificates', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for 'avatars' bucket
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar image." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can update their own avatar image." ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

-- Set up storage policies for 'company_documents' bucket
CREATE POLICY "Company documents are viewable by T&P officers and admins." ON storage.objects FOR SELECT USING (bucket_id = 'company_documents' AND ((get_my_claim('role'::text)) IN ('"tp_officer"'::jsonb, '"super_admin"'::jsonb)));
CREATE POLICY "T&P officers can upload company documents." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'company_documents' AND ((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));
CREATE POLICY "T&P officers can update company documents." ON storage.objects FOR UPDATE USING (bucket_id = 'company_documents' AND ((get_my_claim('role'::text)) = '"tp_officer"'::jsonb));

-- Set up storage policies for 'noc_documents' bucket
CREATE POLICY "NOC documents are viewable by students, teachers, T&P officers, and admins." ON storage.objects FOR SELECT USING (bucket_id = 'noc_documents' AND ((get_my_claim('role'::text)) IN ('"student"'::jsonb, '"teacher"'::jsonb, '"tp_officer"'::jsonb, '"super_admin"'::jsonb)));
CREATE POLICY "Students can upload their own NOC documents." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'noc_documents' AND ((get_my_claim('sub'::text)) = owner));
CREATE POLICY "Students can update their own NOC documents." ON storage.objects FOR UPDATE USING (bucket_id = 'noc_documents' AND ((get_my_claim('sub'::text)) = owner));

-- Set up storage policies for 'weekly_reports' bucket
CREATE POLICY "Weekly reports are viewable by students, teachers, T&P officers, and admins." ON storage.objects FOR SELECT USING (bucket_id = 'weekly_reports' AND ((get_my_claim('role'::text)) IN ('"student"'::jsonb, '"teacher"'::jsonb, '"tp_officer"'::jsonb, '"super_admin"'::jsonb)));
CREATE POLICY "Students can upload their own weekly reports." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'weekly_reports' AND ((get_my_claim('sub'::text)) = owner));
CREATE POLICY "Students can update their own weekly reports." ON storage.objects FOR UPDATE USING (bucket_id = 'weekly_reports' AND ((get_my_claim('sub'::text)) = owner));

-- Set up storage policies for 'certificates' bucket
CREATE POLICY "Certificates are viewable by students, T&P officers, and admins." ON storage.objects FOR SELECT USING (bucket_id = 'certificates' AND ((get_my_claim('role'::text)) IN ('"student"'::jsonb, '"tp_officer"'::jsonb, '"super_admin"'::jsonb)));
CREATE POLICY "Students can upload their own certificates." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND ((get_my_claim('sub'::text)) = owner));
CREATE POLICY "Students can update their own certificates." ON storage.objects FOR UPDATE USING (bucket_id = 'certificates' AND ((get_my_claim('sub'::text)) = owner));

-- Sample Data (Optional - uncomment to seed your database)
-- INSERT INTO public.profiles (id, email, name, role, enrollment_no, branch, year, phone, department) VALUES
-- ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'student1@charusat.edu.in', 'Alice Student', 'student', '2022001', 'CSE', '3rd', '1234567890', 'Computer Engineering'),
-- ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'teacher1@charusat.ac.in', 'Bob Teacher', 'teacher', NULL, NULL, NULL, '0987654321', 'Computer Engineering'),
-- ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'tp.officer@charusat.ac.in', 'Charlie TPO', 'tp_officer', NULL, NULL, NULL, '1122334455', 'Training & Placement'),
-- ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'admin@charusat.ac.in', 'Diana Admin', 'super_admin', NULL, NULL, NULL, '5544332211', 'Administration');

-- INSERT INTO public.companies (name, industry, website, contact_person, contact_email, status) VALUES
-- ('Tech Solutions Inc.', 'IT', 'https://techsolutions.com', 'John Doe', 'john.doe@techsolutions.com', 'verified'),
-- ('Innovate Corp', 'Software', 'https://innovatecorp.com', 'Jane Smith', 'jane.smith@innovatecorp.com', 'pending');

-- INSERT INTO public.internship_opportunities (company_id, title, description, location, mode, duration, stipend, max_applicants, status) VALUES
-- ((SELECT id FROM public.companies WHERE name = 'Tech Solutions Inc.'), 'Software Dev Intern', 'Develop web applications.', 'Ahmedabad', 'onsite', '6 months', '15000 INR', 10, 'active'),
-- ((SELECT id FROM public.companies WHERE name = 'Innovate Corp'), 'Data Science Intern', 'Analyze large datasets.', 'Remote', 'remote', '3 months', '10000 INR', 5, 'active');

-- INSERT INTO public.noc_requests (student_id, company_name, internship_role, internship_duration, start_date, end_date, status) VALUES
-- ((SELECT id FROM public.profiles WHERE email = 'student1@charusat.edu.in'), 'Tech Solutions Inc.', 'Software Engineer Intern', '6 months', '2024-06-01', '2024-12-01', 'pending_teacher');

-- INSERT INTO public.internship_applications (student_id, opportunity_id, status) VALUES
-- ((SELECT id FROM public.profiles WHERE email = 'student1@charusat.edu.in'), (SELECT id FROM public.internship_opportunities WHERE title = 'Software Dev Intern'), 'pending_teacher');

-- INSERT INTO public.weekly_reports (student_id, week_number, title, description, status) VALUES
-- ((SELECT id FROM public.profiles WHERE email = 'student1@charusat.edu.in'), 1, 'Week 1 Progress', 'Completed initial setup and learned new framework.', 'submitted');

-- INSERT INTO public.certificates (student_id, title, issuer, file_url, status) VALUES
-- ((SELECT id FROM public.profiles WHERE email = 'student1@charusat.edu.in'), 'Web Development Basics', 'Coursera', 'https://example.com/cert1.pdf', 'pending');
