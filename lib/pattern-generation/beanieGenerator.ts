// Beanie pattern generator
import { Pattern, StitchChart, Gauge, PatternInstructions } from '../types';
import { BEANIE_MEASUREMENTS, calculateStitchCount, calculateRowCount } from '../knitting/measurements';
import { calculateYarnRequirements } from '../knitting/yarnCalculator';

// Negative ease by yarn weight - tighter fabrics need more negative ease
// to maintain stretch and fit properly on the head
const BEANIE_NEGATIVE_EASE: Record<string, number> = {
  fingering: 0.15, // 15% - tight fabric needs more stretch allowance
  sport: 0.12,     // 12%
  dk: 0.10,        // 10%
  worsted: 0.10,   // 10% - standard
  aran: 0.08,      // 8% - looser fabric
  bulky: 0.05,     // 5% - very loose, minimal ease needed
};

export function generateBeaniePattern(
  chart: StitchChart,
  size: 'S' | 'M' | 'L',
  gauge: Gauge,
  customMeasurements?: { circumference: number; height: number; brimDepth: number }
): Pattern {
  const measurements = customMeasurements || BEANIE_MEASUREMENTS[size];

  // Get negative ease for this yarn weight (default to 10% if unknown)
  const negativeEase = BEANIE_NEGATIVE_EASE[gauge.yarnWeight] || 0.10;
  const easedCircumference = measurements.circumference * (1 - negativeEase);

  // Calculate stitch counts
  // Must be divisible by 8 for crown decreases (8-point star)
  // Also must be divisible by 4 for K2P2 ribbing
  // LCM(8,4) = 8, so round to nearest multiple of 8
  const rawStitches = calculateStitchCount(easedCircumference, gauge);
  const circumferenceStitches = Math.round(rawStitches / 8) * 8;

  const brimRows = calculateRowCount(measurements.brimDepth, gauge);
  const bodyRows = calculateRowCount(measurements.height - measurements.brimDepth - 2, gauge); // 2 inches for crown
  const crownRows = calculateRowCount(2, gauge);

  // Calculate chart placement (centered)
  // Ensure chart fits within body
  const bodyRowsBeforeChart = Math.max(0, Math.floor((bodyRows - chart.height) / 2));
  const chartStartRow = brimRows + bodyRowsBeforeChart;
  const stitchesBeforeChart = Math.floor((circumferenceStitches - chart.width) / 2);
  const stitchesAfterChart = circumferenceStitches - stitchesBeforeChart - chart.width;

  // Identify main color (most common in chart)
  const colorCounts = new Map<string, number>();
  for (const row of chart.grid) {
    for (const colorId of row) {
      colorCounts.set(colorId, (colorCounts.get(colorId) || 0) + 1);
    }
  }
  let mainColorId = chart.colorMap[0].id;
  let maxCount = 0;
  colorCounts.forEach((count, colorId) => {
    if (count > maxCount) {
      maxCount = count;
      mainColorId = colorId;
    }
  });
  const mainColor = chart.colorMap.find(c => c.id === mainColorId) || chart.colorMap[0];
  const contrastColors = chart.colorMap.filter(c => c.id !== mainColorId);

  const instructions: PatternInstructions = {
    abbreviations: {
      'K': 'knit',
      'P': 'purl',
      'K2tog': 'knit 2 together',
      'PM': 'place marker',
      'CO': 'cast on',
      'BO': 'bind off',
      'rnd': 'round',
    },
    sections: [
      {
        title: 'Before You Begin',
        steps: [
          `GAUGE CHECK: This pattern is written for ${gauge.stitchesPerInch} stitches and ${gauge.rowsPerInch} rows per inch in stockinette stitch.`,
          `Knit a 4" x 4" swatch, wash and block it, then measure. Adjust needle size if needed.`,
          `EASE: This pattern includes ${Math.round(negativeEase * 100)}% negative ease for a snug fit.`,
          `Finished circumference: ${easedCircumference.toFixed(1)} inches (unstretched).`,
          `COLORWORK TECHNIQUE: This pattern uses stranded colorwork (Fair Isle) by default.`,
          `ALTERNATIVE: For beginners or those who prefer not to carry floats, you may knit the beanie in the main color only, then add the chart design using DUPLICATE STITCH after blocking. This produces identical results with no float management.`,
        ],
      },
      {
        title: 'Brim',
        steps: [
          `CO ${circumferenceStitches} sts using long-tail cast on.`,
          `Join in the round, being careful not to twist. PM for beginning of round.`,
          `Work in K2, P2 ribbing for ${brimRows} rounds (approximately ${measurements.brimDepth} inches).`,
        ],
      },
      {
        title: 'Body',
        steps: [
          `Switch to stockinette stitch (knit all stitches every round).`,
          `Color designation: MC (Main Color) = ${mainColor.name}, CC (Contrast Colors) = ${contrastColors.map(c => c.name).join(', ')}.`,
          ...(bodyRowsBeforeChart > 0 ? [`Work ${bodyRowsBeforeChart} rounds in MC before starting chart.`] : []),
          `Begin chart on the first round after ${bodyRowsBeforeChart > 0 ? 'the MC rounds' : 'ribbing'}.`,
          `Chart placement (centered): K${stitchesBeforeChart} in MC, work chart over next ${chart.width} sts, K${stitchesAfterChart} in MC.`,
          `Chart uses MC (${mainColor.name}) for background with motifs in ${contrastColors.map(c => c.name).join(', ')}. Chart is ${chart.width} sts × ${chart.height} rows.`,
          `Work chart in stranded colorwork (Fair Isle):`,
          `  - Carry unused colors loosely across back (floats no longer than 3-4 stitches).`,
          `  - Maintain consistent color dominance (background color above, pattern color below).`,
          `  - At end of each round, lift working yarn over starting yarn to avoid jog.`,
          ...(bodyRows - bodyRowsBeforeChart - chart.height > 0
            ? [`After completing chart, continue in MC in stockinette until piece measures ${measurements.height - 2} inches from cast-on edge (approximately ${bodyRows - bodyRowsBeforeChart - chart.height} more rounds).`]
            : [`After completing chart, continue in MC in stockinette if needed until piece measures ${measurements.height - 2} inches from cast-on edge.`]
          ),
        ],
      },
      {
        title: 'Crown Shaping',
        steps: [
          `Note: Crown shaping creates an 8-point star decrease. This will result in approximately 2–2.5 inches of crown depth.`,
          ...generateCrownDecreases(circumferenceStitches),
        ],
      },
      {
        title: 'Finishing',
        steps: [
          `Weave in all ends on the wrong side.`,
          `Wash and block according to yarn label instructions.`,
        ],
      },
    ],
  };

  const materials = {
    yarn: chart.colorMap,
    yardage: calculateYarnRequirements(
      circumferenceStitches,
      brimRows + bodyRows + crownRows,
      gauge,
      chart
    ),
    needles: getNeedleSize(gauge),
    notions: ['Stitch marker', 'Tapestry needle'],
  };

  return {
    id: `beanie-${size}-${Date.now()}`,
    garmentType: 'beanie',
    size,
    gauge,
    materials,
    measurements: { beanie: measurements },
    instructions,
    chart,
    createdAt: new Date(),
  };
}

function generateCrownDecreases(totalStitches: number): string[] {
  // 8-point crown decreases
  // totalStitches must be divisible by 8
  const stitchesPerSection = totalStitches / 8;

  const steps: string[] = [];
  let currentStitches = totalStitches;
  let currentKnitCount = stitchesPerSection - 1;
  let roundNum = 1;

  while (currentStitches > 8) {
    steps.push(`Round ${roundNum}: *K${currentKnitCount}, K2tog; repeat from * 7 more times. (${currentStitches - 8} sts)`);
    currentStitches -= 8;
    roundNum++;

    if (currentStitches > 8) {
      steps.push(`Round ${roundNum}: Knit all stitches.`);
      roundNum++;
      currentKnitCount--;
    }
  }

  steps.push(`Cut yarn leaving 6-inch tail. Thread through remaining 8 stitches and pull tight to close top.`);
  steps.push(`Weave tail to inside.`);

  return steps;
}

function getNeedleSize(gauge: Gauge): string {
  if (gauge.stitchesPerInch >= 6.5) return 'US 2 (2.75mm) circular, 16" length';
  if (gauge.stitchesPerInch >= 5.5) return 'US 4 (3.5mm) circular, 16" length';
  if (gauge.stitchesPerInch >= 4.5) return 'US 7 (4.5mm) circular, 16" length';
  if (gauge.stitchesPerInch >= 3.5) return 'US 9 (5.5mm) circular, 16" length';
  return 'US 10.5 (6.5mm) circular, 16" length';
}
