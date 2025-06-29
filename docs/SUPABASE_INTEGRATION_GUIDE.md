# Complete Supabase Integration Guide

## Step 1: Supabase Project Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `vachon-portfolio`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for project to be ready (2-3 minutes)

### 1.2 Get Project Credentials
1. Go to Project Settings → API
2. Copy these values (you'll need them later):
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## Step 2: Database Schema Setup

### 2.1 Run SQL in Supabase SQL Editor
Go to SQL Editor in Supabase dashboard and run this:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'editor', 'admin', 'super_admin')),
  avatar_url VARCHAR(500),
  bio TEXT,
  background_image VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role requests table
CREATE TABLE public.role_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  current_role VARCHAR(50) NOT NULL,
  requested_role VARCHAR(50) NOT NULL CHECK (requested_role IN ('editor', 'admin')),
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.user_profiles(id)
);

-- Projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  tags TEXT[],
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  content JSONB, -- Store rich content blocks
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT,
  content JSONB, -- Store rich content blocks
  image_url VARCHAR(500),
  category VARCHAR(100),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gradients table
CREATE TABLE public.gradients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  colors TEXT[] NOT NULL,
  direction VARCHAR(50) DEFAULT 'to right',
  is_featured BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  gradient_id UUID REFERENCES public.gradients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, gradient_id)
);

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  message TEXT NOT NULL,
  services TEXT[],
  budget_range VARCHAR(100),
  timeline VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_role_requests_status ON public.role_requests(status);
CREATE INDEX idx_role_requests_user_id ON public.role_requests(user_id);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_featured ON public.projects(is_featured);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gradients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Role Requests Policies
CREATE POLICY "Users can view own requests" ON public.role_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all requests" ON public.role_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);
CREATE POLICY "Users can create own requests" ON public.role_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update requests" ON public.role_requests FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Projects Policies
CREATE POLICY "Anyone can view public projects" ON public.projects FOR SELECT USING (is_public = true);
CREATE POLICY "Authenticated users can view all projects" ON public.projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Editors can create projects" ON public.projects FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin')
  )
);
CREATE POLICY "Editors can update projects" ON public.projects FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin')
  )
);

-- Blog Posts Policies (similar to projects)
CREATE POLICY "Anyone can view public blog posts" ON public.blog_posts FOR SELECT USING (is_public = true AND status = 'published');
CREATE POLICY "Authenticated users can view all blog posts" ON public.blog_posts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Editors can create blog posts" ON public.blog_posts FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin')
  )
);
CREATE POLICY "Editors can update blog posts" ON public.blog_posts FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin')
  )
);

-- Gradients Policies
CREATE POLICY "Anyone can view gradients" ON public.gradients FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create gradients" ON public.gradients FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own gradients" ON public.gradients FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete own gradients" ON public.gradients FOR DELETE USING (created_by = auth.uid());

-- User Favorites Policies
CREATE POLICY "Users can manage own favorites" ON public.user_favorites FOR ALL USING (user_id = auth.uid());

-- Contact Messages Policies
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    CASE 
      WHEN NEW.email = 'vachon@gmail.com' THEN 'super_admin'
      ELSE 'subscriber'
    END,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### 2.2 Insert Sample Data (Optional)
```sql
-- Insert some sample gradients
INSERT INTO public.gradients (name, colors, direction, is_featured) VALUES
('Sunset Vibes', ARRAY['#ff9a9e', '#fecfef'], 'to right', true),
('Ocean Blue', ARRAY['#667eea', '#764ba2'], 'to bottom', true),
('Forest Green', ARRAY['#134e5e', '#71b280'], 'to right', false);
```

## Step 3: Install Dependencies and Setup Environment

### 3.1 Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 3.2 Create Environment File
Create `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Add `.env.local` to your `.gitignore` file!

## Step 4: Create Supabase Client and Types

### 4.1 Create Database Types
```typescript
// types/database.ts
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          avatar_url: string | null
          bio: string | null
          background_image: string | null
          status: 'active' | 'inactive' | 'banned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          avatar_url?: string | null
          bio?: string | null
          background_image?: string | null
          status?: 'active' | 'inactive' | 'banned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          avatar_url?: string | null
          bio?: string | null
          background_image?: string | null
          status?: 'active' | 'inactive' | 'banned'
          created_at?: string
          updated_at?: string
        }
      }
      role_requests: {
        Row: {
          id: string
          user_id: string
          current_role: string
          requested_role: string
          reason: string
          status: 'pending' | 'approved' | 'rejected'
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          current_role: string
          requested_role: string
          reason: string
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          current_role?: string
          requested_role?: string
          reason?: string
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      // Add other tables as needed...
    }
  }
}
```

### 4.2 Create Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for admin operations)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

## Step 5: Update AuthContext with Supabase

### 5.1 Create Updated AuthContext
```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { toast } from 'sonner@2.0.3';

type UserRole = 'subscriber' | 'editor' | 'admin' | 'super_admin';
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type RoleRequest = Database['public']['Tables']['role_requests']['Row'];

interface AuthUser extends UserProfile {
  // Extend with any additional properties
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  requestRoleUpgrade: (requestedRole: UserRole, reason: string) => Promise<void>;
  getRoleRequests: () => RoleRequest[];
  approveRoleRequest: (requestId: string) => Promise<void>;
  rejectRoleRequest: (requestId: string) => Promise<void>;
  canEdit: () => boolean;
  canManageUsers: () => boolean;
  isSuperAdmin: () => boolean;
  isSubscriber: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRoleRequests();
    }
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleRequests = async () => {
    if (!user || !canManageUsers()) return;

    try {
      const { data, error } = await supabase
        .from('role_requests')
        .select(`
          *,
          user_profiles:user_id (
            name,
            email,
            avatar_url
          )
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setRoleRequests(data || []);
    } catch (error) {
      console.error('Error fetching role requests:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast.success('Check your email for the confirmation link!');
      } else {
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setRoleRequests([]);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const requestRoleUpgrade = async (requestedRole: UserRole, reason: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('role_requests')
        .insert({
          user_id: user.id,
          current_role: user.role,
          requested_role: requestedRole,
          reason,
        });

      if (error) throw error;
      toast.success('Role upgrade request submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
      throw error;
    }
  };

  const approveRoleRequest = async (requestId: string) => {
    if (!user || !canManageUsers()) {
      throw new Error('Insufficient permissions');
    }

    try {
      // Get the role request
      const { data: request, error: fetchError } = await supabase
        .from('role_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;

      // Update user role
      const { error: updateUserError } = await supabase
        .from('user_profiles')
        .update({ role: request.requested_role as UserRole })
        .eq('id', request.user_id);

      if (updateUserError) throw updateUserError;

      // Update request status
      const { error: updateRequestError } = await supabase
        .from('role_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', requestId);

      if (updateRequestError) throw updateRequestError;

      await fetchRoleRequests();
      toast.success('Role request approved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve request');
      throw error;
    }
  };

  const rejectRoleRequest = async (requestId: string) => {
    if (!user || !canManageUsers()) {
      throw new Error('Insufficient permissions');
    }

    try {
      const { error } = await supabase
        .from('role_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', requestId);

      if (error) throw error;

      await fetchRoleRequests();
      toast.success('Role request rejected.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
      throw error;
    }
  };

  // Permission helpers
  const canEdit = () => {
    return user?.role && ['editor', 'admin', 'super_admin'].includes(user.role);
  };

  const canManageUsers = () => {
    return user?.role && ['admin', 'super_admin'].includes(user.role);
  };

  const isSuperAdmin = () => {
    return user?.role === 'super_admin';
  };

  const isSubscriber = () => {
    return user?.role === 'subscriber';
  };

  const getRoleRequests = () => {
    return roleRequests;
  };

  // Logout function for backward compatibility
  const logout = signOut;

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    requestRoleUpgrade,
    getRoleRequests,
    approveRoleRequest,
    rejectRoleRequest,
    canEdit,
    canManageUsers,
    isSuperAdmin,
    isSubscriber,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## Step 6: Create API Services

### 6.1 Projects Service
```typescript
// services/projects.ts
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export const projectsService = {
  async getAll(isAuthenticated = false) {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAuthenticated) {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(project: ProjectInsert) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ProjectUpdate) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
```

### 6.2 Blog Service
```typescript
// services/blog.ts
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export const blogService = {
  async getAll(isAuthenticated = false) {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!isAuthenticated) {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async create(post: BlogPostInsert) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: BlogPostUpdate) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
```

### 6.3 Contact Service
```typescript
// services/contact.ts
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];

export const contactService = {
  async submit(message: Omit<ContactMessageInsert, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id);

    if (error) throw error;
  }
};
```

## Step 7: Migration Script

### 7.1 Create Migration Utility
```typescript
// utils/migration.ts
import { supabase } from '../lib/supabase';
import { toast } from 'sonner@2.0.3';

export async function migrateLocalStorageData() {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be logged in to migrate data');
    }

    // Migrate gradients
    const localGradients = JSON.parse(localStorage.getItem('custom-gradients') || '[]');
    if (localGradients.length > 0) {
      const gradientInserts = localGradients.map((gradient: any) => ({
        id: gradient.id,
        name: gradient.name,
        colors: gradient.colors,
        direction: gradient.direction || 'to right',
        is_custom: true,
        created_by: user.id
      }));

      const { error: gradientsError } = await supabase
        .from('gradients')
        .upsert(gradientInserts);

      if (gradientsError) {
        console.error('Error migrating gradients:', gradientsError);
      } else {
        console.log(`Migrated ${gradientInserts.length} custom gradients`);
      }
    }

    // Migrate favorites
    const localFavorites = JSON.parse(localStorage.getItem('gradient-favorites') || '[]');
    if (localFavorites.length > 0) {
      const favoriteInserts = localFavorites.map((gradientId: string) => ({
        user_id: user.id,
        gradient_id: gradientId
      }));

      const { error: favoritesError } = await supabase
        .from('user_favorites')
        .upsert(favoriteInserts, { onConflict: 'user_id,gradient_id' });

      if (favoritesError) {
        console.error('Error migrating favorites:', favoritesError);
      } else {
        console.log(`Migrated ${favoriteInserts.length} favorites`);
      }
    }

    // Clear localStorage after successful migration
    localStorage.removeItem('custom-gradients');
    localStorage.removeItem('gradient-favorites');
    localStorage.removeItem('edited-projects');
    localStorage.removeItem('edited-posts');
    localStorage.removeItem('custom-projects');
    localStorage.removeItem('custom-posts');

    toast.success('Data migrated successfully!');
    return true;
  } catch (error: any) {
    console.error('Migration error:', error);
    toast.error(error.message || 'Failed to migrate data');
    return false;
  }
}
```

## Step 8: Update Components to Use Supabase

### 8.1 Update UnifiedAuth Component
You'll need to update your `UnifiedAuth` component to use the new Supabase auth methods:

```typescript
// In your UnifiedAuth component, replace localStorage auth with:
const { signUp, signIn } = useAuth();

// For signup:
await signUp(email, password, { name });

// For login:
await signIn(email, password);
```

### 8.2 Update ContactForm Component
```typescript
// In your ContactForm component, add:
import { contactService } from '../services/contact';

const handleSubmit = async (formData: ContactFormData) => {
  try {
    await contactService.submit({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: formData.message,
      services: formData.services,
      budget_range: formData.budgetRange,
      timeline: formData.timeline
    });
    
    toast.success('Message sent successfully!');
    // Reset form
  } catch (error) {
    toast.error('Failed to send message');
  }
};
```

## Step 9: Testing and Deployment

### 9.1 Local Testing
1. Start your development server
2. Test user registration/login
3. Test role requests
4. Verify data persistence
5. Test all CRUD operations

### 9.2 Production Deployment

#### Option A: Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

#### Option B: Netlify
1. Build your app: `npm run build`
2. Deploy `dist` folder to Netlify
3. Add environment variables
4. Configure redirects for SPA

### 9.3 Post-Deployment Setup
1. Update Supabase Auth settings:
   - Add your production URL to allowed origins
   - Configure email templates
   - Set up custom SMTP (optional)

2. Test production authentication flow
3. Set up monitoring and error tracking
4. Configure backup strategy

## Troubleshooting

### Common Issues:

1. **RLS Policies**: If you get permission errors, check your Row Level Security policies
2. **Environment Variables**: Ensure all environment variables are set correctly
3. **CORS Issues**: Make sure your domain is added to Supabase settings
4. **Email Confirmation**: Configure email settings in Supabase Auth

### Debug Tips:
- Check Supabase logs in dashboard
- Use browser network tab to inspect API calls
- Enable Supabase client debugging: `supabase.debug = true`

## Next Steps After Integration

1. **Email Notifications**: Set up email notifications for role requests
2. **File Storage**: Use Supabase Storage for image uploads
3. **Real-time Features**: Add real-time subscriptions for live updates
4. **Analytics**: Implement user analytics and activity tracking
5. **Backup Strategy**: Set up automated database backups
```