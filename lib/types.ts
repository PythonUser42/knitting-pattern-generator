// Core type definitions for the knitting pattern generator

export interface StitchChart {
  width: number;
  height: number;
  grid: string[][]; // Color codes for each stitch
  colorMap: YarnColor[];
}

export interface YarnColor {
  id: string;
  name: string;
  hex: string;
  brand?: string;
  colorNumber?: string;
}

export interface Gauge {
  stitchesPerInch: number;
  rowsPerInch: number;
  yarnWeight: YarnWeight;
}

export type YarnWeight = 'fingering' | 'sport' | 'dk' | 'worsted' | 'aran' | 'bulky';

export type GarmentType = 'beanie' | 'scarf' | 'sweater';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface GarmentMeasurements {
  beanie: {
    circumference: number; // inches
    height: number;
    brimDepth: number;
  };
  scarf: {
    width: number;
    length: number;
  };
  sweater: {
    chest: number;
    length: number;
    armholeDepth: number;
    sleeveLength: number;
    cuffWidth: number;
    upperArmWidth: number;
  };
}

export interface YarnRequirements {
  totalYards: number;
  colorBreakdown: {
    color: YarnColor;
    yards: number;
    skeins: number; // Assuming 220 yards per skein
  }[];
}

export interface Pattern {
  id: string;
  garmentType: GarmentType;
  size: Size | string;
  gauge: Gauge;
  materials: {
    yarn: YarnColor[];
    yardage: YarnRequirements;
    needles: string;
    notions: string[];
  };
  measurements: Partial<GarmentMeasurements>;
  instructions: PatternInstructions;
  chart: StitchChart;
  createdAt: Date;
}

export interface PatternInstructions {
  abbreviations: { [key: string]: string };
  sections: PatternSection[];
}

export interface PatternSection {
  title: string;
  steps: string[];
}

export interface ImageValidation {
  isValid: boolean;
  score: number; // 0-100
  warnings: string[];
  suggestions: string[];
}

// Project save/load types
export interface SavedProject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Image stored as base64 data URL
  imageDataUrl: string | null;
  chart: StitchChart | null;
  selectedGarment: GarmentType;
  selectedSize: Size | string;
  selectedGauge: Gauge;
  customGauge: CustomGauge | null;
  customMeasurements: CustomMeasurements | null;
  pattern: Pattern | null;
}

// Custom gauge from swatch measurements
export interface CustomGauge {
  swatchStitches: number;
  swatchRows: number;
  swatchWidthInches: number;
  swatchHeightInches: number;
  // Calculated values
  stitchesPerInch: number;
  rowsPerInch: number;
}

// Custom sizing measurements (inches)
export interface CustomMeasurements {
  beanie?: {
    circumference: number;
    height: number;
    brimDepth: number;
  };
  scarf?: {
    width: number;
    length: number;
  };
  sweater?: {
    chest: number;
    length: number;
    armholeDepth: number;
    sleeveLength: number;
    cuffWidth: number;
    upperArmWidth: number;
  };
}
