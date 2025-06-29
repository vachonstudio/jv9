import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { GradientCard } from "./GradientCard";
import { GradientLightbox } from "./GradientLightbox";
import { GradientFilters } from "./GradientFilters";
import { GradientCreator } from "./GradientCreator";
import { 
  gradients as defaultGradients, 
  Gradient, 
  getFavorites, 
  toggleFavorite,
  getCustomGradients,
  deleteCustomGradient
} from "../types/gradient";

export function GradientGallery() {
  const [selectedGradient, setSelectedGradient] = useState<Gradient | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customGradients, setCustomGradients] = useState<Gradient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites and custom gradients on mount
  useEffect(() => {
    setFavorites(getFavorites());
    setCustomGradients(getCustomGradients());
  }, []);

  // Combine default and custom gradients
  const allGradients = useMemo(() => {
    return [...defaultGradients, ...customGradients];
  }, [customGradients]);

  // Filter gradients based on search, category, and favorites
  const filteredGradients = useMemo(() => {
    let filtered = allGradients;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(gradient =>
        gradient.name.toLowerCase().includes(query) ||
        gradient.description.toLowerCase().includes(query) ||
        gradient.category.toLowerCase().includes(query) ||
        gradient.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(gradient => gradient.category === selectedCategory);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(gradient => favorites.includes(gradient.id));
    }

    return filtered;
  }, [allGradients, searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  const handleGradientClick = (gradient: Gradient) => {
    setSelectedGradient(gradient);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setTimeout(() => setSelectedGradient(null), 300);
  };

  const handleToggleFavorite = (gradientId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const newFavorites = toggleFavorite(gradientId);
    setFavorites(newFavorites);
  };

  const handleDeleteCustomGradient = (gradientId: string) => {
    deleteCustomGradient(gradientId);
    setCustomGradients(getCustomGradients());
    
    // Close lightbox if the deleted gradient is currently open
    if (selectedGradient?.id === gradientId) {
      handleCloseLightbox();
    }
  };

  const handleSaveCustomGradient = (gradient: Gradient) => {
    setCustomGradients(getCustomGradients());
  };

  return (
    <>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="mb-4">Gradient Gallery</h1>
            <p className="text-muted-foreground text-lg">
              Discover beautiful gradients for your next project
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <GradientFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
              onCreateNew={() => setIsCreatorOpen(true)}
              favoritesCount={favorites.length}
            />
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredGradients.length} gradient{filteredGradients.length !== 1 ? 's' : ''} found
              {showFavoritesOnly && " in favorites"}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Gradient Grid */}
          {filteredGradients.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {filteredGradients.map((gradient, index) => (
                <motion.div
                  key={gradient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <GradientCard
                    gradient={gradient}
                    onClick={() => handleGradientClick(gradient)}
                    className="aspect-[4/3] w-full"
                    isFavorite={favorites.includes(gradient.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(gradient.id, e)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="mb-2">No gradients found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters, or create a custom gradient
              </p>
              <button
                onClick={() => setIsCreatorOpen(true)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Custom Gradient
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <GradientLightbox
        gradient={selectedGradient}
        onClose={handleCloseLightbox}
        isOpen={isLightboxOpen}
        isFavorite={selectedGradient ? favorites.includes(selectedGradient.id) : false}
        onToggleFavorite={selectedGradient ? () => handleToggleFavorite(selectedGradient.id) : undefined}
        onDelete={selectedGradient?.isCustom ? () => handleDeleteCustomGradient(selectedGradient.id) : undefined}
      />

      {/* Gradient Creator */}
      <GradientCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSave={handleSaveCustomGradient}
      />
    </>
  );
}