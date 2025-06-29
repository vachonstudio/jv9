# Vercel Deployment Fix Guide

🚨 **Error:** `Environment Variable "NEXT_PUBLIC_VERCEL_URL" references Secret "vercel-url", which does not exist.`

## 🔍 Root Cause

This error occurs when there's a misconfigured environment variable in your Vercel project settings that references a non-existent secret.

## 🛠️ Solution Steps

### Step 1: Clean Up Vercel Project Settings

1. **Go to your Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Check Environment Variables**
   - Go to Settings → Environment Variables
   - Look for any variable named `NEXT_PUBLIC_VERCEL_URL`
   - **DELETE** this variable if it exists

3. **Check for Other Problematic Variables**
   - Look for any variables that reference non-existent secrets
   - Common problematic patterns:
     - Variables that reference `@secret-name` but the secret doesn't exist
     - Variables with malformed secret references

### Step 2: Set Up Correct Environment Variables

Add these environment variables in your Vercel dashboard:

#### For Demo/Testing Deployment:
```
NEXT_PUBLIC_SUPABASE_URL=https://demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-anon-key-replace-with-real
```

#### For Production Deployment:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3: Remove Problematic Configuration

1. **Check your local files** for any references to `NEXT_PUBLIC_VERCEL_URL`
2. **Updated vercel.json** (already done) - removed problematic references
3. **Clear any cached environment variables**

### Step 4: Redeploy

1. **Trigger a new deployment**:
   ```bash
   # Method 1: Through Git
   git add .
   git commit -m "fix: remove problematic vercel environment variable"
   git push

   # Method 2: Manual redeploy in Vercel dashboard
   # Go to Deployments → Click "..." → Redeploy
   ```

## 🔧 Alternative Quick Fix

If the issue persists, try these steps:

### Option A: Create New Vercel Project
1. Delete the current Vercel project
2. Create a new one with clean configuration
3. Add only the necessary environment variables

### Option B: Use Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Remove existing project link
rm -rf .vercel

# Redeploy with fresh configuration
vercel --prod
```

## 📋 Environment Variables Checklist

✅ **Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

✅ **Optional Variables:**
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

❌ **Remove These (if they exist):**
- `NEXT_PUBLIC_VERCEL_URL`
- Any variables referencing non-existent secrets

## 🎯 Deployment Settings

Your `vercel.json` should look like this (already updated):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

## 🔍 Debugging Steps

If deployment still fails:

1. **Check Build Logs**
   - Look for the exact error message
   - Note which environment variable is causing issues

2. **Verify Environment Variables**
   ```bash
   # In your Vercel project settings, verify:
   # - Variable names are correct
   # - No typos in variable names
   # - No references to non-existent secrets
   ```

3. **Test Locally**
   ```bash
   # Make sure local build works
   npm run build
   npm run start
   ```

## 🚀 Expected Result

After following these steps:
- ✅ Deployment should succeed
- ✅ Application runs in demo mode (if using demo credentials)
- ✅ No environment variable errors
- ✅ Clean build logs

## 📞 Next Steps After Successful Deployment

1. **Verify Demo Mode**
   - Check browser console for "Demo mode" messages
   - Verify basic functionality works

2. **Set Up Production Supabase** (when ready)
   - Create real Supabase project
   - Update environment variables
   - Run database migrations

3. **Test Full Functionality**
   - Test authentication (should show demo warnings)
   - Test gradient gallery
   - Test contact form
   - Test responsive design

---

**Need Help?** 
- Check the browser console for any remaining errors
- Verify all environment variables are set correctly
- Ensure no old configuration is cached