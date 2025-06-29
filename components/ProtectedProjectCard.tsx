import { motion } from "framer-motion";
import { Lock, Eye, UserPlus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Project } from "../types/portfolio";

interface ProtectedProjectCardProps {
  project: Project;
  onClick: () => void;
  index: number;
  isAuthenticated: boolean;
  onSignupClick: () => void;
}

export function ProtectedProjectCard({ 
  project, 
  onClick, 
  index, 
  isAuthenticated,
  onSignupClick 
}: ProtectedProjectCardProps) {
  const handleClick = () => {
    if (isAuthenticated) {
      onClick();
    } else {
      onSignupClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <Card 
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
          !isAuthenticated ? 'relative' : ''
        }`}
        onClick={handleClick}
      >
        <div className="aspect-video relative overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              !isAuthenticated ? 'blur-sm' : ''
            }`}
          />
          
          {!isAuthenticated && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center text-white"
              >
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Premium Content</p>
              </motion.div>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="outline" className="border-primary/20 text-primary">
              {project.category}
            </Badge>
            {!isAuthenticated && (
              <Eye className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          
          <h3 className="mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          <p className={`text-muted-foreground mb-4 ${
            !isAuthenticated ? 'blur-sm' : ''
          }`}>
            {isAuthenticated ? project.description : project.description.slice(0, 50) + '...'}
          </p>
          
          {!isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Sign up to view</span>
              </div>
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                onSignupClick();
              }}>
                <UserPlus className="w-3 h-3 mr-1" />
                Join
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.impact.slice(0, 2).map((metric, idx) => (
                <div key={idx} className="text-xs bg-muted/50 px-2 py-1 rounded">
                  <span className="text-primary">{metric.value}</span>
                  <span className="text-muted-foreground ml-1">{metric.metric}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}