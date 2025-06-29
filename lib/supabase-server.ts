import { createClient } from '@supabase/supabase-js'
import { config, isUsingDemoConfig } from './supabase-config'
import type { Database } from '../types/supabase'

// Safe environment variable access for server-side
const getServerEnvVar = (key: string, fallback: string = ''): string => {
  try {
    return process?.env?.[key] || fallback
  } catch (error) {
    console.warn(`Could not access environment variable ${key}:`, error)
    return fallback
  }
}

// Server-side Supabase client with service role key
// This should ONLY be used in API routes and server-side functions
export function createServerSupabaseClient() {
  // In demo mode, return a mock client to prevent server errors
  if (isUsingDemoConfig()) {
    console.warn('🚨 Server-side Supabase: Using demo mode - API operations will be mocked')
    
    // Return a minimal mock client for server-side operations
    return {
      auth: {
        admin: {
          listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
          getUserById: () => Promise.resolve({ data: { user: null }, error: null }),
          updateUserById: () => Promise.resolve({ data: { user: null }, error: null }),
          deleteUser: () => Promise.resolve({ data: {}, error: null }),
        }
      },
      from: (table: string) => ({
        select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      }),
    } as any
  }

  // Get server-side environment variables
  const supabaseUrl = getServerEnvVar('NEXT_PUBLIC_SUPABASE_URL') || config.url
  const supabaseServiceRoleKey = getServerEnvVar('SUPABASE_SERVICE_ROLE_KEY') || config.serviceRoleKey

  if (!supabaseUrl || !supabaseServiceRoleKey || supabaseUrl.includes('demo-project')) {
    console.warn(`
      Missing or invalid Supabase server environment variables.
      Current values:
      - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'Missing'}
      - SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceRoleKey ? 'Set' : 'Missing'}
      
      Please set:
      - NEXT_PUBLIC_SUPABASE_URL=your-project-url
      - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
      
      Or update /lib/supabase-config.ts with your credentials.
      
      Falling back to demo mode for now.
    `)
    
    // Return mock client as fallback
    return {
      auth: {
        admin: {
          listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
          getUserById: () => Promise.resolve({ data: { user: null }, error: null }),
          updateUserById: () => Promise.resolve({ data: { user: null }, error: null }),
          deleteUser: () => Promise.resolve({ data: {}, error: null }),
        }
      },
      from: (table: string) => ({
        select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      }),
    } as any
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'vachon-ux-studio-server'
      }
    }
  })
}

// Helper function to safely use server client
export async function withServerSupabase<T>(
  operation: (client: ReturnType<typeof createServerSupabaseClient>) => Promise<T>
): Promise<T> {
  try {
    const client = createServerSupabaseClient()
    return await operation(client)
  } catch (error) {
    console.error('Server Supabase operation failed:', error)
    throw error
  }
}

// Export for convenience - but wrap in try-catch for safety
export const createSafeServerSupabaseClient = () => {
  try {
    return createServerSupabaseClient()
  } catch (error) {
    console.error('Failed to create server Supabase client:', error)
    // Return mock client as ultimate fallback
    return {
      auth: {
        admin: {
          listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
          getUserById: () => Promise.resolve({ data: { user: null }, error: null }),
          updateUserById: () => Promise.resolve({ data: { user: null }, error: null }),
          deleteUser: () => Promise.resolve({ data: {}, error: null }),
        }
      },
      from: (table: string) => ({
        select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      }),
    } as any
  }
}

export const serverSupabase = createSafeServerSupabaseClient()