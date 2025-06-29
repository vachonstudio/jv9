import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config, isUsingDemoConfig, logConfigStatus } from './supabase-config'
import type { Database } from '../types/supabase'

// Log configuration status on import (but only once)
let hasLoggedStatus = false
if (!hasLoggedStatus && typeof window !== 'undefined') {
  logConfigStatus()
  hasLoggedStatus = true
}

// Create Supabase client with proper typing and error handling
export const createSupabaseClient = (): SupabaseClient<Database> => {
  try {
    return createClient<Database>(
      config.url,
      config.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          flowType: 'pkce'
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'X-Client-Info': 'vachon-ux-studio'
          }
        }
      }
    )
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    // Return a mock client if creation fails
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Demo mode - signup disabled' } }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Demo mode - signin disabled' } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        resetPasswordForEmail: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }) }) }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }) }),
      }),
    } as any
  }
}

// Create the client instance
export const supabase: SupabaseClient<Database> = createSupabaseClient()

// Initialize connection test only in browser environment
if (typeof window !== 'undefined') {
  // Test connection with error handling
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        if (isUsingDemoConfig()) {
          console.log('🔄 Demo mode: Connection test skipped (expected behavior)')
        } else {
          console.warn('⚠️ Supabase connection test failed:', error.message)
        }
      } else {
        if (!isUsingDemoConfig()) {
          console.log('✅ Supabase client initialized successfully')
        }
      }
    } catch (err) {
      if (isUsingDemoConfig()) {
        console.log('🔄 Demo mode: Connection test skipped due to demo credentials')
      } else {
        console.warn('⚠️ Supabase connection error:', err)
      }
    }
  }

  // Run connection test after a brief delay to avoid blocking initial render
  setTimeout(testConnection, 1000)
}

// Export configuration for runtime access
export { config, isUsingDemoConfig, updateSupabaseConfig } from './supabase-config'

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !isUsingDemoConfig() && 
         config.url.includes('supabase.co') && 
         config.anonKey.length > 20 &&
         !config.url.includes('demo-project')
}

// Helper function for server-side operations
export const createServerSupabaseClient = () => {
  try {
    const serverConfig = {
      url: config.url,
      key: config.serviceRoleKey || config.anonKey
    }
    
    return createClient<Database>(serverConfig.url, serverConfig.key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  } catch (error) {
    console.error('Failed to create server Supabase client:', error)
    throw error
  }
}

export default supabase