// Image validation for knitting suitability
import { ImageValidation } from '../types';

export async function validateImageForKnitting(
  imageData: ImageData,
  targetWidth: number = 80
): Promise<ImageValidation> {
  const { width, height, data } = imageData;
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check dimensions
  if (width < 20 || height < 20) {
    warnings.push('Image is too small. Minimum recommended size is 20x20 pixels.');
    score -= 30;
  }

  if (width > 200 || height > 200) {
    suggestions.push('Image will be downscaled to fit knitting resolution.');
  }

  // Analyze complexity (count unique colors)
  const colors = new Set<string>();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a > 128) { // Only count non-transparent pixels
      colors.add(`${r},${g},${b}`);
    }
  }

  const uniqueColors = colors.size;
  if (uniqueColors > 50) {
    warnings.push('Image has many colors. It will be simplified, which may lose detail.');
    suggestions.push('Consider using an image with 2-6 distinct colors for best results.');
    score -= 15;
  }

  // Check contrast (simplified check)
  const avgBrightness = calculateAverageBrightness(data);
  if (avgBrightness < 30 || avgBrightness > 225) {
    warnings.push('Image has low contrast. The pattern may be hard to see.');
    suggestions.push('Try adjusting contrast or using a different image.');
    score -= 10;
  }

  // Check aspect ratio
  const aspectRatio = width / height;
  if (aspectRatio > 3 || aspectRatio < 0.33) {
    warnings.push('Extreme aspect ratio may not fit well on most garments.');
    score -= 10;
  }

  // Check detail level based on target size
  const scaleFactor = targetWidth / width;
  if (scaleFactor < 0.5 && uniqueColors > 20) {
    warnings.push('Image will lose significant detail when scaled down for knitting.');
    suggestions.push('Simpler images with bold shapes work best.');
    score -= 15;
  }

  return {
    isValid: score >= 40,
    score: Math.max(0, score),
    warnings,
    suggestions,
  };
}

function calculateAverageBrightness(data: Uint8ClampedArray): number {
  let totalBrightness = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a > 128) { // Only count non-transparent pixels
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      count++;
    }
  }

  return count > 0 ? totalBrightness / count : 128;
}

export function analyzeImageComplexity(imageData: ImageData): {
  hasTransparency: boolean;
  colorCount: number;
  averageBrightness: number;
} {
  const { data } = imageData;
  const colors = new Set<string>();
  let hasTransparency = false;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 255) {
      hasTransparency = true;
    }

    if (a > 128) {
      colors.add(`${r},${g},${b}`);
    }
  }

  return {
    hasTransparency,
    colorCount: colors.size,
    averageBrightness: calculateAverageBrightness(data),
  };
}
