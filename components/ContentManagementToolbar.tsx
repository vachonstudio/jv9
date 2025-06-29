import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings, 
  ChevronDown,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";

interface ContentManagementToolbarProps {
  type: 'project' | 'blog';
  contentTitle?: string;
  isPublic: boolean;
  isFeatured?: boolean;
  onVisibilityChange: (isPublic: boolean) => void;
  onFeaturedChange?: (isFeatured: boolean) => void;
  onAddNew: () => void;
  onCopy: () => void;
  onDelete: () => void;
  totalCount?: number;
  publicCount?: number;
  privateCount?: number;
}

export function ContentManagementToolbar({
  type,
  contentTitle,
  isPublic,
  isFeatured = false,
  onVisibilityChange,
  onFeaturedChange,
  onAddNew,
  onCopy,
  onDelete,
  totalCount,
  publicCount,
  privateCount
}: ContentManagementToolbarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVisibilityChange = (checked: boolean) => {
    onVisibilityChange(checked);
    toast.success(`${type === 'project' ? 'Project' : 'Post'} visibility changed to ${checked ? 'public' : 'private'}`);
  };

  const handleFeaturedChange = (checked: boolean) => {
    if (onFeaturedChange) {
      onFeaturedChange(checked);
      toast.success(`${type === 'project' ? 'Project' : 'Post'} ${checked ? 'featured' : 'unfeatured'}`);
    }
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
    toast.success(`${type === 'project' ? 'Project' : 'Post'} deleted successfully`);
  };

  const handleCopy = () => {
    onCopy();
    toast.success(`${type === 'project' ? 'Project' : 'Post'} copied successfully`);
  };

  const handleAddNew = () => {
    onAddNew();
    toast.success(`New ${type === 'project' ? 'project' : 'post'} created`);
  };

  return (
    <>
      <Card className="w-full border border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Content Management
                </span>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  Admin Mode
                </Badge>
              </div>
              
              {totalCount !== undefined && (
                <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Total: {totalCount}
                  </span>
                  {publicCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Public: {publicCount}
                    </span>
                  )}
                  {privateCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Private: {privateCount}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Direct Action Buttons - No Dropdown */}
              <Button
                onClick={handleAddNew}
                size="sm"
                className="hidden sm:flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New {type === 'project' ? 'Project' : 'Post'}
              </Button>

              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                className="hidden sm:flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </Button>

              <Button
                onClick={() => setShowDeleteDialog(true)}
                size="sm"
                variant="outline"
                className="hidden sm:flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>

              {/* Mobile Actions */}
              <div className="sm:hidden flex items-center gap-1">
                <Button onClick={handleAddNew} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button onClick={handleCopy} size="sm" variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={() => setShowDeleteDialog(true)} size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Expand/Collapse Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Expanded Controls */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-green-200 dark:border-green-800"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Visibility Control */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Visibility</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="visibility"
                        checked={isPublic}
                        onCheckedChange={handleVisibilityChange}
                      />
                      <Label htmlFor="visibility" className="flex items-center gap-2">
                        {isPublic ? (
                          <>
                            <Eye className="w-4 h-4 text-green-600" />
                            Public
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-orange-600" />
                            Private
                          </>
                        )}
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isPublic 
                        ? 'Visible to all visitors' 
                        : 'Requires authentication to view'
                      }
                    </p>
                  </div>

                  {/* Featured Control */}
                  {onFeaturedChange && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Featured</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={isFeatured}
                          onCheckedChange={handleFeaturedChange}
                        />
                        <Label htmlFor="featured" className="flex items-center gap-2">
                          {isFeatured ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                              Featured
                            </>
                          ) : (
                            <span>Not Featured</span>
                          )}
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isFeatured 
                          ? 'Appears in featured sections' 
                          : 'Regular content listing'
                        }
                      </p>
                    </div>
                  )}

                  {/* Status Summary */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Current Status</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={isPublic ? "default" : "secondary"}>
                        {isPublic ? 'Public' : 'Private'}
                      </Badge>
                      {isFeatured && (
                        <Badge variant="outline" className="border-blue-300 text-blue-700">
                          Featured
                        </Badge>
                      )}
                    </div>
                    {contentTitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {contentTitle}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete {type === 'project' ? 'Project' : 'Post'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {type === 'project' ? 'project' : 'blog post'}? 
              This action cannot be undone and will permanently remove all content and associated data.
              {contentTitle && (
                <div className="mt-2 p-2 bg-muted rounded border-l-2 border-red-500">
                  <strong>{contentTitle}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}