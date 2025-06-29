import type { Database } from '../types/supabase'

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// Safe environment variable access that works in both server and client
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    // Client-side: only NEXT_PUBLIC_ vars are available
    return (window as any)?.__NEXT_DATA__?.props?.pageProps?.env?.[key] || fallback
  } else {
    // Server-side: full process.env access
    return process?.env?.[key] || fallback
  }
}

// Demo configuration for development/testing
const DEMO_CONFIG: SupabaseConfig = {
  url: 'https://demo-project.supabase.co',
  anonKey: 'demo-anon-key-replace-with-real-key',
  serviceRoleKey: 'demo-service-role-key-replace-with-real-key'
}

// Try to get environment variables safely
const envUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', DEMO_CONFIG.url)
const envAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', DEMO_CONFIG.anonKey)
const envServiceRoleKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', DEMO_CONFIG.serviceRoleKey)

// Use environment variables if available, otherwise fall back to demo
export const config: SupabaseConfig = {
  url: envUrl,
  anonKey: envAnonKey,
  serviceRoleKey: envServiceRoleKey
}

// Check if we're using demo configuration
export const isUsingDemoConfig = (): boolean => {
  return config.url.includes('demo-project') || 
         config.anonKey.includes('demo-anon-key') ||
         !config.url.includes('supabase.co') ||
         config.url === DEMO_CONFIG.url
}

// Log configuration status for debugging
export const logConfigStatus = (): void => {
  if (typeof window !== 'undefined') {
    if (isUsingDemoConfig()) {
      console.warn(`
🚨 DEMO MODE: Using demo Supabase configuration
📋 To connect to real Supabase:

For Vercel deployment:
1. Set up your Supabase project at https://supabase.com
2. Add environment variables in Vercel dashboard:
   - NEXT_PUBLIC_SUPABASE_URL=your-project-url
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
3. Redeploy your application

For local development:
1. Create .env.local file in project root
2. Add your Supabase credentials:
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
3. Restart development server

Current config: ${config.url}
      `)
    } else {
      console.log('✅ Using production Supabase configuration')
    }
  }
}

// Function to update config at runtime (for development)
export const updateSupabaseConfig = (newConfig: Partial<SupabaseConfig>): void => {
  Object.assign(config, newConfig)
  logConfigStatus()
  
  // If running in browser, trigger a page reload to reinitialize everything
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}

// Default export for convenience
export default config

// Re-export for backwards compatibility
export const SUPABASE_CONFIG = config
export const isDemoMode = isUsingDemoConfig