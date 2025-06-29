import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, UserPlus, Globe, Play, Pause, Star, TrendingUp, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { projects, Project, getFeaturedProjects, requiresAuthentication } from "../types/portfolio";
import { gradients, Gradient } from "../types/gradient";

interface HeroSliderProps {
  type: 'projects' | 'gradients';
  onItemClick: (item: Project | Gradient) => void;
  showProtected?: boolean;
  isAuthenticated?: boolean;
  autoplayOffset?: number; // Offset in milliseconds for staggered autoplay
}

export function HeroSlider({ 
  type, 
  onItemClick, 
  showProtected = false, 
  isAuthenticated = false,
  autoplayOffset = 0 
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const items = type === 'projects' 
    ? getFeaturedProjects() 
    : gradients.slice(0, 8);

  // Slower autoplay with offset timing
  const autoplayDuration = 6000; // Slower: 6 seconds instead of 4
  const progressInterval = 50; // Update progress every 50ms

  // Progress tracking for visual indicator
  useEffect(() => {
    if (!isAutoPlaying || isHovered) {
      setProgress(0);
      return;
    }

    const progressStep = (progressInterval / autoplayDuration) * 100;
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + progressStep;
      });
    }, progressInterval);

    return () => clearInterval(progressTimer);
  }, [currentIndex, isAutoPlaying, isHovered]);

  // Auto-play functionality with offset
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    // Apply offset delay for staggered carousel timing
    const offsetTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
        setProgress(0); // Reset progress when slide changes
      }, autoplayDuration);

      return () => clearInterval(interval);
    }, autoplayOffset);

    return () => clearTimeout(offsetTimer);
  }, [items.length, isAutoPlaying, isHovered, autoplayOffset]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000); // Longer pause after manual interaction
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
    setProgress(0);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
    setProgress(0);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const toggleAutoplay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setProgress(0);
  };

  const renderProjectSlide = (project: Project, index: number) => {
    const safeTitle = project?.title || 'Untitled Project';
    const safeDescription = project?.description || 'No description available';
    const safeImage = project?.image || '';
    const safeCategory = project?.category || 'General';
    const safeImpact = project?.impact && Array.isArray(project.impact) ? project.impact : [];
    const isPrivate = requiresAuthentication(project);
    const shouldBlur = isPrivate && !isAuthenticated;

    return (
      <motion.div
        key={project?.id || index}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.05, y: -20 }}
        transition={{ 
          duration: 0.7,
          ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoother animation
        }}
        className="relative h-[28rem] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
        onClick={() => onItemClick(project)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={safeImage}
            alt={safeTitle}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
              shouldBlur ? 'blur-sm' : ''
            }`}
            initial={{ scale: 1.1 }}
            animate={{ scale: isHovered ? 1.15 : 1.1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
        
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        
        {/* Top Badges with Glass Effect */}
        <div className="absolute top-6 left-6 flex gap-3">
          <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 shadow-lg">
            {safeCategory}
          </Badge>
          <Badge 
            variant={isPrivate ? "destructive" : "secondary"}
            className={`backdrop-blur-md shadow-lg ${isPrivate 
              ? "bg-orange-500/20 text-orange-100 border-orange-400/30" 
              : "bg-green-500/20 text-green-100 border-green-400/30"
            }`}
          >
            {isPrivate ? (
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

        {/* Featured Star */}
        <div className="absolute top-6 right-6">
          <motion.div 
            className="bg-yellow-400/20 backdrop-blur-md p-2 rounded-full border border-yellow-300/30"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Star className="w-4 h-4 text-yellow-300 fill-current" />
          </motion.div>
        </div>
        
        {/* Private Content Overlay */}
        {shouldBlur && (
          <motion.div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="text-center text-white bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <Lock className="w-16 h-16 mx-auto mb-4 text-orange-300" />
              <h4 className="font-semibold mb-3 text-lg">Premium Case Study</h4>
              <p className="text-white/80 text-sm mb-4 max-w-xs">
                Join our community to access detailed insights and methodologies
              </p>
              <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-md hover:bg-white/30 border-white/30">
                <UserPlus className="w-4 h-4 mr-2" />
                Join to Unlock
              </Button>
            </motion.div>
          </motion.div>
        )}
        
        {/* Enhanced Content Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-white mb-3 text-2xl font-semibold ${shouldBlur ? 'blur-sm' : ''}`}>
                  {safeTitle}
                </h3>
                <p className={`text-white/90 text-base leading-relaxed ${shouldBlur ? 'blur-sm' : ''}`}>
                  {shouldBlur && safeDescription.length > 80 
                    ? safeDescription.slice(0, 80) + '...' 
                    : safeDescription.slice(0, 120) + (safeDescription.length > 120 ? '...' : '')
                  }
                </p>
              </div>
              
              {!shouldBlur && (
                <motion.div
                  className="flex items-center gap-2 ml-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <ExternalLink className="w-5 h-5 text-white/70" />
                </motion.div>
              )}
            </div>
            
            {/* Impact Metrics with Enhanced Design */}
            {!shouldBlur && safeImpact.length > 0 && (
              <div className="flex gap-4">
                {safeImpact.slice(0, 3).map((metric, idx) => (
                  <motion.div 
                    key={idx} 
                    className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <div>
                        <div className="text-white font-bold text-lg">{metric?.value || 'N/A'}</div>
                        <div className="text-white/70 text-xs uppercase tracking-wide">{metric?.metric || ''}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    );
  };

  const renderGradientSlide = (gradient: Gradient, index: number) => {
    const safeName = gradient?.name || 'Untitled Gradient';
    const safeGradient = gradient?.css || 'linear-gradient(45deg, #000, #fff)';
    const safeTags = gradient?.tags && Array.isArray(gradient.tags) ? gradient.tags : [];

    return (
      <motion.div
        key={gradient?.id || index}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.05, y: -20 }}
        transition={{ 
          duration: 0.7,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="relative h-[28rem] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
        onClick={() => onItemClick(gradient)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient Background with Animation */}
        <motion.div
          className="w-full h-full"
          style={{ background: safeGradient }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Animated Overlay Pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
          <div 
            className="w-full h-full bg-gradient-to-br from-white/20 via-transparent to-black/20"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
            }}
          />
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Floating Elements */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <motion.div 
            className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20"
            whileHover={{ scale: 1.1, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ExternalLink className="w-5 h-5 text-white" />
          </motion.div>
        </div>
        
        {/* Enhanced Content */}
        <motion.div 
          className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500"
          initial={{ y: 20 }}
          whileHover={{ y: 0 }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white mb-4 text-xl font-semibold">{safeName}</h3>
            
            {safeTags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {safeTags.slice(0, 3).map((tag, idx) => (
                  <motion.div
                    key={tag}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    );
  };

  // Safety checks
  if (!items || items.length === 0) {
    return (
      <div className="h-[28rem] rounded-3xl bg-muted flex items-center justify-center shadow-xl">
        <p className="text-muted-foreground">No items to display</p>
      </div>
    );
  }

  const safeCurrentIndex = Math.min(currentIndex, items.length - 1);
  const currentItem = items[safeCurrentIndex];

  if (!currentItem) {
    return (
      <div className="h-[28rem] rounded-3xl bg-muted flex items-center justify-center shadow-xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main slider with enhanced controls */}
      <div className="relative h-[28rem] mb-8">
        <AnimatePresence mode="wait">
          {type === 'projects' 
            ? renderProjectSlide(currentItem as Project, safeCurrentIndex)
            : renderGradientSlide(currentItem as Gradient, safeCurrentIndex)
          }
        </AnimatePresence>

        {/* Enhanced Navigation Buttons */}
        <motion.div
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white shadow-xl"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </motion.div>
        
        <motion.div
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white shadow-xl"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Autoplay Control */}
        <motion.div
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white shadow-xl"
            onClick={toggleAutoplay}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </motion.div>
      </div>

      {/* Enhanced Dots Indicator */}
      <div className="flex justify-center gap-3 mb-8">
        {items.map((_, index) => (
          <motion.button
            key={index}
            className={`relative transition-all duration-300 ${
              index === safeCurrentIndex
                ? 'w-8 h-3 bg-primary rounded-full'
                : 'w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50 rounded-full'
            }`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {index === safeCurrentIndex && (
              <motion.div
                className="absolute inset-0 bg-primary/30 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Enhanced Thumbnails Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.slice(0, 6).map((item, index) => {
          if (!item) return null;
          
          const isPrivate = type === 'projects' && requiresAuthentication(item as Project);
          const shouldBlur = isPrivate && !isAuthenticated;
          const isActive = index === safeCurrentIndex;
          
          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg ${
                isActive 
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' 
                  : 'hover:scale-105 hover:shadow-xl'
              }`}
              onClick={() => {
                goToSlide(index);
                onItemClick(item);
              }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              {type === 'projects' ? (
                <>
                  <img
                    src={(item as Project)?.image || ''}
                    alt={(item as Project)?.title || 'Project'}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      shouldBlur ? 'blur-sm' : ''
                    } ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                  />
                  {shouldBlur && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {/* Enhanced Status Indicator */}
                  <div className="absolute top-2 right-2">
                    <motion.div
                      className={`w-3 h-3 rounded-full ${
                        isPrivate ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </>
              ) : (
                <div
                  className={`w-full h-full transition-transform duration-500 ${
                    isActive ? 'scale-110' : 'hover:scale-110'
                  }`}
                  style={{ background: (item as Gradient)?.css || 'linear-gradient(45deg, #000, #fff)' }}
                />
              )}
              
              {/* Active Indicator Overlay */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}