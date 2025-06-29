# Production Setup Guide for Role Request System

## Current Issues with Development Setup

The current application stores all data in localStorage, which means:
- ❌ Role requests are only visible to the person who submitted them
- ❌ Super admins can't see requests from other users
- ❌ Data is lost when browser cache is cleared
- ❌ No cross-device synchronization
- ❌ No email notifications

## Production Architecture Needed

### 1. Backend API Requirements

You'll need to create API endpoints for:

```typescript
// Auth endpoints
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/reset-password

// Role request endpoints
POST /api/role-requests          // Submit new request
GET /api/role-requests           // Get all requests (admin only)
GET /api/role-requests/my        // Get user's own requests
PUT /api/role-requests/:id/approve
PUT /api/role-requests/:id/reject

// User management endpoints
GET /api/users                   // Get all users (admin only)
PUT /api/users/:id/role          // Update user role
```

### 2. Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'subscriber',
  avatar_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Role requests table
CREATE TABLE role_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  current_role VARCHAR(50) NOT NULL,
  requested_role VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP NULL,
  reviewed_by UUID REFERENCES users(id) NULL
);

-- Indexes for performance
CREATE INDEX idx_role_requests_status ON role_requests(status);
CREATE INDEX idx_role_requests_user_id ON role_requests(user_id);
```

### 3. Frontend Changes Needed

Update the AuthContext to use API calls instead of localStorage:

```typescript
// In contexts/AuthContext.tsx
const requestRoleUpgrade = async (requestedRole: UserRole, reason: string): Promise<void> => {
  if (!user) throw new Error('User not authenticated');
  
  const response = await fetch('/api/role-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      requested_role: requestedRole,
      reason: reason
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit role request');
  }
  
  toast.success('Role upgrade request submitted successfully');
};

const getRoleRequests = async (): Promise<RoleRequest[]> => {
  const response = await fetch('/api/role-requests', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch role requests');
  }
  
  return response.json();
};
```

## Implementation Options

### Option 1: Full-Stack Next.js (Recommended)

```bash
# Setup
npx create-next-app@latest your-app --typescript --tailwind --app
cd your-app
npm install @supabase/supabase-js @auth0/nextjs-auth0
```

**Pros:**
- Server-side rendering
- Built-in API routes
- Easy deployment on Vercel
- Good for SEO

### Option 2: React + Node.js/Express Backend

```bash
# Backend setup
mkdir backend
cd backend
npm init -y
npm install express cors helmet bcryptjs jsonwebtoken
npm install -D @types/node @types/express typescript ts-node
```

**Pros:**
- Separate frontend/backend
- More flexibility
- Can use any database

### Option 3: React + Supabase (Easiest)

```bash
npm install @supabase/supabase-js
```

**Pros:**
- No backend code needed
- Built-in auth
- Real-time subscriptions
- PostgreSQL database

## Recommended Setup: Next.js + Supabase

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Run the SQL schema above in Supabase SQL editor
4. Get your project URL and anon key

### 2. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. API Route Example

```typescript
// pages/api/role-requests/index.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { requested_role, reason } = req.body;
    const user = await getUser(req); // Your auth logic
    
    const { data, error } = await supabase
      .from('role_requests')
      .insert({
        user_id: user.id,
        current_role: user.role,
        requested_role,
        reason
      });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Send email notification to admins
    await sendAdminNotification(user, requested_role);
    
    res.json(data);
  }
  
  if (req.method === 'GET') {
    const user = await getUser(req);
    
    if (user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { data, error } = await supabase
      .from('role_requests')
      .select(`
        *,
        users:user_id (
          name,
          email,
          avatar_url
        )
      `)
      .order('requested_at', { ascending: false });
    
    res.json(data);
  }
}
```

### 4. Email Notifications

```typescript
// utils/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  // Your email service config
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendAdminNotification(user: User, requestedRole: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'vachon@gmail.com', // Super admin email
    subject: 'New Role Request - Portfolio Site',
    html: `
      <h2>New Role Request</h2>
      <p><strong>User:</strong> ${user.name} (${user.email})</p>
      <p><strong>Current Role:</strong> ${user.role}</p>
      <p><strong>Requested Role:</strong> ${requestedRole}</p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/role-requests">Review Request</a></p>
    `
  };
  
  await transporter.sendMail(mailOptions);
}
```

### 5. Real-time Updates (Optional)

```typescript
// hooks/useRoleRequests.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRoleRequests() {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    // Initial fetch
    fetchRequests();
    
    // Real-time subscription
    const subscription = supabase
      .channel('role_requests')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'role_requests' },
        (payload) => {
          console.log('Role request updated:', payload);
          fetchRequests(); // Refresh the list
        }
      )
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, []);
  
  return requests;
}
```

## Migration Steps

### 1. Database Migration

Create a script to migrate existing localStorage data:

```typescript
// scripts/migrate-data.ts
async function migrateLocalStorageData() {
  // Get existing users from localStorage
  const users = JSON.parse(localStorage.getItem('all-users') || '[]');
  const roleRequests = JSON.parse(localStorage.getItem('role-requests') || '[]');
  
  // Upload to Supabase
  for (const user of users) {
    await supabase.from('users').insert(user);
  }
  
  for (const request of roleRequests) {
    await supabase.from('role_requests').insert(request);
  }
}
```

### 2. Environment Setup

1. Set up your chosen backend (Next.js/Supabase recommended)
2. Create database tables
3. Configure authentication
4. Set up email service
5. Deploy to Vercel/Netlify

### 3. Testing

1. Test role request submission
2. Verify admin receives email notifications
3. Test role approval/rejection
4. Ensure data persists across browsers

## Security Considerations

1. **Input Validation**: Validate all form inputs
2. **Rate Limiting**: Prevent spam requests
3. **CSRF Protection**: Use CSRF tokens
4. **SQL Injection**: Use parameterized queries
5. **Authentication**: Verify JWT tokens
6. **Authorization**: Check user permissions

## Deployment Checklist

- [ ] Database schema created
- [ ] API endpoints implemented
- [ ] Authentication working
- [ ] Email notifications configured
- [ ] Frontend updated to use APIs
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Error logging configured
- [ ] Performance monitoring set up

## Quick Start with Supabase

If you want the fastest setup:

1. Create Supabase project
2. Run the SQL schema
3. Install `@supabase/supabase-js`
4. Replace localStorage calls with Supabase calls
5. Deploy to Vercel

This will give you a fully functional role request system in about 2 hours!