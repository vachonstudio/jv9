import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Type, 
  Image, 
  Quote, 
  Code, 
  Video, 
  Minus,
  Images,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { ContentBlock, createContentBlock } from "../types/blog";
import { InlineEditor } from "./InlineEditor";
import { toast } from "sonner";

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
  isFullscreen?: boolean;
}

export function ContentBlockEditor({ blocks, onBlocksChange, isFullscreen = false }: ContentBlockEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = (type: ContentBlock['type'], insertAfterIndex?: number) => {
    const newBlock = createContentBlock(type);
    const newBlocks = [...blocks];
    
    if (insertAfterIndex !== undefined) {
      newBlocks.splice(insertAfterIndex + 1, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }
    
    onBlocksChange(newBlocks);
    setSelectedBlockId(newBlock.id);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} block added`);
  };

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId 
        ? { ...block, ...updates }
        : block
    );
    onBlocksChange(newBlocks);
  };

  const removeBlock = (blockId: string) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    onBlocksChange(newBlocks);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    toast.success('Block removed');
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onBlocksChange(newBlocks);
  };

  const blockTypeOptions = [
    { type: 'text' as const, label: 'Text', icon: Type },
    { type: 'heading' as const, label: 'Heading', icon: Heading1 },
    { type: 'image' as const, label: 'Image', icon: Image },
    { type: 'quote' as const, label: 'Quote', icon: Quote },
    { type: 'code' as const, label: 'Code', icon: Code },
    { type: 'video' as const, label: 'Video', icon: Video },
    { type: 'gallery' as const, label: 'Gallery', icon: Images },
    { type: 'divider' as const, label: 'Divider', icon: Minus }
  ];

  const renderBlockEditor = (block: ContentBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;

    return (
      <motion.div
        key={block.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`group relative ${isSelected ? 'ring-2 ring-primary rounded-lg' : ''}`}
      >
        <Card className={`${isSelected ? 'border-primary' : 'border-transparent hover:border-border'} transition-all`}>
          <CardContent className="p-4">
            {/* Block Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-grab hover:cursor-grabbing h-6 w-6"
                >
                  <GripVertical className="w-3 h-3" />
                </Button>
                <Badge variant="outline" className="text-xs">
                  {block.type}
                </Badge>
                <span className="text-sm text-muted-foreground">Block {index + 1}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setSelectedBlockId(isSelected ? null : block.id)}
                >
                  <Palette className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeBlock(block.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Block Content Editor */}
            <div className="space-y-4">
              {block.type === 'text' && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Enter your text content..."
                    value={block.content.text || ''}
                    onChange={(e) => updateBlock(block.id, {
                      content: { ...block.content, text: e.target.value }
                    })}
                    className="min-h-24"
                  />
                </div>
              )}

              {block.type === 'heading' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Heading text..."
                        value={block.content.text || ''}
                        onChange={(e) => updateBlock(block.id, {
                          content: { ...block.content, text: e.target.value }
                        })}
                      />
                    </div>
                    <Select
                      value={block.content.level?.toString() || '2'}
                      onValueChange={(value) => updateBlock(block.id, {
                        content: { ...block.content, level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 }
                      })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">H1</SelectItem>
                        <SelectItem value="2">H2</SelectItem>
                        <SelectItem value="3">H3</SelectItem>
                        <SelectItem value="4">H4</SelectItem>
                        <SelectItem value="5">H5</SelectItem>
                        <SelectItem value="6">H6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {block.type === 'image' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`image-src-${block.id}`} className="text-xs">Image URL</Label>
                      <Input
                        id={`image-src-${block.id}`}
                        placeholder="https://example.com/image.jpg"
                        value={block.content.src || ''}
                        onChange={(e) => updateBlock(block.id, {
                          content: { ...block.content, src: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`image-alt-${block.id}`} className="text-xs">Alt Text</Label>
                      <Input
                        id={`image-alt-${block.id}`}
                        placeholder="Description of the image"
                        value={block.content.alt || ''}
                        onChange={(e) => updateBlock(block.id, {
                          content: { ...block.content, alt: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`image-caption-${block.id}`} className="text-xs">Caption (optional)</Label>
                    <Input
                      id={`image-caption-${block.id}`}
                      placeholder="Image caption..."
                      value={block.content.caption || ''}
                      onChange={(e) => updateBlock(block.id, {
                        content: { ...block.content, caption: e.target.value }
                      })}
                    />
                  </div>
                  
                  {/* Image preview */}
                  {block.content.src && (
                    <div className="mt-3">
                      <img
                        src={block.content.src}
                        alt={block.content.alt || 'Preview'}
                        className="max-w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {block.type === 'quote' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`quote-text-${block.id}`} className="text-xs">Quote</Label>
                    <Textarea
                      id={`quote-text-${block.id}`}
                      placeholder="Enter the quote..."
                      value={block.content.quote || ''}
                      onChange={(e) => updateBlock(block.id, {
                        content: { ...block.content, quote: e.target.value }
                      })}
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`quote-author-${block.id}`} className="text-xs">Author (optional)</Label>
                    <Input
                      id={`quote-author-${block.id}`}
                      placeholder="Quote author..."
                      value={block.content.author || ''}
                      onChange={(e) => updateBlock(block.id, {
                        content: { ...block.content, author: e.target.value }
                      })}
                    />
                  </div>
                </div>
              )}

              {block.type === 'code' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`code-language-${block.id}`} className="text-xs">Language</Label>
                      <Select
                        value={block.content.language || 'javascript'}
                        onValueChange={(value) => updateBlock(block.id, {
                          content: { ...block.content, language: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="bash">Bash</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`code-content-${block.id}`} className="text-xs">Code</Label>
                    <Textarea
                      id={`code-content-${block.id}`}
                      placeholder="// Your code here..."
                      value={block.content.code || ''}
                      onChange={(e) => updateBlock(block.id, {
                        content: { ...block.content, code: e.target.value }
                      })}
                      className="font-mono text-sm min-h-32"
                    />
                  </div>
                </div>
              )}

              {block.type === 'video' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`video-url-${block.id}`} className="text-xs">Video URL</Label>
                    <Input
                      id={`video-url-${block.id}`}
                      placeholder="https://youtube.com/watch?v=..."
                      value={block.content.videoUrl || ''}
                      onChange={(e) => updateBlock(block.id, {
                        content: { ...block.content, videoUrl: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`video-thumbnail-${block.id}`} className="text-xs">Thumbnail URL</Label>
                    <Input
                      id={`video-thumbnail-${block.id}`}
                      placeholder="https://example.com/thumbnail.jpg"
                      value={block.content.thumbnail || ''}
                      onChange={(e) => updateBlock(block.id, {
                        content: { ...block.content, thumbnail: e.target.value }
                      })}
                    />
                  </div>
                </div>
              )}

              {/* Style Options - Show when block is selected */}
              {isSelected && block.type !== 'divider' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-4 mt-4"
                >
                  <Label className="text-xs font-medium">Style Options</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {/* Alignment */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Alignment</Label>
                      <div className="flex gap-1 mt-1">
                        {[
                          { value: 'left', icon: AlignLeft },
                          { value: 'center', icon: AlignCenter },
                          { value: 'right', icon: AlignRight }
                        ].map(({ value, icon: Icon }) => (
                          <Button
                            key={value}
                            variant={block.style?.alignment === value ? 'default' : 'outline'}
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateBlock(block.id, {
                              style: { ...block.style, alignment: value as any }
                            })}
                          >
                            <Icon className="w-3 h-3" />
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Size for text and image blocks */}
                    {(block.type === 'text' || block.type === 'image') && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          {block.type === 'text' ? 'Font Size' : 'Width'}
                        </Label>
                        <Select
                          value={block.type === 'text' ? block.style?.fontSize || 'medium' : block.style?.width || 'full'}
                          onValueChange={(value) => updateBlock(block.id, {
                            style: { 
                              ...block.style, 
                              ...(block.type === 'text' ? { fontSize: value as any } : { width: value as any })
                            }
                          })}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                            {block.type === 'image' && <SelectItem value="full">Full</SelectItem>}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Add Block After This One */}
            <div className="flex justify-center mt-4 pt-3 border-t border-dashed">
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {blockTypeOptions.slice(0, 4).map(({ type, icon: Icon }) => (
                  <Button
                    key={type}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => addBlock(type, index)}
                    title={`Add ${type} block`}
                  >
                    <Icon className="w-3 h-3" />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Add First Block */}
      {blocks.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No content blocks yet. Add your first block to get started.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {blockTypeOptions.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(type)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Blocks */}
      <AnimatePresence>
        {blocks.map((block, index) => renderBlockEditor(block, index))}
      </AnimatePresence>

      {/* Add Block at End */}
      {blocks.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Add block:</span>
              {blockTypeOptions.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  onClick={() => addBlock(type)}
                  className="flex items-center gap-1 h-7 px-2 text-xs"
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}