import { supabase } from '../lib/supabase';
import { toast } from 'sonner@2.0.3';

interface MigrationResult {
  success: boolean;
  migratedItems: {
    gradients: number;
    favorites: number;
    projects: number;
    posts: number;
  };
  errors: string[];
}

export async function migrateLocalStorageData(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedItems: {
      gradients: 0,
      favorites: 0,
      projects: 0,
      posts: 0
    },
    errors: []
  };

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be logged in to migrate data');
    }

    console.log('Starting data migration for user:', user.id);

    // Migrate custom gradients
    try {
      const localGradients = JSON.parse(localStorage.getItem('custom-gradients') || '[]');
      if (localGradients.length > 0) {
        const gradientInserts = localGradients.map((gradient: any) => ({
          id: gradient.id,
          name: gradient.name,
          colors: gradient.colors,
          direction: gradient.direction || 'to right',
          is_custom: true,
          created_by: user.id
        }));

        const { error: gradientsError } = await supabase
          .from('gradients')
          .upsert(gradientInserts, { onConflict: 'id' });

        if (gradientsError) {
          result.errors.push(`Gradients migration error: ${gradientsError.message}`);
        } else {
          result.migratedItems.gradients = gradientInserts.length;
          console.log(`Migrated ${gradientInserts.length} custom gradients`);
        }
      }
    } catch (error: any) {
      result.errors.push(`Gradients migration failed: ${error.message}`);
    }

    // Migrate favorites
    try {
      const localFavorites = JSON.parse(localStorage.getItem('gradient-favorites') || '[]');
      if (localFavorites.length > 0) {
        const favoriteInserts = localFavorites.map((gradientId: string) => ({
          user_id: user.id,
          gradient_id: gradientId
        }));

        const { error: favoritesError } = await supabase
          .from('user_favorites')
          .upsert(favoriteInserts, { onConflict: 'user_id,gradient_id' });

        if (favoritesError) {
          result.errors.push(`Favorites migration error: ${favoritesError.message}`);
        } else {
          result.migratedItems.favorites = favoriteInserts.length;
          console.log(`Migrated ${favoriteInserts.length} favorites`);
        }
      }
    } catch (error: any) {
      result.errors.push(`Favorites migration failed: ${error.message}`);
    }

    // Migrate custom projects
    try {
      const customProjects = JSON.parse(localStorage.getItem('custom-projects') || '[]');
      const editedProjects = JSON.parse(localStorage.getItem('edited-projects') || '{}');
      
      const allProjects = [...customProjects, ...Object.values(editedProjects)];
      
      if (allProjects.length > 0) {
        const projectInserts = allProjects.map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          tags: project.tags,
          image_url: project.image,
          is_featured: project.featured || false,
          is_public: !project.isPrivate,
          content: project.content || project.sections,
          created_by: user.id
        }));

        const { error: projectsError } = await supabase
          .from('projects')
          .upsert(projectInserts, { onConflict: 'id' });

        if (projectsError) {
          result.errors.push(`Projects migration error: ${projectsError.message}`);
        } else {
          result.migratedItems.projects = projectInserts.length;
          console.log(`Migrated ${projectInserts.length} projects`);
        }
      }
    } catch (error: any) {
      result.errors.push(`Projects migration failed: ${error.message}`);
    }

    // Migrate blog posts
    try {
      const customPosts = JSON.parse(localStorage.getItem('custom-posts') || '[]');
      const editedPosts = JSON.parse(localStorage.getItem('edited-posts') || '{}');
      
      const allPosts = [...customPosts, ...Object.values(editedPosts)];
      
      if (allPosts.length > 0) {
        const postInserts = allPosts.map((post: any) => ({
          id: post.id,
          title: post.title,
          slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-'),
          excerpt: post.excerpt,
          content: post.content || post.sections,
          image_url: post.image,
          category: post.category,
          tags: post.tags,
          is_featured: post.featured || false,
          is_public: !post.isPrivate,
          status: 'published' as const,
          created_by: user.id
        }));

        const { error: postsError } = await supabase
          .from('blog_posts')
          .upsert(postInserts, { onConflict: 'id' });

        if (postsError) {
          result.errors.push(`Blog posts migration error: ${postsError.message}`);
        } else {
          result.migratedItems.posts = postInserts.length;
          console.log(`Migrated ${postInserts.length} blog posts`);
        }
      }
    } catch (error: any) {
      result.errors.push(`Blog posts migration failed: ${error.message}`);
    }

    // Migration completed
    result.success = result.errors.length === 0;

    if (result.success) {
      // Clear localStorage after successful migration
      const keysToRemove = [
        'custom-gradients',
        'gradient-favorites', 
        'edited-projects',
        'edited-posts',
        'custom-projects',
        'custom-posts',
        'user-signed-up',
        'user-data'
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      toast.success('Data migrated successfully to Supabase!');
      console.log('Migration completed successfully:', result.migratedItems);
    } else {
      toast.error(`Migration completed with errors: ${result.errors.join(', ')}`);
      console.error('Migration errors:', result.errors);
    }

    return result;
  } catch (error: any) {
    result.errors.push(`Migration failed: ${error.message}`);
    console.error('Migration error:', error);
    toast.error(error.message || 'Failed to migrate data');
    return result;
  }
}

export async function checkMigrationStatus(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if user has any data in Supabase that might indicate previous migration
    const [gradientsResult, favoritesResult] = await Promise.all([
      supabase.from('gradients').select('id').eq('created_by', user.id).limit(1),
      supabase.from('user_favorites').select('id').eq('user_id', user.id).limit(1)
    ]);

    const hasSupabaseData = (gradientsResult.data?.length || 0) > 0 || 
                           (favoritesResult.data?.length || 0) > 0;

    // Check if localStorage has data that needs migration
    const hasLocalStorageData = !!(
      localStorage.getItem('custom-gradients') ||
      localStorage.getItem('gradient-favorites') ||
      localStorage.getItem('custom-projects') ||
      localStorage.getItem('custom-posts')
    );

    return hasLocalStorageData && !hasSupabaseData;
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
}

export async function promptForMigration(): Promise<boolean> {
  const shouldMigrate = await checkMigrationStatus();
  
  if (shouldMigrate) {
    const userWantsMigration = window.confirm(
      'We found data from your previous sessions. Would you like to migrate it to your account? This will preserve your custom gradients, favorites, and other content.'
    );
    
    if (userWantsMigration) {
      const result = await migrateLocalStorageData();
      return result.success;
    }
  }
  
  return false;
}