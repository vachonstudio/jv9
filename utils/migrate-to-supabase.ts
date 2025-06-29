import { supabase } from '../lib/supabase'
import { Project, BlogPost, Gradient } from '../types'

export class DataMigrator {
  static async migrateProjects(projects: Project[]) {
    console.log('Migrating projects to Supabase...')
    
    for (const project of projects) {
      try {
        const { error } = await supabase
          .from('projects')
          .upsert({
            id: project.id,
            title: project.title,
            description: project.description,
            content: project.content,
            image: project.image,
            category: project.category,
            tags: project.tags,
            is_private: project.isPrivate,
            is_featured: project.isFeatured,
            // author_id: 'your-admin-user-id', // Set this to your admin user ID
          })

        if (error) {
          console.error(`Error migrating project ${project.id}:`, error)
        } else {
          console.log(`Migrated project: ${project.title}`)
        }
      } catch (error) {
        console.error(`Failed to migrate project ${project.id}:`, error)
      }
    }
  }

  static async migrateBlogPosts(posts: BlogPost[]) {
    console.log('Migrating blog posts to Supabase...')
    
    for (const post of posts) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .upsert({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            cover_image: post.coverImage,
            category: post.category,
            tags: post.tags,
            is_subscriber_only: post.isSubscriberOnly,
            is_featured: post.isFeatured,
            published_at: post.publishedAt,
            read_time: post.readTime,
            likes: post.likes,
            views: post.views,
            // author_id: 'your-admin-user-id',
          })

        if (error) {
          console.error(`Error migrating blog post ${post.id}:`, error)
        } else {
          console.log(`Migrated blog post: ${post.title}`)
        }
      } catch (error) {
        console.error(`Failed to migrate blog post ${post.id}:`, error)
      }
    }
  }

  static async migrateGradients(gradients: Gradient[]) {
    console.log('Migrating gradients to Supabase...')
    
    for (const gradient of gradients) {
      try {
        const { error } = await supabase
          .from('gradients')
          .upsert({
            id: gradient.id,
            name: gradient.name,
            css: gradient.css,
            colors: gradient.colors,
            tags: gradient.tags,
            is_custom: gradient.isCustom,
            // author_id: null, // For default gradients
          })

        if (error) {
          console.error(`Error migrating gradient ${gradient.id}:`, error)
        } else {
          console.log(`Migrated gradient: ${gradient.name}`)
        }
      } catch (error) {
        console.error(`Failed to migrate gradient ${gradient.id}:`, error)
      }
    }
  }

  static async migrateFavorites(userId: string, favorites: any[]) {
    console.log('Migrating user favorites to Supabase...')
    
    for (const favorite of favorites) {
      try {
        const { error } = await supabase
          .from('favorites')
          .upsert({
            user_id: userId,
            content_id: favorite.id,
            content_type: favorite.type,
            metadata: {
              title: favorite.title,
              image: favorite.image,
              description: favorite.description,
              category: favorite.category,
              tags: favorite.tags
            }
          })

        if (error) {
          console.error(`Error migrating favorite ${favorite.id}:`, error)
        }
      } catch (error) {
        console.error(`Failed to migrate favorite ${favorite.id}:`, error)
      }
    }
  }
}