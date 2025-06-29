export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string | null
          bio: string | null
          role: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          profile_image: string | null
          background_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar?: string | null
          bio?: string | null
          role?: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          profile_image?: string | null
          background_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar?: string | null
          bio?: string | null
          role?: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          profile_image?: string | null
          background_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          industry: string | null
          role: string | null
          image: string | null
          tags: string[] | null
          technologies: string[] | null
          challenges: string[] | null
          outcomes: string[] | null
          access_level: 'public' | 'private' | 'premium'
          content: any | null
          is_featured: boolean | null
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          industry?: string | null
          role?: string | null
          image?: string | null
          tags?: string[] | null
          technologies?: string[] | null
          challenges?: string[] | null
          outcomes?: string[] | null
          access_level?: 'public' | 'private' | 'premium'
          content?: any | null
          is_featured?: boolean | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          industry?: string | null
          role?: string | null
          image?: string | null
          tags?: string[] | null
          technologies?: string[] | null
          challenges?: string[] | null
          outcomes?: string[] | null
          access_level?: 'public' | 'private' | 'premium'
          content?: any | null
          is_featured?: boolean | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          excerpt: string
          category: string
          tags: string[] | null
          featured_image: string | null
          access_level: 'public' | 'private' | 'premium'
          content: any | null
          read_time: number | null
          is_featured: boolean | null
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          category: string
          tags?: string[] | null
          featured_image?: string | null
          access_level?: 'public' | 'private' | 'premium'
          content?: any | null
          read_time?: number | null
          is_featured?: boolean | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          category?: string
          tags?: string[] | null
          featured_image?: string | null
          access_level?: 'public' | 'private' | 'premium'
          content?: any | null
          read_time?: number | null
          is_featured?: boolean | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gradients: {
        Row: {
          id: string
          name: string
          description: string | null
          colors: string[]
          css: string
          tags: string[] | null
          is_custom: boolean | null
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          colors: string[]
          css: string
          tags?: string[] | null
          is_custom?: boolean | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          colors?: string[]
          css?: string
          tags?: string[] | null
          is_custom?: boolean | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          content_id: string
          content_type: 'project' | 'blog_post' | 'gradient'
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          content_type: 'project' | 'blog_post' | 'gradient'
          metadata?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          content_type?: 'project' | 'blog_post' | 'gradient'
          metadata?: any | null
          created_at?: string
        }
      }
      role_requests: {
        Row: {
          id: string
          user_id: string
          requested_role: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          current_role: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          reason: string | null
          status: 'pending' | 'approved' | 'denied'
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          requested_role: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          current_role: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          reason?: string | null
          status?: 'pending' | 'approved' | 'denied'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          requested_role?: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          current_role?: 'subscriber' | 'editor' | 'admin' | 'super_admin'
          reason?: string | null
          status?: 'pending' | 'approved' | 'denied'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          services: string[] | null
          budget: string | null
          timeline: string | null
          message: string
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          services?: string[] | null
          budget?: string | null
          timeline?: string | null
          message: string
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string | null
          services?: string[] | null
          budget?: string | null
          timeline?: string | null
          message?: string
          status?: string | null
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
      user_role: 'subscriber' | 'editor' | 'admin' | 'super_admin'
      role_request_status: 'pending' | 'approved' | 'denied'
      content_access_level: 'public' | 'private' | 'premium'
      content_type: 'project' | 'blog_post' | 'gradient'
    }
  }
}