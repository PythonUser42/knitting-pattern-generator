// Standard garment measurements and gauge information
import { Gauge, Size, YarnWeight } from '../types';

export const STANDARD_GAUGES: Record<YarnWeight, Gauge> = {
  fingering: { stitchesPerInch: 7, rowsPerInch: 9, yarnWeight: 'fingering' },
  sport: { stitchesPerInch: 6, rowsPerInch: 8, yarnWeight: 'sport' },
  dk: { stitchesPerInch: 5.5, rowsPerInch: 7.5, yarnWeight: 'dk' },
  worsted: { stitchesPerInch: 4.5, rowsPerInch: 6, yarnWeight: 'worsted' },
  aran: { stitchesPerInch: 4, rowsPerInch: 5.5, yarnWeight: 'aran' },
  bulky: { stitchesPerInch: 3.5, rowsPerInch: 5, yarnWeight: 'bulky' },
};

export const BEANIE_MEASUREMENTS = {
  S: { circumference: 19, height: 8, brimDepth: 2 },
  M: { circumference: 21, height: 9, brimDepth: 2.5 },
  L: { circumference: 23, height: 10, brimDepth: 2.5 },
};

export const SCARF_MEASUREMENTS = {
  standard: { width: 7, length: 65 },
  wide: { width: 10, length: 60 },
  narrow: { width: 5, length: 70 },
};

export const SWEATER_MEASUREMENTS = {
  XS: {
    chest: 32,
    length: 22,
    armholeDepth: 7,
    sleeveLength: 17,
    cuffWidth: 7,
    upperArmWidth: 11,
  },
  S: {
    chest: 36,
    length: 23,
    armholeDepth: 7.5,
    sleeveLength: 17.5,
    cuffWidth: 7.5,
    upperArmWidth: 12,
  },
  M: {
    chest: 40,
    length: 24,
    armholeDepth: 8,
    sleeveLength: 18,
    cuffWidth: 8,
    upperArmWidth: 13,
  },
  L: {
    chest: 44,
    length: 25,
    armholeDepth: 8.5,
    sleeveLength: 18.5,
    cuffWidth: 8.5,
    upperArmWidth: 14,
  },
  XL: {
    chest: 48,
    length: 26,
    armholeDepth: 9,
    sleeveLength: 19,
    cuffWidth: 9,
    upperArmWidth: 15,
  },
};

export function calculateStitchCount(inches: number, gauge: Gauge): number {
  return Math.round(inches * gauge.stitchesPerInch);
}

export function calculateRowCount(inches: number, gauge: Gauge): number {
  return Math.round(inches * gauge.rowsPerInch);
}

export function adjustForRibbing(stitchCount: number): number {
  // Ensure stitch count is divisible by 4 for K2P2 ribbing
  return Math.round(stitchCount / 4) * 4;
}
