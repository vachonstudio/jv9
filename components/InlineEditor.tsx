import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Check, X, Image, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface InlineEditorProps {
  content: string;
  type?: 'text' | 'textarea' | 'title';
  onSave: (newContent: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export function InlineEditor({ 
  content, 
  type = 'text', 
  onSave, 
  placeholder,
  className = '',
  multiline = false
}: InlineEditorProps) {
  const { canEdit } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!canEdit()) {
    return <span className={className}>{content}</span>;
  }

  const handleSave = () => {
    if (editValue.trim() !== content) {
      onSave(editValue.trim());
      toast.success('Content updated successfully');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.metaKey && multiline) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative group"
      >
        {multiline || type === 'textarea' ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`min-h-20 ${className}`}
            rows={3}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={className}
          />
        )}
        
        <div className="flex items-center gap-2 mt-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          <div className="text-xs text-muted-foreground">
            {multiline ? 'Cmd+Enter to save' : 'Enter to save, Esc to cancel'}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsEditing(true)}
    >
      <span>{content}</span>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-1 -right-1"
          >
            <Badge 
              variant="outline" 
              className="text-xs bg-background/90 backdrop-blur-sm border-primary/20"
            >
              <Edit3 className="w-2 h-2 mr-1" />
              Edit
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ImageEditorProps {
  currentImage: string;
  alt: string;
  onImageChange: (newImageUrl: string) => void;
  className?: string;
}

export function ImageEditor({ currentImage, alt, onImageChange, className = '' }: ImageEditorProps) {
  const { canEdit } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!canEdit()) {
    return <img src={currentImage} alt={alt} className={className} />;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server here
      // For demo, we'll use a URL input instead
      setIsEditing(true);
      toast.info('For demo purposes, please enter an image URL');
    }
  };

  const handleUrlSave = () => {
    if (newImageUrl.trim()) {
      onImageChange(newImageUrl.trim());
      toast.success('Image updated successfully');
      setIsEditing(false);
      setNewImageUrl('');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewImageUrl('');
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={currentImage} alt={alt} className={className} />
      
      <AnimatePresence>
        {isHovered && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                <Image className="w-3 h-3 mr-1" />
                Change Image
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm p-4 flex flex-col justify-center"
          >
            <div className="space-y-3">
              <Input
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUrlSave();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUrlSave} disabled={!newImageUrl.trim()}>
                  <Check className="w-3 h-3 mr-1" />
                  Update
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a valid image URL (e.g., from Unsplash, your CDN, etc.)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}