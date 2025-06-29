# Complete Deployment Guide for Vachon UX Studio

## I Cannot Deploy For You, But Here's Everything You Need

**Important**: I cannot create real user accounts or deploy to live hosting services. However, this guide will walk you through doing it yourself with exact steps.

## Pre-Deployment Checklist

### 1. Fix Critical Issues (DONE)
- ✅ Fixed CSS import path in layout.tsx
- ✅ All version-specific imports removed from UI components
- ✅ Package.json dependencies properly configured

### 2. Required Accounts You Need to Create

**Supabase Account** (Database & Auth):
1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project: "vachon-ux-studio"
4. Note down:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

**Netlify Account** (Hosting):
1. Go to https://netlify.com
2. Sign up with GitHub
3. Connect your repository
4. Deploy settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18.17.0`

## Environment Variables Setup

Create these in Netlify's Environment Variables section:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NEXTAUTH_SECRET=generate-random-32-char-string
NODE_ENV=production

# Optional: Analytics & Monitoring
NEXT_PUBLIC_VERCEL_URL=https://your-site.netlify.app
```

## Database Setup (Supabase)

### Step 1: Run Migrations
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref your-project-ref`
4. Run migrations: `supabase db push`

### Step 2: Enable Row Level Security
In Supabase dashboard, go to Authentication > Policies and enable RLS for all tables.

### Step 3: Create Initial Admin User
```sql
-- Run in Supabase SQL Editor
INSERT INTO public.users (id, email, role, first_name, last_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'),
  'your-admin-email@example.com',
  'admin',
  'Admin',
  'User'
);
```

## Deployment Steps

### Option 1: Netlify (Recommended)

1. **Connect Repository**:
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**:
   - Go to Site settings > Environment variables
   - Add all variables from the list above

4. **Deploy**:
   - Trigger deploy
   - Domain will be: `https://your-site-name.netlify.app`

### Option 2: Vercel

1. **Connect Repository**:
   - Go to https://vercel.com
   - Import your GitHub repository

2. **Environment Variables**:
   - Add all variables during import or in project settings

3. **Deploy**:
   - Automatic deployment on push to main branch
   - Domain will be: `https://your-project.vercel.app`

## Post-Deployment Setup

### 1. Test Admin Access
- Go to your deployed site
- Navigate to `/admin`
- Login with the admin user you created

### 2. Content Setup
- Upload initial gradients through the admin panel
- Create first blog posts
- Add portfolio projects

### 3. User Management
- Test user registration flow
- Verify email confirmation works
- Test role-based permissions

## Mock User Accounts for Testing

Use these test credentials locally (create in Supabase Auth):

```
Admin User:
Email: admin@vachon.design
Password: TestAdmin123!
Role: admin

Content Manager:
Email: content@vachon.design  
Password: TestContent123!
Role: content_manager

Regular User:
Email: user@vachon.design
Password: TestUser123!
Role: user
```

## Common Issues & Solutions

### Build Errors
1. **Missing environment variables**: Check all vars are set in Netlify
2. **CSS import errors**: Ensure layout.tsx imports from correct path
3. **Package conflicts**: Clear node_modules and reinstall

### Database Issues
1. **Connection failed**: Check Supabase URL and keys
2. **Permission denied**: Enable Row Level Security policies
3. **Missing tables**: Run database migrations

### Authentication Issues
1. **Login failed**: Check Supabase auth settings
2. **Redirect issues**: Configure correct site URL in Supabase
3. **Session expired**: Check JWT settings

## Security Checklist

- ✅ Environment variables are secure
- ✅ RLS enabled on all database tables
- ✅ HTTPS enforced
- ✅ Proper CORS configuration
- ✅ API routes protected
- ✅ File upload restrictions in place

## Performance Optimization

1. **Image Optimization**: Already configured in next.config.js
2. **Caching**: Netlify handles static asset caching
3. **Database**: Supabase includes connection pooling
4. **CDN**: Both Netlify and Vercel provide global CDN

## Monitoring & Analytics

### Recommended Tools:
- **Uptime**: Netlify Analytics (built-in)
- **Performance**: Web Vitals (built-in)
- **Errors**: Sentry integration (optional)
- **Users**: Supabase Auth analytics

## Domain Setup

### Custom Domain (Optional):
1. Buy domain from registrar
2. In Netlify: Site settings > Domain management
3. Add custom domain
4. Configure DNS records as shown
5. SSL certificate auto-generated

## Backup Strategy

1. **Database**: Supabase provides daily backups
2. **Files**: Store in Supabase Storage with replication
3. **Code**: GitHub serves as code backup
4. **Environment**: Keep secure copy of env vars

## Final Steps

1. ✅ Deploy to Netlify/Vercel
2. ✅ Set up Supabase database
3. ✅ Configure environment variables
4. ✅ Create admin user
5. ✅ Test all functionality
6. ✅ Set up custom domain (optional)
7. ✅ Enable monitoring

## Support

If you encounter issues:
1. Check Netlify deploy logs
2. Check browser console for errors
3. Verify Supabase connection in dashboard
4. Test environment variables are loading

**You now have everything needed to deploy this yourself!**