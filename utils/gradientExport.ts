import { Gradient } from "../types/gradient";

// Export gradient as CSS file
export const exportAsCSS = (gradient: Gradient): void => {
  const cssContent = `/* ${gradient.name} - ${gradient.description} */
.gradient-${gradient.id} {
  background: ${gradient.css};
}

/* Alternative syntax */
.${gradient.name.toLowerCase().replace(/\s+/g, '-')} {
  background: ${gradient.css};
}

/* Individual color stops */
${gradient.colors.map((color, index) => 
  `/* ${color.name}: ${color.hex} (${color.position}%) */`
).join('\n')}
`;

  downloadFile(cssContent, `${gradient.name.toLowerCase().replace(/\s+/g, '-')}.css`, 'text/css');
};

// Export gradient as SVG
export const exportAsSVG = (gradient: Gradient, width: number = 400, height: number = 300): void => {
  const gradientId = `gradient-${gradient.id}`;
  const direction = extractDirection(gradient.css);
  const { x1, y1, x2, y2 } = getLinearGradientCoordinates(direction);
  
  const stops = gradient.colors
    .sort((a, b) => a.position - b.position)
    .map(color => `<stop offset="${color.position}%" stop-color="${color.hex}" />`)
    .join('\n    ');

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      ${stops}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradientId})" />
  <text x="20" y="${height - 20}" font-family="Arial, sans-serif" font-size="14" fill="white" opacity="0.8">
    ${gradient.name}
  </text>
</svg>`;

  downloadFile(svgContent, `${gradient.name.toLowerCase().replace(/\s+/g, '-')}.svg`, 'image/svg+xml');
};

// Export gradient as PNG
export const exportAsPNG = (gradient: Gradient, width: number = 800, height: number = 600): void => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  canvas.width = width;
  canvas.height = height;
  
  // Create gradient
  const direction = extractDirection(gradient.css);
  const { x1, y1, x2, y2 } = getLinearGradientCoordinates(direction);
  
  const gradientObj = ctx.createLinearGradient(
    (x1 / 100) * width,
    (y1 / 100) * height,
    (x2 / 100) * width,
    (y2 / 100) * height
  );
  
  gradient.colors
    .sort((a, b) => a.position - b.position)
    .forEach(color => {
      gradientObj.addColorStop(color.position / 100, color.hex);
    });
  
  ctx.fillStyle = gradientObj;
  ctx.fillRect(0, 0, width, height);
  
  // Add text overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText(gradient.name, 30, height - 30);
  
  // Download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${gradient.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, 'image/png');
};

// Helper functions
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const extractDirection = (cssGradient: string): string => {
  const match = cssGradient.match(/linear-gradient\(([^,]+),/);
  return match ? match[1].trim() : '135deg';
};

const getLinearGradientCoordinates = (direction: string): { x1: number; y1: number; x2: number; y2: number } => {
  const deg = parseFloat(direction);
  const rad = (deg * Math.PI) / 180;
  
  return {
    x1: 50 - 50 * Math.cos(rad),
    y1: 50 - 50 * Math.sin(rad),
    x2: 50 + 50 * Math.cos(rad),
    y2: 50 + 50 * Math.sin(rad)
  };
};

// URL sharing utilities
export const generateGradientURL = (gradient: Gradient): string => {
  const params = new URLSearchParams({
    id: gradient.id,
    name: gradient.name,
    colors: JSON.stringify(gradient.colors),
    css: gradient.css
  });
  
  return `${window.location.origin}${window.location.pathname}?gradient=${encodeURIComponent(params.toString())}`;
};

export const parseGradientFromURL = (): Gradient | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const gradientData = urlParams.get('gradient');
  
  if (!gradientData) return null;
  
  try {
    const params = new URLSearchParams(decodeURIComponent(gradientData));
    return {
      id: params.get('id') || '',
      name: params.get('name') || 'Shared Gradient',
      description: 'Shared via URL',
      category: 'Shared',
      tags: ['shared'],
      colors: JSON.parse(params.get('colors') || '[]'),
      css: params.get('css') || '',
      isCustom: true
    };
  } catch {
    return null;
  }
};