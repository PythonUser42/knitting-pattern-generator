// Scarf pattern generator
import { Pattern, StitchChart, Gauge, PatternInstructions } from '../types';
import { SCARF_MEASUREMENTS, calculateStitchCount, calculateRowCount } from '../knitting/measurements';
import { calculateYarnRequirements } from '../knitting/yarnCalculator';

export function generateScarfPattern(
  chart: StitchChart,
  size: 'standard' | 'wide' | 'narrow',
  gauge: Gauge,
  customMeasurements?: { width: number; length: number }
): Pattern {
  const measurements = customMeasurements || SCARF_MEASUREMENTS[size];

  // Calculate stitch counts
  const widthStitches = calculateStitchCount(measurements.width, gauge);
  const lengthRows = calculateRowCount(measurements.length, gauge);

  // Add border stitches (4 stitches on each side for garter stitch border)
  const totalWidthStitches = widthStitches + 8;
  const borderRows = 6; // 6 rows of garter stitch at start and end

  // Calculate chart placement
  const chartStartRow = borderRows + Math.floor((lengthRows - borderRows * 2 - chart.height) / 2);
  const chartStartStitch = 4 + Math.floor((widthStitches - chart.width) / 2); // 4 for border

  // Calculate actual scarf length accounting for both borders
  const borderInches = (borderRows / gauge.rowsPerInch) * 2; // Both ends
  const actualScarfLength = measurements.length;

  const instructions: PatternInstructions = {
    abbreviations: {
      'K': 'knit',
      'P': 'purl',
      'CO': 'cast on',
      'BO': 'bind off',
      'RS': 'right side',
      'WS': 'wrong side',
    },
    sections: [
      {
        title: 'Before You Begin',
        steps: [
          `GAUGE CHECK: This pattern is written for ${gauge.stitchesPerInch} stitches and ${gauge.rowsPerInch} rows per inch in stockinette stitch.`,
          `Knit a 4" x 4" swatch, wash and block it, then measure. Adjust needle size if needed.`,
          `FINISHED DIMENSIONS: ${measurements.width}" wide × ${actualScarfLength}" long (after blocking).`,
          `COLORWORK TECHNIQUE: This pattern uses stranded colorwork (Fair Isle) by default.`,
          `ALTERNATIVE: For beginners, you may knit the scarf in the main color only, then add the chart design using DUPLICATE STITCH after blocking. This produces identical results with no float management.`,
        ],
      },
      {
        title: 'Border',
        steps: [
          `CO ${totalWidthStitches} sts using long-tail cast on.`,
          `Rows 1-${borderRows}: Knit all stitches (garter stitch border).`,
        ],
      },
      {
        title: 'Body',
        steps: [
          `Begin main pattern:`,
          `Row ${borderRows + 1} (RS): K4 (border), knit to last 4 sts, K4 (border).`,
          `Row ${borderRows + 2} (WS): K4 (border), purl to last 4 sts, K4 (border).`,
          `Repeat these 2 rows for ${chartStartRow - borderRows} rows.`,
          `Begin chart at row ${chartStartRow + 1}:`,
          `Chart is centered, starting at stitch ${chartStartStitch} (after the 4-stitch border).`,
          `Chart is ${chart.width} stitches wide and ${chart.height} rows tall.`,
          `Work chart in colorwork while maintaining 4-stitch garter borders on each side.`,
          `After completing chart, continue in stockinette with garter borders until piece measures ${(actualScarfLength - borderInches / 2).toFixed(1)} inches from cast-on edge (leaving room for final border).`,
        ],
      },
      {
        title: 'Finishing Border',
        steps: [
          `Work ${borderRows} rows in garter stitch (knit all stitches).`,
          `BO all stitches loosely.`,
        ],
      },
      {
        title: 'Finishing',
        steps: [
          `Weave in all ends.`,
          `Block to measurements, pinning edges straight.`,
        ],
      },
    ],
  };

  const materials = {
    yarn: chart.colorMap,
    yardage: calculateYarnRequirements(
      totalWidthStitches,
      lengthRows,
      gauge,
      chart
    ),
    needles: getNeedleSize(gauge),
    notions: ['Tapestry needle', 'Blocking pins'],
  };

  return {
    id: `scarf-${size}-${Date.now()}`,
    garmentType: 'scarf',
    size,
    gauge,
    materials,
    measurements: { scarf: measurements },
    instructions,
    chart,
    createdAt: new Date(),
  };
}

function getNeedleSize(gauge: Gauge): string {
  if (gauge.stitchesPerInch >= 6.5) return 'US 2 (2.75mm) straight or circular';
  if (gauge.stitchesPerInch >= 5.5) return 'US 4 (3.5mm) straight or circular';
  if (gauge.stitchesPerInch >= 4.5) return 'US 7 (4.5mm) straight or circular';
  if (gauge.stitchesPerInch >= 3.5) return 'US 9 (5.5mm) straight or circular';
  return 'US 10.5 (6.5mm) straight or circular';
}
