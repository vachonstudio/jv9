import { Project, projects, getPublicProjects, requiresAuthentication } from '../types/portfolio';
import { BlogPost, getPublicPosts, getPrivatePosts } from '../types/blog';
import { Gradient, gradients } from '../types/gradient';

export interface SearchResult {
  id: string;
  type: 'project' | 'blog_post' | 'gradient';
  title: string;
  description: string;
  image?: string;
  category?: string;
  tags?: string[];
  isPrivate?: boolean;
  data: Project | BlogPost | Gradient;
  score?: number;
}

export interface SearchFilters {
  type?: 'all' | 'project' | 'blog_post' | 'gradient';
  category?: string;
}

// Helper functions to get all content
function getAllProjects(isAuthenticated: boolean): Project[] {
  return isAuthenticated ? projects : getPublicProjects();
}

function getAllPosts(isAuthenticated: boolean): BlogPost[] {
  try {
    const publicPosts = getPublicPosts();
    const privatePosts = isAuthenticated ? getPrivatePosts() : [];
    return [...publicPosts, ...privatePosts];
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
}

// Fuzzy search function
function fuzzyMatch(searchTerm: string, text: string): number {
  if (!searchTerm || !text) return 0;
  
  const search = searchTerm.toLowerCase().trim();
  const target = text.toLowerCase();
  
  // Exact match gets highest score
  if (target.includes(search)) {
    const index = target.indexOf(search);
    // Earlier matches get higher scores, max 100
    return Math.max(100 - index, 50);
  }
  
  // Word boundary matches get high scores
  const words = target.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(search)) {
      return 75;
    }
    if (word.includes(search)) {
      return 60;
    }
  }
  
  // Character-by-character fuzzy matching
  let searchIndex = 0;
  let matchCount = 0;
  
  for (let i = 0; i < target.length && searchIndex < search.length; i++) {
    if (target[i] === search[searchIndex]) {
      matchCount++;
      searchIndex++;
    }
  }
  
  // Return percentage of characters matched, scaled to 0-40 range
  const fuzzyScore = searchIndex === search.length ? (matchCount / search.length) * 40 : 0;
  return Math.max(fuzzyScore, 0);
}

// Get searchable content for a project
function getProjectSearchableContent(project: Project): string {
  const content = [
    project.title,
    project.description,
    project.category,
    project.industry,
    project.role,
    ...(project.tags || []),
    ...(project.technologies || []),
    ...(project.challenges || []),
    ...(project.outcomes || []),
  ].filter(Boolean).join(' ');
  
  return content;
}

// Get searchable content for a blog post
function getBlogPostSearchableContent(post: BlogPost): string {
  const content = [
    post.title,
    post.excerpt,
    post.category,
    ...(post.tags || []),
    // Add content from content blocks
    ...(post.content?.map(block => {
      switch (block.type) {
        case 'text':
        case 'quote':
          return block.content;
        case 'image':
          return block.alt || '';
        case 'code':
          return block.language || '';
        default:
          return '';
      }
    }) || [])
  ].filter(Boolean).join(' ');
  
  return content;
}

// Get searchable content for a gradient
function getGradientSearchableContent(gradient: Gradient): string {
  const content = [
    gradient.name,
    gradient.description,
    ...(gradient.tags || []),
    gradient.colors.join(' ')
  ].filter(Boolean).join(' ');
  
  return content;
}

// Search projects
function searchProjects(
  searchTerm: string, 
  isAuthenticated: boolean,
  customProjects: Project[] = [],
  editedProjects: Record<string, Project> = {}
): SearchResult[] {
  try {
    // Get available projects based on authentication
    const baseProjects = getAllProjects(isAuthenticated);
    const allProjects = [...baseProjects, ...customProjects];
    
    // Apply edited versions
    const projectsToSearch = allProjects.map(project => editedProjects[project.id] || project);
    
    console.log(`Searching ${projectsToSearch.length} projects for "${searchTerm}"`);
    
    const results = projectsToSearch
      .map(project => {
        const searchableContent = getProjectSearchableContent(project);
        const score = fuzzyMatch(searchTerm, searchableContent);
        
        if (score > 0) {
          console.log(`Project "${project.title}" scored ${score}`);
        }
        
        return {
          id: project.id,
          type: 'project' as const,
          title: project.title,
          description: project.description,
          image: project.image,
          category: project.category,
          tags: project.tags,
          isPrivate: requiresAuthentication(project),
          data: project,
          score
        };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    
    console.log(`Found ${results.length} matching projects`);
    return results;
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
}

// Search blog posts
function searchBlogPosts(
  searchTerm: string, 
  isAuthenticated: boolean,
  customPosts: BlogPost[] = [],
  editedPosts: Record<string, BlogPost> = {}
): SearchResult[] {
  try {
    // Get available posts based on authentication
    const basePosts = getAllPosts(isAuthenticated);
    const allPosts = [...basePosts, ...customPosts];
    
    // Apply edited versions
    const postsToSearch = allPosts.map(post => editedPosts[post.id] || post);
    
    console.log(`Searching ${postsToSearch.length} blog posts for "${searchTerm}"`);
    
    const results = postsToSearch
      .map(post => {
        const searchableContent = getBlogPostSearchableContent(post);
        const score = fuzzyMatch(searchTerm, searchableContent);
        
        if (score > 0) {
          console.log(`Blog post "${post.title}" scored ${score}`);
        }
        
        return {
          id: post.id,
          type: 'blog_post' as const,
          title: post.title,
          description: post.excerpt,
          image: post.featuredImage,
          category: post.category,
          tags: post.tags,
          isPrivate: post.accessLevel === 'private',
          data: post,
          score
        };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    
    console.log(`Found ${results.length} matching blog posts`);
    return results;
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

// Search gradients
function searchGradients(
  searchTerm: string,
  customGradients: Gradient[] = []
): SearchResult[] {
  try {
    const allGradients = [...gradients, ...customGradients];
    
    console.log(`Searching ${allGradients.length} gradients for "${searchTerm}"`);
    
    const results = allGradients
      .map(gradient => {
        const searchableContent = getGradientSearchableContent(gradient);
        const score = fuzzyMatch(searchTerm, searchableContent);
        
        if (score > 0) {
          console.log(`Gradient "${gradient.name}" scored ${score}`);
        }
        
        return {
          id: gradient.id,
          type: 'gradient' as const,
          title: gradient.name,
          description: gradient.description || `Gradient with ${gradient.colors.length} colors`,
          image: gradient.css, // Use CSS as image for gradients
          category: gradient.tags?.[0] || 'Design',
          tags: gradient.tags,
          data: gradient,
          score
        };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    
    console.log(`Found ${results.length} matching gradients`);
    return results;
  } catch (error) {
    console.error('Error searching gradients:', error);
    return [];
  }
}

// Main search function
export function performSearch(
  searchTerm: string,
  filters: SearchFilters,
  isAuthenticated: boolean,
  customProjects: Project[] = [],
  editedProjects: Record<string, Project> = {},
  customPosts: BlogPost[] = [],
  editedPosts: Record<string, BlogPost> = {},
  customGradients: Gradient[] = []
): {
  projects: SearchResult[];
  blogPosts: SearchResult[];
  gradients: SearchResult[];
  total: number;
} {
  console.log('=== SEARCH DEBUG ===');
  console.log('Search term:', searchTerm);
  console.log('Filters:', filters);
  console.log('Is authenticated:', isAuthenticated);
  console.log('Custom projects:', customProjects.length);
  console.log('Custom posts:', customPosts.length);
  console.log('Custom gradients:', customGradients.length);
  
  const results = {
    projects: [] as SearchResult[],
    blogPosts: [] as SearchResult[],
    gradients: [] as SearchResult[],
    total: 0
  };
  
  if (!searchTerm || !searchTerm.trim()) {
    console.log('Empty search term, returning empty results');
    return results;
  }
  
  try {
    // Search based on filters
    if (filters.type === 'all' || filters.type === 'project' || !filters.type) {
      console.log('Searching projects...');
      results.projects = searchProjects(searchTerm, isAuthenticated, customProjects, editedProjects);
    }
    
    if (filters.type === 'all' || filters.type === 'blog_post' || !filters.type) {
      console.log('Searching blog posts...');
      results.blogPosts = searchBlogPosts(searchTerm, isAuthenticated, customPosts, editedPosts);
    }
    
    if (filters.type === 'all' || filters.type === 'gradient' || !filters.type) {
      console.log('Searching gradients...');
      results.gradients = searchGradients(searchTerm, customGradients);
    }
    
    // Apply category filter if specified
    if (filters.category) {
      console.log('Applying category filter:', filters.category);
      results.projects = results.projects.filter(result => 
        result.category?.toLowerCase() === filters.category?.toLowerCase()
      );
      results.blogPosts = results.blogPosts.filter(result => 
        result.category?.toLowerCase() === filters.category?.toLowerCase()
      );
      results.gradients = results.gradients.filter(result => 
        result.category?.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    
    results.total = results.projects.length + results.blogPosts.length + results.gradients.length;
    
    console.log('=== SEARCH RESULTS ===');
    console.log('Projects found:', results.projects.length);
    console.log('Blog posts found:', results.blogPosts.length);
    console.log('Gradients found:', results.gradients.length);
    console.log('Total results:', results.total);
    console.log('======================');
    
    return results;
  } catch (error) {
    console.error('Error in performSearch:', error);
    throw error;
  }
}

// Get recent searches from localStorage
export function getRecentSearches(): string[] {
  try {
    const recent = localStorage.getItem('recent_searches');
    return recent ? JSON.parse(recent) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
}

// Save a search term to recent searches
export function saveRecentSearch(searchTerm: string): void {
  if (!searchTerm.trim()) return;
  
  try {
    const recent = getRecentSearches();
    const updated = [searchTerm, ...recent.filter(term => term !== searchTerm)].slice(0, 10);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
}

// Clear recent searches
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem('recent_searches');
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}