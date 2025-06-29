export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          avatar_url: string | null
          bio: string | null
          background_image: string | null
          status: 'active' | 'inactive' | 'banned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          avatar_url?: string | null
          bio?: string | null
          background_image?: string | null
          status?: 'active' | 'inactive' | 'banned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          avatar_url?: string | null
          bio?: string | null
          background_image?: string | null
          status?: 'active' | 'inactive' | 'banned'
          created_at?: string
          updated_at?: string
        }
      }
      role_requests: {
        Row: {
          id: string
          user_id: string
          current_role: string
          requested_role: string
          reason: string
          status: 'pending' | 'approved' | 'rejected'
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          current_role: string
          requested_role: string
          reason: string
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          current_role?: string
          requested_role?: string
          reason?: string
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string | null
          tags: string[] | null
          image_url: string | null
          is_featured: boolean
          is_public: boolean
          content: any | null // JSONB
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category?: string | null
          tags?: string[] | null
          image_url?: string | null
          is_featured?: boolean
          is_public?: boolean
          content?: any | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string | null
          tags?: string[] | null
          image_url?: string | null
          is_featured?: boolean
          is_public?: boolean
          content?: any | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string | null
          excerpt: string | null
          content: any | null // JSONB
          image_url: string | null
          category: string | null
          tags: string[] | null
          is_featured: boolean
          is_public: boolean
          status: 'draft' | 'published' | 'archived'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          excerpt?: string | null
          content?: any | null
          image_url?: string | null
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          is_public?: boolean
          status?: 'draft' | 'published' | 'archived'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          excerpt?: string | null
          content?: any | null
          image_url?: string | null
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          is_public?: boolean
          status?: 'draft' | 'published' | 'archived'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gradients: {
        Row: {
          id: string
          name: string
          colors: string[]
          direction: string
          is_featured: boolean
          is_custom: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          colors: string[]
          direction?: string
          is_featured?: boolean
          is_custom?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          colors?: string[]
          direction?: string
          is_featured?: boolean
          is_custom?: boolean
          created_by?: string | null
          created_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          gradient_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gradient_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gradient_id?: string
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          message: string
          services: string[] | null
          budget_range: string | null
          timeline: string | null
          status: 'new' | 'read' | 'replied' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          message: string
          services?: string[] | null
          budget_range?: string | null
          timeline?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string | null
          message?: string
          services?: string[] | null
          budget_range?: string | null
          timeline?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type RoleRequest = Database['public']['Tables']['role_requests']['Row']
export type RoleRequestInsert = Database['public']['Tables']['role_requests']['Insert']
export type RoleRequestUpdate = Database['public']['Tables']['role_requests']['Update']

export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type BlogPostRow = Database['public']['Tables']['blog_posts']['Row']
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update']

export type GradientRow = Database['public']['Tables']['gradients']['Row']
export type GradientInsert = Database['public']['Tables']['gradients']['Insert']
export type GradientUpdate = Database['public']['Tables']['gradients']['Update']

export type ContactMessageRow = Database['public']['Tables']['contact_messages']['Row']
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert']
export type ContactMessageUpdate = Database['public']['Tables']['contact_messages']['Update']

export type UserRole = UserProfile['role']