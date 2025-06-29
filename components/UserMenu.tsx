import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Users, 
  ArrowUp, 
  Bell,
  Moon,
  Sun,
  Monitor,
  Crown,
  Edit,
  Heart,
  BookOpen,
  Palette,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ROLE_DISPLAY_INFO } from '../types/auth';
import { toast } from 'sonner';

interface UserProfile {
  profileImage?: string;
  backgroundImage?: string;
  bio?: string;
  lastUpdated?: string;
}

interface UserMenuProps {
  onRoleRequestClick: () => void;
  onUserManagementClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  pendingRequestsCount?: number;
  userProfile?: UserProfile;
}

export function UserMenu({ 
  onRoleRequestClick, 
  onUserManagementClick, 
  onProfileClick,
  onLogout,
  pendingRequestsCount = 0,
  userProfile = {}
}: UserMenuProps) {
  const { 
    user, 
    isSuperAdmin, 
    isSubscriber, 
    canManageUsers,
    canEdit 
  } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showFallbackDropdown, setShowFallbackDropdown] = useState(false);

  if (!user) return null;

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    
    // Add a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onLogout();
    setShowLogoutDialog(false);
    setIsLoggingOut(false);
    toast.success('Successfully logged out');
  };

  const getThemeIcon = (currentTheme: string) => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-red-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  // Use profile image from userProfile if available, otherwise fallback to user avatar
  const displayAvatar = userProfile.profileImage || user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';

  return (
    <>
      <div className="relative">
        {/* Primary Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors border border-border/50 relative"
              onClick={() => {
                // Fallback: If dropdown doesn't work, show manual menu
                setTimeout(() => {
                  setShowFallbackDropdown(true);
                }, 100);
              }}
            >
              <Avatar className="w-8 h-8">
                <img 
                  src={displayAvatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${ROLE_DISPLAY_INFO[user.role].color} text-foreground border-border hidden sm:flex`}
              >
                {getRoleIcon(user.role)}
                <span className="ml-1">{ROLE_DISPLAY_INFO[user.role].name}</span>
              </Badge>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
              
              {/* Notification Badge */}
              {isSuperAdmin() && pendingRequestsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                  {pendingRequestsCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-64 z-[60]">
            {/* User Info */}
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <img 
                    src={displayAvatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover" 
                  />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getRoleIcon(user.role)}
                    <span className="text-xs text-muted-foreground">
                      {ROLE_DISPLAY_INFO[user.role].name}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />

            {/* Quick Stats */}
            <div className="px-2 py-2">
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="p-2 bg-muted/30 rounded-md">
                  <BookOpen className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs font-medium">12</p>
                  <p className="text-xs text-muted-foreground">Stories</p>
                </div>
                <div className="p-2 bg-muted/30 rounded-md">
                  <Heart className="w-4 h-4 mx-auto mb-1 text-red-600" />
                  <p className="text-xs font-medium">47</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div className="p-2 bg-muted/30 rounded-md">
                  <Palette className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  <p className="text-xs font-medium">8</p>
                  <p className="text-xs text-muted-foreground">Gradients</p>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Management Actions */}
            {canManageUsers() && (
              <>
                <DropdownMenuItem onClick={onUserManagementClick}>
                  <Users className="w-4 h-4 mr-2" />
                  User Management
                  {pendingRequestsCount > 0 && (
                    <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                      {pendingRequestsCount}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Role Upgrade */}
            {(isSubscriber() || user.role === 'editor') && (
              <>
                <DropdownMenuItem onClick={onRoleRequestClick}>
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Request Role Upgrade
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Account Management */}
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="w-4 h-4 mr-2" />
              My Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => toast.info('Profile settings would open here')}>
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </DropdownMenuItem>

            {/* Notifications */}
            <DropdownMenuItem onClick={() => toast.info('Notifications panel would open here')}>
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {pendingRequestsCount > 0 && (
                <Badge className="ml-auto h-4 w-4 p-0 flex items-center justify-center bg-blue-600 text-white text-xs">
                  {pendingRequestsCount}
                </Badge>
              )}
            </DropdownMenuItem>

            {/* Theme Selection */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {getThemeIcon(theme)}
                <span className="ml-2">Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                  {theme === 'light' && <Badge className="ml-auto" variant="outline">✓</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                  {theme === 'dark' && <Badge className="ml-auto" variant="outline">✓</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="w-4 h-4 mr-2" />
                  System
                  {theme === 'system' && <Badge className="ml-auto" variant="outline">✓</Badge>}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem 
              onClick={handleLogoutClick}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Fallback Dropdown Menu for Super Admin */}
        <AnimatePresence>
          {showFallbackDropdown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-64 bg-popover border rounded-md shadow-lg z-[70] p-1"
            >
              {/* User Info Header */}
              <div className="px-2 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <img 
                      src={displayAvatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                    />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getRoleIcon(user.role)}
                      <span className="text-xs text-muted-foreground">
                        {ROLE_DISPLAY_INFO[user.role].name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border my-1" />

              {/* Management Actions */}
              {canManageUsers() && (
                <>
                  <button
                    onClick={() => {
                      onUserManagementClick();
                      setShowFallbackDropdown(false);
                    }}
                    className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    User Management
                    {pendingRequestsCount > 0 && (
                      <Badge className="ml-auto h-4 w-4 p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                        {pendingRequestsCount}
                      </Badge>
                    )}
                  </button>
                  <div className="h-px bg-border my-1" />
                </>
              )}

              {/* Role Upgrade */}
              {(isSubscriber() || user.role === 'editor') && (
                <>
                  <button
                    onClick={() => {
                      onRoleRequestClick();
                      setShowFallbackDropdown(false);
                    }}
                    className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Request Role Upgrade
                  </button>
                  <div className="h-px bg-border my-1" />
                </>
              )}

              {/* Account Management */}
              <button
                onClick={() => {
                  onProfileClick();
                  setShowFallbackDropdown(false);
                }}
                className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </button>

              <button
                onClick={() => {
                  toast.info('Profile settings would open here');
                  setShowFallbackDropdown(false);
                }}
                className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
              >
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </button>

              {/* Notifications */}
              <button
                onClick={() => {
                  toast.info('Notifications panel would open here');
                  setShowFallbackDropdown(false);
                }}
                className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {pendingRequestsCount > 0 && (
                  <Badge className="ml-auto h-4 w-4 p-0 flex items-center justify-center bg-blue-600 text-white text-xs">
                    {pendingRequestsCount}
                  </Badge>
                )}
              </button>

              <div className="h-px bg-border my-1" />

              {/* Theme Selection - Simplified for fallback */}
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground mb-2">Theme</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setTheme('light');
                      setShowFallbackDropdown(false);
                    }}
                    className={`flex-1 p-2 text-xs rounded-sm hover:bg-accent ${theme === 'light' ? 'bg-accent' : ''}`}
                  >
                    <Sun className="w-3 h-3 mx-auto" />
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setShowFallbackDropdown(false);
                    }}
                    className={`flex-1 p-2 text-xs rounded-sm hover:bg-accent ${theme === 'dark' ? 'bg-accent' : ''}`}
                  >
                    <Moon className="w-3 h-3 mx-auto" />
                  </button>
                  <button
                    onClick={() => {
                      setTheme('system');
                      setShowFallbackDropdown(false);
                    }}
                    className={`flex-1 p-2 text-xs rounded-sm hover:bg-accent ${theme === 'system' ? 'bg-accent' : ''}`}
                  >
                    <Monitor className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="h-px bg-border my-1" />

              {/* Logout */}
              <button
                onClick={() => {
                  handleLogoutClick();
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

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-600" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <Avatar className="w-12 h-12">
              <img 
                src={displayAvatar} 
                alt={user.name} 
                className="w-full h-full object-cover" 
              />
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className="mt-1 text-foreground border-border">
                {getRoleIcon(user.role)}
                <span className="ml-1">{ROLE_DISPLAY_INFO[user.role].name}</span>
              </Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1"
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutConfirm}
              className="flex-1"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.div>
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}