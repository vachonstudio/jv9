import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { Gradient } from "../types/gradient";
import { Button } from "./ui/button";

interface GradientLightboxProps {
  gradient: Gradient | null;
  onClose: () => void;
  isOpen: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

export function GradientLightbox({ 
  gradient, 
  onClose, 
  isOpen, 
  isFavorite = false,
  onToggleFavorite,
  onDelete
}: GradientLightboxProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!gradient) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div
              className="h-48 relative"
              style={{ background: gradient.css }}
            >
              <div className="absolute top-4 right-4 flex gap-2">
                {onToggleFavorite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`bg-white/20 hover:bg-white/30 ${
                      isFavorite ? 'text-red-500' : 'text-white'
                    }`}
                    onClick={onToggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                )}
                
                {gradient.isCustom && onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 hover:bg-red-500/30 text-white hover:text-red-100"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2>{gradient.name}</h2>
                  {gradient.isCustom && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{gradient.description}</p>
                
                {/* Category and tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {gradient.category}
                  </span>
                  {gradient.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CSS Code */}
              <div className="mb-6">
                <h3 className="mb-3">CSS Code</h3>
                <div className="bg-gray-50 rounded-lg p-4 relative">
                  <code className="text-sm break-all">{gradient.css}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(gradient.css, 'css')}
                  >
                    {copiedItem === 'css' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Color Details */}
              <div>
                <h3 className="mb-4">Colors</h3>
                <div className="space-y-3">
                  {gradient.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{color.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(color.hex, `color-${index}`)}
                          >
                            <span className="text-sm text-gray-600">{color.hex}</span>
                            {copiedItem === `color-${index}` ? (
                              <Check className="h-3 w-3 ml-2 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 ml-2" />
                            )}
                          </Button>
                        </div>
                        <span className="text-sm text-gray-500">{color.position}% position</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}