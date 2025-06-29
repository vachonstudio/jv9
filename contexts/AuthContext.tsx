'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isUsingDemoConfig } from '../lib/supabase'
import { UserRole, RoleRequest } from '../types/auth'

interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  logout: () => Promise<void> // Alias for signOut
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>
  canEdit: () => boolean
  isSuperAdmin: () => boolean
  isAdmin: () => boolean
  isEditor: () => boolean
  isSubscriber: () => boolean
  canManageUsers: () => boolean
  getRoleRequests: () => RoleRequest[]
  requestRoleUpgrade: (requestedRole: UserRole, reason: string) => Promise<void>
  approveRoleRequest: (requestId: string) => Promise<void>
  rejectRoleRequest: (requestId: string) => Promise<void>
  getAllUsers: () => any[]
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])

  useEffect(() => {
    if (isUsingDemoConfig()) {
      // Demo mode - create a mock admin user and mock user list
      console.log('🎭 Running in demo mode with mock authentication')
      setTimeout(() => {
        const mockUsers: any[] = [
          {
            id: 'demo-admin-user',
            email: 'vachon@demo.com',
            name: 'Vachon Admin (Demo)',
            role: 'super_admin',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 'demo-user-1',
            email: 'editor@demo.com',
            name: 'Demo Editor',
            role: 'editor',
            status: 'active',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 'demo-user-2',
            email: 'subscriber1@demo.com',
            name: 'Demo Subscriber',
            role: 'subscriber',
            status: 'active',
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-02-01T00:00:00Z',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 'demo-user-3',
            email: 'subscriber2@demo.com',
            name: 'Another User',
            role: 'subscriber',
            status: 'active',
            createdAt: '2024-02-15T00:00:00Z',
            updatedAt: '2024-02-15T00:00:00Z',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 'demo-user-4',
            email: 'admin@demo.com',
            name: 'Demo Admin',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-10T00:00:00Z',
            updatedAt: '2024-01-10T00:00:00Z',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
          }
        ]
        
        setAllUsers(mockUsers)
        setUser(mockUsers[0]) // Set as super admin
        setLoading(false)
      }, 1000)
      return
    }

    // Real Supabase mode
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    }).catch(error => {
      console.warn('Auth session error:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Load role requests for admins
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      if (isUsingDemoConfig()) {
        // Mock role requests for demo
        setRoleRequests([
          {
            id: 'demo-request-1',
            userId: 'demo-user-2',
            userName: 'Demo Subscriber',
            userEmail: 'subscriber1@demo.com',
            requestedRole: 'editor',
            currentRole: 'subscriber',
            reason: 'I would like to contribute content to the blog and help manage content.',
            status: 'pending',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            profiles: { name: 'Demo Subscriber', email: 'subscriber1@demo.com' }
          },
          {
            id: 'demo-request-2',
            userId: 'demo-user-3',
            userName: 'Another User',
            userEmail: 'subscriber2@demo.com',
            requestedRole: 'admin',
            currentRole: 'subscriber',
            reason: 'I have experience managing online communities and would like to help moderate the platform.',
            status: 'pending',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            profiles: { name: 'Another User', email: 'subscriber2@demo.com' }
          }
        ])
      } else {
        loadRoleRequests()
      }
    }
  }, [user])

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        // If profile doesn't exist, create one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
            role: 'subscriber'
          })
        
        if (insertError) {
          console.error('Error creating profile:', insertError)
        } else {
          // Retry loading the profile
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()
          
          if (newProfile) {
            setUser({
              id: authUser.id,
              email: authUser.email!,
              name: newProfile.name,
              avatar: newProfile.avatar_url,
              role: newProfile.role as UserRole
            })
          }
        }
        setLoading(false)
        return
      }

      setUser({
        id: authUser.id,
        email: authUser.email!,
        name: profile.name,
        avatar: profile.avatar_url,
        role: profile.role as UserRole
      })
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRoleRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('role_requests')
        .select(`
          *,
          profiles!role_requests_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setRoleRequests(data as any)
      }
    } catch (error) {
      console.error('Error loading role requests:', error)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (isUsingDemoConfig()) {
      // Mock signup for demo
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        name,
        role: 'subscriber' as UserRole
      }
      setUser(mockUser)
      return { user: mockUser, session: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    
    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    if (isUsingDemoConfig()) {
      // Mock signin for demo
      const mockUser = {
        id: 'demo-user-signin',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'super_admin' as UserRole : 'subscriber' as UserRole
      }
      setUser(mockUser)
      return { user: mockUser, session: null }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  const signOut = async () => {
    if (isUsingDemoConfig()) {
      setUser(null)
      setSession(null)
      setRoleRequests([])
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    setUser(null)
    setSession(null)
    setRoleRequests([])
  }

  // Alias for signOut to match the App.tsx expectations
  const logout = signOut

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return

    if (isUsingDemoConfig()) {
      setUser({ ...user, ...updates })
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        avatar_url: updates.avatar,
      })
      .eq('id', user.id)

    if (error) throw error

    setUser({ ...user, ...updates })
  }

  const requestRoleUpgrade = async (requestedRole: UserRole, reason: string) => {
    if (!user) throw new Error('User not authenticated')

    if (isUsingDemoConfig()) {
      console.log('Demo: Role upgrade requested', { requestedRole, reason })
      return
    }

    const { error } = await supabase
      .from('role_requests')
      .insert({
        user_id: user.id,
        requested_role: requestedRole,
        current_role: user.role,
        reason
      })

    if (error) throw error
  }

  const approveRoleRequest = async (requestId: string) => {
    if (!user || !canManageUsers()) throw new Error('Unauthorized')

    if (isUsingDemoConfig()) {
      setRoleRequests(prev => prev.filter(r => r.id !== requestId))
      console.log('Demo: Role request approved', requestId)
      return
    }

    // Get the request details
    const { data: request, error: fetchError } = await supabase
      .from('role_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !request) throw fetchError

    // Update user role
    const { error: roleError } = await supabase
      .from('profiles')
      .update({ role: request.requested_role })
      .eq('id', request.user_id)

    if (roleError) throw roleError

    // Update request status
    const { error: requestError } = await supabase
      .from('role_requests')
      .update({
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (requestError) throw requestError

    // Reload requests
    await loadRoleRequests()
  }

  const rejectRoleRequest = async (requestId: string) => {
    if (!user || !canManageUsers()) throw new Error('Unauthorized')

    if (isUsingDemoConfig()) {
      setRoleRequests(prev => prev.filter(r => r.id !== requestId))
      console.log('Demo: Role request rejected', requestId)
      return
    }

    const { error } = await supabase
      .from('role_requests')
      .update({
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (error) throw error

    await loadRoleRequests()
  }

  const getAllUsers = () => {
    return allUsers
  }

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (!user || !canManageUsers()) throw new Error('Unauthorized')

    if (isUsingDemoConfig()) {
      setAllUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ))
      console.log('Demo: User role updated', { userId, newRole })
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) throw error

    // Reload users (this would need a real implementation in production)
    console.log('User role updated successfully')
  }

  // Role checking functions
  const canEdit = () => user?.role && ['editor', 'admin', 'super_admin'].includes(user.role)
  const isSuperAdmin = () => user?.role === 'super_admin'
  const isAdmin = () => user?.role && ['admin', 'super_admin'].includes(user.role)
  const isEditor = () => user?.role && ['editor', 'admin', 'super_admin'].includes(user.role)
  const isSubscriber = () => user?.role === 'subscriber'
  const canManageUsers = () => user?.role && ['admin', 'super_admin'].includes(user.role)
  const getRoleRequests = () => roleRequests

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    logout, // Add the alias
    updateProfile,
    canEdit,
    isSuperAdmin,
    isAdmin,
    isEditor,
    isSubscriber,
    canManageUsers,
    getRoleRequests,
    requestRoleUpgrade,
    approveRoleRequest,
    rejectRoleRequest,
    getAllUsers,
    updateUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}