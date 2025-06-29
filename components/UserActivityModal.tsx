import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, Grid, List, Heart, Palette, User, BookOpen, ExternalLink, Lock, Globe, Upload, Activity, Bookmark } from "lucide-react";
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
import { toast } from "sonner";

interface UserActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  initialTab?: FavoriteContentType | 'all' | 'saved';
  onItemClick?: (item: any, type: FavoriteContentType) => void;
  isAuthenticated?: boolean;
}

// Extended activity types for user activity
type ActivityType = FavoriteContentType | 'all' | 'saved';

export function UserActivityModal({ 
  isOpen, 
  onClose, 
  userId, 
  initialTab = 'all',
  onItemClick,
  isAuthenticated = false
}: UserActivityModalProps) {
  const [activeTab, setActiveTab] = useState<ActivityType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } else if (activeTab === 'saved') {
      // For saved items, we'll show all favorites but with a different display
      setFavorites(getAllFavorites(userId));
    } else {
      const favoriteIds = getFavoritesByType(userId, activeTab as FavoriteContentType);
      const favoriteItems = favoriteIds.map(id => {
        // Get the actual content data
        const content = getContentById(id, activeTab as FavoriteContentType);
        if (content) {
          return {
            id,
            type: activeTab as FavoriteContentType,
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
    if (activeTab !== 'all' && activeTab !== 'saved') {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Create object URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    
    // In a real app, you'd upload to a service like Supabase Storage
    // For demo purposes, we'll just use the object URL
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Image uploaded successfully (demo mode)');
      // You would handle the actual upload and add to favorites here
      URL.revokeObjectURL(objectUrl);
    }, 2000);
  };

  const getTabIcon = (type: ActivityType) => {
    switch (type) {
      case 'all': return Activity;
      case 'project': return User;
      case 'blog_post': return BookOpen;
      case 'gradient': return Palette;
      case 'saved': return Bookmark;
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
    project: favorites.filter(item => item.type === 'project').length,
    blog_post: favorites.filter(item => item.type === 'blog_post').length,
    gradient: favorites.filter(item => item.type === 'gradient').length,
    saved: favorites.length, // Same as all for now
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full lg:max-w-7xl lg:h-auto overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              User Activity
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters and Search */}
          <div className="p-6 pb-4 border-b space-y-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your activity..."
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

                {/* Upload Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-5 mx-6 mt-4 flex-shrink-0">
                <TabsTrigger value="all" className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">All</span> ({tabCounts.all})
                </TabsTrigger>
                <TabsTrigger value="project" className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Projects</span> ({tabCounts.project})
                </TabsTrigger>
                <TabsTrigger value="blog_post" className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Stories</span> ({tabCounts.blog_post})
                </TabsTrigger>
                <TabsTrigger value="gradient" className="flex items-center gap-2 text-sm">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Gradients</span> ({tabCounts.gradient})
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2 text-sm">
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved</span> ({tabCounts.saved})
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
                      <Activity className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                      <p className="text-muted-foreground max-w-md">
                        Start exploring and interacting with content to see your activity here.
                      </p>
                    </motion.div>
                  ) : viewMode === 'grid' ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
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