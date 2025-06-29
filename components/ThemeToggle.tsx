import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun 
        className={`h-5 w-5 rotate-0 scale-100 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-90 scale-0' : ''
        }`}
      />
      <Moon 
        className={`absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100' : ''
        }`}
      />
    </Button>
  );
}