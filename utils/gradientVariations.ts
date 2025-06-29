import { Gradient } from "../types/gradient";

interface HSL {
  h: number;
  s: number;
  l: number;
}

// Convert hex to HSL
const hexToHsl = (hex: string): HSL => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number): string => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Apply variation to a color
const applyColorVariation = (hex: string, type: 'lighter' | 'darker' | 'saturated' | 'desaturated'): string => {
  const hsl = hexToHsl(hex);
  
  switch (type) {
    case 'lighter':
      return hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20));
    case 'darker':
      return hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20));
    case 'saturated':
      return hslToHex(hsl.h, Math.min(100, hsl.s + 30), hsl.l);
    case 'desaturated':
      return hslToHex(hsl.h, Math.max(0, hsl.s - 30), hsl.l);
    default:
      return hex;
  }
};

// Generate gradient variations
export const generateGradientVariations = (gradient: Gradient): Gradient[] => {
  const variations = [
    {
      type: 'lighter' as const,
      name: 'Light',
      description: 'Lighter version with increased brightness'
    },
    {
      type: 'darker' as const,
      name: 'Dark',
      description: 'Darker version with reduced brightness'
    },
    {
      type: 'saturated' as const,
      name: 'Vibrant',
      description: 'More saturated and vibrant colors'
    },
    {
      type: 'desaturated' as const,
      name: 'Muted',
      description: 'Desaturated and muted colors'
    }
  ];

  return variations.map(variation => {
    const newColors = gradient.colors.map(color => ({
      ...color,
      hex: applyColorVariation(color.hex, variation.type),
      name: `${variation.name} ${color.name}`
    }));

    const newCSS = gradient.css.replace(
      /#[0-9A-Fa-f]{6}/g,
      (match) => {
        const colorIndex = gradient.colors.findIndex(c => c.hex.toLowerCase() === match.toLowerCase());
        return colorIndex !== -1 ? newColors[colorIndex].hex : match;
      }
    );

    return {
      id: `${gradient.id}-${variation.type}`,
      name: `${gradient.name} (${variation.name})`,
      description: variation.description,
      category: gradient.category,
      tags: [...gradient.tags, variation.type],
      colors: newColors,
      css: newCSS,
      isCustom: true
    };
  });
};

// Generate complementary color variations
export const generateComplementaryVariations = (gradient: Gradient): Gradient[] => {
  const getComplementaryColor = (hex: string): string => {
    const hsl = hexToHsl(hex);
    const complementaryHue = (hsl.h + 180) % 360;
    return hslToHex(complementaryHue, hsl.s, hsl.l);
  };

  const getAnalogousColors = (hex: string): string[] => {
    const hsl = hexToHsl(hex);
    return [
      hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
    ];
  };

  const variations = [];

  // Complementary variation
  if (gradient.colors.length >= 2) {
    const complementaryColors = gradient.colors.map(color => ({
      ...color,
      hex: getComplementaryColor(color.hex),
      name: `Complementary ${color.name}`
    }));

    const complementaryCSS = gradient.css.replace(
      /#[0-9A-Fa-f]{6}/g,
      (match) => {
        const colorIndex = gradient.colors.findIndex(c => c.hex.toLowerCase() === match.toLowerCase());
        return colorIndex !== -1 ? complementaryColors[colorIndex].hex : match;
      }
    );

    variations.push({
      id: `${gradient.id}-complementary`,
      name: `${gradient.name} (Complementary)`,
      description: 'Complementary color scheme variation',
      category: gradient.category,
      tags: [...gradient.tags, 'complementary'],
      colors: complementaryColors,
      css: complementaryCSS,
      isCustom: true
    });
  }

  // Analogous variation
  if (gradient.colors.length >= 1) {
    const baseColor = gradient.colors[0];
    const analogousHexes = getAnalogousColors(baseColor.hex);
    
    const analogousColors = [
      { ...baseColor, hex: analogousHexes[0], name: `Analogous ${baseColor.name} 1` },
      { ...baseColor, hex: analogousHexes[1], name: `Analogous ${baseColor.name} 2` }
    ];

    const analogousCSS = `linear-gradient(135deg, ${analogousColors[0].hex} 0%, ${analogousColors[1].hex} 100%)`;

    variations.push({
      id: `${gradient.id}-analogous`,
      name: `${gradient.name} (Analogous)`,
      description: 'Analogous color scheme variation',
      category: gradient.category,
      tags: [...gradient.tags, 'analogous'],
      colors: analogousColors,
      css: analogousCSS,
      isCustom: true
    });
  }

  return variations;
};