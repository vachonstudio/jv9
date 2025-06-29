import { motion } from "framer-motion";
import { Calendar, Clock, Eye, Heart, Lock, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { BlogPost } from "../types/blog";
import { isFavorited, toggleFavorite } from "../utils/favorites";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

interface BlogPostCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
  index: number;
  showProtected?: boolean;
}

export function BlogPostCard({ post, onClick, index, showProtected = false }: BlogPostCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const isProtected = showProtected && post.isSubscriberOnly;
  
  // Check if post is favorited
  useEffect(() => {
    const userId = user?.id || null;
    setIsFavorite(isFavorited(userId, post.id, 'blog_post'));
  }, [post.id, user?.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleCardClick = () => {
    onClick(post);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(post);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
        onClick={handleCardClick}
      >
        <div className="relative">
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isProtected ? 'blur-sm' : ''
              }`}
            />
          </div>
          
          {isProtected && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center text-white"
              >
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium text-sm">Subscriber Only</p>
              </motion.div>
            </div>
          )}
          
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <Badge className="bg-primary/90 text-primary-foreground">
              {post.category}
            </Badge>
            <div className="flex items-center gap-2">
              {post.isFeatured && (
                <Badge variant="secondary" className="bg-yellow-500/90 text-yellow-900">
                  Featured
                </Badge>
              )}
              
              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isFavorite 
                    ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                    : 'bg-black/20 text-white/70 hover:text-white border border-white/20 hover:border-white/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-8 h-8">
              <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{post.author}</p>
              <p className="text-xs text-muted-foreground truncate">{post.authorRole}</p>
            </div>
          </div>

          <h3 className={`mb-3 line-clamp-2 group-hover:text-primary transition-colors ${
            isProtected ? 'blur-sm' : ''
          }`}>
            {post.title}
          </h3>
          
          <p className={`text-muted-foreground text-sm mb-4 line-clamp-3 ${
            isProtected ? 'blur-sm' : ''
          }`}>
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoriteClick}
                className={`flex items-center gap-1 transition-colors ${
                  isFavorite ? 'text-red-500' : 'hover:text-foreground'
                }`}
              >
                <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{post.likes + (isFavorite ? 1 : 0)}</span>
              </motion.button>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{post.views}</span>
              </div>
            </div>
            
            {isProtected ? (
              <Button size="sm" variant="outline" onClick={handleButtonClick}>
                <UserPlus className="w-3 h-3 mr-1" />
                Subscribe
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={handleButtonClick}>
                Read More
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}