export interface Gradient {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  colors: {
    hex: string;
    name: string;
    position: number;
  }[];
  css: string;
  isCustom?: boolean;
}

export const categories = [
  "All",
  "Sunset",
  "Ocean",
  "Nature",
  "Purple",
  "Cosmic",
  "Minimal",
  "Vibrant",
  "Dark",
  "Pastel",
  "Warm",
  "Cool"
];

export const gradients: Gradient[] = [
  {
    id: "1",
    name: "Sunset Glow",
    description: "A warm gradient reminiscent of golden hour sunsets",
    category: "Sunset",
    tags: ["warm", "orange", "yellow", "golden"],
    colors: [
      { hex: "#FF6B6B", name: "Coral Red", position: 0 },
      { hex: "#FFE66D", name: "Golden Yellow", position: 100 }
    ],
    css: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)"
  },
  {
    id: "2",
    name: "Ocean Breeze",
    description: "Cool blues flowing like ocean waves",
    category: "Ocean",
    tags: ["cool", "blue", "teal", "refreshing"],
    colors: [
      { hex: "#4ECDC4", name: "Turquoise", position: 0 },
      { hex: "#44A08D", name: "Teal", position: 100 }
    ],
    css: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)"
  },
  {
    id: "3",
    name: "Purple Haze",
    description: "Dreamy purples blending into mystical depths",
    category: "Purple",
    tags: ["purple", "mystical", "dreamy", "royal"],
    colors: [
      { hex: "#667eea", name: "Periwinkle", position: 0 },
      { hex: "#764ba2", name: "Royal Purple", position: 100 }
    ],
    css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: "4",
    name: "Forest Whisper",
    description: "Natural greens inspired by woodland tranquility",
    category: "Nature",
    tags: ["green", "nature", "forest", "calm"],
    colors: [
      { hex: "#56ab2f", name: "Forest Green", position: 0 },
      { hex: "#a8e6cf", name: "Mint Green", position: 100 }
    ],
    css: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)"
  },
  {
    id: "5",
    name: "Cosmic Dawn",
    description: "Ethereal pinks and oranges from distant galaxies",
    category: "Cosmic",
    tags: ["pink", "cosmic", "ethereal", "space"],
    colors: [
      { hex: "#ff9a9e", name: "Rose Pink", position: 0 },
      { hex: "#fecfef", name: "Lavender Pink", position: 100 }
    ],
    css: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  },
  {
    id: "6",
    name: "Arctic Flow",
    description: "Crisp blues and whites like arctic ice formations",
    category: "Cool",
    tags: ["blue", "white", "arctic", "crisp"],
    colors: [
      { hex: "#a8edea", name: "Ice Blue", position: 0 },
      { hex: "#fed6e3", name: "Soft Pink", position: 100 }
    ],
    css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  {
    id: "7",
    name: "Amber Sunset",
    description: "Rich ambers and golds of a desert evening",
    category: "Sunset",
    tags: ["amber", "gold", "desert", "warm"],
    colors: [
      { hex: "#ffecd2", name: "Cream", position: 0 },
      { hex: "#fcb69f", name: "Peach", position: 100 }
    ],
    css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
  },
  {
    id: "8",
    name: "Midnight Storm",
    description: "Deep blues and grays of a stormy night sky",
    category: "Dark",
    tags: ["dark", "blue", "gray", "storm"],
    colors: [
      { hex: "#232526", name: "Charcoal", position: 0 },
      { hex: "#414345", name: "Steel Gray", position: 100 }
    ],
    css: "linear-gradient(135deg, #232526 0%, #414345 100%)"
  },
  {
    id: "9",
    name: "Cherry Blossom",
    description: "Soft pinks inspired by Japanese sakura",
    category: "Pastel",
    tags: ["pink", "soft", "sakura", "delicate"],
    colors: [
      { hex: "#fbc2eb", name: "Cherry Pink", position: 0 },
      { hex: "#a6c1ee", name: "Sky Blue", position: 100 }
    ],
    css: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
  },
  {
    id: "10",
    name: "Tropical Paradise",
    description: "Vibrant greens and blues of tropical waters",
    category: "Vibrant",
    tags: ["tropical", "vibrant", "green", "blue"],
    colors: [
      { hex: "#00d2ff", name: "Cyan", position: 0 },
      { hex: "#3a7bd5", name: "Ocean Blue", position: 100 }
    ],
    css: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)"
  },
  {
    id: "11",
    name: "Fire Burst",
    description: "Intense reds and oranges like dancing flames",
    category: "Vibrant",
    tags: ["red", "orange", "fire", "intense"],
    colors: [
      { hex: "#f953c6", name: "Magenta", position: 0 },
      { hex: "#b91d73", name: "Deep Pink", position: 100 }
    ],
    css: "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)"
  },
  {
    id: "12",
    name: "Misty Mountain",
    description: "Cool grays and blues of mountain fog",
    category: "Minimal",
    tags: ["gray", "blue", "minimal", "fog"],
    colors: [
      { hex: "#bdc3c7", name: "Silver", position: 0 },
      { hex: "#2c3e50", name: "Dark Blue Gray", position: 100 }
    ],
    css: "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)"
  },
  {
    id: "13",
    name: "Golden Hour",
    description: "Warm yellows and oranges of perfect lighting",
    category: "Warm",
    tags: ["yellow", "orange", "golden", "warm"],
    colors: [
      { hex: "#f7971e", name: "Sunset Orange", position: 0 },
      { hex: "#ffd200", name: "Golden Yellow", position: 100 }
    ],
    css: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
  },
  {
    id: "14",
    name: "Deep Ocean",
    description: "Dark blues of the ocean depths",
    category: "Ocean",
    tags: ["blue", "dark", "ocean", "deep"],
    colors: [
      { hex: "#2E3192", name: "Navy Blue", position: 0 },
      { hex: "#1BFFFF", name: "Electric Blue", position: 100 }
    ],
    css: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)"
  },
  {
    id: "15",
    name: "Nebula Dreams",
    description: "Cosmic purples and pinks of distant nebulae",
    category: "Cosmic",
    tags: ["purple", "pink", "cosmic", "nebula"],
    colors: [
      { hex: "#8A2387", name: "Cosmic Purple", position: 0 },
      { hex: "#E94057", name: "Nova Pink", position: 50 },
      { hex: "#F27121", name: "Star Orange", position: 100 }
    ],
    css: "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)"
  },
  {
    id: "16",
    name: "Fresh Mint",
    description: "Clean greens with a refreshing feel",
    category: "Cool",
    tags: ["green", "mint", "fresh", "clean"],
    colors: [
      { hex: "#00b09b", name: "Emerald", position: 0 },
      { hex: "#96c93d", name: "Lime Green", position: 100 }
    ],
    css: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)"
  }
];

// Utility functions for favorites
export const getFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  const favorites = localStorage.getItem('gradient-favorites');
  return favorites ? JSON.parse(favorites) : [];
};

export const saveFavorites = (favorites: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gradient-favorites', JSON.stringify(favorites));
};

export const toggleFavorite = (gradientId: string): string[] => {
  const favorites = getFavorites();
  const index = favorites.indexOf(gradientId);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(gradientId);
  }
  
  saveFavorites(favorites);
  return favorites;
};

// Utility functions for custom gradients
export const getCustomGradients = (): Gradient[] => {
  if (typeof window === 'undefined') return [];
  const customGradients = localStorage.getItem('custom-gradients');
  return customGradients ? JSON.parse(customGradients) : [];
};

export const saveCustomGradient = (gradient: Gradient): void => {
  if (typeof window === 'undefined') return;
  const customGradients = getCustomGradients();
  customGradients.push({ ...gradient, isCustom: true });
  localStorage.setItem('custom-gradients', JSON.stringify(customGradients));
};

export const deleteCustomGradient = (gradientId: string): void => {
  if (typeof window === 'undefined') return;
  const customGradients = getCustomGradients();
  const filteredGradients = customGradients.filter(g => g.id !== gradientId);
  localStorage.setItem('custom-gradients', JSON.stringify(filteredGradients));
};