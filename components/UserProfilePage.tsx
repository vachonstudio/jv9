import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Save, 
  User, 
  Calendar,
  MapPin,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Edit3,
  Check,
  X,
  Image as ImageIcon,
  Heart,
  Palette,
  BookOpen,
  Archive,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { UserActivityModal } from './UserActivityModal';
import { 
  getAllFavorites, 
  getFavoritesByType, 
  getFavoritesCount, 
  getTotalFavoritesCount,
  FavoriteContentType 
} from '../utils/favorites';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface UserProfile {
  profileImage?: string;
  backgroundImage?: string;
  bio?: string;
  lastUpdated?: string;
}

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface UserProfilePageProps {
  userProfile: UserProfile;
  userData: UserData | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const DEFAULT_BACKGROUND = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
const DEFAULT_BIO = `Welcome to my profile! I'm passionate about creating exceptional user experiences and bringing innovative ideas to life.

I believe in the power of design thinking to solve complex problems and create meaningful connections between people and technology. When I'm not designing, you can find me exploring new technologies, reading about design trends, or collaborating with other creative professionals.

Feel free to connect with me to discuss projects, share ideas, or just have a great conversation about design and technology!`;

export function UserProfilePage({ userProfile, userData, onProfileUpdate }: UserProfilePageProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState(userProfile.profileImage || userData?.avatar || DEFAULT_AVATAR);
  const [backgroundImage, setBackgroundImage] = useState(userProfile.backgroundImage || DEFAULT_BACKGROUND);
  const [bio, setBio] = useState(userProfile.bio || DEFAULT_BIO);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempBio, setTempBio] = useState(bio);
  const [hasChanges, setHasChanges] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState<FavoriteContentType | 'all' | 'saved'>('all');
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">Profile Not Available</h2>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const userId = user?.id || null;

  // Get favorites counts
  const totalFavorites = getTotalFavoritesCount(userId);
  const projectFavorites = getFavoritesCount(userId, 'project');
  const blogFavorites = getFavoritesCount(userId, 'blog_post');
  const gradientFavorites = getFavoritesCount(userId, 'gradient');

  const handleFileUpload = async (file: File, type: 'profile' | 'background') => {
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

    try {
      // Create object URL for immediate preview
      const objectUrl = URL.createObjectURL(file);
      
      // In a real app, you'd upload to Supabase Storage or similar service
      // For demo purposes, we'll simulate upload and use object URL
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (type === 'profile') {
        setProfileImage(objectUrl);
      } else {
        setBackgroundImage(objectUrl);
      }
      
      setHasChanges(true);
      setEditingField(null);
      toast.success(`${type === 'profile' ? 'Profile' : 'Background'} image uploaded successfully`);
      
      // In production, you would clean up the object URL after the actual upload
      // URL.revokeObjectURL(objectUrl);
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpdate = (type: 'profile' | 'background', url: string) => {
    if (type === 'profile') {
      setProfileImage(url);
    } else {
      setBackgroundImage(url);
    }
    setHasChanges(true);
    setEditingField(null);
    setTempImageUrl('');
  };

  const handleBioUpdate = (newBio: string) => {
    setBio(newBio);
    setHasChanges(true);
    setEditingField(null);
    setTempBio(newBio);
  };

  const handleSaveAll = () => {
    const updatedProfile: UserProfile = {
      profileImage,
      backgroundImage,
      bio,
      lastUpdated: new Date().toISOString()
    };
    
    onProfileUpdate(updatedProfile);
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setProfileImage(userProfile.profileImage || userData.avatar || DEFAULT_AVATAR);
    setBackgroundImage(userProfile.backgroundImage || DEFAULT_BACKGROUND);
    setBio(userProfile.bio || DEFAULT_BIO);
    setTempBio(userProfile.bio || DEFAULT_BIO);
    setHasChanges(false);
    setIsEditing(false);
    setEditingField(null);
    setTempImageUrl('');
  };

  const handleActivityClick = (type: FavoriteContentType | 'all' | 'saved') => {
    setActivityFilter(type);
    setIsActivityOpen(true);
  };

  const wordCount = bio.split(/\s+/).filter(word => word.length > 0).length;
  const isOverLimit = wordCount > 2000;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={backgroundImage}
          alt="Profile background"
          className="w-full h-full object-cover"
        />
        
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Edit Background Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => backgroundFileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-white/90 hover:bg-white text-black"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditingField('background');
              setTempImageUrl(backgroundImage);
            }}
            className="bg-white/90 hover:bg-white text-black"
          >
            <Camera className="w-4 h-4 mr-2" />
            URL
          </Button>
        </div>

        {/* Save/Cancel Buttons when editing */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 flex gap-2"
          >
            <Button
              onClick={handleSaveAll}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white text-black"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </motion.div>
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            {/* Profile Image */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <img
                  src={profileImage}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </Avatar>
              
              {/* Edit Profile Image Buttons */}
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => profileFileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-full w-8 h-8 p-0"
                  title="Upload image"
                >
                  <Upload className="w-3 h-3" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingField('profile');
                    setTempImageUrl(profileImage);
                  }}
                  className="rounded-full w-8 h-8 p-0"
                  title="Image URL"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="mb-2">{userData.name}</h1>
              <p className="text-muted-foreground mb-3">{userData.email}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="capitalize">
                  {userData.role.replace('_', ' ')}
                </Badge>
                {userProfile.lastUpdated && (
                  <span className="text-sm text-muted-foreground">
                    Updated {new Date(userProfile.lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Enhanced Stats with Activity */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <motion.button
                  onClick={() => handleActivityClick('project')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {projectFavorites}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <User className="w-3 h-3" />
                    Projects
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleActivityClick('blog_post')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {blogFavorites}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Stories
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleActivityClick('gradient')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {gradientFavorites}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Palette className="w-3 h-3" />
                    Gradients
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleActivityClick('all')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-center p-3 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg hover:from-primary/10 hover:to-secondary/10 transition-all cursor-pointer group border border-primary/10"
                >
                  <div className="font-semibold text-lg text-primary group-hover:scale-105 transition-transform">
                    {totalFavorites}
                  </div>
                  <div className="text-xs text-primary/70 flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" />
                    Activity
                  </div>
                </motion.button>
              </div>

              {/* Activity Button */}
              {totalFavorites > 0 && (
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={() => handleActivityClick('all')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    View User Activity
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          <Separator className="mb-8" />

          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2">
                <User className="w-5 h-5" />
                About Me
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingField('bio');
                  setTempBio(bio);
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Bio
              </Button>
            </div>

            <div className="space-y-4">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {bio.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{wordCount} / 2000 words</span>
                {isOverLimit && (
                  <span className="text-destructive">Bio exceeds 2000 word limit</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={profileFileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, 'profile');
        }}
        className="hidden"
      />
      <input
        ref={backgroundFileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, 'background');
        }}
        className="hidden"
      />

      {/* User Activity Modal */}
      <UserActivityModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        userId={userId}
        initialTab={activityFilter}
        isAuthenticated={!!user}
      />

      {/* Edit Modals */}
      <AnimatePresence>
        {editingField === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="mb-4">Update Profile Image</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    placeholder="Enter image URL"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                  />
                </div>
                
                {tempImageUrl && (
                  <div className="text-center">
                    <img
                      src={tempImageUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-border"
                      onError={() => toast.error('Invalid image URL')}
                    />
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleImageUpdate('profile', tempImageUrl)}
                    disabled={!tempImageUrl.trim()}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingField(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {editingField === 'background' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="mb-4">Update Background Image</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    placeholder="Enter background image URL"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                  />
                </div>
                
                {tempImageUrl && (
                  <div className="text-center">
                    <img
                      src={tempImageUrl}
                      alt="Preview"
                      className="w-full h-24 rounded-lg object-cover border-2 border-border"
                      onError={() => toast.error('Invalid image URL')}
                    />
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleImageUpdate('background', tempImageUrl)}
                    disabled={!tempImageUrl.trim()}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingField(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {editingField === 'bio' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <h3 className="mb-4">Edit Bio</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>About Me (2000 words max)</Label>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    className="min-h-48 resize-none"
                    rows={12}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>
                      {tempBio.split(/\s+/).filter(word => word.length > 0).length} / 2000 words
                    </span>
                    {tempBio.split(/\s+/).filter(word => word.length > 0).length > 2000 && (
                      <span className="text-destructive">Exceeds word limit</span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleBioUpdate(tempBio)}
                    disabled={tempBio.split(/\s+/).filter(word => word.length > 0).length > 2000}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Update Bio
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingField(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}