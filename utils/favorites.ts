import { toast } from "sonner";

// Universal content types that can be favorited
export type FavoriteContentType = 'gradient' | 'project' | 'blog_post';

export interface FavoriteItem {
  id: string;
  type: FavoriteContentType;
  title: string;
  image?: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPrivate?: boolean;
  dateAdded: string;
}

// Get user-specific storage key
const getUserStorageKey = (userId: string | null, type: FavoriteContentType) => {
  const baseUserId = userId || 'guest-user';
  return `user-favorites-${type}-${baseUserId}`;
};

// Get all favorites for a user by type
export const getFavoritesByType = (userId: string | null, type: FavoriteContentType): string[] => {
  try {
    const storageKey = getUserStorageKey(userId, type);
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(`Error loading ${type} favorites:`, error);
    return [];
  }
};

// Get all favorites across all types with metadata
export const getAllFavorites = (userId: string | null): FavoriteItem[] => {
  try {
    const allFavorites: FavoriteItem[] = [];
    
    // Get all content types
    const types: FavoriteContentType[] = ['gradient', 'project', 'blog_post'];
    
    types.forEach(type => {
      const favoriteIds = getFavoritesByType(userId, type);
      const metadataKey = `user-favorites-metadata-${type}-${userId || 'guest-user'}`;
      const metadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
      
      favoriteIds.forEach(id => {
        if (metadata[id]) {
          allFavorites.push(metadata[id]);
        }
      });
    });
    
    // Sort by date added (newest first)
    return allFavorites.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  } catch (error) {
    console.error('Error loading all favorites:', error);
    return [];
  }
};

// Check if an item is favorited
export const isFavorited = (userId: string | null, itemId: string, type: FavoriteContentType): boolean => {
  const favorites = getFavoritesByType(userId, type);
  return favorites.includes(itemId);
};

// Toggle favorite status
export const toggleFavorite = (
  userId: string | null, 
  itemId: string, 
  type: FavoriteContentType,
  metadata: Omit<FavoriteItem, 'id' | 'type' | 'dateAdded'>
): boolean => {
  try {
    const storageKey = getUserStorageKey(userId, type);
    const metadataKey = `user-favorites-metadata-${type}-${userId || 'guest-user'}`;
    
    const favorites = getFavoritesByType(userId, type);
    const existingMetadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
    
    const isCurrentlyFavorited = favorites.includes(itemId);
    
    if (isCurrentlyFavorited) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(id => id !== itemId);
      localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
      
      // Remove metadata
      delete existingMetadata[itemId];
      localStorage.setItem(metadataKey, JSON.stringify(existingMetadata));
      
      toast.success('Removed from favorites');
      return false;
    } else {
      // Add to favorites
      const updatedFavorites = [...favorites, itemId];
      localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
      
      // Add metadata
      const favoriteItem: FavoriteItem = {
        id: itemId,
        type,
        dateAdded: new Date().toISOString(),
        ...metadata
      };
      existingMetadata[itemId] = favoriteItem;
      localStorage.setItem(metadataKey, JSON.stringify(existingMetadata));
      
      toast.success('Added to favorites');
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    toast.error('Failed to update favorites');
    return false;
  }
};

// Get favorites count by type
export const getFavoritesCount = (userId: string | null, type: FavoriteContentType): number => {
  return getFavoritesByType(userId, type).length;
};

// Get total favorites count
export const getTotalFavoritesCount = (userId: string | null): number => {
  const types: FavoriteContentType[] = ['gradient', 'project', 'blog_post'];
  return types.reduce((total, type) => total + getFavoritesCount(userId, type), 0);
};

// Remove a favorite (for cleanup when content is deleted)
export const removeFavorite = (userId: string | null, itemId: string, type: FavoriteContentType): void => {
  try {
    const storageKey = getUserStorageKey(userId, type);
    const metadataKey = `user-favorites-metadata-${type}-${userId || 'guest-user'}`;
    
    const favorites = getFavoritesByType(userId, type);
    const updatedFavorites = favorites.filter(id => id !== itemId);
    localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
    
    const existingMetadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
    delete existingMetadata[itemId];
    localStorage.setItem(metadataKey, JSON.stringify(existingMetadata));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

// Clear all favorites for a user (for logout cleanup)
export const clearAllFavorites = (userId: string | null): void => {
  try {
    const types: FavoriteContentType[] = ['gradient', 'project', 'blog_post'];
    types.forEach(type => {
      const storageKey = getUserStorageKey(userId, type);
      const metadataKey = `user-favorites-metadata-${type}-${userId || 'guest-user'}`;
      localStorage.removeItem(storageKey);
      localStorage.removeItem(metadataKey);
    });
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};

// Legacy support for gradient favorites (to maintain compatibility)
export const getLegacyGradientFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem('gradient-favorites');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading legacy gradient favorites:', error);
    return [];
  }
};

// Migrate legacy gradient favorites to new system
export const migrateLegacyGradientFavorites = (userId: string | null): void => {
  try {
    const legacyFavorites = getLegacyGradientFavorites();
    if (legacyFavorites.length > 0) {
      const storageKey = getUserStorageKey(userId, 'gradient');
      const existingFavorites = getFavoritesByType(userId, 'gradient');
      
      // Merge legacy with existing (avoid duplicates)
      const mergedFavorites = [...new Set([...existingFavorites, ...legacyFavorites])];
      localStorage.setItem(storageKey, JSON.stringify(mergedFavorites));
      
      // Remove legacy storage
      localStorage.removeItem('gradient-favorites');
      
      console.log(`Migrated ${legacyFavorites.length} legacy gradient favorites`);
    }
  } catch (error) {
    console.error('Error migrating legacy favorites:', error);
  }
};