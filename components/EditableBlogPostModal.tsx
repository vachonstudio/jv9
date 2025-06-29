import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Heart, Eye, Bookmark, Check, Save, Maximize, Minimize, FileText, Blocks } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { InlineEditor, ImageEditor } from "./InlineEditor";
import { ContentManagementToolbar } from "./ContentManagementToolbar";
import { CategoryTagManager } from "./CategoryTagManager";
import { ContentBlockEditor } from "./ContentBlockEditor";
import { SharePopover } from "./SharePopover";
import { useAuth } from "../contexts/AuthContext";
import { 
  BlogPost,
  ContentBlock,
  blogCategories,
  blogTags,
  createNewBlogPost,
  duplicateBlogPost,
  addBlogCategory,
  removeBlogCategory,
  addBlogTag,
  removeBlogTag,
  createContentBlock
} from "../types/blog";
import { toast } from "sonner";

interface EditableBlogPostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
  onPostUpdate?: (updatedPost: BlogPost) => void;
  onPostCreate?: (newPost: BlogPost) => void;
  onPostDelete?: (postId: string) => void;
  totalPosts?: number;
  publicPosts?: number;
  privatePosts?: number;
}

export function EditableBlogPostModal({ 
  post, 
  isOpen, 
  isFullscreen,
  onClose, 
  onToggleFullscreen,
  onPostUpdate,
  onPostCreate,
  onPostDelete,
  totalPosts = 0,
  publicPosts = 0,
  privatePosts = 0
}: EditableBlogPostModalProps) {
  const { canEdit } = useAuth();
  const [editablePost, setEditablePost] = useState<BlogPost | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [contentMode, setContentMode] = useState<'blocks' | 'markdown'>('blocks');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
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
  }, [isOpen]);

  useEffect(() => {
    if (post) {
      // Initialize contentBlocks if they don't exist
      let initialPost = { ...post };
      if (!initialPost.contentBlocks || initialPost.contentBlocks.length === 0) {
        // Create default content blocks from existing content
        initialPost.contentBlocks = [
          createContentBlock('heading'),
          createContentBlock('text')
        ];
        
        // If there's existing markdown content, put it in the text block
        if (initialPost.content && initialPost.content.trim()) {
          initialPost.contentBlocks[1].content.text = initialPost.content;
        }
      }
      
      setEditablePost(initialPost);
      setHasChanges(false);
      
      // Set initial content mode based on what's available
      setContentMode(initialPost.contentBlocks && initialPost.contentBlocks.length > 0 ? 'blocks' : 'markdown');
    }
  }, [post]);

  if (!post || !editablePost || !isOpen) return null;

  const updatePost = (updates: Partial<BlogPost>) => {
    const updated = { ...editablePost, ...updates };
    setEditablePost(updated);
    setHasChanges(true);
  };

  const updateContentBlocks = (blocks: ContentBlock[]) => {
    updatePost({ contentBlocks: blocks });
  };

  const updateTag = (tagIndex: number, newTag: string) => {
    const updatedTags = [...(editablePost.tags || [])];
    updatedTags[tagIndex] = newTag;
    updatePost({ tags: updatedTags });
  };

  const removeTag = (tagIndex: number) => {
    const updatedTags = (editablePost.tags || []).filter((_, index) => index !== tagIndex);
    updatePost({ tags: updatedTags });
  };

  const addTag = () => {
    const newTag = prompt('Enter new tag:');
    if (newTag && newTag.trim()) {
      updatePost({ tags: [...(editablePost.tags || []), newTag.trim()] });
    }
  };

  const handleSaveChanges = () => {
    if (onPostUpdate && hasChanges) {
      onPostUpdate(editablePost);
      
      // Save to localStorage for persistence
      const savedPosts = JSON.parse(localStorage.getItem('edited-posts') || '{}');
      savedPosts[editablePost.id] = editablePost;
      localStorage.setItem('edited-posts', JSON.stringify(savedPosts));
      
      toast.success('Blog post changes saved successfully');
      setHasChanges(false);
    }
  };

  const handleAddNewPost = () => {
    const newPost = createNewBlogPost() as BlogPost;
    if (onPostCreate) {
      onPostCreate(newPost);
      toast.success('New blog post created');
    }
  };

  const handleCopyPost = () => {
    if (editablePost) {
      const copiedPost = duplicateBlogPost(editablePost);
      if (onPostCreate) {
        onPostCreate(copiedPost);
        toast.success('Blog post duplicated successfully');
      }
    }
  };

  const handleDeletePost = () => {
    if (editablePost && onPostDelete) {
      onPostDelete(editablePost.id);
      handleClose();
    }
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    updatePost({ visibility: isPublic ? 'public' : 'private' });
  };

  const handleFeaturedChange = (isFeatured: boolean) => {
    updatePost({ isFeatured });
  };

  const handleCategoryChange = (categories: string[]) => {
    if (categories.length > 0) {
      updatePost({ category: categories[0] }); // Use first selected category
    }
  };

  const handleTagsChange = (tags: string[]) => {
    updatePost({ tags });
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    onClose();
    setHasChanges(false);
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked-posts') || '[]');
    const isBookmarked = bookmarks.includes(editablePost.id);
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter((id: string) => id !== editablePost.id);
      localStorage.setItem('bookmarked-posts', JSON.stringify(updatedBookmarks));
      toast.success("Removed from bookmarks");
    } else {
      bookmarks.push(editablePost.id);
      localStorage.setItem('bookmarked-posts', JSON.stringify(bookmarks));
      toast.success("Added to bookmarks");
    }
  };

  const handleContentModeChange = (mode: 'blocks' | 'markdown') => {
    if (mode === 'blocks' && (!editablePost.contentBlocks || editablePost.contentBlocks.length === 0)) {
      // Convert markdown content to blocks if switching to blocks mode
      const newBlocks: ContentBlock[] = [
        createContentBlock('heading'),
        createContentBlock('text')
      ];
      
      if (editablePost.content && editablePost.content.trim()) {
        newBlocks[1].content.text = editablePost.content;
      }
      
      updatePost({ contentBlocks: newBlocks });
    }
    setContentMode(mode);
  };

  // Generate hashtags for sharing
  const hashtags = [
    ...(editablePost.tags || []),
    editablePost.category || 'UXDesign',
    'Design',
    'UserExperience'
  ].slice(0, 8);

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
          onClick={isFullscreen ? undefined : handleClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: isFullscreen ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: isFullscreen ? 1 : 0.9 }}
          className={`relative bg-background overflow-hidden ${
            isFullscreen
              ? "w-screen h-screen"
              : "w-[90vw] h-[90vh] max-w-5xl rounded-xl shadow-2xl border"
          }`}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-blog-post-title"
          aria-describedby="edit-blog-post-description"
        >
          {/* Hidden accessibility labels */}
          <div className="sr-only">
            <h1 id="edit-blog-post-title">Edit Blog Post: {editablePost.title || 'Untitled'}</h1>
            <p id="edit-blog-post-description">
              Edit and modify the blog post content, including title, content, tags, and metadata. Changes are saved locally and can be published by administrators.
            </p>
          </div>

          {/* Window Controls - Fixed Position */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
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
                  onClick={handleClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Close blog post
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Save Changes Button - Fixed Position */}
          {canEdit() && hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 z-20"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handleSaveChanges} 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white border border-green-500"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Save your changes to this blog post
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}

          {/* Scrollable Content - Full Modal */}
          <ScrollArea className="h-full w-full">
            <div className="min-h-full">
              
              {/* Content Management Toolbar */}
              {canEdit() && (
                <div className={`sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b ${
                  isFullscreen ? "p-6 md:p-8 lg:p-10" : "p-4 md:p-6"
                }`}>
                  <ContentManagementToolbar
                    type="blog"
                    contentTitle={editablePost?.title}
                    isPublic={editablePost?.visibility === 'public'}
                    isFeatured={editablePost?.isFeatured}
                    onVisibilityChange={handleVisibilityChange}
                    onFeaturedChange={handleFeaturedChange}
                    onAddNew={handleAddNewPost}
                    onCopy={handleCopyPost}
                    onDelete={handleDeletePost}
                    totalCount={totalPosts}
                    publicCount={publicPosts}
                    privateCount={privatePosts}
                  />
                  
                  {showCategoryManager && (
                    <div className="mt-4">
                      <CategoryTagManager
                        type="blog"
                        categories={blogCategories}
                        tags={blogTags}
                        selectedCategories={editablePost?.category ? [editablePost.category] : []}
                        selectedTags={editablePost?.tags || []}
                        onCategoriesChange={handleCategoryChange}
                        onTagsChange={handleTagsChange}
                        onAddCategory={addBlogCategory}
                        onRemoveCategory={removeBlogCategory}
                        onAddTag={addBlogTag}
                        onRemoveTag={removeBlogTag}
                      />
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowCategoryManager(false)}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!showCategoryManager && (
                    <div className="flex justify-center mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowCategoryManager(true)}
                      >
                        Manage Categories & Tags
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Header Image Section */}
              <div className={`relative overflow-hidden ${
                isFullscreen ? "h-[40vh] min-h-[320px]" : "h-[30vh] min-h-[240px]"
              }`}>
                <ImageEditor
                  currentImage={editablePost.coverImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'}
                  alt={editablePost.title || 'Blog post'}
                  onImageChange={(newImage) => updatePost({ coverImage: newImage })}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Category Badge */}
                <div className={`absolute bottom-0 left-0 ${
                  isFullscreen 
                    ? "p-6 md:p-8 lg:p-10"
                    : "p-4 md:p-6"
                }`}>
                  <Badge className={`bg-primary/90 text-primary-foreground ${
                    isFullscreen ? "px-4 py-2 text-base" : "px-3 py-1 text-sm"
                  }`}>
                    {editablePost.category || 'General'}
                  </Badge>
                </div>
              </div>

              {/* Content Area */}
              <div className={`w-full ${
                isFullscreen 
                  ? "py-8 md:py-12 lg:py-16 px-6 md:px-12 lg:px-16 xl:px-20 max-w-5xl mx-auto"
                  : "py-6 md:py-8 px-4 md:px-6 lg:px-8"
              }`}>
                
                {/* Article Header */}
                <div className={`${
                  isFullscreen ? "mb-8 lg:mb-12" : "mb-6 lg:mb-8"
                }`}>
                  <InlineEditor
                    content={editablePost.title || ''}
                    type="title"
                    onSave={(newTitle) => updatePost({ title: newTitle })}
                    className={`font-bold mb-4 leading-tight block ${
                      isFullscreen 
                        ? "text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                        : "text-xl md:text-2xl lg:text-3xl"
                    }`}
                    placeholder="Blog post title"
                  />
                  
                  <InlineEditor
                    content={editablePost.excerpt || ''}
                    type="textarea"
                    multiline
                    onSave={(newExcerpt) => updatePost({ excerpt: newExcerpt })}
                    className={`text-muted-foreground mb-6 leading-relaxed block ${
                      isFullscreen 
                        ? "text-lg md:text-xl lg:text-2xl"
                        : "text-base md:text-lg"
                    }`}
                    placeholder="Post excerpt"
                  />
                  
                  {/* Author and Meta Info */}
                  <div className={`flex items-center justify-between ${
                    isFullscreen ? "mb-8" : "mb-6"
                  }`}>
                    <div className="flex items-center gap-4">
                      <Avatar className={`${
                        isFullscreen ? "w-14 h-14 lg:w-16 lg:h-16" : "w-12 h-12"
                      }`}>
                        <img 
                          src={editablePost.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'} 
                          alt={editablePost.author || 'Author'} 
                          className="w-full h-full object-cover" 
                        />
                      </Avatar>
                      <div>
                        <InlineEditor
                          content={editablePost.author || ''}
                          onSave={(newAuthor) => updatePost({ author: newAuthor })}
                          className={`font-medium ${
                            isFullscreen ? "text-lg lg:text-xl" : "text-base"
                          }`}
                          placeholder="Author name"
                        />
                        <InlineEditor
                          content={editablePost.authorRole || ''}
                          onSave={(newRole) => updatePost({ authorRole: newRole })}
                          className={`text-muted-foreground ${
                            isFullscreen ? "text-base lg:text-lg" : "text-sm"
                          }`}
                          placeholder="Author role"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <SharePopover
                        title={editablePost.title || 'Blog Post'}
                        description={editablePost.excerpt || 'Check out this blog post!'}
                        url={window.location.href}
                        imageUrl={editablePost.coverImage}
                        hashtags={hashtags}
                        author={editablePost.author}
                        triggerClassName="bg-transparent hover:bg-white/10 text-foreground border-border"
                        tooltipText="Share this post"
                      />
                      <Button 
                        variant="ghost" 
                        size={isFullscreen ? "default" : "sm"} 
                        onClick={handleBookmark}
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className={`flex items-center gap-4 lg:gap-6 text-muted-foreground mb-6 ${
                    isFullscreen ? "text-base lg:text-lg" : "text-sm"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{editablePost.publishedAt ? new Date(editablePost.publishedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <InlineEditor
                        content={editablePost.readTime || ''}
                        onSave={(newReadTime) => updatePost({ readTime: newReadTime })}
                        placeholder="Read time"
                        className="inline"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{editablePost.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{editablePost.views || 0} views</span>
                    </div>
                  </div>

                  <Separator />
                </div>

                {/* Content Editor - Tabs for Block vs Markdown */}
                <div className={`mb-8 lg:mb-12 ${
                  isFullscreen ? "mb-12 lg:mb-16" : "mb-8"
                }`}>
                  <Tabs value={contentMode} onValueChange={(value) => handleContentModeChange(value as 'blocks' | 'markdown')}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`font-bold ${
                        isFullscreen ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
                      }`}>
                        Content
                      </h3>
                      <TabsList>
                        <TabsTrigger value="blocks" className="flex items-center gap-2">
                          <Blocks className="w-4 h-4" />
                          Block Editor
                        </TabsTrigger>
                        <TabsTrigger value="markdown" className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Markdown
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="blocks" className="space-y-6">
                      <ContentBlockEditor
                        blocks={editablePost.contentBlocks || []}
                        onBlocksChange={updateContentBlocks}
                        isFullscreen={isFullscreen}
                      />
                    </TabsContent>

                    <TabsContent value="markdown" className="space-y-6">
                      <div className={`prose prose-neutral dark:prose-invert max-w-none ${
                        isFullscreen 
                          ? "prose-lg lg:prose-xl" 
                          : "prose-base lg:prose-lg"
                      }`}>
                        <InlineEditor
                          content={editablePost.content || ''}
                          type="textarea"
                          multiline
                          onSave={(newContent) => updatePost({ content: newContent })}
                          className={`whitespace-pre-wrap leading-relaxed block min-h-64 ${
                            isFullscreen 
                              ? "text-base md:text-lg lg:text-xl"
                              : "text-sm md:text-base lg:text-lg"
                          }`}
                          placeholder="Blog post content (supports markdown-style formatting)"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Tags */}
                <div className={`${
                  isFullscreen ? "mb-12 lg:mb-16" : "mb-8"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold ${
                      isFullscreen ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
                    }`}>
                      Tags
                    </h3>
                    {canEdit() && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={addTag}
                      >
                        Add Tag
                      </Button>
                    )}
                  </div>
                  <div className={`flex flex-wrap ${
                    isFullscreen ? "gap-3" : "gap-2"
                  }`}>
                    {(editablePost.tags || []).map((tag, index) => (
                      <div key={index} className="relative group">
                        {canEdit() ? (
                          <div className="relative">
                            <InlineEditor
                              content={tag}
                              onSave={(newTag) => updateTag(index, newTag)}
                              className={`inline-block px-3 py-1 bg-accent text-accent-foreground rounded-md ${
                                isFullscreen 
                                  ? "text-sm lg:text-base"
                                  : "text-xs lg:text-sm"
                              }`}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute -top-2 -right-2 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                              onClick={() => removeTag(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className={`cursor-pointer hover:bg-accent transition-colors ${
                              isFullscreen 
                                ? "px-4 py-2 text-sm lg:text-base"
                                : "px-3 py-1 text-xs lg:text-sm"
                            }`}
                          >
                            {tag}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement Section */}
                <div className={`border-t pt-6 ${
                  isFullscreen ? "pt-8 lg:pt-12" : "pt-6"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        size={isFullscreen ? "default" : "sm"}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Like ({editablePost.likes || 0})
                      </Button>
                      <SharePopover
                        title={editablePost.title || 'Blog Post'}
                        description={editablePost.excerpt || 'Check out this blog post!'}
                        url={window.location.href}
                        imageUrl={editablePost.coverImage}
                        hashtags={hashtags}
                        author={editablePost.author}
                        triggerClassName="bg-transparent hover:bg-accent text-foreground border-border"
                        tooltipText="Share this post on social media"
                      />
                    </div>
                    
                    <div className={`text-muted-foreground ${
                      isFullscreen ? "text-base" : "text-sm"
                    }`}>
                      {editablePost.views || 0} views
                    </div>
                  </div>
                </div>

                {/* Bottom Spacing */}
                <div className={`${
                  isFullscreen ? "h-8 lg:h-12" : "h-6"
                }`} />
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}