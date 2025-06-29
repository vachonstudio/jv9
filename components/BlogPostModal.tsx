import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Eye, Heart, Tag, Maximize, Minimize } from "lucide-react";
import { isFavorited, toggleFavorite } from "../utils/favorites";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ContentBlock } from "./ContentBlock";
import { SharePopover } from "./SharePopover";
import { BlogPost } from "../types/blog";

interface BlogPostModalProps {
  post: BlogPost;
  isOpen: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
}

export function BlogPostModal({ 
  post, 
  isOpen, 
  isFullscreen, 
  onClose, 
  onToggleFullscreen 
}: BlogPostModalProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if post is favorited
  useEffect(() => {
    if (post) {
      const userId = user?.id || null;
      setIsFavorite(isFavorited(userId, post.id, 'blog_post'));
    }
  }, [post?.id, user?.id]);

  const handleFavoriteClick = () => {
    if (!post) return;
    
    const userId = user?.id || null;
    const newFavoriteStatus = toggleFavorite(userId, post.id, 'blog_post', {
      title: post.title,
      image: post.coverImage,
      description: post.excerpt,
      category: post.category,
      tags: post.tags,
      isPrivate: post.isSubscriberOnly
    });
    setIsFavorite(newFavoriteStatus);
  };
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  // Determine content to render with proper null checks
  const hasContentBlocks = post.contentBlocks && Array.isArray(post.contentBlocks) && post.contentBlocks.length > 0;
  const hasLegacyContent = post.content && typeof post.content === 'string' && post.content.trim().length > 0;
  const contentToRender = hasContentBlocks ? post.contentBlocks : null;

  // Generate hashtags from tags and category
  const hashtags = [
    ...(post.tags || []),
    post.category || 'UXDesign',
    'Design',
    'UserExperience'
  ].slice(0, 8); // Limit to 8 hashtags

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 ${
            isFullscreen 
              ? "bg-background" 
              : "bg-black/70 backdrop-blur-sm"
          }`}
          onClick={isFullscreen ? undefined : onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: isFullscreen ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: isFullscreen ? 1 : 0.9 }}
          className={`relative bg-background overflow-hidden ${
            isFullscreen
              ? "w-screen h-screen"
              : "w-[90vw] h-[90vh] max-w-6xl rounded-xl shadow-2xl border"
          }`}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-post-title"
          aria-describedby="blog-post-content"
        >
          {/* Hidden accessibility labels */}
          <div className="sr-only">
            <h1 id="blog-post-title">{post.title || 'Blog Post'}</h1>
            <p id="blog-post-content">
              Blog post by {post.author || 'Unknown'} published on {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unknown date'}. 
              {post.excerpt || 'No excerpt available'}
            </p>
          </div>

          {/* Window Controls - Fixed Position */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {/* Favorite Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`backdrop-blur-sm h-9 w-9 transition-colors ${
                    isFavorite 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30' 
                      : 'bg-black/20 hover:bg-black/40 text-white border border-white/20'
                  }`}
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>

            <SharePopover
              title={post.title || 'Blog Post'}
              description={post.excerpt || 'Check out this blog post!'}
              url={window.location.href}
              imageUrl={post.coverImage}
              hashtags={hashtags}
              author={post.author}
              tooltipText="Share this post"
            />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-sm h-9 w-9"
                  onClick={onToggleFullscreen}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? 'Minimize to window' : 'Maximize to fullscreen'}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-sm h-9 w-9"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Close blog post
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="h-full w-full">
            <div className="min-h-full">
              {/* Header Image */}
              <div className={`relative overflow-hidden ${
                isFullscreen ? "h-[60vh] min-h-[500px]" : "h-[40vh] min-h-[320px]"
              }`}>
                <img
                  src={post.coverImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'}
                  alt={post.title || 'Blog post cover'}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Header Content */}
                <div className={`absolute bottom-0 left-0 right-0 text-white ${
                  isFullscreen 
                    ? "p-8 md:p-12 lg:p-16 xl:p-20"
                    : "p-6 md:p-8"
                }`}>
                  <div className="max-w-4xl">
                    {/* Category Badge */}
                    <Badge className={`bg-primary/90 text-primary-foreground mb-4 ${
                      isFullscreen ? "px-4 py-2 text-base" : "px-3 py-1 text-sm"
                    }`}>
                      {post.category || 'General'}
                    </Badge>
                    
                    {/* Title */}
                    <h1 className={`font-bold mb-4 leading-tight ${
                      isFullscreen 
                        ? "text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                        : "text-2xl md:text-3xl lg:text-4xl"
                    }`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {post.title || 'Untitled Post'}
                    </h1>
                    
                    {/* Excerpt */}
                    <p className={`text-white/90 leading-relaxed mb-6 ${
                      isFullscreen 
                        ? "text-lg md:text-xl lg:text-2xl max-w-4xl"
                        : "text-base md:text-lg max-w-3xl"
                    }`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {post.excerpt || 'No excerpt available'}
                    </p>

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-4 text-white/80">
                      <div className="flex items-center gap-2">
                        <Avatar className={isFullscreen ? "w-10 h-10" : "w-8 h-8"}>
                          <img 
                            src={post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'} 
                            alt={post.author || 'Author'} 
                          />
                        </Avatar>
                        <div>
                          <p className={`font-medium ${isFullscreen ? "text-base" : "text-sm"}`}>
                            {post.author || 'Unknown Author'}
                          </p>
                          <p className={`${isFullscreen ? "text-sm" : "text-xs"} text-white/70`}>
                            {post.authorRole || 'Author'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-white/70">
                        <div className={`flex items-center gap-1 ${isFullscreen ? "text-sm" : "text-xs"}`}>
                          <Calendar className="w-4 h-4" />
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unknown date'}
                        </div>
                        <div className={`flex items-center gap-1 ${isFullscreen ? "text-sm" : "text-xs"}`}>
                          <Clock className="w-4 h-4" />
                          {post.readTime || '5 min read'}
                        </div>
                        {post.views && (
                          <div className={`flex items-center gap-1 ${isFullscreen ? "text-sm" : "text-xs"}`}>
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()}
                          </div>
                        )}
                        <motion.button
                          onClick={handleFavoriteClick}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-1 transition-colors ${
                            isFullscreen ? "text-sm" : "text-xs"
                          } ${
                            isFavorite ? 'text-red-400' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                          {((post.likes || 0) + (isFavorite ? 1 : 0)).toLocaleString()}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className={`${
                isFullscreen 
                  ? "px-8 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16 lg:py-20"
                  : "px-6 md:px-8 py-8 md:py-12"
              }`}>
                <div className="max-w-4xl mx-auto">
                  {/* Content Blocks or Legacy Content */}
                  {contentToRender ? (
                    <div className="space-y-6">
                      {contentToRender.map((block, index) => (
                        <motion.div
                          key={block.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                        >
                          <ContentBlock 
                            block={block} 
                            isFullscreen={isFullscreen}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : hasLegacyContent ? (
                    /* Fallback to markdown content with proper null checking */
                    <div className="prose prose-lg max-w-none">
                      <div className={`leading-relaxed ${
                        isFullscreen 
                          ? "text-lg md:text-xl lg:text-2xl"
                          : "text-base md:text-lg"
                      }`}>
                        {post.content.split('\n').map((line, index) => {
                          // Simple markdown-like rendering for fallback
                          if (line.startsWith('# ')) {
                            return (
                              <h1 key={index} className={`font-bold mt-8 mb-4 ${
                                isFullscreen ? "text-3xl md:text-4xl lg:text-5xl" : "text-2xl md:text-3xl"
                              }`}>
                                {line.substring(2)}
                              </h1>
                            );
                          }
                          if (line.startsWith('## ')) {
                            return (
                              <h2 key={index} className={`font-bold mt-6 mb-3 ${
                                isFullscreen ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl"
                              }`}>
                                {line.substring(3)}
                              </h2>
                            );
                          }
                          if (line.trim() === '') {
                            return <br key={index} />;
                          }
                          return (
                            <p key={index} className="mb-4">
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* No content available */
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No content available for this post.
                      </p>
                    </div>
                  )}

                  {/* Tags Section */}
                  {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                    <>
                      <Separator className="my-8" />
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Author Bio Section */}
                  <Separator className="my-8" />
                  <div className={`flex items-start gap-4 p-6 bg-muted/30 rounded-xl ${
                    isFullscreen ? "p-8" : "p-6"
                  }`}>
                    <Avatar className={isFullscreen ? "w-16 h-16" : "w-12 h-12"}>
                      <img 
                        src={post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'} 
                        alt={post.author || 'Author'} 
                      />
                    </Avatar>
                    <div className="flex-1">
                      <h3 className={`font-medium mb-1 ${
                        isFullscreen ? "text-lg" : "text-base"
                      }`}>
                        {post.author || 'Unknown Author'}
                      </h3>
                      <p className={`text-muted-foreground mb-2 ${
                        isFullscreen ? "text-base" : "text-sm"
                      }`}>
                        {post.authorRole || 'Author'}
                      </p>
                      <p className={`text-muted-foreground ${
                        isFullscreen ? "text-base" : "text-sm"
                      }`}>
                        Passionate about creating user-centered digital experiences and helping teams build better products through research-driven design.
                      </p>
                    </div>
                  </div>

                  {/* Share Section */}
                  <Separator className="my-8" />
                  <div className="text-center">
                    <h3 className={`font-medium mb-4 ${isFullscreen ? "text-lg" : "text-base"}`}>
                      Share this post
                    </h3>
                    <div className="flex justify-center">
                      <SharePopover
                        title={post.title || 'Blog Post'}
                        description={post.excerpt || 'Check out this blog post!'}
                        url={window.location.href}
                        imageUrl={post.coverImage}
                        hashtags={hashtags}
                        author={post.author}
                        triggerClassName="bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
                        tooltipText="Share this post on social media"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}