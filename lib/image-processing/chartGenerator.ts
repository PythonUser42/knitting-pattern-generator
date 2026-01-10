// Convert images to knitting charts
import { StitchChart, YarnColor } from '../types';
import { mapColorsToYarn } from '../knitting/yarnColors';

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function quantizeColors(
  imageData: ImageData,
  maxColors: number = 6
): { pixels: Uint8ClampedArray; palette: string[] } {
  const { data, width, height } = imageData;

  // Simple median cut algorithm for color quantization
  // For MVP, we'll use a simplified k-means approach

  // Collect all unique colors
  const colorCounts = new Map<string, number>();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 128) { // Only count non-transparent pixels
      const hex = rgbToHex(r, g, b);
      colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
    }
  }

  // Get most common colors
  const sortedColors = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map(([color]) => color);

  // If we have fewer colors than max, use them all
  const palette = sortedColors.length <= maxColors ? sortedColors : sortedColors.slice(0, maxColors);

  // Create new quantized image data
  const quantized = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 128) {
      const originalHex = rgbToHex(r, g, b);
      const closestColor = findClosestColor(originalHex, palette);
      const rgb = hexToRgb(closestColor);

      quantized[i] = rgb.r;
      quantized[i + 1] = rgb.g;
      quantized[i + 2] = rgb.b;
      quantized[i + 3] = 255;
    } else {
      // Transparent pixel
      quantized[i] = 255;
      quantized[i + 1] = 255;
      quantized[i + 2] = 255;
      quantized[i + 3] = 0;
    }
  }

  return { pixels: quantized, palette };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function findClosestColor(targetHex: string, palette: string[]): string {
  const target = hexToRgb(targetHex);
  let closestColor = palette[0];
  let minDistance = Infinity;

  for (const hex of palette) {
    const color = hexToRgb(hex);
    const distance = Math.sqrt(
      Math.pow(target.r - color.r, 2) +
      Math.pow(target.g - color.g, 2) +
      Math.pow(target.b - color.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = hex;
    }
  }

  return closestColor;
}

export function resizeImageData(
  imageData: ImageData,
  targetWidth: number,
  maxHeight?: number
): ImageData {
  const { width, height, data } = imageData;
  const aspectRatio = height / width;
  let targetHeight = Math.round(targetWidth * aspectRatio);

  // If maxHeight is specified and calculated height exceeds it, constrain by height instead
  if (maxHeight && targetHeight > maxHeight) {
    targetHeight = maxHeight;
    targetWidth = Math.round(targetHeight / aspectRatio);
  }

  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Create temporary canvas with original image
  const tempCanvas = new OffscreenCanvas(width, height);
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Could not get temp canvas context');

  tempCtx.putImageData(imageData, 0, 0);

  // Use nearest neighbor for pixel art style
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);

  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

export function generateStitchChart(
  imageData: ImageData,
  maxColors: number = 6
): StitchChart {
  const { width, height } = imageData;

  // Quantize colors
  const { pixels, palette } = quantizeColors(imageData, maxColors);

  // Map to yarn colors
  const yarnColors = mapColorsToYarn(palette);

  // Create grid
  const grid: string[][] = [];

  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a > 128) {
        const hex = rgbToHex(r, g, b);
        const colorIndex = palette.indexOf(hex);
        row.push(yarnColors[colorIndex]?.id || yarnColors[0].id);
      } else {
        // Transparent = background color (first color)
        row.push(yarnColors[0].id);
      }
    }
    grid.push(row);
  }

  return {
    width,
    height,
    grid,
    colorMap: yarnColors,
  };
}

export async function imageFileToChart(
  file: File,
  targetWidth: number = 60,
  maxColors: number = 6,
  maxHeight?: number
): Promise<StitchChart> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Create canvas and get image data
          const canvas = new OffscreenCanvas(img.width, img.height);
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);

          // Resize to target width (and constrain height if specified)
          const resized = resizeImageData(imageData, targetWidth, maxHeight);

          // Generate chart
          const chart = generateStitchChart(resized, maxColors);

          resolve(chart);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function imageDataUrlToChart(
  dataUrl: string,
  targetWidth: number = 60,
  maxColors: number = 6,
  maxHeight?: number
): Promise<StitchChart> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        // Create canvas and get image data
        const canvas = new OffscreenCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        // Resize to target width (and constrain height if specified)
        const resized = resizeImageData(imageData, targetWidth, maxHeight);

        // Generate chart
        const chart = generateStitchChart(resized, maxColors);

        resolve(chart);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image from data URL'));
    img.src = dataUrl;
  });
}
