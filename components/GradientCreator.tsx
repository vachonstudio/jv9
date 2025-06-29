import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Gradient, categories, saveCustomGradient } from "../types/gradient";

interface GradientCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gradient: Gradient) => void;
}

interface ColorStop {
  hex: string;
  name: string;
  position: number;
}

export function GradientCreator({ isOpen, onClose, onSave }: GradientCreatorProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { hex: "#FF6B6B", name: "Red", position: 0 },
    { hex: "#4ECDC4", name: "Blue", position: 100 }
  ]);
  const [direction, setDirection] = useState("135deg");

  const generateCSS = () => {
    const colorString = colorStops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.hex} ${stop.position}%`)
      .join(", ");
    return `linear-gradient(${direction}, ${colorString})`;
  };

  const addColorStop = () => {
    const newPosition = colorStops.length === 0 ? 50 : 
      Math.min(100, Math.max(...colorStops.map(s => s.position)) + 10);
    
    setColorStops([
      ...colorStops,
      { hex: "#FFFFFF", name: "White", position: newPosition }
    ]);
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index));
    }
  };

  const updateColorStop = (index: number, field: keyof ColorStop, value: string | number) => {
    const updated = [...colorStops];
    updated[index] = { ...updated[index], [field]: value };
    setColorStops(updated);
  };

  const handleSave = () => {
    if (!name.trim() || !category || colorStops.length < 2) return;

    const gradient: Gradient = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim() || "Custom gradient",
      category,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      colors: colorStops.map(stop => ({
        hex: stop.hex,
        name: stop.name || "Color",
        position: stop.position
      })),
      css: generateCSS(),
      isCustom: true
    };

    saveCustomGradient(gradient);
    onSave(gradient);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setCategory("");
    setTags("");
    setColorStops([
      { hex: "#FF6B6B", name: "Red", position: 0 },
      { hex: "#4ECDC4", name: "Blue", position: 100 }
    ]);
    setDirection("135deg");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with live preview */}
            <div
              className="h-48 relative"
              style={{ background: generateCSS() }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-4 left-4 text-white">
                <h2>{name || "Untitled Gradient"}</h2>
                <p className="text-white/80">{description || "Custom gradient"}</p>
              </div>
            </div>

            {/* Form content */}
            <div className="p-8 space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Gradient Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Awesome Gradient"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your gradient..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="warm, sunset, vibrant"
                  />
                </div>
                <div>
                  <Label htmlFor="direction">Direction</Label>
                  <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="135deg">Diagonal (135°)</SelectItem>
                      <SelectItem value="90deg">Vertical (90°)</SelectItem>
                      <SelectItem value="0deg">Horizontal (0°)</SelectItem>
                      <SelectItem value="45deg">Diagonal (45°)</SelectItem>
                      <SelectItem value="180deg">Vertical Reverse (180°)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color stops */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Color Stops</Label>
                  <Button onClick={addColorStop} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {colorStops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="color"
                        value={stop.hex}
                        onChange={(e) => updateColorStop(index, "hex", e.target.value)}
                        className="w-12 h-12 rounded-lg border cursor-pointer"
                      />
                      <Input
                        value={stop.name}
                        onChange={(e) => updateColorStop(index, "name", e.target.value)}
                        placeholder="Color name"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => updateColorStop(index, "position", parseInt(e.target.value) || 0)}
                        className="w-20"
                        placeholder="%"
                      />
                      <span className="text-sm text-gray-500">%</span>
                      {colorStops.length > 2 && (
                        <Button
                          onClick={() => removeColorStop(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button onClick={handleClose} variant="outline">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!name.trim() || !category || colorStops.length < 2}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Gradient
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}