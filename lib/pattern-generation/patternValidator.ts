// Pattern validation to catch generation errors before export
import { Pattern } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePattern(pattern: Pattern): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate yarn requirements
  if (pattern.materials.yardage.totalYards <= 0) {
    errors.push('Total yardage must be greater than 0');
  }

  if (pattern.materials.yardage.colorBreakdown.length === 0) {
    errors.push('No yarn colors specified');
  }

  // Check for duplicate yarn colors (same hex value) - warning only, not blocking
  const hexValues = pattern.materials.yardage.colorBreakdown.map(item => item.color.hex);
  const uniqueHexValues = new Set(hexValues);
  if (hexValues.length !== uniqueHexValues.size) {
    warnings.push('Some similar colors may have been mapped to the same yarn color');
  }

  // Validate chart fits in garment
  if (pattern.garmentType === 'beanie') {
    const measurements = pattern.measurements.beanie;
    if (measurements) {
      const circumferenceInches = measurements.circumference * 0.9; // With negative ease
      const chartWidthInches = pattern.chart.width / pattern.gauge.stitchesPerInch;

      if (chartWidthInches > circumferenceInches) {
        errors.push(`Chart is too wide (${chartWidthInches.toFixed(1)}" vs ${circumferenceInches.toFixed(1)}" circumference)`);
      }

      const bodyHeight = measurements.height - measurements.brimDepth - 2; // 2" for crown
      const chartHeightInches = pattern.chart.height / pattern.gauge.rowsPerInch;

      if (chartHeightInches > bodyHeight) {
        errors.push(`Chart is too tall (${chartHeightInches.toFixed(1)}" vs ${bodyHeight.toFixed(1)}" body height)`);
      }
    }
  }

  // Validate instructions don't contain invalid patterns
  for (const section of pattern.instructions.sections) {
    for (const step of section.steps) {
      // Check for negative numbers in instructions
      if (/Work -\d+/.test(step)) {
        errors.push(`Invalid instruction with negative count: "${step}"`);
      }

      // Check for division issues in crown shaping
      if (section.title.toLowerCase().includes('crown') && step.includes('K2tog')) {
        const match = step.match(/repeat from \* (\d+)/);
        if (match) {
          const repeatCount = parseInt(match[1]);
          if (repeatCount !== 7 && repeatCount !== 8) {
            warnings.push(`Crown shaping uses ${repeatCount} repeats instead of standard 8-point crown`);
          }
        }
      }
    }
  }

  // Validate gauge is reasonable
  if (pattern.gauge.stitchesPerInch < 2 || pattern.gauge.stitchesPerInch > 10) {
    warnings.push(`Unusual gauge: ${pattern.gauge.stitchesPerInch} sts/in (typical range: 2-10)`);
  }

  // Validate total yardage is reasonable for garment type
  const yardage = pattern.materials.yardage.totalYards;
  if (pattern.garmentType === 'beanie' && (yardage < 150 || yardage > 500)) {
    warnings.push(`Unusual yardage for beanie: ${yardage} yards (typical: 150-500)`);
  } else if (pattern.garmentType === 'scarf' && (yardage < 200 || yardage > 800)) {
    warnings.push(`Unusual yardage for scarf: ${yardage} yards (typical: 200-800)`);
  } else if (pattern.garmentType === 'sweater' && (yardage < 800 || yardage > 3000)) {
    warnings.push(`Unusual yardage for sweater: ${yardage} yards (typical: 800-3000)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
