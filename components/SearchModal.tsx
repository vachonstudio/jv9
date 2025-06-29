import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ArrowRight, 
  User, 
  BookOpen, 
  Palette, 
  Clock, 
  Filter,
  Command,
  ArrowUp,
  ArrowDown,
  Enter
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  performSearch, 
  SearchResult, 
  SearchFilters,
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches
} from '../utils/search';
import { Project } from '../types/portfolio';
import { BlogPost } from '../types/blog';
import { Gradient } from '../types/gradient';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  customProjects?: Project[];
  editedProjects?: Record<string, Project>;
  customPosts?: BlogPost[];
  editedPosts?: Record<string, BlogPost>;
  customGradients?: Gradient[];
  onProjectClick: (project: Project) => void;
  onBlogPostClick: (post: BlogPost) => void;
  onGradientClick: (gradient: Gradient) => void;
}

const contentTypeIcons = {
  project: User,
  blog_post: BookOpen,
  gradient: Palette
};

const contentTypeLabels = {
  project: 'Projects',
  blog_post: 'Stories',
  gradient: 'Gradients'
};

export function SearchModal({
  isOpen,
  onClose,
  isAuthenticated,
  customProjects = [],
  editedProjects = {},
  customPosts = [],
  editedPosts = {},
  customGradients = [],
  onProjectClick,
  onBlogPostClick,
  onGradientClick
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all' });
  const [searchResults, setSearchResults] = useState({
    projects: [] as SearchResult[],
    blogPosts: [] as SearchResult[],
    gradients: [] as SearchResult[],
    total: 0
  });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults({ projects: [], blogPosts: [], gradients: [], total: 0 });
      setSelectedIndex(-1);
      setSearchError(null);
    }
  }, [isOpen]);

  // Debounced search with error handling
  const performSearchDebounced = useCallback((term: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      try {
        setIsLoading(true);
        setSearchError(null);
        
        console.log('Performing search for:', term);
        console.log('Search filters:', filters);
        console.log('Is authenticated:', isAuthenticated);
        
        const results = performSearch(
          term,
          filters,
          isAuthenticated,
          customProjects,
          editedProjects,
          customPosts,
          editedPosts,
          customGradients
        );
        
        console.log('Search results:', results);
        
        setSearchResults(results);
        setSelectedIndex(-1);
        setIsLoading(false);
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('An error occurred while searching. Please try again.');
        setIsLoading(false);
      }
    }, 300);
  }, [filters, isAuthenticated, customProjects, editedProjects, customPosts, editedPosts, customGradients]);

  // Handle search term change
  useEffect(() => {
    if (searchTerm.trim()) {
      performSearchDebounced(searchTerm);
    } else {
      setSearchResults({ projects: [], blogPosts: [], gradients: [], total: 0 });
      setSelectedIndex(-1);
      setSearchError(null);
    }
  }, [searchTerm, performSearchDebounced]);

  // Get all results in order for keyboard navigation
  const getAllResults = useCallback((): SearchResult[] => {
    return [
      ...searchResults.projects,
      ...searchResults.blogPosts,
      ...searchResults.gradients
    ];
  }, [searchResults]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const allResults = getAllResults();
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < allResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && allResults[selectedIndex]) {
            handleResultClick(allResults[selectedIndex]);
          } else if (searchTerm.trim()) {
            handleSearch();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchTerm, getAllResults, onClose]);

  // Handle search submission
  const handleSearch = () => {
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
      setRecentSearches(getRecentSearches());
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
    }
    
    try {
      switch (result.type) {
        case 'project':
          onProjectClick(result.data as Project);
          break;
        case 'blog_post':
          onBlogPostClick(result.data as BlogPost);
          break;
        case 'gradient':
          onGradientClick(result.data as Gradient);
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Error handling result click:', error);
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
  };

  // Clear recent searches
  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Result component
  const SearchResultItem = ({ result, index }: { result: SearchResult; index: number }) => {
    const Icon = contentTypeIcons[result.type];
    const isSelected = index === selectedIndex;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg cursor-pointer transition-all ${
          isSelected 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-muted/50'
        }`}
        onClick={() => handleResultClick(result)}
      >
        <div className="flex items-start gap-3">
          {result.type === 'gradient' ? (
            <div 
              className="w-12 h-12 rounded-lg flex-shrink-0"
              style={{ background: result.image }}
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              {result.image ? (
                <img 
                  src={result.image} 
                  alt={result.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Icon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium truncate ${isSelected ? 'text-primary-foreground' : ''}`}>
                {result.title}
              </h4>
              {result.isPrivate && (
                <Badge variant="secondary" className="text-xs">
                  Premium
                </Badge>
              )}
            </div>
            
            <p className={`text-sm line-clamp-2 mb-2 ${
              isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
            }`}>
              {result.description}
            </p>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${isSelected ? 'border-primary-foreground/20' : ''}`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {contentTypeLabels[result.type]}
              </Badge>
              
              {result.category && (
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                >
                  {result.category}
                </Badge>
              )}
            </div>
          </div>
          
          <ArrowRight className={`w-4 h-4 flex-shrink-0 ${
            isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
          }`} />
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
                onClick={() => setSearchTerm('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Search Filters */}
          <div className="flex items-center gap-2 mt-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'project', label: 'Projects' },
                { value: 'blog_post', label: 'Stories' },
                { value: 'gradient', label: 'Gradients' }
              ].map((filter) => (
                <Badge
                  key={filter.value}
                  variant={filters.type === filter.value ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => setFilters({ ...filters, type: filter.value as any })}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↵</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </DialogHeader>

        {/* Search Results */}
        <div ref={resultsRef} className="flex-1 overflow-y-auto p-6 pt-4 min-h-[60vh]">
          {/* Error State */}
          {searchError && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-medium mb-2 text-destructive">Search Error</h3>
              <p className="text-muted-foreground">{searchError}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !searchError && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
              <span className="text-muted-foreground">Searching...</span>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && !searchError && searchTerm.trim() ? (
            searchResults.total > 0 ? (
              <div className="space-y-6">
                {/* Results Summary */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Found {searchResults.total} result{searchResults.total !== 1 ? 's' : ''} for "{searchTerm}"
                  </p>
                </div>

                {/* Projects */}
                {searchResults.projects.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4" />
                      <h3 className="font-medium">Projects ({searchResults.projects.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {searchResults.projects.map((result, index) => (
                        <SearchResultItem 
                          key={result.id} 
                          result={result} 
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Posts */}
                {searchResults.blogPosts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4" />
                      <h3 className="font-medium">Stories ({searchResults.blogPosts.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {searchResults.blogPosts.map((result, index) => (
                        <SearchResultItem 
                          key={result.id} 
                          result={result} 
                          index={searchResults.projects.length + index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Gradients */}
                {searchResults.gradients.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-4 h-4" />
                      <h3 className="font-medium">Gradients ({searchResults.gradients.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {searchResults.gradients.map((result, index) => (
                        <SearchResultItem 
                          key={result.id} 
                          result={result} 
                          index={searchResults.projects.length + searchResults.blogPosts.length + index}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try different keywords or check your spelling
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>Search tips:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Use broader terms</li>
                    <li>Check for typos</li>
                    <li>Try different content types using the filters above</li>
                  </ul>
                </div>
              </div>
            )
          ) : !isLoading && !searchError && (
            /* Recent Searches */
            <div className="py-4">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <h3 className="font-medium">Recent Searches</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearRecent}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((term, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleRecentSearchClick(term)}
                      >
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1">{term}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Start Searching</h3>
                  <p className="text-muted-foreground">
                    Search across projects, stories, and gradients to find what you're looking for
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}