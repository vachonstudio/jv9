import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, Grid, List, Heart, Palette, User, BookOpen, ExternalLink, Lock, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FavoriteItem, FavoriteContentType, getAllFavorites, getFavoritesByType } from "../utils/favorites";
import { projects, Project } from "../types/portfolio";
import { gradients, Gradient } from "../types/gradient";
import { BlogPost } from "../types/blog";

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  initialTab?: FavoriteContentType | 'all';
  onItemClick?: (item: any, type: FavoriteContentType) => void;
  isAuthenticated?: boolean;
}

export function ArchiveModal({ 
  isOpen, 
  onClose, 
  userId, 
  initialTab = 'all',
  onItemClick,
  isAuthenticated = false
}: ArchiveModalProps) {
  const [activeTab, setActiveTab] = useState<FavoriteContentType | 'all'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites when modal opens or tab changes
  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen, activeTab, userId]);

  // Filter and sort favorites when search/filters change
  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, searchQuery, sortBy, filterCategory, activeTab]);

  const loadFavorites = () => {
    if (activeTab === 'all') {
      setFavorites(getAllFavorites(userId));
    } else {
      const favoriteIds = getFavoritesByType(userId, activeTab);
      const favoriteItems = favoriteIds.map(id => {
        // Get the actual content data
        const content = getContentById(id, activeTab);
        if (content) {
          return {
            id,
            type: activeTab,
            title: content.title || content.name || 'Untitled',
            image: content.image || content.css,
            description: content.description || content.excerpt,
            category: content.category,
            tags: content.tags,
            isPrivate: activeTab === 'project' ? (content as Project).isPrivate : false,
            dateAdded: new Date().toISOString() // This would come from metadata in real implementation
          } as FavoriteItem;
        }
        return null;
      }).filter(Boolean) as FavoriteItem[];
      
      setFavorites(favoriteItems);
    }
  };

  const getContentById = (id: string, type: FavoriteContentType) => {
    switch (type) {
      case 'project':
        return projects.find(p => p.id === id);
      case 'gradient':
        return gradients.find(g => g.id === id);
      case 'blog_post':
        // This would need to be implemented with your blog posts data
        return null;
      default:
        return null;
    }
  };

  const filterAndSortFavorites = () => {
    let filtered = favorites;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.type === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'date':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    setFilteredFavorites(filtered);
  };

  const getTabIcon = (type: FavoriteContentType | 'all') => {
    switch (type) {
      case 'all': return Heart;
      case 'gradient': return Palette;
      case 'project': return User;
      case 'blog_post': return BookOpen;
      default: return Heart;
    }
  };

  const getTypeLabel = (type: FavoriteContentType) => {
    switch (type) {
      case 'gradient': return 'Gradient';
      case 'project': return 'Project';
      case 'blog_post': return 'Story';
      default: return 'Item';
    }
  };

  const handleItemClick = (item: FavoriteItem) => {
    if (onItemClick) {
      const content = getContentById(item.id, item.type);
      if (content) {
        onItemClick(content, item.type);
      }
    }
  };

  const renderGridItem = (item: FavoriteItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => handleItemClick(item)}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
        {item.type === 'gradient' ? (
          <div 
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            style={{ background: item.image }}
          />
        ) : (
          <>
            <img
              src={item.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop'}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {item.isPrivate && !isAuthenticated && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            )}
          </>
        )}
        
        {/* Type indicator */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/20 text-white border-white/20 backdrop-blur-sm">
            {getTypeLabel(item.type)}
          </Badge>
        </div>

        {/* Privacy indicator */}
        {item.type === 'project' && (
          <div className="absolute top-2 right-2">
            <Badge 
              variant={item.isPrivate ? "destructive" : "secondary"}
              className={`${item.isPrivate 
                ? "bg-orange-500/20 text-orange-100 border-orange-400/30" 
                : "bg-green-500/20 text-green-100 border-green-400/30"
              } backdrop-blur-sm`}
            >
              {item.isPrivate ? (
                <>
                  <Lock className="w-3 h-3 mr-1" />
                  Premium
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Free
                </>
              )}
            </Badge>
          </div>
        )}

        {/* Overlay with action */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button size="sm" className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30">
              <ExternalLink className="w-4 h-4 mr-2" />
              View {getTypeLabel(item.type)}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="font-medium truncate group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {item.category && (
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(item.dateAdded).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const renderListItem = (item: FavoriteItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer group transition-colors"
      onClick={() => handleItemClick(item)}
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {item.type === 'gradient' ? (
          <div 
            className="w-full h-full"
            style={{ background: item.image }}
          />
        ) : (
          <img
            src={item.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=64&h=64&fit=crop'}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate group-hover:text-primary transition-colors">
            {item.title}
          </h4>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {getTypeLabel(item.type)}
          </Badge>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {item.category && (
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(item.dateAdded).toLocaleDateString()}
          </span>
        </div>
      </div>

      <Button size="sm" variant="ghost" className="flex-shrink-0">
        <ExternalLink className="w-4 h-4" />
      </Button>
    </motion.div>
  );

  // Get unique categories for filter
  const categories = [...new Set(favorites.map(item => item.category).filter(Boolean))];

  const tabCounts = {
    all: favorites.length,
    gradient: favorites.filter(item => item.type === 'gradient').length,
    project: favorites.filter(item => item.type === 'project').length,
    blog_post: favorites.filter(item => item.type === 'blog_post').length,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              My Favorites
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters and Search */}
          <div className="p-6 pb-4 border-b space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Added</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>

                {categories.length > 0 && (
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category!}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 mx-6 mt-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  All ({tabCounts.all})
                </TabsTrigger>
                <TabsTrigger value="project" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Projects ({tabCounts.project})
                </TabsTrigger>
                <TabsTrigger value="blog_post" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Stories ({tabCounts.blog_post})
                </TabsTrigger>
                <TabsTrigger value="gradient" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Gradients ({tabCounts.gradient})
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {filteredFavorites.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <Heart className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                      <p className="text-muted-foreground max-w-md">
                        Start exploring and add items to your favorites to see them here.
                      </p>
                    </motion.div>
                  ) : viewMode === 'grid' ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {filteredFavorites.map((item, index) => renderGridItem(item, index))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      {filteredFavorites.map((item, index) => renderListItem(item, index))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}