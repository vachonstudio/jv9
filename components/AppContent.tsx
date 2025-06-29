'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, User, Home, Menu, X, Mail, UserPlus, BookOpen, Shield, LogOut, Edit, Users, ArrowUp, Bell, Settings, ChevronDown } from "lucide-react";
import { UserActivityModal } from "./UserActivityModal";
import { SearchModal } from "./SearchModal";
import { SearchBar, CompactSearchBar } from "./SearchBar";
import { SupabaseSetupHelper } from "./SupabaseSetupHelper";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { UnifiedAuth } from "./UnifiedAuth";
import { UserMenu } from "./UserMenu";
import { UserProfilePage } from "./UserProfilePage";
import { WelcomeOnboarding } from "./WelcomeOnboarding";
import { ProtectedContent } from "./ProtectedContent";
import { ProtectedProjectCard } from "./ProtectedProjectCard";
import { ContactPage } from "./ContactPage";
import { BlogPage } from "./BlogPage";
import { BlogPostModal } from "./BlogPostModal";
import { EditableBlogPostModal } from "./EditableBlogPostModal";
import { EditableCaseStudyModal } from "./EditableCaseStudyModal";
import { RoleRequestModal } from "./RoleRequestModal";
import { UserManagementDashboard } from "./UserManagementDashboard";
import { GradientGallery } from "./GradientGallery";
import { HeroSlider } from "./HeroSlider";
import { ProjectCard } from "./ProjectCard";
import { CaseStudyModal } from "./CaseStudyModal";
import { EnhancedGradientLightbox } from "./EnhancedGradientLightbox";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Toaster } from "./ui/sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { 
  projects, 
  projectCategories, 
  Project, 
  getFeaturedProjects, 
  getProjectsByCategory, 
  getPublicProjects,
  requiresAuthentication 
} from "../types/portfolio";
import { gradients, Gradient, getCustomGradients, deleteCustomGradient } from "../types/gradient";
import { isFavorited, toggleFavorite as toggleUniversalFavorite, migrateLegacyGradientFavorites } from "../utils/favorites";
import { BlogPost, getPublicPosts, getPrivatePosts, requiresBlogAuthentication } from "../types/blog";
import { parseGradientFromURL } from "../utils/gradientExport";
import { SignupFormData } from "../types/signup";
import { ROLE_DISPLAY_INFO } from "../types/auth";
import { isUsingDemoConfig } from "../lib/supabase";
import { toast } from "sonner";

type Section = 'home' | 'gradients' | 'portfolio' | 'stories' | 'contact' | 'profile';
type AuthMode = 'login' | 'signup';

// User profile interface
interface UserProfile {
  profileImage?: string;
  backgroundImage?: string;
  bio?: string;
  lastUpdated?: string;
}

// Modern Vachon Logo Component
const VachonLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 32 32" className="w-full h-full">
      {/* Modern geometric V shape with gradient */}
      <defs>
        <linearGradient id="vachon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      
      {/* Main V shape */}
      <path
        d="M6 8 L16 24 L26 8 L22 8 L16 18 L10 8 Z"
        fill="url(#vachon-gradient)"
        className="drop-shadow-sm"
      />
      
      {/* Accent dot */}
      <circle
        cx="16"
        cy="6"
        r="2"
        fill="url(#vachon-gradient)"
        className="opacity-80"
      />
    </svg>
  </div>
);

export function AppContent() {
  const { 
    user, 
    logout, 
    canEdit, 
    isSuperAdmin, 
    isSubscriber,
    canManageUsers,
    getRoleRequests,
    loading: authLoading
  } = useAuth();
  
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGradient, setSelectedGradient] = useState<Gradient | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectModalFullscreen, setIsProjectModalFullscreen] = useState(false);
  const [isGradientModalOpen, setIsGradientModalOpen] = useState(false);
  const [isBlogPostModalOpen, setIsBlogPostModalOpen] = useState(false);
  const [isBlogPostModalFullscreen, setIsBlogPostModalFullscreen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [isRoleRequestOpen, setIsRoleRequestOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'gradient' | 'project' | 'blog_post' | 'saved'>('all');
  const [customGradients, setCustomGradients] = useState<Gradient[]>([]);
  const [allGradients, setAllGradients] = useState<Gradient[]>(gradients);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [editedProjects, setEditedProjects] = useState<Record<string, Project>>({});
  const [editedPosts, setEditedPosts] = useState<Record<string, BlogPost>>({});
  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const [customPosts, setCustomPosts] = useState<BlogPost[]>([]);
  const [userData, setUserData] = useState<SignupFormData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [showFallbackDropdown, setShowFallbackDropdown] = useState(false);
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Define authentication status early - AuthContext user takes priority over localStorage signup
  const isAuthenticated = !!user || isSignedUp;
  const pendingRequests = user ? getRoleRequests().filter(r => r.status === 'pending') : [];

  // Show demo mode info
  useEffect(() => {
    if (isUsingDemoConfig()) {
      setTimeout(() => {
        toast.info('Running in demo mode - connect your Supabase project for full functionality', {
          duration: 5000,
          action: {
            label: 'Setup',
            onClick: () => {
              // Setup helper will be shown
            }
          }
        })
      }, 2000)
    }
  }, [])

  // Load initial data and check for shared gradient
  useEffect(() => {
    // Migrate legacy gradient favorites if needed
    migrateLegacyGradientFavorites(user?.id || null);
    
    setCustomGradients(getCustomGradients());
    
    // Check if user has already signed up (only if not logged in through AuthContext)
    if (!user) {
      const hasSignedUp = localStorage.getItem('user-signed-up');
      const storedUserData = localStorage.getItem('user-data');
      
      setIsSignedUp(!!hasSignedUp);
      
      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    } else {
      // If user is logged in through AuthContext, clear any localStorage signup state
      setIsSignedUp(false);
      setUserData(null);
    }
    
    // Load user profile data
    const currentUserId = user?.id || 'signup-user';
    const storedProfile = localStorage.getItem(`user-profile-${currentUserId}`);
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
    
    // Load edited content
    const savedProjects = JSON.parse(localStorage.getItem('edited-projects') || '{}');
    const savedPosts = JSON.parse(localStorage.getItem('edited-posts') || '{}');
    setEditedProjects(savedProjects);
    setEditedPosts(savedPosts);
    
    // Load custom content created by admins/editors
    const customProjectsData = JSON.parse(localStorage.getItem('custom-projects') || '[]');
    const customPostsData = JSON.parse(localStorage.getItem('custom-posts') || '[]');
    setCustomProjects(customProjectsData);
    setCustomPosts(customPostsData);
    
    // Check for shared gradient in URL
    const sharedGradient = parseGradientFromURL();
    if (sharedGradient) {
      setSelectedGradient(sharedGradient);
      setIsGradientModalOpen(true);
      setCurrentSection('gradients');
    }
  }, [user]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update all gradients when custom gradients change
  useEffect(() => {
    setAllGradients([...gradients, ...customGradients]);
  }, [customGradients]);

  // Show loading screen while auth is loading
  if (authLoading) {
    return (
      <div className="size-full bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <VachonLogo className="w-16 h-16 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
          {isUsingDemoConfig() && (
            <Badge className="mt-2 bg-orange-100 text-orange-800">Demo Mode</Badge>
          )}
        </div>
      </div>
    )
  }

  const getProjectToDisplay = (project: Project): Project => {
    return editedProjects[project.id] || project;
  };

  const getBlogPostToDisplay = (post: BlogPost): BlogPost => {
    return editedPosts[post.id] || post;
  };

  // Get all projects including custom ones
  const getAllProjects = (): Project[] => {
    return [...projects, ...customProjects].map(getProjectToDisplay);
  };

  // Get all blog posts including custom ones
  const getAllBlogPosts = (): BlogPost[] => {
    return [...Object.values(editedPosts), ...customPosts].map(getBlogPostToDisplay);
  };

  const handleProjectClick = (project: Project) => {
    const projectToShow = getProjectToDisplay(project);
    
    // Check if project requires authentication
    if (requiresAuthentication(projectToShow) && !isAuthenticated) {
      // If private project and not authenticated, prompt to sign up
      handleAuthOpen('signup');
      toast.info('Join the community to view this exclusive case study');
      return;
    }
    
    // Show the project (either public or user is authenticated)
    setSelectedProject(projectToShow);
    setIsProjectModalOpen(true);
    setIsProjectModalFullscreen(false); // Default to windowed
  };

  const handleGradientClick = (gradient: Gradient) => {
    setSelectedGradient(gradient);
    setIsGradientModalOpen(true);
  };

  const handleBlogPostClick = (post: BlogPost) => {
    const postToShow = getBlogPostToDisplay(post);
    setSelectedBlogPost(postToShow);
    setIsBlogPostModalOpen(true);
    setIsBlogPostModalFullscreen(false); // Default to windowed
  };

  const handleToggleFavorite = (gradientId: string) => {
    const userId = user?.id || null;
    const gradient = gradients.find(g => g.id === gradientId) || 
                    customGradients.find(g => g.id === gradientId);
    
    if (gradient) {
      const newFavoriteStatus = toggleUniversalFavorite(userId, gradientId, 'gradient', {
        title: gradient.name,
        image: gradient.css,
        description: `Gradient with ${gradient.colors.length} colors`,
        category: gradient.tags?.[0] || 'Design',
        tags: gradient.tags
      });
      
      // Update local state for immediate UI feedback
      const currentFavorites = isFavorited(userId, gradientId, 'gradient') ? 
        favorites.filter(id => id !== gradientId) : 
        [...favorites, gradientId];
      setFavorites(currentFavorites);
    }
  };

  const handleDeleteCustomGradient = (gradientId: string) => {
    deleteCustomGradient(gradientId);
    setCustomGradients(getCustomGradients());
    
    if (selectedGradient?.id === gradientId) {
      setIsGradientModalOpen(false);
      setTimeout(() => setSelectedGradient(null), 300);
    }
  };

  const handleAddVariation = (variation: Gradient) => {
    setCustomGradients(getCustomGradients());
  };

  const handleAuthOpen = (mode: AuthMode = 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    // Check if this is a new signup (only handle if not logged in through AuthContext)
    if (!user) {
      const wasSignedUp = isSignedUp;
      const hasSignedUp = localStorage.getItem('user-signed-up');
      const storedUserData = localStorage.getItem('user-data');
      
      setIsSignedUp(!!hasSignedUp);
      
      if (storedUserData) {
        try {
          const newUserData = JSON.parse(storedUserData);
          setUserData(newUserData);
          
          // Show welcome onboarding for new users
          if (!wasSignedUp && hasSignedUp) {
            setTimeout(() => {
              setIsWelcomeOpen(true);
            }, 500);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setEditedProjects(prev => ({
      ...prev,
      [updatedProject.id]: updatedProject
    }));
  };

  const handleBlogPostUpdate = (updatedPost: BlogPost) => {
    setEditedPosts(prev => ({
      ...prev,
      [updatedPost.id]: updatedPost
    }));
  };

  const handleProjectCreate = (newProject: Project) => {
    setCustomProjects(prev => [...prev, newProject]);
    localStorage.setItem('custom-projects', JSON.stringify([...customProjects, newProject]));
    
    // Also add to edited projects for immediate display
    setEditedProjects(prev => ({
      ...prev,
      [newProject.id]: newProject
    }));
    
    // Open the new project
    setSelectedProject(newProject);
    setIsProjectModalOpen(true);
    setIsProjectModalFullscreen(false);
  };

  const handleProjectDelete = (projectId: string) => {
    // Remove from custom projects
    const updatedCustomProjects = customProjects.filter(p => p.id !== projectId);
    setCustomProjects(updatedCustomProjects);
    localStorage.setItem('custom-projects', JSON.stringify(updatedCustomProjects));
    
    // Remove from edited projects
    const updatedEditedProjects = { ...editedProjects };
    delete updatedEditedProjects[projectId];
    setEditedProjects(updatedEditedProjects);
    localStorage.setItem('edited-projects', JSON.stringify(updatedEditedProjects));
    
    toast.success('Project deleted successfully');
  };

  const handleBlogPostCreate = (newPost: BlogPost) => {
    setCustomPosts(prev => [...prev, newPost]);
    localStorage.setItem('custom-posts', JSON.stringify([...customPosts, newPost]));
    
    // Also add to edited posts for immediate display
    setEditedPosts(prev => ({
      ...prev,
      [newPost.id]: newPost
    }));
    
    // Open the new post
    setSelectedBlogPost(newPost);
    setIsBlogPostModalOpen(true);
    setIsBlogPostModalFullscreen(false);
  };

  const handleBlogPostDelete = (postId: string) => {
    // Remove from custom posts
    const updatedCustomPosts = customPosts.filter(p => p.id !== postId);
    setCustomPosts(updatedCustomPosts);
    localStorage.setItem('custom-posts', JSON.stringify(updatedCustomPosts));
    
    // Remove from edited posts
    const updatedEditedPosts = { ...editedPosts };
    delete updatedEditedPosts[postId];
    setEditedPosts(updatedEditedPosts);
    localStorage.setItem('edited-posts', JSON.stringify(updatedEditedPosts));
    
    toast.success('Blog post deleted successfully');
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    const currentUserId = user?.id || 'signup-user';
    const profileWithTimestamp = {
      ...updatedProfile,
      lastUpdated: new Date().toISOString()
    };
    
    setUserProfile(profileWithTimestamp);
    localStorage.setItem(`user-profile-${currentUserId}`, JSON.stringify(profileWithTimestamp));
    toast.success('Profile updated successfully');
  };

  const handleLogout = () => {
    logout();
    setIsSignedUp(false);
    setUserData(null);
    setUserProfile({});
    localStorage.removeItem('user-signed-up');
    localStorage.removeItem('user-data');
    
    // Redirect to home
    setCurrentSection('home');
    toast.success('Successfully logged out');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setCurrentSection('profile');
    } else {
      handleAuthOpen('signup');
    }
  };

  const toggleProjectModalFullscreen = () => {
    setIsProjectModalFullscreen(prev => !prev);
  };

  const toggleBlogPostModalFullscreen = () => {
    setIsBlogPostModalFullscreen(prev => !prev);
  };

  const handleProjectModalClose = () => {
    setIsProjectModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
      setIsProjectModalFullscreen(false); // Reset to windowed for next open
    }, 300);
  };

  const handleBlogPostModalClose = () => {
    setIsBlogPostModalOpen(false);
    setTimeout(() => {
      setSelectedBlogPost(null);
      setIsBlogPostModalFullscreen(false); // Reset to windowed for next open
    }, 300);
  };

  // Filter projects based on authentication status and selected category
  const filteredProjects = getProjectsByCategory(selectedCategory, isAuthenticated).map(getProjectToDisplay);

  const navigationItems = [
    { id: 'home' as Section, label: 'Home', icon: Home },
    { id: 'portfolio' as Section, label: 'Portfolio', icon: User },
    { id: 'stories' as Section, label: 'Stories', icon: BookOpen },
    { id: 'gradients' as Section, label: 'Gradient Gallery', icon: Palette },
    { id: 'contact' as Section, label: 'Contact', icon: Mail }
  ];

  // Get current user display data - AuthContext user takes priority
  const getCurrentUserData = () => {
    if (user) {
      // User logged in through AuthContext (e.g., vachon@gmail.com as super_admin)
      return {
        name: user.name,
        email: user.email,
        avatar: userProfile.profileImage || user.avatar,
        role: user.role // This will be 'super_admin' for vachon@gmail.com
      };
    } else if (userData) {
      // User signed up through localStorage (subscribers only)
      return {
        name: userData.name,
        email: userData.email,
        avatar: userProfile.profileImage || userData.profileImage,
        role: 'subscriber' as const
      };
    }
    return null;
  };

  const currentUserData = getCurrentUserData();

  // Get public project count for display
  const publicProjectCount = getPublicProjects().length;
  const totalProjectCount = projects.length;
  const privateProjectCount = totalProjectCount - publicProjectCount;

  return (
    <TooltipProvider>
      <div className="size-full bg-background text-foreground">
        {/* Demo Mode Banner */}
        {isUsingDemoConfig() && (
          <div className="bg-orange-100 dark:bg-orange-950/20 border-b border-orange-200 dark:border-orange-800 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800 dark:text-orange-200">
                  Demo Mode - Mock data and authentication active
                </span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-orange-800 border-orange-300 hover:bg-orange-200 dark:text-orange-200 dark:border-orange-700"
                onClick={() => {/* SupabaseSetupHelper will handle this */}}
              >
                Setup Supabase
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b" style={{
          top: isUsingDemoConfig() ? '44px' : '0' // Offset for demo banner
        }}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <VachonLogo className="w-9 h-9" />
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg tracking-tight">Vachon</span>
                  <Badge variant="outline" className="hidden sm:inline-flex text-xs">
                    UX Design Studio
                  </Badge>
                  {isUsingDemoConfig() && (
                    <Badge className="bg-orange-100 text-orange-800 text-xs">Demo</Badge>
                  )}
                </div>
                {canEdit() && (
                  <Badge className="hidden sm:inline-flex bg-green-600 text-white ml-2">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit Mode
                  </Badge>
                )}
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentSection === item.id ? 'default' : 'ghost'}
                    onClick={() => setCurrentSection(item.id)}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                ))}
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden md:block lg:flex-1 lg:max-w-sm lg:mx-6">
                <SearchBar onSearchClick={() => setIsSearchOpen(true)} />
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {/* Search - Mobile/Tablet */}
                <div className="md:hidden">
                  <CompactSearchBar onSearchClick={() => setIsSearchOpen(true)} />
                </div>

                {/* Enhanced Authentication Display - AuthContext user takes priority */}
                {user ? (
                  /* AuthContext User (Super Admin, Admin, etc.) */
                  <UserMenu
                    onRoleRequestClick={() => setIsRoleRequestOpen(true)}
                    onUserManagementClick={() => setIsUserManagementOpen(true)}
                    onProfileClick={handleProfileClick}
                    onLogout={handleLogout}
                    pendingRequestsCount={pendingRequests.length}
                    userProfile={userProfile}
                  />
                ) : isSignedUp && currentUserData ? (
                  /* localStorage Signup User (Subscribers only) */
                  <div className="relative">
                    {/* Primary Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors border border-border/50"
                          onClick={() => {
                            // Fallback: If dropdown doesn't work, show manual menu
                            setTimeout(() => {
                              setShowFallbackDropdown(true);
                            }, 100);
                          }}
                        >
                          <Avatar className="w-8 h-8">
                            <img 
                              src={currentUserData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'} 
                              alt={currentUserData.name || 'User'} 
                              className="w-full h-full object-cover" 
                            />
                          </Avatar>
                          <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium">{currentUserData.name}</p>
                            <p className="text-xs text-muted-foreground">Subscriber</p>
                          </div>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 z-[60]">
                        <div className="px-2 py-1.5">
                          <p className="text-sm font-medium">{currentUserData.name}</p>
                          <p className="text-xs text-muted-foreground">{currentUserData.email}</p>
                          <Badge variant="outline" className="mt-1 text-foreground border-border">Subscriber</Badge>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleProfileClick}>
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleLogout}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Fallback Dropdown Menu */}
                    <AnimatePresence>
                      {showFallbackDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute top-full right-0 mt-2 w-56 bg-popover border rounded-md shadow-lg z-[70] p-1"
                        >
                          <div className="px-2 py-1.5">
                            <p className="text-sm font-medium">{currentUserData.name}</p>
                            <p className="text-xs text-muted-foreground">{currentUserData.email}</p>
                            <Badge variant="outline" className="mt-1 text-foreground border-border">Subscriber</Badge>
                          </div>
                          <div className="h-px bg-border my-1" />
                          <button
                            onClick={() => {
                              handleProfileClick();
                              setShowFallbackDropdown(false);
                            }}
                            className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                          >
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                          </button>
                          <div className="h-px bg-border my-1" />
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowFallbackDropdown(false);
                            }}
                            className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-red-50 text-red-600"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Click outside to close fallback */}
                    {showFallbackDropdown && (
                      <div
                        className="fixed inset-0 z-[65]"
                        onClick={() => setShowFallbackDropdown(false)}
                      />
                    )}
                  </div>
                ) : (
                  /* Not authenticated - clean CTA buttons */
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleAuthOpen('login')}
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign In</span>
                    </Button>
                    <Button
                      onClick={() => handleAuthOpen('signup')}
                      size="sm"
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Join Community</span>
                    </Button>
                  </div>
                )}
                <ThemeToggle />

                {/* Mobile menu button */}
                <div className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden border-t mt-4 pt-4"
                >
                  <div className="flex flex-col gap-2">
                    {/* Brand Section */}
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <VachonLogo className="w-8 h-8" />
                        <div>
                          <p className="font-semibold">Vachon</p>
                          <p className="text-xs text-muted-foreground">UX Design Studio</p>
                          {isUsingDemoConfig() && (
                            <Badge className="mt-1 bg-orange-100 text-orange-800 text-xs">Demo Mode</Badge>
                          )}
                        </div>
                      </div>

                      {/* Authentication Status */}
                      {isAuthenticated && currentUserData ? (
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <img 
                              src={currentUserData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'} 
                              alt={currentUserData.name || 'User'} 
                              className="w-full h-full object-cover" 
                            />
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{currentUserData.name}</p>
                            <p className="text-sm text-muted-foreground">{currentUserData.email}</p>
                            <Badge variant="outline" className="mt-1 text-foreground border-border">
                              {user?.role ? ROLE_DISPLAY_INFO[user.role].name : 'Subscriber'}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Join the community for full access</p>
                          <Button onClick={() => {
                            handleAuthOpen('signup');
                            setIsMobileMenuOpen(false);
                          }} size="sm" className="w-full">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join Community
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Search Bar - Mobile Menu */}
                    <div className="mb-4">
                      <SearchBar 
                        onSearchClick={() => {
                          setIsSearchOpen(true);
                          setIsMobileMenuOpen(false);
                        }} 
                        className="w-full"
                      />
                    </div>

                    {/* Navigation Items */}
                    {navigationItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={currentSection === item.id ? 'default' : 'ghost'}
                        onClick={() => {
                          setCurrentSection(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className="justify-start"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    ))}
                    
                    {/* User Actions */}
                    {user ? (
                      <>
                        {canManageUsers() && (
                          <Button
                            onClick={() => {
                              setIsUserManagementOpen(true);
                              setIsMobileMenuOpen(false);
                            }}
                            variant="ghost"
                            className="justify-start"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            User Management
                            {pendingRequests.length > 0 && (
                              <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                                {pendingRequests.length}
                              </Badge>
                            )}
                          </Button>
                        )}
                        {(isSubscriber() || user.role === 'editor') && (
                          <Button
                            onClick={() => {
                              setIsRoleRequestOpen(true);
                              setIsMobileMenuOpen(false);
                            }}
                            variant="ghost"
                            className="justify-start"
                          >
                            <ArrowUp className="w-4 h-4 mr-2" />
                            Request Role Upgrade
                          </Button>
                        )}
                      </>
                    ) : null}

                    {/* Profile and Logout */}
                    {isAuthenticated && (
                      <>
                        <div className="mt-2 pt-2 border-t space-y-2">
                          <Button
                            onClick={() => {
                              handleProfileClick();
                              setIsMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                          </Button>
                          
                          <Button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            variant="destructive"
                            className="w-full justify-start"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Sign in options for non-authenticated users */}
                    {!isAuthenticated && (
                      <div className="mt-2 pt-2 border-t space-y-2">
                        <Button
                          onClick={() => {
                            handleAuthOpen('login');
                            setIsMobileMenuOpen(false);
                          }}
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-20" style={{
          paddingTop: isUsingDemoConfig() ? '164px' : '80px' // Account for demo banner
        }}>
          <AnimatePresence mode="wait">
            {currentSection === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                {/* Hero Section */}
                <section className="px-6 py-16">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                      <div className="flex items-center justify-center mb-6">
                        <VachonLogo className="w-16 h-16" />
                      </div>
                      <h1 className="mb-4">Crafting Digital Experiences That Matter</h1>
                      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Vachon is a UX design studio specializing in transforming complex problems into intuitive digital solutions. 
                        We create user-centered designs that drive measurable business impact.
                      </p>
                      
                      <div className="flex items-center justify-center gap-4 mt-8">
                        <Button 
                          onClick={() => setCurrentSection('contact')}
                          size="lg"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Start a Project
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentSection('portfolio')}
                          size="lg"
                        >
                          View Our Work
                        </Button>
                        {!isAuthenticated && (
                          <Button 
                            variant="secondary"
                            onClick={() => handleAuthOpen('signup')}
                            size="lg"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join Community
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Portfolio Access Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 mb-16"
                    >
                      <div className="max-w-4xl mx-auto text-center">
                        <h3 className="mb-4">Explore Our Design Portfolio</h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-xl">
                            <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                              <span className="font-bold text-sm">{publicProjectCount}</span>
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Public Case Studies</p>
                              <p className="text-sm text-muted-foreground">Free to explore</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-xl">
                            <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center">
                              <span className="font-bold text-sm">{privateProjectCount}</span>
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Premium Case Studies</p>
                              <p className="text-sm text-muted-foreground">
                                {isAuthenticated ? 'Available to you' : 'Members only'}
                              </p>
                            </div>
                          </div>
                        </div>
                        {!isAuthenticated ? (
                          <Button 
                            onClick={() => handleAuthOpen('signup')}
                            size="lg"
                            className="inline-flex items-center gap-2"
                          >
                            <UserPlus className="w-5 h-5" />
                            Join Free to Unlock All Case Studies
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => setCurrentSection('portfolio')}
                            size="lg"
                            variant="outline"
                            className="inline-flex items-center gap-2"
                          >
                            View Full Portfolio ({totalProjectCount} projects)
                          </Button>
                        )}
                      </div>
                    </motion.div>

                    {/* Featured Projects Slider */}
                    <motion.div 
                      className="mb-20"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="mb-2">Featured Projects</h2>
                          <p className="text-muted-foreground">
                            Explore our most impactful case studies and design solutions
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentSection('portfolio')}
                          className="group"
                        >
                          {isAuthenticated ? 'View All Projects' : 'View Portfolio'}
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            →
                          </motion.div>
                        </Button>
                      </div>
                      <HeroSlider
                        type="projects"
                        onItemClick={(item) => handleProjectClick(item as Project)}
                        showProtected={!isAuthenticated}
                        isAuthenticated={isAuthenticated}
                        autoplayOffset={0} // Start immediately
                      />
                    </motion.div>

                    {/* Design Resources Slider */}
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="mb-2">Design Resources</h2>
                          <p className="text-muted-foreground">
                            Curated gradients and design elements for your next project
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentSection('gradients')}
                          className="group"
                        >
                          Explore Gallery
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          >
                            →
                          </motion.div>
                        </Button>
                      </div>
                      <HeroSlider
                        type="gradients"
                        onItemClick={(item) => handleGradientClick(item as Gradient)}
                        autoplayOffset={3000} // Start 3 seconds after projects carousel
                      />
                    </motion.div>
                  </div>
                </section>
              </motion.div>
            )}

            {currentSection === 'portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen p-6"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12">
                    <h1 className="mb-4">Design Portfolio</h1>
                    <p className="text-lg text-muted-foreground">
                      Case studies showcasing user-centered design and measurable impact
                    </p>
                    {canEdit() && (
                      <Badge className="mt-2 bg-green-600 text-white">
                        <Edit className="w-3 h-3 mr-1" />
                        Editing enabled - Click any content to edit
                      </Badge>
                    )}
                    
                    {/* Portfolio access info */}
                    <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>{publicProjectCount} Public Projects</span>
                      </div>
                      {isAuthenticated && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span>{privateProjectCount} Premium Projects</span>
                        </div>
                      )}
                      {!isAuthenticated && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                          <span>{privateProjectCount} Members-Only Projects</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 justify-center mb-12">
                    {projectCategories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => handleProjectClick(project)}
                        index={index}
                        showAuthRequired={!isAuthenticated}
                      />
                    ))}
                  </div>

                  {/* Join CTA for non-authenticated users */}
                  {!isAuthenticated && privateProjectCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-16 text-center p-8 bg-muted/30 rounded-2xl"
                    >
                      <h3 className="mb-4">Unlock {privateProjectCount} Premium Case Studies</h3>
                      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Join our community to access detailed case studies including enterprise solutions, 
                        healthcare platforms, and advanced FinTech projects.
                      </p>
                      <Button 
                        onClick={() => handleAuthOpen('signup')}
                        size="lg"
                        className="inline-flex items-center gap-2"
                      >
                        <UserPlus className="w-5 h-5" />
                        Join Free - Unlock All Projects
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {currentSection === 'stories' && (
              <motion.div
                key="stories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <BlogPage
                  isAuthenticated={isAuthenticated}
                  onSignupClick={() => handleAuthOpen('signup')}
                  onPostClick={handleBlogPostClick}
                />
              </motion.div>
            )}

            {currentSection === 'gradients' && (
              <motion.div
                key="gradients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <GradientGallery />
              </motion.div>
            )}

            {currentSection === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ContactPage />
              </motion.div>
            )}

            {currentSection === 'profile' && (
              <ProtectedContent
                isAuthenticated={isAuthenticated}
                onSignupClick={() => handleAuthOpen('signup')}
                fallbackType="profile"
              >
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <UserProfilePage
                    userProfile={userProfile}
                    userData={currentUserData}
                    onProfileUpdate={handleProfileUpdate}
                  />
                </motion.div>
              </ProtectedContent>
            )}
          </AnimatePresence>
        </main>

        {/* Modals */}
        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          isAuthenticated={isAuthenticated}
          customProjects={customProjects}
          editedProjects={editedProjects}
          customPosts={customPosts}
          editedPosts={editedPosts}
          customGradients={customGradients}
          onProjectClick={handleProjectClick}
          onBlogPostClick={handleBlogPostClick}
          onGradientClick={handleGradientClick}
        />

        {/* Project Modal - Now handles both public and private projects with fullscreen toggle */}
        {selectedProject && isProjectModalOpen && (
          <>
            {canEdit() ? (
              <EditableCaseStudyModal
                project={selectedProject}
                isOpen={isProjectModalOpen}
                isFullscreen={isProjectModalFullscreen}
                onClose={handleProjectModalClose}
                onToggleFullscreen={toggleProjectModalFullscreen}
                onProjectUpdate={handleProjectUpdate}
              />
            ) : (
              <CaseStudyModal
                project={selectedProject}
                isOpen={isProjectModalOpen}
                isFullscreen={isProjectModalFullscreen}
                onClose={handleProjectModalClose}
                onToggleFullscreen={toggleProjectModalFullscreen}
              />
            )}
          </>
        )}

        {/* Blog Post Modal */}
        {selectedBlogPost && isBlogPostModalOpen && (
          <>
            {canEdit() ? (
              <EditableBlogPostModal
                post={selectedBlogPost}
                isOpen={isBlogPostModalOpen}
                isFullscreen={isBlogPostModalFullscreen}
                onClose={handleBlogPostModalClose}
                onToggleFullscreen={toggleBlogPostModalFullscreen}
                onPostUpdate={handleBlogPostUpdate}
              />
            ) : (
              <BlogPostModal
                post={selectedBlogPost}
                isOpen={isBlogPostModalOpen}
                isFullscreen={isBlogPostModalFullscreen}
                onClose={handleBlogPostModalClose}
                onToggleFullscreen={toggleBlogPostModalFullscreen}
              />
            )}
          </>
        )}

        <EnhancedGradientLightbox
          gradient={selectedGradient}
          onClose={() => {
            setIsGradientModalOpen(false);
            setTimeout(() => setSelectedGradient(null), 300);
          }}
          isOpen={isGradientModalOpen}
          isFavorite={selectedGradient ? isFavorited(user?.id || null, selectedGradient.id, 'gradient') : false}
          onToggleFavorite={selectedGradient ? () => handleToggleFavorite(selectedGradient.id) : undefined}
          onDelete={selectedGradient?.isCustom ? () => handleDeleteCustomGradient(selectedGradient.id) : undefined}
          onAddVariation={handleAddVariation}
        />

        <UnifiedAuth
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          defaultMode={authMode}
          onSuccess={handleAuthSuccess}
        />

        <RoleRequestModal
          isOpen={isRoleRequestOpen}
          onClose={() => setIsRoleRequestOpen(false)}
        />

        <UserManagementDashboard
          isOpen={isUserManagementOpen}
          onClose={() => setIsUserManagementOpen(false)}
        />

        <WelcomeOnboarding
          isOpen={isWelcomeOpen}
          onClose={() => setIsWelcomeOpen(false)}
          userName={userData?.name || 'User'}
          userEmail={userData?.email || ''}
        />

        {/* User Activity Modal */}
        <UserActivityModal
          isOpen={isActivityOpen}
          onClose={() => setIsActivityOpen(false)}
          userId={user?.id || null}
          initialTab={activityFilter}
          onItemClick={(item, type) => {
            if (type === 'project') {
              handleProjectClick(item);
            } else if (type === 'gradient') {
              handleGradientClick(item);
            } else if (type === 'blog_post') {
              handleBlogPostClick(item);
            }
            setIsActivityOpen(false);
          }}
          isAuthenticated={isAuthenticated}
        />

        {/* Supabase Setup Helper - only shown in demo mode */}
        <SupabaseSetupHelper />

        {/* Toast notifications */}
        <Toaster />
      </div>
    </TooltipProvider>
  );
}