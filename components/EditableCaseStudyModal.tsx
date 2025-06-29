import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Target, TrendingUp, ChevronRight, Save, Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { InlineEditor, ImageEditor } from "./InlineEditor";
import { ContentManagementToolbar } from "./ContentManagementToolbar";
import { CategoryTagManager } from "./CategoryTagManager";
import { useAuth } from "../contexts/AuthContext";
import { 
  Project, 
  projectCategories,
  createNewProject,
  duplicateProject,
  addProjectCategory,
  removeProjectCategory
} from "../types/portfolio";
import { toast } from "sonner";

interface EditableCaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
  onProjectUpdate?: (updatedProject: Project) => void;
  onProjectCreate?: (newProject: Project) => void;
  onProjectDelete?: (projectId: string) => void;
  totalProjects?: number;
  publicProjects?: number;
  privateProjects?: number;
}

export function EditableCaseStudyModal({ 
  project, 
  isOpen, 
  isFullscreen,
  onClose, 
  onToggleFullscreen,
  onProjectUpdate,
  onProjectCreate,
  onProjectDelete,
  totalProjects = 0,
  publicProjects = 0,
  privateProjects = 0
}: EditableCaseStudyModalProps) {
  const { canEdit } = useAuth();
  const [editableProject, setEditableProject] = useState<Project | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

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
    if (project) {
      // Ensure all required arrays exist with defaults
      const projectWithDefaults = {
        ...project,
        sections: project.sections || [],
        impact: project.impact || [],
        technologies: project.technologies || []
      };
      setEditableProject(projectWithDefaults);
      setHasChanges(false);
    }
  }, [project]);

  if (!project || !editableProject || !isOpen) return null;

  const updateProject = (updates: Partial<Project>) => {
    const updated = { ...editableProject, ...updates };
    setEditableProject(updated);
    setHasChanges(true);
  };

  const updateSection = (sectionIndex: number, updates: Partial<typeof editableProject.sections[0]>) => {
    const updatedSections = [...(editableProject.sections || [])];
    if (updatedSections[sectionIndex]) {
      updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], ...updates };
      updateProject({ sections: updatedSections });
    }
  };

  const updateImpactMetric = (metricIndex: number, updates: Partial<typeof editableProject.impact[0]>) => {
    const impact = editableProject.impact || [];
    if (impact[metricIndex]) {
      const updatedImpact = [...impact];
      updatedImpact[metricIndex] = { ...updatedImpact[metricIndex], ...updates };
      updateProject({ impact: updatedImpact });
    }
  };

  const handleSaveChanges = () => {
    if (onProjectUpdate && hasChanges) {
      onProjectUpdate(editableProject);
      
      // Save to localStorage for persistence
      const savedProjects = JSON.parse(localStorage.getItem('edited-projects') || '{}');
      savedProjects[editableProject.id] = editableProject;
      localStorage.setItem('edited-projects', JSON.stringify(savedProjects));
      
      toast.success('Project changes saved successfully');
      setHasChanges(false);
    }
  };

  const handleAddNewProject = () => {
    const newProject = createNewProject() as Project;
    if (onProjectCreate) {
      onProjectCreate(newProject);
      toast.success('New project created');
    }
  };

  const handleCopyProject = () => {
    if (editableProject) {
      const copiedProject = duplicateProject(editableProject);
      if (onProjectCreate) {
        onProjectCreate(copiedProject);
        toast.success('Project duplicated successfully');
      }
    }
  };

  const handleDeleteProject = () => {
    if (editableProject && onProjectDelete) {
      onProjectDelete(editableProject.id);
      handleClose();
    }
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    updateProject({ visibility: isPublic ? 'public' : 'private' });
  };

  const handleFeaturedChange = (isFeatured: boolean) => {
    updateProject({ featured: isFeatured });
  };

  const handleCategoryChange = (categories: string[]) => {
    if (categories.length > 0) {
      updateProject({ category: categories[0] }); // Use first selected category
    }
  };

  const handleTechnologiesChange = (technologies: string[]) => {
    updateProject({ technologies });
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    onClose();
    setHasChanges(false);
  };

  const sections = editableProject.sections || [];
  const impact = editableProject.impact || [];
  const technologies = editableProject.technologies || [];

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
              : "w-[80vw] h-[85vh] max-w-6xl rounded-xl shadow-2xl border"
          }`}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-case-study-title"
          aria-describedby="edit-case-study-description"
        >
          {/* Hidden accessibility labels */}
          <div className="sr-only">
            <h1 id="edit-case-study-title">Edit Project: {editableProject.title || 'Untitled'}</h1>
            <p id="edit-case-study-description">
              Edit and modify the case study content, including sections, images, and project details. Changes are saved locally and can be published by administrators.
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
                Close case study
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
                  Save your changes to this case study
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
                    type="project"
                    contentTitle={editableProject?.title}
                    isPublic={editableProject?.visibility === 'public'}
                    isFeatured={editableProject?.featured}
                    onVisibilityChange={handleVisibilityChange}
                    onFeaturedChange={handleFeaturedChange}
                    onAddNew={handleAddNewProject}
                    onCopy={handleCopyProject}
                    onDelete={handleDeleteProject}
                    totalCount={totalProjects}
                    publicCount={publicProjects}
                    privateCount={privateProjects}
                  />
                  
                  {showCategoryManager && (
                    <div className="mt-4">
                      <CategoryTagManager
                        type="project"
                        categories={projectCategories}
                        tags={editableProject?.technologies || []}
                        selectedCategories={editableProject?.category ? [editableProject.category] : []}
                        selectedTags={editableProject?.technologies || []}
                        onCategoriesChange={handleCategoryChange}
                        onTagsChange={handleTechnologiesChange}
                        onAddCategory={addProjectCategory}
                        onRemoveCategory={removeProjectCategory}
                        onAddTag={(tag) => {
                          const updatedTechnologies = [...(editableProject?.technologies || []), tag];
                          updateProject({ technologies: updatedTechnologies });
                        }}
                        onRemoveTag={(tag) => {
                          const updatedTechnologies = (editableProject?.technologies || []).filter(t => t !== tag);
                          updateProject({ technologies: updatedTechnologies });
                        }}
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
                        Manage Categories & Technologies
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {/* Header Image Section */}
              <div className={`relative overflow-hidden ${
                isFullscreen ? "h-[50vh] min-h-[400px]" : "h-[35vh] min-h-[280px]"
              }`}>
                <ImageEditor
                  currentImage={editableProject.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'}
                  alt={editableProject.title || 'Project image'}
                  onImageChange={(newImage) => updateProject({ image: newImage })}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Project Title Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 ${
                  isFullscreen 
                    ? "p-8 md:p-12 lg:p-16 xl:p-20"
                    : "p-4 md:p-6 lg:p-8"
                }`}>
                  <div className="w-full max-w-none">
                    <Badge className={`bg-primary/90 text-primary-foreground mb-3 ${
                      isFullscreen ? "px-4 py-2 text-base" : "px-3 py-1 text-sm"
                    }`}>
                      {editableProject.category || 'General'}
                    </Badge>
                    
                    <InlineEditor
                      content={editableProject.title || ''}
                      type="title"
                      onSave={(newTitle) => updateProject({ title: newTitle })}
                      className={`text-white font-bold mb-3 leading-tight block ${
                        isFullscreen 
                          ? "text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
                          : "text-xl md:text-2xl lg:text-3xl"
                      }`}
                      placeholder="Project title"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                    />
                    
                    <InlineEditor
                      content={editableProject.description || ''}
                      type="textarea"
                      multiline
                      onSave={(newDescription) => updateProject({ description: newDescription })}
                      className={`text-white/90 leading-relaxed block ${
                        isFullscreen 
                          ? "text-lg md:text-xl lg:text-2xl xl:text-3xl max-w-6xl"
                          : "text-sm md:text-base lg:text-lg max-w-4xl"
                      }`}
                      placeholder="Project description"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className={`w-full ${
                isFullscreen 
                  ? "py-12 md:py-16 lg:py-20 xl:py-24 px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24"
                  : "py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8"
              }`}>
                
                {/* Project Meta Information */}
                <div className={`grid grid-cols-2 lg:grid-cols-4 bg-muted/30 rounded-xl mb-8 ${
                  isFullscreen 
                    ? "gap-6 lg:gap-8 xl:gap-12 p-8 lg:p-10 xl:p-12 mb-16 lg:mb-20"
                    : "gap-3 lg:gap-4 p-4 lg:p-6 mb-8 lg:mb-10"
                }`}>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <Calendar className={`text-primary ${
                        isFullscreen ? "w-6 h-6 lg:w-7 lg:h-7" : "w-4 h-4 lg:w-5 lg:h-5"
                      }`} />
                      <span className={`font-medium ${
                        isFullscreen ? "text-lg lg:text-xl" : "text-sm lg:text-base"
                      }`}>Duration</span>
                    </div>
                    <InlineEditor
                      content={editableProject.duration || ''}
                      onSave={(newDuration) => updateProject({ duration: newDuration })}
                      className={`font-semibold ${
                        isFullscreen ? "text-xl lg:text-2xl" : "text-base lg:text-lg"
                      }`}
                      placeholder="Duration"
                    />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <Users className={`text-primary ${
                        isFullscreen ? "w-6 h-6 lg:w-7 lg:h-7" : "w-4 h-4 lg:w-5 lg:h-5"
                      }`} />
                      <span className={`font-medium ${
                        isFullscreen ? "text-lg lg:text-xl" : "text-sm lg:text-base"
                      }`}>Team Size</span>
                    </div>
                    <InlineEditor
                      content={editableProject.team || ''}
                      onSave={(newTeam) => updateProject({ team: newTeam })}
                      className={`font-semibold ${
                        isFullscreen ? "text-xl lg:text-2xl" : "text-base lg:text-lg"
                      }`}
                      placeholder="Team size"
                    />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <Target className={`text-primary ${
                        isFullscreen ? "w-6 h-6 lg:w-7 lg:h-7" : "w-4 h-4 lg:w-5 lg:h-5"
                      }`} />
                      <span className={`font-medium ${
                        isFullscreen ? "text-lg lg:text-xl" : "text-sm lg:text-base"
                      }`}>My Role</span>
                    </div>
                    <InlineEditor
                      content={editableProject.role || ''}
                      onSave={(newRole) => updateProject({ role: newRole })}
                      className={`font-semibold ${
                        isFullscreen ? "text-xl lg:text-2xl" : "text-base lg:text-lg"
                      }`}
                      placeholder="Your role"
                    />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <TrendingUp className={`text-primary ${
                        isFullscreen ? "w-6 h-6 lg:w-7 lg:h-7" : "w-4 h-4 lg:w-5 lg:h-5"
                      }`} />
                      <span className={`font-medium ${
                        isFullscreen ? "text-lg lg:text-xl" : "text-sm lg:text-base"
                      }`}>Type</span>
                    </div>
                    <p className={`font-semibold ${
                      isFullscreen ? "text-xl lg:text-2xl" : "text-base lg:text-lg"
                    }`}>Case Study</p>
                  </div>
                </div>

                {/* Project Sections */}
                <div className={`${
                  isFullscreen 
                    ? "space-y-16 lg:space-y-20 xl:space-y-24"
                    : "space-y-8 lg:space-y-10"
                }`}>
                  {sections.map((section, index) => (
                    <motion.article
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="relative"
                    >
                      {/* Section Header */}
                      <div className={`${
                        isFullscreen 
                          ? "mb-8 lg:mb-12 xl:mb-16"
                          : "mb-4 lg:mb-6"
                      }`}>
                        <div className={`flex items-center ${
                          isFullscreen 
                            ? "gap-4 lg:gap-6 xl:gap-8 mb-6 lg:mb-8"
                            : "gap-3 lg:gap-4 mb-3 lg:mb-4"
                        }`}>
                          <div className={`rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ${
                            isFullscreen 
                              ? "w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16"
                              : "w-8 h-8 lg:w-10 lg:h-10"
                          }`}>
                            <span className={`text-primary font-bold ${
                              isFullscreen 
                                ? "text-lg lg:text-xl xl:text-2xl"
                                : "text-sm lg:text-base"
                            }`}>{index + 1}</span>
                          </div>
                          <InlineEditor
                            content={section.title || ''}
                            type="title"
                            onSave={(newTitle) => updateSection(index, { title: newTitle })}
                            className={`font-bold leading-tight ${
                              isFullscreen 
                                ? "text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl"
                                : "text-lg md:text-xl lg:text-2xl"
                            }`}
                            placeholder="Section title"
                          />
                        </div>
                      </div>

                      {/* Section Content Layout */}
                      <div className={`grid items-start ${
                        isFullscreen 
                          ? "lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16"
                          : "lg:grid-cols-12 gap-4 lg:gap-6"
                      }`}>
                        
                        {/* Text Content */}
                        <div className={`${section.image ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'}`}>
                          <div className="prose prose-lg max-w-none">
                            <InlineEditor
                              content={section.content || ''}
                              type="textarea"
                              multiline
                              onSave={(newContent) => updateSection(index, { content: newContent })}
                              className={`leading-relaxed text-muted-foreground whitespace-pre-line block ${
                                isFullscreen 
                                  ? "text-lg md:text-xl lg:text-2xl xl:text-3xl"
                                  : "text-sm md:text-base lg:text-lg"
                              }`}
                              placeholder="Section content"
                              style={{ lineHeight: '1.7' }}
                            />
                          </div>

                          {/* Section Metrics */}
                          {section.metrics && section.metrics.length > 0 && (
                            <div className={`grid mt-6 ${
                              isFullscreen 
                                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mt-12 lg:mt-16"
                                : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 mt-6 lg:mt-8"
                            }`}>
                              {section.metrics.map((metric, metricIndex) => (
                                <div 
                                  key={metricIndex} 
                                  className={`text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10 ${
                                    isFullscreen 
                                      ? "p-8 lg:p-10 xl:p-12"
                                      : "p-4 lg:p-6"
                                  }`}
                                >
                                  <InlineEditor
                                    content={metric.value || ''}
                                    onSave={(newValue) => {
                                      const updatedMetrics = [...(section.metrics || [])];
                                      updatedMetrics[metricIndex] = { ...metric, value: newValue };
                                      updateSection(index, { metrics: updatedMetrics });
                                    }}
                                    className={`font-bold text-primary mb-3 block ${
                                      isFullscreen 
                                        ? "text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6"
                                        : "text-2xl md:text-3xl lg:text-4xl"
                                    }`}
                                    placeholder="Value"
                                  />
                                  <InlineEditor
                                    content={metric.label || ''}
                                    onSave={(newLabel) => {
                                      const updatedMetrics = [...(section.metrics || [])];
                                      updatedMetrics[metricIndex] = { ...metric, label: newLabel };
                                      updateSection(index, { metrics: updatedMetrics });
                                    }}
                                    className={`text-muted-foreground font-medium block ${
                                      isFullscreen 
                                        ? "text-lg md:text-xl lg:text-2xl"
                                        : "text-xs md:text-sm lg:text-base"
                                    }`}
                                    placeholder="Metric label"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Section Image */}
                        {section.image && (
                          <div className="lg:col-span-5 xl:col-span-4">
                            <div className="rounded-xl overflow-hidden shadow-lg border border-border/50">
                              <ImageEditor
                                currentImage={section.image}
                                alt={section.title || 'Section image'}
                                onImageChange={(newImage) => updateSection(index, { image: newImage })}
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Section Divider */}
                      {index < sections.length - 1 && (
                        <div className={`${
                          isFullscreen 
                            ? "mt-16 lg:mt-20 xl:mt-24"
                            : "mt-8 lg:mt-10"
                        }`}>
                          <div className="relative">
                            <Separator />
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.article>
                  ))}
                </div>

                {/* Impact & Results Section */}
                {impact.length > 0 && (
                  <div className={`border-t border-border ${
                    isFullscreen 
                      ? "mt-20 lg:mt-24 xl:mt-28 pt-16 lg:pt-20 xl:pt-24"
                      : "mt-10 lg:mt-12 pt-8 lg:pt-10"
                  }`}>
                    <div className={`text-center ${
                      isFullscreen 
                        ? "mb-12 lg:mb-16 xl:mb-20"
                        : "mb-6 lg:mb-8"
                    }`}>
                      <h3 className={`font-bold mb-4 ${
                        isFullscreen 
                          ? "text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-8"
                          : "text-xl md:text-2xl lg:text-3xl"
                      }`}>Impact & Results</h3>
                      <p className={`text-muted-foreground leading-relaxed mx-auto ${
                        isFullscreen 
                          ? "text-lg md:text-xl lg:text-2xl xl:text-3xl max-w-6xl"
                          : "text-sm md:text-base lg:text-lg max-w-4xl"
                      }`}>
                        Measurable outcomes and key achievements from this project
                      </p>
                    </div>
                    
                    <div className={`grid ${
                      isFullscreen 
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-10 xl:gap-12"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                    }`}>
                      {impact.map((metric, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className={`text-center bg-gradient-to-br from-secondary/50 to-accent/50 rounded-xl border border-border/50 ${
                            isFullscreen 
                              ? "p-8 lg:p-10 xl:p-12"
                              : "p-4 lg:p-6"
                          }`}
                        >
                          <InlineEditor
                            content={metric.value || ''}
                            onSave={(newValue) => updateImpactMetric(index, { value: newValue })}
                            className={`font-bold text-primary block ${
                              isFullscreen 
                                ? "text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6"
                                : "text-3xl md:text-4xl lg:text-5xl mb-3"
                            }`}
                            placeholder="Impact value"
                          />
                          <InlineEditor
                            content={metric.metric || ''}
                            onSave={(newMetric) => updateImpactMetric(index, { metric: newMetric })}
                            className={`text-muted-foreground font-medium leading-relaxed block ${
                              isFullscreen 
                                ? "text-lg md:text-xl lg:text-2xl"
                                : "text-sm md:text-base lg:text-lg"
                            }`}
                            placeholder="Impact description"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies & Tools */}
                {technologies.length > 0 && (
                  <div className={`border-t border-border ${
                    isFullscreen 
                      ? "mt-16 lg:mt-20 xl:mt-24 pt-12 lg:pt-16 xl:pt-20"
                      : "mt-8 lg:mt-10 pt-6 lg:pt-8"
                  }`}>
                    <h4 className={`font-bold text-center ${
                      isFullscreen 
                        ? "text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 lg:mb-12"
                        : "text-lg md:text-xl lg:text-2xl mb-4 lg:mb-6"
                    }`}>
                      Technologies & Tools
                    </h4>
                    <div className={`flex flex-wrap justify-center ${
                      isFullscreen 
                        ? "gap-4 lg:gap-6 xl:gap-8"
                        : "gap-2 lg:gap-3"
                    }`}>
                      {technologies.map((tech, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`font-medium hover:bg-primary/10 transition-colors ${
                            isFullscreen 
                              ? "px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg xl:text-xl"
                              : "px-3 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm"
                          }`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Spacing */}
                <div className={`${
                  isFullscreen 
                    ? "h-16 lg:h-20 xl:h-24"
                    : "h-6 lg:h-8"
                }`} />
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}