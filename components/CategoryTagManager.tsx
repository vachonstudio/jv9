import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Tag, Folder } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";

interface CategoryTagManagerProps {
  type: 'project' | 'blog';
  categories: string[];
  tags?: string[];
  selectedCategories?: string[];
  selectedTags?: string[];
  onCategoriesChange: (categories: string[]) => void;
  onTagsChange?: (tags: string[]) => void;
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
}

export function CategoryTagManager({
  type,
  categories,
  tags = [],
  selectedCategories = [],
  selectedTags = [],
  onCategoriesChange,
  onTagsChange,
  onAddCategory,
  onRemoveCategory,
  onAddTag,
  onRemoveTag
}: CategoryTagManagerProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  
  // Local state to track categories and tags for immediate UI updates
  const [localCategories, setLocalCategories] = useState<string[]>(categories);
  const [localTags, setLocalTags] = useState<string[]>(tags);

  // Update local state when props change
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !localCategories.includes(newCategory.trim())) {
      try {
        onAddCategory(newCategory.trim());
        setLocalCategories(prev => [...prev, newCategory.trim()]);
        setNewCategory("");
        toast.success(`Category "${newCategory.trim()}" added successfully`);
      } catch (error) {
        toast.error("Failed to add category");
      }
    } else if (localCategories.includes(newCategory.trim())) {
      toast.error("Category already exists");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && onAddTag && !localTags.includes(newTag.trim())) {
      try {
        onAddTag(newTag.trim());
        setLocalTags(prev => [...prev, newTag.trim()]);
        setNewTag("");
        toast.success(`Tag "${newTag.trim()}" added successfully`);
      } catch (error) {
        toast.error("Failed to add tag");
      }
    } else if (localTags.includes(newTag.trim())) {
      toast.error("Tag already exists");
    }
  };

  const handleRemoveCategory = (category: string) => {
    if (category === "All") {
      toast.error("Cannot remove the 'All' category");
      return;
    }
    
    try {
      onRemoveCategory(category);
      setLocalCategories(prev => prev.filter(c => c !== category));
      toast.success(`Category "${category}" removed`);
    } catch (error) {
      toast.error(`Failed to remove category "${category}"`);
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (onRemoveTag) {
      try {
        onRemoveTag(tag);
        setLocalTags(prev => prev.filter(t => t !== tag));
        toast.success(`Tag "${tag}" removed`);
      } catch (error) {
        toast.error(`Failed to remove tag "${tag}"`);
      }
    }
  };

  const toggleCategory = (category: string) => {
    if (category === "All") return; // Don't allow selecting "All"
    
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(updatedCategories);
  };

  const toggleTag = (tag: string) => {
    if (!onTagsChange) return;
    
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(updatedTags);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Manage {type === 'project' ? 'Project' : 'Blog'} Categories & Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags" disabled={!localTags.length && !onAddTag}>Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            {/* Add New Category */}
            <div className="space-y-2">
              <Label htmlFor="new-category">Add New Category</Label>
              <div className="flex gap-2">
                <Input
                  id="new-category"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Current Categories */}
            <div className="space-y-2">
              <Label>Current Categories</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg min-h-16">
                <AnimatePresence>
                  {localCategories.map((category) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative"
                    >
                      <Badge
                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          category === "All" ? "cursor-not-allowed opacity-60" : ""
                        }`}
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                        {category !== "All" && (
                          <button
                            className="ml-2 h-4 w-4 p-0 hover:bg-transparent hover:text-red-600 rounded-sm text-muted-foreground/60 hover:text-red-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCategory(category);
                            }}
                            title={`Remove ${category} category`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {selectedCategories.length > 0 && (
                <Alert>
                  <Tag className="w-4 h-4" />
                  <AlertDescription>
                    Selected categories: {selectedCategories.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            {onAddTag && (
              <>
                {/* Add New Tag */}
                <div className="space-y-2">
                  <Label htmlFor="new-tag">Add New Tag</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-tag"
                      placeholder="Enter tag name"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Current Tags */}
                <div className="space-y-2">
                  <Label>Available Tags</Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg min-h-16 max-h-48 overflow-y-auto">
                    <AnimatePresence>
                      {localTags.map((tag) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative"
                        >
                          <Badge
                            variant={selectedTags.includes(tag) ? "default" : "secondary"}
                            className="cursor-pointer transition-all hover:scale-105"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                            <button
                              className="ml-2 h-4 w-4 p-0 hover:bg-transparent hover:text-red-600 rounded-sm text-muted-foreground/60 hover:text-red-500 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTag(tag);
                              }}
                              title={`Remove ${tag} tag`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {selectedTags.length > 0 && (
                    <Alert>
                      <Tag className="w-4 h-4" />
                      <AlertDescription>
                        Selected tags: {selectedTags.join(", ")}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}