// Convert images to knitting charts
import { StitchChart, YarnColor } from '../types';
import { mapColorsToYarn, rgbToLab, hexToRgb } from '../knitting/yarnColors';

// Type for LAB color
type LABColor = { l: number; a: number; b: number };

// Type for pixel with LAB color
type LABPixel = { lab: LABColor; originalRgb: { r: number; g: number; b: number } };

// Calculate squared Euclidean distance in LAB space
function labDistanceSquared(lab1: LABColor, lab2: LABColor): number {
  const dl = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return dl * dl + da * da + db * db;
}

// K-means++ initialization: pick initial centroids with probability proportional to distance
function initializeCentroidsKMeansPlusPlus(pixels: LABPixel[], k: number): LABColor[] {
  const centroids: LABColor[] = [];

  // Pick first centroid randomly
  const firstIndex = Math.floor(Math.random() * pixels.length);
  centroids.push({ ...pixels[firstIndex].lab });

  // Pick remaining centroids
  for (let i = 1; i < k; i++) {
    // Calculate distance from each pixel to nearest centroid
    const distances: number[] = pixels.map(pixel => {
      let minDist = Infinity;
      for (const centroid of centroids) {
        const dist = labDistanceSquared(pixel.lab, centroid);
        if (dist < minDist) minDist = dist;
      }
      return minDist;
    });

    // Calculate total distance for probability
    const totalDist = distances.reduce((sum, d) => sum + d, 0);

    // Pick next centroid with probability proportional to squared distance
    let random = Math.random() * totalDist;
    let nextIndex = 0;
    for (let j = 0; j < distances.length; j++) {
      random -= distances[j];
      if (random <= 0) {
        nextIndex = j;
        break;
      }
    }

    centroids.push({ ...pixels[nextIndex].lab });
  }

  return centroids;
}

// Run k-means clustering on LAB pixels
function kMeansCluster(pixels: LABPixel[], k: number, maxIterations: number = 20): LABColor[] {
  if (pixels.length === 0) return [];
  if (pixels.length <= k) {
    // Fewer pixels than clusters, just use pixel colors
    return pixels.map(p => ({ ...p.lab }));
  }

  // Initialize centroids with k-means++
  let centroids = initializeCentroidsKMeansPlusPlus(pixels, k);

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign each pixel to nearest centroid
    const assignments: number[] = pixels.map(pixel => {
      let minDist = Infinity;
      let minIndex = 0;
      for (let i = 0; i < centroids.length; i++) {
        const dist = labDistanceSquared(pixel.lab, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          minIndex = i;
        }
      }
      return minIndex;
    });

    // Recompute centroids as mean of assigned pixels
    const newCentroids: LABColor[] = [];
    let converged = true;

    for (let i = 0; i < k; i++) {
      const assigned = pixels.filter((_, idx) => assignments[idx] === i);

      if (assigned.length === 0) {
        // Keep old centroid if no pixels assigned
        newCentroids.push(centroids[i]);
        continue;
      }

      const sumL = assigned.reduce((sum, p) => sum + p.lab.l, 0);
      const sumA = assigned.reduce((sum, p) => sum + p.lab.a, 0);
      const sumB = assigned.reduce((sum, p) => sum + p.lab.b, 0);

      const newCentroid = {
        l: sumL / assigned.length,
        a: sumA / assigned.length,
        b: sumB / assigned.length
      };

      // Check for convergence (centroid moved less than threshold)
      const movement = labDistanceSquared(centroids[i], newCentroid);
      if (movement > 1) converged = false;

      newCentroids.push(newCentroid);
    }

    centroids = newCentroids;
    if (converged) break;
  }

  return centroids;
}

// Check if a color lies "between" two other colors (interpolation from anti-aliasing)
// Returns true if the color is approximately on the line segment between any two other colors
function isInterpolatedColor(
  color: LABColor,
  otherColors: LABColor[],
  tolerance: number = 100 // How close to the line it needs to be
): boolean {
  if (otherColors.length < 2) return false;

  for (let i = 0; i < otherColors.length; i++) {
    for (let j = i + 1; j < otherColors.length; j++) {
      const a = otherColors[i];
      const b = otherColors[j];

      // Check if color is between a and b
      // First, check if it's within the bounding box
      const minL = Math.min(a.l, b.l) - 5;
      const maxL = Math.max(a.l, b.l) + 5;
      const minA = Math.min(a.a, b.a) - 5;
      const maxA = Math.max(a.a, b.a) + 5;
      const minB = Math.min(a.b, b.b) - 5;
      const maxB = Math.max(a.b, b.b) + 5;

      if (color.l < minL || color.l > maxL ||
          color.a < minA || color.a > maxA ||
          color.b < minB || color.b > maxB) {
        continue;
      }

      // Calculate distance from point to line segment
      const abL = b.l - a.l;
      const abA = b.a - a.a;
      const abB = b.b - a.b;
      const abLenSq = abL * abL + abA * abA + abB * abB;

      if (abLenSq === 0) continue; // a and b are the same point

      // Project color onto line ab
      const t = Math.max(0, Math.min(1,
        ((color.l - a.l) * abL + (color.a - a.a) * abA + (color.b - a.b) * abB) / abLenSq
      ));

      // Find closest point on segment
      const closestL = a.l + t * abL;
      const closestA = a.a + t * abA;
      const closestB = a.b + t * abB;

      // Distance from color to closest point
      const distSq = Math.pow(color.l - closestL, 2) +
                     Math.pow(color.a - closestA, 2) +
                     Math.pow(color.b - closestB, 2);

      // Check if it's on the line (not at endpoints) and close enough
      if (distSq < tolerance && t > 0.1 && t < 0.9) {
        return true;
      }
    }
  }

  return false;
}

// Remove anti-aliasing artifact colors
// These are colors that: 1) have few pixels AND 2) lie between two other colors
function removeAntiAliasingColors(
  centroids: LABColor[],
  pixels: LABPixel[],
  minPixelPercent: number = 0.005 // 0.5% threshold for "few pixels"
): LABColor[] {
  if (centroids.length <= 2) return centroids;

  // Count pixels per centroid
  const counts = new Array(centroids.length).fill(0);
  for (const pixel of pixels) {
    let minDist = Infinity;
    let minIdx = 0;
    for (let i = 0; i < centroids.length; i++) {
      const dist = labDistanceSquared(pixel.lab, centroids[i]);
      if (dist < minDist) {
        minDist = dist;
        minIdx = i;
      }
    }
    counts[minIdx]++;
  }

  const totalPixels = pixels.length;
  const keepCentroids: LABColor[] = [];

  // First, identify "major" colors (significant pixel count)
  const majorColors: LABColor[] = [];
  for (let i = 0; i < centroids.length; i++) {
    if (counts[i] / totalPixels >= minPixelPercent) {
      majorColors.push(centroids[i]);
    }
  }

  // Now decide which colors to keep
  for (let i = 0; i < centroids.length; i++) {
    const percent = counts[i] / totalPixels;
    const color = centroids[i];

    // Keep if it has significant pixels
    if (percent >= minPixelPercent) {
      keepCentroids.push(color);
    }
    // Keep if it's a small but distinct color (not an interpolation)
    else if (!isInterpolatedColor(color, majorColors)) {
      keepCentroids.push(color);
    }
    // Otherwise it's likely anti-aliasing - skip it
  }

  return keepCentroids.length > 0 ? keepCentroids : centroids;
}

// Merge similar colors that are likely duplicates
// Delta E threshold of ~20 is "noticeably different"
function mergeSimilarColors(centroids: LABColor[], threshold: number = 400): LABColor[] {
  if (centroids.length <= 1) return centroids;

  const merged: LABColor[] = [];
  const used = new Set<number>();

  for (let i = 0; i < centroids.length; i++) {
    if (used.has(i)) continue;

    // Find all centroids similar to this one
    const cluster = [centroids[i]];
    used.add(i);

    for (let j = i + 1; j < centroids.length; j++) {
      if (used.has(j)) continue;

      const dist = labDistanceSquared(centroids[i], centroids[j]);
      if (dist < threshold) {
        cluster.push(centroids[j]);
        used.add(j);
      }
    }

    // Average all similar colors into one
    if (cluster.length === 1) {
      merged.push(cluster[0]);
    } else {
      const avgL = cluster.reduce((s, c) => s + c.l, 0) / cluster.length;
      const avgA = cluster.reduce((s, c) => s + c.a, 0) / cluster.length;
      const avgB = cluster.reduce((s, c) => s + c.b, 0) / cluster.length;
      merged.push({ l: avgL, a: avgA, b: avgB });
    }
  }

  return merged;
}

// Convert LAB color back to RGB hex
function labToHex(lab: LABColor): string {
  // LAB to XYZ
  let y = (lab.l + 16) / 116;
  let x = lab.a / 500 + y;
  let z = y - lab.b / 200;

  const delta = 6 / 29;
  const deltaCubed = delta * delta * delta;

  x = x > delta ? x * x * x : (x - 16 / 116) * 3 * delta * delta;
  y = y > delta ? y * y * y : (y - 16 / 116) * 3 * delta * delta;
  z = z > delta ? z * z * z : (z - 16 / 116) * 3 * delta * delta;

  // Scale by reference white (D65)
  x *= 0.95047;
  y *= 1.00000;
  z *= 1.08883;

  // XYZ to RGB
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  // Clamp and convert to 0-255
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));

  return rgbToHex(clamp(r), clamp(g), clamp(b));
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Pre-process: snap near-white and near-black pixels to pure values
// This removes subtle color casts from backgrounds and anti-aliasing
function cleanPixelColor(r: number, g: number, b: number): { r: number; g: number; b: number } {
  const brightness = (r + g + b) / 3;
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));

  // If very bright and nearly grayscale, snap to white
  if (brightness > 240 && maxDiff < 20) {
    return { r: 255, g: 255, b: 255 };
  }

  // If very dark and nearly grayscale, snap to black
  if (brightness < 30 && maxDiff < 20) {
    return { r: 0, g: 0, b: 0 };
  }

  // If grayscale (no color), snap to nearest gray
  if (maxDiff < 15) {
    const gray = Math.round(brightness);
    return { r: gray, g: gray, b: gray };
  }

  return { r, g, b };
}

export function quantizeColors(
  imageData: ImageData,
  maxColors: number = 6
): { pixels: Uint8ClampedArray; palette: string[] } {
  const { data, width, height } = imageData;

  // K-means clustering in LAB color space for perceptually accurate color reduction
  // This ensures visually distinct colors (like pink) survive even if they have fewer pixels

  // Collect all non-transparent pixels and convert to LAB
  const labPixels: LABPixel[] = [];

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    const a = data[i + 3];

    if (a > 128) {
      // Clean up near-white/near-black/grayscale pixels first
      const cleaned = cleanPixelColor(r, g, b);
      r = cleaned.r;
      g = cleaned.g;
      b = cleaned.b;

      const lab = rgbToLab(r, g, b);
      labPixels.push({
        lab,
        originalRgb: { r, g, b }
      });
    }
  }

  // Run k-means clustering
  const rawCentroids = kMeansCluster(labPixels, maxColors);

  // Remove anti-aliasing artifact colors (minority colors that are interpolations)
  const cleanedCentroids = removeAntiAliasingColors(rawCentroids, labPixels);

  // Merge any remaining similar colors
  const centroids = mergeSimilarColors(cleanedCentroids);

  // Convert centroids back to hex palette
  const palette = centroids.map(lab => labToHex(lab));

  // Build centroid lookup for fast pixel assignment
  const centroidLabs = centroids;

  // Create new quantized image data
  const quantized = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    const a = data[i + 3];

    if (a > 128) {
      // Clean up pixel before assignment (same as during clustering)
      const cleaned = cleanPixelColor(r, g, b);
      r = cleaned.r;
      g = cleaned.g;
      b = cleaned.b;

      // Find nearest centroid in LAB space
      const pixelLab = rgbToLab(r, g, b);
      let minDist = Infinity;
      let minIndex = 0;

      for (let j = 0; j < centroidLabs.length; j++) {
        const dist = labDistanceSquared(pixelLab, centroidLabs[j]);
        if (dist < minDist) {
          minDist = dist;
          minIndex = j;
        }
      }

      const closestHex = palette[minIndex];
      const rgb = hexToRgb(closestHex);

      quantized[i] = rgb.r;
      quantized[i + 1] = rgb.g;
      quantized[i + 2] = rgb.b;
      quantized[i + 3] = 255;
    } else {
      // Transparent pixel - use white
      quantized[i] = 255;
      quantized[i + 1] = 255;
      quantized[i + 2] = 255;
      quantized[i + 3] = 0;
    }
  }

  return { pixels: quantized, palette };
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
