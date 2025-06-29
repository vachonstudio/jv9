import { motion } from "framer-motion";
import { Clock, Users, Award, ArrowRight, Lock, Globe, Eye, Heart } from "lucide-react";
import { Project } from "../types/portfolio";
import { Badge } from "./ui/badge";
import { isFavorited, toggleFavorite } from "../utils/favorites";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index: number;
  showAuthRequired?: boolean;
}

export function ProjectCard({ project, onClick, index, showAuthRequired = false }: ProjectCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const isPrivate = project.visibility === 'private';
  
  // Check if project is favorited
  useEffect(() => {
    const userId = user?.id || null;
    setIsFavorite(isFavorited(userId, project.id, 'project'));
  }, [project.id, user?.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = user?.id || null;
    const newFavoriteStatus = toggleFavorite(userId, project.id, 'project', {
      title: project.title,
      image: project.image,
      description: project.description,
      category: project.category,
      tags: project.technologies,
      isPrivate: isPrivate
    });
    setIsFavorite(newFavoriteStatus);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer relative"
      onClick={onClick}
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/10]">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top badges and controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex gap-2">
              {project.featured && (
                <Badge variant="secondary" className="bg-white/90 text-primary">
                  <Award className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              
              {/* Visibility badge */}
              <Badge 
                variant={isPrivate ? "destructive" : "secondary"} 
                className={`${isPrivate 
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" 
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                }`}
              >
                {isPrivate ? (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Members Only
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* Category */}
              <Badge variant="outline" className="bg-white/90 border-white/20">
                {project.category}
              </Badge>
              
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

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              {showAuthRequired && isPrivate ? (
                <>
                  <Lock className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Join to View</span>
                </>
              ) : (
                <>
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <span>View Case Study</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <h3 className="mb-1 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm">{project.description}</p>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {project.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {project.team}
            </div>
            {/* Favorite indicator in meta */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavoriteClick}
              className={`flex items-center gap-1 transition-colors ${
                isFavorite ? 'text-red-500' : 'hover:text-foreground'
              }`}
            >
              <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="text-xs">
                {isFavorite ? 'Favorited' : 'Favorite'}
              </span>
            </motion.button>
          </div>

          {/* Impact metrics preview */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {project.impact.slice(0, 2).map((metric, index) => (
              <div key={index} className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-sm text-primary font-medium">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.metric}</div>
              </div>
            ))}
          </div>

          {/* Technologies preview */}
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map(tech => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          {/* Auth required message */}
          {showAuthRequired && isPrivate && (
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Join the community to view this case study</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}