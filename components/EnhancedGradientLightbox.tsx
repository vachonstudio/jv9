import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Heart, Trash2, Download, Share2, Palette, FileImage, FileText, Image } from "lucide-react";
import { useState, useEffect } from "react";
import { Gradient } from "../types/gradient";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { exportAsCSS, exportAsSVG, exportAsPNG, generateGradientURL } from "../utils/gradientExport";
import { generateGradientVariations, generateComplementaryVariations } from "../utils/gradientVariations";

interface EnhancedGradientLightboxProps {
  gradient: Gradient | null;
  onClose: () => void;
  isOpen: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  onAddVariation?: (variation: Gradient) => void;
}

export function EnhancedGradientLightbox({ 
  gradient, 
  onClose, 
  isOpen, 
  isFavorite = false,
  onToggleFavorite,
  onDelete,
  onAddVariation
}: EnhancedGradientLightboxProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showVariations, setShowVariations] = useState(false);

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

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShareGradient = async () => {
    if (!gradient) return;
    
    const shareUrl = generateGradientURL(gradient);
    try {
      if (navigator.share) {
        await navigator.share({
          title: gradient.name,
          text: gradient.description,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedItem('share-url');
        setTimeout(() => setCopiedItem(null), 2000);
      }
    } catch (err) {
      console.error('Failed to share: ', err);
    }
  };

  const handleExport = (format: 'css' | 'svg' | 'png') => {
    if (!gradient) return;
    
    switch (format) {
      case 'css':
        exportAsCSS(gradient);
        break;
      case 'svg':
        exportAsSVG(gradient, 800, 600);
        break;
      case 'png':
        exportAsPNG(gradient, 1200, 800);
        break;
    }
  };

  const generateVariations = () => {
    if (!gradient || !onAddVariation) return;
    
    const variations = [
      ...generateGradientVariations(gradient),
      ...generateComplementaryVariations(gradient)
    ];
    
    variations.forEach(variation => onAddVariation(variation));
    setShowVariations(true);
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
            className="bg-white dark:bg-card rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gradient-title"
            aria-describedby="gradient-description"
          >
            {/* Hidden accessibility labels */}
            <div className="sr-only">
              <h1 id="gradient-title">{gradient.name} - Gradient Details</h1>
              <p id="gradient-description">
                Gradient preview and export options for {gradient.name}. {gradient.description}
              </p>
            </div>

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
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={handleShareGradient}
                  aria-label="Share gradient"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                {gradient.isCustom && onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 hover:bg-red-500/30 text-white hover:text-red-100"
                    onClick={onDelete}
                    aria-label="Delete custom gradient"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={onClose}
                  aria-label="Close gradient preview"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-foreground">{gradient.name}</h2>
                  {gradient.isCustom && (
                    <Badge variant="secondary">Custom</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{gradient.description}</p>
                
                {/* Category and tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{gradient.category}</Badge>
                  {gradient.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Export options */}
              <div className="mb-6">
                <h3 className="mb-3">Export Options</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleExport('css')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Export CSS
                  </Button>
                  <Button
                    onClick={() => handleExport('svg')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FileImage className="h-4 w-4" />
                    Export SVG
                  </Button>
                  <Button
                    onClick={() => handleExport('png')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Export PNG
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Generate variations */}
              {onAddVariation && (
                <div className="mb-6">
                  <h3 className="mb-3">Create Variations</h3>
                  <Button
                    onClick={generateVariations}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Palette className="h-4 w-4" />
                    Generate Variations
                  </Button>
                  {showVariations && (
                    <p className="text-sm text-muted-foreground mt-2">
                      6 variations created! Check the gallery to see them.
                    </p>
                  )}
                </div>
              )}

              <Separator className="my-6" />

              {/* CSS Code */}
              <div className="mb-6">
                <h3 className="mb-3">CSS Code</h3>
                <div className="bg-muted rounded-lg p-4 relative">
                  <code className="text-sm break-all text-foreground">{gradient.css}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(gradient.css, 'css')}
                    aria-label="Copy CSS code"
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
                <h3 className="mb-4">Color Breakdown</h3>
                <div className="space-y-3">
                  {gradient.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-border"
                        style={{ backgroundColor: color.hex }}
                        aria-label={`Color ${color.name}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{color.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(color.hex, `color-${index}`)}
                            aria-label={`Copy ${color.name} hex code`}
                          >
                            <span className="text-sm text-muted-foreground">{color.hex}</span>
                            {copiedItem === `color-${index}` ? (
                              <Check className="h-3 w-3 ml-2 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 ml-2" />
                            )}
                          </Button>
                        </div>
                        <span className="text-sm text-muted-foreground">{color.position}% position</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share URL notification */}
              {copiedItem === 'share-url' && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 rounded-lg text-sm">
                  Share URL copied to clipboard! Send it to share this gradient.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}