-- Create storage buckets for organized file management

-- NOC Documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'noc-documents',
  'noc-documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Weekly Reports bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'weekly-reports',
  'weekly-reports',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Completion Certificates bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'completion-certificates',
  'completion-certificates',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf']
);

-- Company Documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-documents',
  'company-documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
);

-- Profile Pictures bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create RLS policies for NOC Documents
CREATE POLICY "Students can upload their own NOC documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'noc-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own NOC documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'noc-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Teachers and admins can view all NOC documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'noc-documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('teacher', 'tp_officer', 'super_admin')
  )
);

-- Create RLS policies for Weekly Reports
CREATE POLICY "Students can upload their own weekly reports"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'weekly-reports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own weekly reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'weekly-reports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Teachers and admins can view all weekly reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'weekly-reports' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('teacher', 'tp_officer', 'super_admin')
  )
);

-- Create RLS policies for Completion Certificates
CREATE POLICY "Students can upload their own certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'completion-certificates' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'completion-certificates' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Teachers and admins can view all certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'completion-certificates' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('teacher', 'tp_officer', 'super_admin')
  )
);

-- Create RLS policies for Company Documents
CREATE POLICY "Admins can manage company documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'company-documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('tp_officer', 'super_admin')
  )
);

-- Create RLS policies for Profile Pictures
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own profile pictures"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public access to profile pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-pictures');

-- Create storage functions for file management
CREATE OR REPLACE FUNCTION get_file_url(bucket_name text, file_path text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN concat(
    current_setting('app.supabase_url'),
    '/storage/v1/object/public/',
    bucket_name,
    '/',
    file_path
  );
END;
$$;

-- Create function to clean up orphaned files
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clean up NOC document files that are no longer referenced
  DELETE FROM storage.objects
  WHERE bucket_id = 'noc-documents'
  AND name NOT IN (
    SELECT file_url FROM noc_requests WHERE file_url IS NOT NULL
  );
  
  -- Clean up weekly report files that are no longer referenced
  DELETE FROM storage.objects
  WHERE bucket_id = 'weekly-reports'
  AND name NOT IN (
    SELECT file_url FROM weekly_reports WHERE file_url IS NOT NULL
  );
  
  -- Clean up certificate files that are no longer referenced
  DELETE FROM storage.objects
  WHERE bucket_id = 'completion-certificates'
  AND name NOT IN (
    SELECT file_url FROM certificates WHERE file_url IS NOT NULL
  );
END;
$$;
