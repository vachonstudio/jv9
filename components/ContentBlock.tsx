import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ContentBlock as ContentBlockType } from "../types/blog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ContentBlockProps {
  block: ContentBlockType;
  isFullscreen?: boolean;
  className?: string;
}

export function ContentBlock({ block, isFullscreen = false, className = "" }: ContentBlockProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getTextSizeClass = (size?: string, isFullscreen?: boolean) => {
    if (isFullscreen) {
      switch (size) {
        case 'small': return 'text-lg md:text-xl';
        case 'large': return 'text-2xl md:text-3xl lg:text-4xl';
        default: return 'text-xl md:text-2xl lg:text-3xl';
      }
    } else {
      switch (size) {
        case 'small': return 'text-sm md:text-base';
        case 'large': return 'text-lg md:text-xl';
        default: return 'text-base md:text-lg';
      }
    }
  };

  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const getWidthClass = (width?: string) => {
    switch (width) {
      case 'small': return 'max-w-sm mx-auto';
      case 'medium': return 'max-w-2xl mx-auto';
      case 'large': return 'max-w-4xl mx-auto';
      default: return 'w-full';
    }
  };

  const baseSpacing = isFullscreen ? "mb-8 lg:mb-12 xl:mb-16" : "mb-6 lg:mb-8";

  switch (block.type) {
    case 'heading':
      const HeadingTag = `h${block.content.level || 2}` as keyof JSX.IntrinsicElements;
      const headingSize = isFullscreen 
        ? block.content.level === 1 
          ? "text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
          : block.content.level === 2
          ? "text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
          : "text-xl md:text-2xl lg:text-3xl xl:text-4xl"
        : block.content.level === 1
        ? "text-2xl md:text-3xl lg:text-4xl"
        : block.content.level === 2
        ? "text-xl md:text-2xl lg:text-3xl"
        : "text-lg md:text-xl lg:text-2xl";

      return (
        <HeadingTag 
          className={`font-bold ${headingSize} ${getAlignmentClass(block.style?.alignment)} ${baseSpacing} ${className}`}
          style={{ 
            color: block.style?.textColor,
            backgroundColor: block.style?.backgroundColor 
          }}
        >
          {block.content.text}
        </HeadingTag>
      );

    case 'text':
      return (
        <div 
          className={`${getTextSizeClass(block.style?.fontSize, isFullscreen)} ${getAlignmentClass(block.style?.alignment)} leading-relaxed ${baseSpacing} ${className}`}
          style={{ 
            color: block.style?.textColor,
            backgroundColor: block.style?.backgroundColor,
            fontWeight: block.style?.fontWeight === 'bold' ? 'bold' : block.style?.fontWeight === 'medium' ? '500' : 'normal'
          }}
        >
          {block.content.text?.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? "mt-4" : ""}>
              {line}
            </p>
          ))}
        </div>
      );

    case 'image':
      return (
        <div className={`${baseSpacing} ${getAlignmentClass(block.style?.alignment)} ${className}`}>
          <div className={getWidthClass(block.style?.width)}>
            <ImageWithFallback
              src={block.content.src || ''}
              alt={block.content.alt || ''}
              className={`w-full h-auto rounded-lg shadow-lg ${
                block.style?.aspectRatio ? '' : 'object-cover'
              }`}
              style={{ 
                aspectRatio: block.style?.aspectRatio,
                backgroundColor: block.style?.backgroundColor 
              }}
            />
            {block.content.caption && (
              <p className="text-sm text-muted-foreground mt-3 italic text-center">
                {block.content.caption}
              </p>
            )}
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className={`${baseSpacing} ${className}`}>
          <blockquote 
            className={`border-l-4 border-primary pl-6 py-4 ${getAlignmentClass(block.style?.alignment)}`}
            style={{ 
              backgroundColor: block.style?.backgroundColor,
              borderColor: block.style?.textColor || 'var(--color-primary)'
            }}
          >
            <p 
              className={`${getTextSizeClass('large', isFullscreen)} italic mb-2`}
              style={{ color: block.style?.textColor }}
            >
              "{block.content.quote}"
            </p>
            {block.content.author && (
              <cite 
                className={`${getTextSizeClass('small', isFullscreen)} text-muted-foreground not-italic`}
                style={{ color: block.style?.textColor ? `${block.style.textColor}80` : undefined }}
              >
                — {block.content.author}
              </cite>
            )}
          </blockquote>
        </div>
      );

    case 'code':
      return (
        <div className={`${baseSpacing} ${className}`}>
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            {block.content.language && (
              <div className="bg-muted/50 px-4 py-2 border-b border-border/50">
                <Badge variant="secondary" className="text-xs">
                  {block.content.language}
                </Badge>
              </div>
            )}
            <pre 
              className="p-4 overflow-x-auto text-sm"
              style={{ 
                backgroundColor: block.style?.backgroundColor,
                color: block.style?.textColor 
              }}
            >
              <code>{block.content.code}</code>
            </pre>
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className={`${baseSpacing} flex justify-center ${className}`}>
          <div 
            className="w-24 h-px bg-border"
            style={{ backgroundColor: block.style?.backgroundColor || 'var(--color-border)' }}
          />
        </div>
      );

    case 'video':
      return (
        <div className={`${baseSpacing} ${getAlignmentClass(block.style?.alignment)} ${className}`}>
          <div className={getWidthClass(block.style?.width)}>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-lg">
              {block.content.thumbnail && (
                <ImageWithFallback
                  src={block.content.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button 
                  size="lg" 
                  className="bg-white/90 text-black hover:bg-white"
                  onClick={() => {
                    if (block.content.videoUrl) {
                      window.open(block.content.videoUrl, '_blank');
                    }
                  }}
                >
                  <Play className="w-6 h-6 mr-2" />
                  Watch Video
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      );

    case 'gallery':
      if (!block.content.images || block.content.images.length === 0) {
        return null;
      }

      const images = block.content.images;
      const currentImage = images[currentImageIndex];

      return (
        <div className={`${baseSpacing} ${className}`}>
          <div className={getWidthClass(block.style?.width)}>
            {images.length === 1 ? (
              // Single image
              <div className={getAlignmentClass(block.style?.alignment)}>
                <ImageWithFallback
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                {currentImage.caption && (
                  <p className="text-sm text-muted-foreground mt-3 italic text-center">
                    {currentImage.caption}
                  </p>
                )}
              </div>
            ) : (
              // Image carousel
              <div className="space-y-4">
                <div className="relative">
                  <ImageWithFallback
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  
                  {/* Navigation buttons */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === 0 ? images.length - 1 : prev - 1
                        )}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === images.length - 1 ? 0 : prev + 1
                        )}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-primary' 
                            : 'border-transparent hover:border-muted-foreground/30'
                        }`}
                      >
                        <ImageWithFallback
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Caption and image counter */}
                <div className="text-center">
                  {currentImage.caption && (
                    <p className="text-sm text-muted-foreground italic">
                      {currentImage.caption}
                    </p>
                  )}
                  {images.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {currentImageIndex + 1} of {images.length}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className={`${baseSpacing} p-4 bg-muted/30 rounded-lg text-center ${className}`}>
          <p className="text-muted-foreground">Unsupported content block type: {block.type}</p>
        </div>
      );
  }
}