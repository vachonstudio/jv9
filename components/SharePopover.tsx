import { useState, useRef, useEffect } from "react";
import { 
  Share2, 
  Mail, 
  Copy, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Instagram,
  Music,
  ExternalLink,
  Check,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SharePopoverProps {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
  author?: string;
  triggerClassName?: string;
  tooltipText?: string;
}

export function SharePopover({ 
  title, 
  description, 
  url = window.location.href, 
  imageUrl,
  hashtags = [],
  author,
  triggerClassName = "",
  tooltipText = "Share this content"
}: SharePopoverProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Encode URL components for safe sharing
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = imageUrl ? encodeURIComponent(imageUrl) : '';
  
  // Create sharing text
  const shareText = encodeURIComponent(`${title} - ${description}`);
  const tweetText = encodeURIComponent(`${title}\n\n${description}\n\n${hashtags.map(tag => `#${tag.replace('#', '')}`).join(' ')}`);

  // Handle positioning when popover opens
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let top = rect.bottom + 8;
      let left = rect.right - 320; // 320px is popover width (w-80)
      
      // Adjust if popover would go off screen
      if (left < 8) {
        left = 8;
      }
      if (left + 320 > viewportWidth - 8) {
        left = viewportWidth - 328;
      }
      if (top + 400 > viewportHeight) { // Approximate popover height
        top = rect.top - 408;
      }
      
      setPosition({ top, left });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          popoverRef.current && 
          !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        setIsOpen(false);
      } catch (error) {
        // User cancelled or share failed, do nothing
      }
    } else {
      handleCopyLink();
    }
  };

  const shareOptions = [
    {
      name: 'Native Share',
      icon: Share2,
      color: 'text-blue-600 dark:text-blue-400',
      action: handleNativeShare,
      available: !!navigator.share,
      description: 'Use device sharing'
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: copied ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400',
      action: handleCopyLink,
      available: true,
      description: 'Copy to clipboard'
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'text-red-600 dark:text-red-400',
      action: () => {
        const subject = encodeURIComponent(`Check out: ${title}`);
        const body = encodeURIComponent(`I thought you might be interested in this:\n\n${title}\n\n${description}\n\n${url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        setIsOpen(false);
      },
      available: true,
      description: 'Share via email'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600 dark:text-green-400',
      action: () => {
        const text = encodeURIComponent(`${title}\n\n${description}\n\n${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        setIsOpen(false);
      },
      available: true,
      description: 'Share on WhatsApp'
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'text-black dark:text-white',
      action: () => {
        let twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodedUrl}`;
        if (author) {
          twitterUrl += `&via=${encodeURIComponent(author.replace('@', ''))}`;
        }
        window.open(twitterUrl, '_blank');
        setIsOpen(false);
      },
      available: true,
      description: 'Share on X (Twitter)'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600 dark:text-blue-400',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${shareText}`;
        window.open(facebookUrl, '_blank');
        setIsOpen(false);
      },
      available: true,
      description: 'Share on Facebook'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700 dark:text-blue-400',
      action: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
        window.open(linkedinUrl, '_blank');
        setIsOpen(false);
      },
      available: true,
      description: 'Share on LinkedIn'
    },
    {
      name: 'Pinterest',
      icon: ExternalLink,
      color: 'text-red-600 dark:text-red-400',
      action: () => {
        let pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${shareText}`;
        if (encodedImage) {
          pinterestUrl += `&media=${encodedImage}`;
        }
        window.open(pinterestUrl, '_blank');
        setIsOpen(false);
      },
      available: !!imageUrl,
      description: 'Pin to Pinterest'
    },
    {
      name: 'TikTok',
      icon: Music,
      color: 'text-black dark:text-white',
      action: () => {
        const tiktokText = `Check this out! 🔥\n\n${title}\n\n${description}\n\n${hashtags.map(tag => `#${tag.replace('#', '')}`).join(' ')}\n\n${url}`;
        navigator.clipboard.writeText(tiktokText);
        toast.success('TikTok-style text copied! Paste it in your TikTok post.');
        setIsOpen(false);
      },
      available: true,
      description: 'Copy for TikTok'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600 dark:text-pink-400',
      action: () => {
        const instagramText = `${title}\n\n${description}\n\n${hashtags.map(tag => `#${tag.replace('#', '')}`).join(' ')}\n\nLink in bio or DM me for the link! 💜`;
        navigator.clipboard.writeText(instagramText);
        toast.success('Instagram-style text copied! Add the link to your bio.');
        setIsOpen(false);
      },
      available: true,
      description: 'Copy for Instagram'
    }
  ];

  // Filter available options
  const availableOptions = shareOptions.filter(option => option.available);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={`bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-sm h-9 w-9 rounded-md flex items-center justify-center transition-colors ${triggerClassName}`}
        title={tooltipText}
        aria-label={tooltipText}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {/* Popover Content - Fixed Position with High Z-Index */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[9998]" />
            
            {/* Popover */}
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="fixed z-[9999] w-80 bg-popover border rounded-md shadow-lg p-4"
              style={{
                top: position.top,
                left: position.left,
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-popover-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 id="share-popover-title" className="font-medium">Share this content</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {title}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Close share menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Share Options Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {availableOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent/50 transition-colors text-left"
                    title={option.description}
                  >
                    <option.icon className={`w-4 h-4 ${option.color}`} />
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                ))}
              </div>

              {/* URL Preview */}
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Share URL</p>
                    <p className="text-sm truncate">{url}</p>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Hashtags Preview */}
              {hashtags.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Suggested hashtags</p>
                  <div className="flex flex-wrap gap-1">
                    {hashtags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        #{tag.replace('#', '')}
                      </span>
                    ))}
                    {hashtags.length > 5 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{hashtags.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}