// Sweater pattern generator (drop shoulder, bottom-up construction)
import { Pattern, StitchChart, Gauge, Size, PatternInstructions } from '../types';
import { SWEATER_MEASUREMENTS, calculateStitchCount, calculateRowCount, adjustForRibbing } from '../knitting/measurements';
import { calculateYarnRequirements } from '../knitting/yarnCalculator';

// Seam allowance in inches (0.5" per side = 1" total for flat-knit construction)
const SEAM_ALLOWANCE = 1;

export function generateSweaterPattern(
  chart: StitchChart,
  size: Size,
  gauge: Gauge,
  customMeasurements?: {
    chest: number;
    length: number;
    armholeDepth: number;
    sleeveLength: number;
    cuffWidth: number;
    upperArmWidth: number;
  }
): Pattern {
  const measurements = customMeasurements || SWEATER_MEASUREMENTS[size];
  const ease = 2; // inches of positive ease

  // Calculate stitch counts
  // Body width = (chest + ease) / 2 for each panel + seam allowance
  const bodyWidth = (measurements.chest + ease) / 2 + SEAM_ALLOWANCE;
  // Adjust for K2P2 ribbing (must be divisible by 4)
  const bodyStitches = adjustForRibbing(calculateStitchCount(bodyWidth, gauge));

  const bodyRows = calculateRowCount(measurements.length - measurements.armholeDepth, gauge);
  const shoulderRows = calculateRowCount(measurements.armholeDepth, gauge);

  // Sleeve calculations
  const cuffStitches = adjustForRibbing(calculateStitchCount(measurements.cuffWidth, gauge));
  const upperArmStitches = calculateStitchCount(measurements.upperArmWidth, gauge);
  const sleeveRows = calculateRowCount(measurements.sleeveLength, gauge);

  // CRITICAL: Correct sleeve increase calculation
  // Each increase row adds 2 stitches (M1 at each end)
  const stitchesToAdd = upperArmStitches - cuffStitches;
  const increaseRowsNeeded = Math.ceil(stitchesToAdd / 2);
  const ribbingRows = calculateRowCount(2, gauge); // 2 inches of ribbing
  const availableRowsForIncreases = sleeveRows - ribbingRows;
  const rowsBetweenIncreases = increaseRowsNeeded > 0
    ? Math.floor(availableRowsForIncreases / increaseRowsNeeded)
    : 0;

  // Chart placement (centered on front)
  const chartStartRow = Math.floor((bodyRows - chart.height) / 2);
  const chartStartStitch = Math.floor((bodyStitches - chart.width) / 2);

  const instructions: PatternInstructions = {
    abbreviations: {
      'K': 'knit',
      'P': 'purl',
      'K2tog': 'knit 2 together',
      'M1': 'make 1 (increase)',
      'M1L': 'make 1 left-leaning (lift bar from front, knit through back)',
      'M1R': 'make 1 right-leaning (lift bar from back, knit through front)',
      'CO': 'cast on',
      'BO': 'bind off',
      'RS': 'right side',
      'WS': 'wrong side',
      'St st': 'stockinette stitch',
    },
    sections: [
      {
        title: 'Before You Begin',
        steps: [
          `GAUGE CHECK: This pattern is written for ${gauge.stitchesPerInch} stitches and ${gauge.rowsPerInch} rows per inch in stockinette stitch.`,
          `Knit a 4" x 4" swatch, wash and block it, then measure. Adjust needle size if needed.`,
          `EASE: This pattern includes ${ease}" of positive ease for a comfortable fit.`,
          `FINISHED MEASUREMENTS: Chest ${measurements.chest + ease}" | Length ${measurements.length}" | Sleeve ${measurements.sleeveLength}"`,
          `CONSTRUCTION: This sweater is knit flat in 4 pieces (back, front, 2 sleeves) and seamed.`,
          `NOTE: Seam allowance of ${SEAM_ALLOWANCE}" is included in panel width calculations.`,
          ``,
          `COLORWORK TECHNIQUE: This pattern uses intarsia or stranded colorwork for the chart on the front panel.`,
          `RECOMMENDED ALTERNATIVE: For easier construction, knit the front panel in the main color only, then add the chart design using DUPLICATE STITCH after seaming and blocking. This is especially recommended for first-time sweater knitters.`,
        ],
      },
      {
        title: 'Back Panel',
        steps: [
          `CO ${bodyStitches} sts.`,
          `Work in K2, P2 ribbing for 2 inches.`,
          `Switch to St st and work even until piece measures ${measurements.length - measurements.armholeDepth} inches from cast-on edge.`,
          `Continue in St st for ${measurements.armholeDepth} more inches (total ${measurements.length} inches).`,
          `BO all stitches loosely.`,
        ],
      },
      {
        title: 'Front Panel',
        steps: [
          `CO ${bodyStitches} sts.`,
          `Work in K2, P2 ribbing for 2 inches.`,
          `Switch to St st and work ${chartStartRow} rows.`,
          ``,
          `Begin chart:`,
          `Chart is centered, starting at stitch ${chartStartStitch}.`,
          `Chart is ${chart.width} stitches wide and ${chart.height} rows tall.`,
          `Work chart in colorwork while maintaining St st for remaining stitches.`,
          ``,
          `After completing chart, continue in St st until piece measures ${measurements.length - measurements.armholeDepth} inches from cast-on edge.`,
          `Continue in St st for ${measurements.armholeDepth} more inches (total ${measurements.length} inches).`,
          `BO all stitches loosely.`,
          ``,
          `Note: For a crew neck, you can bind off center ${Math.floor(bodyStitches / 3)} sts when piece measures ${measurements.length - 2} inches, then work each shoulder separately for final 2 inches.`,
        ],
      },
      {
        title: 'Sleeves (make 2)',
        steps: [
          `OVERVIEW: Each sleeve starts narrow at the cuff and widens toward the upper arm. You will increase gradually as you knit upward.`,
          ``,
          `CUFF:`,
          `CO ${cuffStitches} sts using long-tail cast on.`,
          `Work in K2, P2 ribbing for 2 inches (approximately ${Math.round(2 * gauge.rowsPerInch)} rows).`,
          ``,
          `SLEEVE BODY WITH SHAPING:`,
          `Switch to St st (knit RS rows, purl WS rows).`,
          ``,
          `Your goal: Increase from ${cuffStitches} stitches to ${upperArmStitches} stitches.`,
          `Total stitches to add: ${stitchesToAdd} stitches (${increaseRowsNeeded} increase rows × 2 stitches each).`,
          ``,
          `HOW TO INCREASE:`,
          `Increase row (RS): K1, M1L (make 1 left-leaning), knit to last stitch, M1R (make 1 right-leaning), K1.`,
          `This adds 2 stitches per increase row - one near each edge.`,
          ``,
          `INCREASE SCHEDULE:`,
          `Work an increase row every ${rowsBetweenIncreases} rows (approximately every ${(rowsBetweenIncreases / gauge.rowsPerInch).toFixed(1)} inches).`,
          `Repeat ${increaseRowsNeeded} times total.`,
          ``,
          `TIP: Place a stitch marker or safety pin every ${rowsBetweenIncreases} rows to track your increases.`,
          `After all ${increaseRowsNeeded} increases: ${cuffStitches + (increaseRowsNeeded * 2)} stitches on needle.`,
          ``,
          `FINISHING SLEEVE:`,
          `Continue even in St st (no more increases) until sleeve measures ${measurements.sleeveLength} inches total from cast-on edge.`,
          `BO all stitches loosely - the sleeve cap needs to stretch during seaming.`,
          ``,
          `Make a second identical sleeve before proceeding to assembly.`,
        ],
      },
      {
        title: 'Assembly',
        steps: [
          `Block all pieces to measurements.`,
          `Seam shoulders: BO edges of front and back should align. Seam approximately ${Math.floor(bodyWidth - (bodyWidth / 3))} inches on each shoulder, leaving center open for neck.`,
          `Mark armholes: Measure down ${measurements.armholeDepth} inches from shoulder seam on both front and back. Place markers.`,
          `Set in sleeves: Center sleeve BO edge at shoulder seam. Pin sleeve between armhole markers. Seam in place.`,
          `Seam sides: Starting at bottom of body, seam front to back on both sides.`,
          `Seam underarms: Seam sleeve from cuff to underarm.`,
        ],
      },
      {
        title: 'Finishing',
        steps: [
          `Weave in all ends.`,
          `Optional: Pick up stitches around neckline and work 1 inch of K1, P1 ribbing. BO loosely.`,
          `Steam or wet block finished sweater.`,
        ],
      },
    ],
  };

  // Calculate total stitches for sweater (2 body panels + 2 sleeves)
  const bodyPanelStitches = bodyStitches * (bodyRows + shoulderRows);
  const totalBodyStitches = bodyPanelStitches * 2; // Front + back

  // Sleeve: trapezoidal shape (average of cuff and upper arm width)
  const avgSleeveStitches = Math.round((cuffStitches + upperArmStitches) / 2);
  const totalSleeveStitches = avgSleeveStitches * sleeveRows * 2; // 2 sleeves

  const totalSweaterStitches = totalBodyStitches + totalSleeveStitches;

  // Use the proper yarn calculation function with chart data
  // Pass 'sweater' to get higher safety margins (20% for sweaters)
  const yarnReqs = calculateYarnRequirements(
    Math.round(Math.sqrt(totalSweaterStitches)), // Approximate as square for area calc
    Math.round(Math.sqrt(totalSweaterStitches)),
    gauge,
    chart,
    'sweater'
  );

  // Calculate chart coverage ratio (chart only on front panel)
  const chartStitches = chart.width * chart.height;
  const chartCoverageRatio = chartStitches / totalSweaterStitches;

  // Adjust color breakdown: main color gets non-chart area, chart colors get proportional
  const mainColorYards = Math.ceil(yarnReqs.totalYards * (1 - chartCoverageRatio));
  const chartYards = Math.ceil(yarnReqs.totalYards * chartCoverageRatio);

  // Count actual stitch usage per color in chart
  const colorCounts = new Map<string, number>();
  let totalChartStitches = 0;
  for (const row of chart.grid) {
    for (const colorId of row) {
      colorCounts.set(colorId, (colorCounts.get(colorId) || 0) + 1);
      totalChartStitches++;
    }
  }

  const materials = {
    yarn: chart.colorMap,
    yardage: {
      totalYards: yarnReqs.totalYards,
      colorBreakdown: chart.colorMap.map((color, index) => {
        const chartColorCount = colorCounts.get(color.id) || 0;
        const chartPercentage = totalChartStitches > 0 ? chartColorCount / totalChartStitches : 0;
        // First color (main) gets main body + its chart portion
        // Other colors only appear in chart
        const yards = index === 0
          ? mainColorYards + Math.ceil(chartYards * chartPercentage)
          : Math.ceil(chartYards * chartPercentage);
        return {
          color,
          yards,
          skeins: Math.ceil(yards / 220),
        };
      }),
    },
    needles: getNeedleSize(gauge),
    notions: ['Tapestry needle', 'Stitch markers', 'Blocking pins'],
  };

  return {
    id: `sweater-${size}-${Date.now()}`,
    garmentType: 'sweater',
    size,
    gauge,
    materials,
    measurements: { sweater: measurements },
    instructions,
    chart,
    createdAt: new Date(),
  };
}

function getNeedleSize(gauge: Gauge): string {
  if (gauge.stitchesPerInch >= 6.5) return 'US 2 (2.75mm) straight needles';
  if (gauge.stitchesPerInch >= 5.5) return 'US 4 (3.5mm) straight needles';
  if (gauge.stitchesPerInch >= 4.5) return 'US 7 (4.5mm) straight needles';
  if (gauge.stitchesPerInch >= 3.5) return 'US 9 (5.5mm) straight needles';
  return 'US 10.5 (6.5mm) straight needles';
}
