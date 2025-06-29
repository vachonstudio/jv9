// Client-side only Supabase config for React app compatibility
// This file is for the current React app (App.tsx) until migration to Next.js is complete

// Mock Supabase client for development
const createMockSupabaseClient = () => {
  const mockUser = {
    id: 'mock-super-admin-id',
    email: 'vachon@gmail.com',
    user_metadata: {
      name: 'Vachon Admin'
    }
  };

  const mockProfile = {
    id: 'mock-super-admin-id',
    email: 'vachon@gmail.com',
    name: 'Vachon Admin',
    role: 'super_admin',
    avatar: null,
    bio: null,
    profile_image: null,
    background_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    auth: {
      getSession: () => Promise.resolve({ 
        data: { 
          session: {
            user: mockUser,
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            expires_at: Date.now() + 3600000,
            token_type: 'bearer'
          }
        }, 
        error: null 
      }),
      signUp: (credentials: any) => {
        console.log('Mock signup:', credentials.email);
        return Promise.resolve({ 
          data: { user: mockUser }, 
          error: null 
        });
      },
      signInWithPassword: (credentials: any) => {
        console.log('Mock signin:', credentials.email);
        return Promise.resolve({ 
          data: { user: mockUser }, 
          error: null 
        });
      },
      signOut: () => {
        console.log('Mock signout');
        return Promise.resolve({ error: null });
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        // Simulate initial session
        setTimeout(() => {
          callback('SIGNED_IN', {
            user: mockUser,
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            expires_at: Date.now() + 3600000,
            token_type: 'bearer'
          });
        }, 100);
        
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => console.log('Mock unsubscribe') 
            } 
          } 
        };
      },
      resetPasswordForEmail: (email: string) => {
        console.log('Mock password reset for:', email);
        return Promise.resolve({ error: null });
      },
    },
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: () => {
            if (table === 'profiles' && column === 'id') {
              return Promise.resolve({ data: mockProfile, error: null });
            }
            return Promise.resolve({ data: null, error: { message: 'Mock: Record not found' } });
          },
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: (data: any) => {
        console.log(`Mock insert into ${table}:`, data);
        return Promise.resolve({ 
          data: { ...data, id: 'mock-' + Date.now() }, 
          error: null 
        });
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          console.log(`Mock update in ${table} where ${column} = ${value}:`, data);
          return Promise.resolve({ error: null });
        }
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          console.log(`Mock delete from ${table} where ${column} = ${value}`);
          return Promise.resolve({ error: null });
        }
      }),
    }),
  };
};

// Export the mock client for the React app
export const supabase = createMockSupabaseClient();

// Helper functions for compatibility
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const isSuperAdmin = async (email?: string) => {
  if (!email) return false;
  return email === 'vachon@gmail.com';
};

export const isSupabaseConfigured = () => {
  return false; // Always return false for mock client
};

// Log development status
console.log('🔧 Using mock Supabase client for React app');
console.log('📝 To use real Supabase, migrate to Next.js version in /app directory');