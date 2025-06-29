-- Run this in Supabase SQL Editor after creating an auth user
-- Replace 'your-admin-email@example.com' with your actual admin email

-- First, create the auth user in Supabase Auth UI, then run this:

INSERT INTO public.users (
  id,
  email, 
  role,
  first_name,
  last_name,
  bio,
  created_at,
  updated_at
) VALUES (
  -- This gets the user ID from the auth.users table
  (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'),
  'your-admin-email@example.com',
  'admin',
  'Admin',
  'User', 
  'System Administrator',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Verify the user was created
SELECT u.*, au.email 
FROM public.users u 
JOIN auth.users au ON u.id = au.id 
WHERE u.role = 'admin';