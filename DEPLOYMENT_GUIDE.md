# 🚀 Deployment Guide - Vachon UX Design Studio

Complete guide for deploying your Vachon UX Design Studio to production.

## 🎯 Quick Start - Deploy Now (Demo Mode)

If you want to deploy immediately and set up Supabase later:

### 1. Deploy to Vercel (Fastest)

```bash
# Clone and deploy in one step
npx create-next-app@latest vachon-studio --example https://github.com/your-repo
cd vachon-studio
npx vercel --prod
```

**Or manually:**

1. **Fork/Clone** this repository
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
3. **Deploy** (will run in demo mode automatically)

⚠️ **Having deployment issues?** Check [VERCEL_DEPLOYMENT_FIX.md](./VERCEL_DEPLOYMENT_FIX.md) for common fixes.

### 2. Deploy to Netlify

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: out
   Node version: 18
   ```

3. **Deploy** (will run in demo mode)

## 🔧 Production Setup (Full Features)

For full functionality with user authentication, database, and premium features:

### Step 1: Create Supabase Project

1. **Sign up** at [supabase.com](https://supabase.com)
2. **Create new project**:
   - Project name: `vachon-ux-studio`
   - Database password: (generate secure password)
   - Region: (choose closest to your users)

3. **Wait for setup** (usually 2-3 minutes)

### Step 2: Set Up Database

1. **Run Migrations**:
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link to your project
   supabase link --project-ref your-project-ref

   # Run migrations
   supabase db push
   ```

   Or manually copy SQL from `supabase/migrations/` to your Supabase SQL editor.

2. **Enable Authentication**:
   - Go to Authentication → Settings
   - Enable "Email confirmations"
   - Set up email templates (optional)

### Step 3: Configure Environment Variables

#### Get Your Supabase Credentials:
1. Go to Settings → API
2. Copy your:
   - **Project URL** (like `https://abc123.supabase.co`)
   - **Public anon key** (starts with `eyJhbGciOiJIUzI1NiI...`)
   - **Service role key** (starts with `eyJhbGciOiJIUzI1NiI...`)

#### For Vercel:
1. Go to your project → Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

#### For Local Development:
```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local with your real credentials
```

### Step 4: Deploy Production

```bash
# Trigger new deployment with environment variables
git add .
git commit -m "feat: add production supabase configuration"
git push

# Or redeploy in Vercel dashboard
```

## 🛠️ Platform-Specific Instructions

### Vercel (Recommended)

**Automatic Deployment:**
- Connected to Git: Auto-deploys on push
- Build command: `npm run build` (automatic)
- Environment variables: Set in dashboard

**Custom Domains:**
1. Go to Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify

**Build Settings:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Railway

```bash
# Deploy to Railway
npm install -g @railway/cli
railway login
railway init
railway up
```

### DigitalOcean App Platform

1. **Create App**:
   - Go to Apps → Create App
   - Connect repository

2. **Configure**:
   - Build command: `npm run build`
   - Run command: `npm start`
   - Environment variables: Add in dashboard

## 🔍 Deployment Verification

After deployment, verify:

### ✅ Basic Functionality
- [ ] Site loads without errors
- [ ] Navigation works smoothly
- [ ] Theme toggle functions
- [ ] Responsive design works on mobile

### ✅ Demo Mode Features
- [ ] Gradient gallery displays and filters work
- [ ] Lightbox opens and copy functions work
- [ ] Contact form validates (shows demo message)
- [ ] Portfolio cards display correctly
- [ ] Blog section renders properly

### ✅ Production Features (if Supabase connected)
- [ ] User signup/login works
- [ ] Email verification emails sent
- [ ] Protected content shows properly
- [ ] User profiles can be created/edited
- [ ] Admin features work (if admin role assigned)

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variable Errors**
   - See [VERCEL_DEPLOYMENT_FIX.md](./VERCEL_DEPLOYMENT_FIX.md)
   - Verify all variables are set correctly
   - Check for typos in variable names

2. **Build Failures**
   ```bash
   # Check locally first
   npm run build
   
   # Check Node.js version
   node --version  # Should be 18+
   ```

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check if project is paused (free tier)
   - Verify migrations were applied

4. **Authentication Problems**
   - Check email settings in Supabase
   - Verify redirect URLs match your domain
   - Check browser console for errors

### Debug Steps

1. **Check Browser Console**
   ```javascript
   // Should see demo mode messages if using demo config
   // Should see connection success if using real Supabase
   ```

2. **Check Network Tab**
   - Look for failed API requests
   - Verify Supabase endpoints are reachable

3. **Check Server Logs**
   - Vercel: Check function logs in dashboard
   - Netlify: Check deploy logs
   - Railway: Use `railway logs`

## 📈 Performance Optimization

### After Deployment

1. **Enable Analytics**:
   - Vercel Analytics (automatic)
   - Google Analytics (add tracking ID)

2. **Set Up Monitoring**:
   - Uptime monitoring (UptimeRobot, etc.)
   - Error tracking (Sentry, LogRocket)

3. **Optimize Performance**:
   - Enable compression in hosting platform
   - Set up CDN for assets
   - Optimize images for web

### Database Optimization

1. **Set Up Database Indexes**:
   ```sql
   -- Add indexes for frequently queried columns
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_projects_user_id ON projects(user_id);
   ```

2. **Configure RLS Policies**:
   - Review and optimize Row Level Security
   - Test with different user roles

3. **Set Up Backups**:
   - Enable automated backups in Supabase
   - Test restore procedures

## 🔒 Security Checklist

### Before Going Live

- [ ] Environment variables are secure
- [ ] No API keys in client-side code  
- [ ] HTTPS is enabled (automatic on modern platforms)
- [ ] Database RLS policies are active
- [ ] Email verification is enabled
- [ ] Rate limiting is configured
- [ ] CORS settings are restrictive

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Monitor for security vulnerabilities
- [ ] Review access logs
- [ ] Update database backups
- [ ] Test disaster recovery procedures

## 📞 Support

### Getting Help

1. **Check Documentation**:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Vercel Docs](https://vercel.com/docs)

2. **Community Support**:
   - GitHub Issues for bug reports
   - Discussions for questions
   - Discord/Slack communities

3. **Professional Support**:
   - Vercel Pro for enhanced support
   - Supabase Pro for priority support
   - Custom development services

---

## 🎉 Success!

Your Vachon UX Design Studio is now live! 

**Next Steps:**
1. Customize content and branding
2. Add your portfolio projects
3. Write blog posts
4. Set up user roles and permissions
5. Launch marketing campaigns

**Share your success:**
- Tweet about your launch
- Update LinkedIn profile
- Add to portfolio
- Get feedback from users

Happy designing! 🎨✨