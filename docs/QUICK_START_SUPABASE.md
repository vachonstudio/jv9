# 🚀 Quick Start: Connect Your App to Supabase

## Step 1: Create Supabase Project (5 minutes)

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Sign in** with GitHub (recommended)
3. **Create new project:**
   - Name: `vachon-portfolio`
   - Password: Generate strong password (save it!)
   - Region: Choose closest to you
4. **Wait 2-3 minutes** for project to initialize

## Step 2: Get Your Credentials (2 minutes)

1. **Go to Project Settings → API** in Supabase dashboard
2. **Copy these values:**
   ```
   Project URL: https://xxxxx.supabase.co
   Anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 3: Environment Setup (1 minute)

1. **Create `.env.local` file** in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Add to `.gitignore`:**
   ```
   .env.local
   ```

## Step 4: Install Supabase (30 seconds)

```bash
npm install @supabase/supabase-js
```

## Step 5: Database Setup (5 minutes)

1. **Go to SQL Editor** in Supabase dashboard
2. **Click "New Query"**
3. **Copy and paste this SQL:**

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'editor', 'admin', 'super_admin')),
  avatar_url VARCHAR(500),
  bio TEXT,
  background_image VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role requests table
CREATE TABLE public.role_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  current_role VARCHAR(50) NOT NULL,
  requested_role VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.user_profiles(id)
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
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own requests" ON public.role_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own requests" ON public.role_requests FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can create contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Auto-create user profile on signup
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
```

4. **Click "Run"** - should see "Success. No rows returned"

## Step 6: Update Your AuthContext (10 minutes)

Replace your current `contexts/AuthContext.tsx` with the Supabase version I created earlier, or make these key changes:

1. **Import Supabase:**
   ```typescript
   import { supabase } from '../lib/supabase';
   ```

2. **Replace localStorage auth with Supabase auth**
3. **Update the signup/login functions**

## Step 7: Test It Out! 

1. **Start your dev server:** `npm run dev`
2. **Try signing up** with a test email
3. **Check Supabase dashboard** - you should see the user in Authentication > Users
4. **Try the role request system**

## 🎯 What This Gives You

- ✅ **Real user accounts** instead of localStorage
- ✅ **Working role requests** across devices  
- ✅ **vachon@gmail.com automatically gets super_admin**
- ✅ **Data persists** when browser cache is cleared
- ✅ **Production ready** authentication

## 🚨 Common Issues & Fixes

**"Invalid JWT" errors:**
- Check your environment variables
- Make sure `.env.local` is in project root
- Restart your dev server

**"Row Level Security" errors:**
- Your policies might be too restrictive
- Check the SQL ran successfully

**"User not found" errors:**
- The trigger might not have run
- Check if user appears in `user_profiles` table

## 🔗 Helpful Links

- **Supabase Dashboard:** [app.supabase.com](https://app.supabase.com)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **SQL Editor:** Dashboard → SQL Editor

## 📞 Need Help?

The complete detailed guide with advanced features is in `/docs/SUPABASE_INTEGRATION_GUIDE.md` in your project files.

---

**🎉 Once this is working, you'll have a fully functional, production-ready authentication system!**
```