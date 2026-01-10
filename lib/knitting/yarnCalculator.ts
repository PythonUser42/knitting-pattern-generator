// Calculate yarn requirements for patterns
import { YarnRequirements, Gauge, StitchChart, YarnColor } from '../types';

const YARDS_PER_SQUARE_INCH = {
  fingering: 2.5,
  sport: 2.0,
  dk: 1.8,
  worsted: 1.5,
  aran: 1.3,
  bulky: 1.0,
};

const SKEIN_YARDAGE = 220; // Standard skein size

export function calculateYarnRequirements(
  stitchCount: number,
  rowCount: number,
  gauge: Gauge,
  chart?: StitchChart,
  garmentType?: 'beanie' | 'scarf' | 'sweater' // Used to adjust safety margins
): YarnRequirements {
  // Calculate total area in square inches
  const widthInches = stitchCount / gauge.stitchesPerInch;
  const heightInches = rowCount / gauge.rowsPerInch;
  const totalArea = widthInches * heightInches;

  // Get yards per square inch for this yarn weight
  const yardsPerSqIn = YARDS_PER_SQUARE_INCH[gauge.yarnWeight] || 1.5;

  // Safety margins vary by garment type - sweaters need more buffer
  // due to seaming, potential gauge variations, and higher cost of running short
  const solidMargin = garmentType === 'sweater' ? 1.20 : 1.10; // 20% for sweaters, 10% otherwise
  const colorworkMargin = garmentType === 'sweater' ? 1.25 : 1.15; // 25% for sweaters, 15% otherwise

  if (!chart) {
    // Single color - simple calculation
    const baseYardage = totalArea * yardsPerSqIn * solidMargin;
    return {
      totalYards: Math.ceil(baseYardage),
      colorBreakdown: [],
    };
  }

  // With chart: separate solid sections from colorwork sections
  const chartHeightInches = chart.height / gauge.rowsPerInch;
  const chartWidthInches = chart.width / gauge.stitchesPerInch;
  const chartArea = chartWidthInches * chartHeightInches;

  // Solid color area = total area - chart area
  const solidArea = totalArea - chartArea;

  // Calculate yardage for solid sections
  const solidYardage = solidArea * yardsPerSqIn * solidMargin;

  // Calculate yardage for chart section (extra margin for colorwork)
  const chartYardage = chartArea * yardsPerSqIn * colorworkMargin;

  // Count stitches per color in chart
  const colorCounts = new Map<string, number>();
  let totalChartStitches = 0;

  for (const row of chart.grid) {
    for (const colorId of row) {
      colorCounts.set(colorId, (colorCounts.get(colorId) || 0) + 1);
      totalChartStitches++;
    }
  }

  // Deduplicate by hex color and calculate yardage
  const yarnColorMap = new Map<string, { color: YarnColor; stitchCount: number }>();

  chart.colorMap.forEach(color => {
    const stitchCount = colorCounts.get(color.id) || 0;
    const existing = yarnColorMap.get(color.hex);

    if (existing) {
      existing.stitchCount += stitchCount;
    } else {
      yarnColorMap.set(color.hex, { color, stitchCount });
    }
  });

  // Find the main color (most common in chart)
  let mainColorHex = '';
  let maxStitches = 0;
  yarnColorMap.forEach(({ color, stitchCount }, hex) => {
    if (stitchCount > maxStitches) {
      maxStitches = stitchCount;
      mainColorHex = hex;
    }
  });

  // Build color breakdown
  const colorBreakdown = Array.from(yarnColorMap.values()).map(({ color, stitchCount }) => {
    const percentage = totalChartStitches > 0 ? stitchCount / totalChartStitches : 0;
    let yards = Math.ceil(chartYardage * percentage);

    // Add solid yardage to main color
    if (color.hex === mainColorHex) {
      yards += Math.ceil(solidYardage);
    }

    const skeins = Math.ceil(yards / SKEIN_YARDAGE);

    return {
      color,
      yards,
      skeins,
    };
  }).filter(item => item.yards > 0);

  // Total is sum of all colors
  const totalYards = colorBreakdown.reduce((sum, item) => sum + item.yards, 0);

  return {
    totalYards,
    colorBreakdown,
  };
}

export function calculateSweaterYarnage(
  gauge: Gauge,
  chestCircumference: number,
  bodyLength: number,
  sleeveLength: number,
  sleeveCircumference: number
): number {
  // Body (front + back)
  const bodyArea = chestCircumference * bodyLength;

  // Sleeves (2)
  const sleeveArea = sleeveCircumference * sleeveLength * 2;

  const totalArea = bodyArea + sleeveArea;
  const yardsPerSqIn = YARDS_PER_SQUARE_INCH[gauge.yarnWeight] || 1.5;

  return Math.ceil(totalArea * yardsPerSqIn * 1.15); // 15% margin for sweaters
}
