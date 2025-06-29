import { useState, useEffect } from 'react';
import { Search, Command } from 'lucide-react';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearchClick: () => void;
  className?: string;
}

export function SearchBar({ onSearchClick, className = "" }: SearchBarProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <Button
      variant="outline"
      onClick={onSearchClick}
      className={`relative flex items-center gap-3 w-full max-w-sm h-10 px-3 text-left bg-background hover:bg-muted/50 transition-colors ${className}`}
    >
      <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <span className="text-muted-foreground flex-1 text-sm">
        Search...
      </span>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs border">
          {isMac ? '⌘' : 'Ctrl'}
        </kbd>
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs border">K</kbd>
      </div>
    </Button>
  );
}

// Compact version for mobile
export function CompactSearchBar({ onSearchClick, className = "" }: SearchBarProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onSearchClick}
      className={`w-10 h-10 ${className}`}
    >
      <Search className="w-4 h-4" />
    </Button>
  );
}