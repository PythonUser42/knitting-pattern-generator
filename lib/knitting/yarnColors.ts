// Curated yarn color palette for MVP
import { YarnColor } from '../types';

export const YARN_COLORS: YarnColor[] = [
  // Neutrals
  { id: 'white', name: 'White', hex: '#FFFFFF', brand: 'Universal', colorNumber: '101' },
  { id: 'cream', name: 'Cream', hex: '#FFFDD0', brand: 'Universal', colorNumber: '102' },
  { id: 'light-gray', name: 'Light Gray', hex: '#D3D3D3', brand: 'Universal', colorNumber: '103' },
  { id: 'gray', name: 'Gray', hex: '#808080', brand: 'Universal', colorNumber: '104' },
  { id: 'charcoal', name: 'Charcoal', hex: '#36454F', brand: 'Universal', colorNumber: '105' },
  { id: 'black', name: 'Black', hex: '#000000', brand: 'Universal', colorNumber: '106' },

  // Reds & Pinks
  { id: 'red', name: 'Red', hex: '#DC143C', brand: 'Universal', colorNumber: '201' },
  { id: 'burgundy', name: 'Burgundy', hex: '#800020', brand: 'Universal', colorNumber: '202' },
  { id: 'pink', name: 'Pink', hex: '#FFC0CB', brand: 'Universal', colorNumber: '203' },
  { id: 'rose', name: 'Rose', hex: '#FF007F', brand: 'Universal', colorNumber: '204' },

  // Blues
  { id: 'navy', name: 'Navy', hex: '#000080', brand: 'Universal', colorNumber: '301' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#4169E1', brand: 'Universal', colorNumber: '302' },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#87CEEB', brand: 'Universal', colorNumber: '303' },
  { id: 'teal', name: 'Teal', hex: '#008080', brand: 'Universal', colorNumber: '304' },

  // Greens
  { id: 'forest-green', name: 'Forest Green', hex: '#228B22', brand: 'Universal', colorNumber: '401' },
  { id: 'sage', name: 'Sage', hex: '#9DC183', brand: 'Universal', colorNumber: '402' },
  { id: 'mint', name: 'Mint', hex: '#98FF98', brand: 'Universal', colorNumber: '403' },

  // Yellows & Oranges
  { id: 'yellow', name: 'Yellow', hex: '#FFD700', brand: 'Universal', colorNumber: '501' },
  { id: 'mustard', name: 'Mustard', hex: '#FFDB58', brand: 'Universal', colorNumber: '502' },
  { id: 'orange', name: 'Orange', hex: '#FF8C00', brand: 'Universal', colorNumber: '503' },

  // Purples & Browns
  { id: 'purple', name: 'Purple', hex: '#800080', brand: 'Universal', colorNumber: '601' },
  { id: 'lavender', name: 'Lavender', hex: '#E6E6FA', brand: 'Universal', colorNumber: '602' },
  { id: 'brown', name: 'Brown', hex: '#8B4513', brand: 'Universal', colorNumber: '701' },
  { id: 'tan', name: 'Tan', hex: '#D2B48C', brand: 'Universal', colorNumber: '702' },
];

// Calculate color distance in LAB color space for accurate matching
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Convert to XYZ
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  // Convert XYZ to LAB
  const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

  return {
    l: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
}

export function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);

  // Delta E (CIE76) - simpler but good enough for MVP
  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

export function findClosestYarnColor(hex: string): YarnColor {
  let closestColor = YARN_COLORS[0];
  let minDistance = Infinity;

  for (const yarnColor of YARN_COLORS) {
    const distance = colorDistance(hex, yarnColor.hex);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = yarnColor;
    }
  }

  return closestColor;
}

export function mapColorsToYarn(hexColors: string[]): YarnColor[] {
  return hexColors.map(hex => findClosestYarnColor(hex));
}
