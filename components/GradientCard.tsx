import { motion } from "framer-motion";
import { Heart, User } from "lucide-react";
import { Gradient } from "../types/gradient";

interface GradientCardProps {
  gradient: Gradient;
  onClick?: () => void;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function GradientCard({ 
  gradient, 
  onClick, 
  className = "", 
  isFavorite = false,
  onToggleFavorite 
}: GradientCardProps) {
  return (
    <motion.div
      className={`rounded-2xl cursor-pointer overflow-hidden relative group ${className}`}
      style={{ background: gradient.css }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Overlay for better icon visibility */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      
      {/* Favorite button */}
      <motion.button
        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
          isFavorite 
            ? 'bg-white/30 text-red-500' 
            : 'bg-white/20 text-white/70 hover:text-white hover:bg-white/30'
        }`}
        onClick={onToggleFavorite}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Heart 
          className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} 
        />
      </motion.button>

      {/* Custom gradient indicator */}
      {gradient.isCustom && (
        <motion.div
          className="absolute top-3 left-3 p-2 rounded-full bg-white/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <User className="h-4 w-4 text-white/80" />
        </motion.div>
      )}

      {/* Gradient name overlay on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
        initial={false}
      >
        <h4 className="text-white">{gradient.name}</h4>
        <p className="text-white/80 text-sm">{gradient.category}</p>
      </motion.div>
    </motion.div>
  );
}