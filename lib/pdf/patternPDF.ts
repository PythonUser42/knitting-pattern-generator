import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Pattern } from '@/lib/types';

/**
 * Generate a professional PDF pattern from a Pattern object
 */
export async function generatePatternPDF(
  pattern: Pattern,
  chartCanvasElement?: HTMLCanvasElement
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with wrapping
  const addText = (
    text: string,
    fontSize: number = 10,
    isBold: boolean = false,
    indent: number = 0
  ) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');

    const lines = pdf.splitTextToSize(text, contentWidth - indent);
    const lineHeight = fontSize * 0.4;

    lines.forEach((line: string) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin + indent, yPosition);
      yPosition += lineHeight;
    });
  };

  const addSpace = (space: number = 5) => {
    yPosition += space;
    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // ================== PAGE 1: COVER & OVERVIEW ==================

  // Title
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(
    `${pattern.garmentType.charAt(0).toUpperCase() + pattern.garmentType.slice(1)} Knitting Pattern`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  yPosition += 15;

  // Metadata
  addText(`Size: ${pattern.size}`, 12, true);
  addText(`Generated: ${new Date(pattern.createdAt).toLocaleDateString()}`, 10);
  addSpace(10);

  // Materials Section
  addText('MATERIALS', 14, true);
  addSpace(3);

  addText('Yarn Required (ESTIMATE - buy extra to be safe):', 11, true);
  pattern.materials.yardage.colorBreakdown.forEach((item) => {
    addText(`${item.color.name}: ~${item.yards} yards (${item.skeins} skein${item.skeins > 1 ? 's' : ''})`, 10, false, 5);
  });
  addSpace(2);
  addText(`Estimated Total: ~${pattern.materials.yardage.totalYards} yards`, 10, true);
  addText('Note: Actual yardage varies by tension, stitch pattern, and yarn. When in doubt, buy an extra skein.', 8, false, 0);
  addSpace(5);

  addText(`Needles: ${pattern.materials.needles}`, 10);
  addSpace(2);
  addText(`Notions: ${pattern.materials.notions.join(', ')}`, 10);
  addSpace(10);

  // Gauge Section
  addText('GAUGE', 14, true);
  addSpace(3);
  addText(
    `${pattern.gauge.stitchesPerInch} stitches × ${pattern.gauge.rowsPerInch} rows per inch in stockinette stitch`,
    10
  );
  addSpace(2);
  addText(
    'It is essential to match gauge exactly. Knit a 4" × 4" swatch, block it, and measure.',
    9,
    false,
    0
  );
  addSpace(10);

  // Measurements Section
  addText('MEASUREMENTS', 14, true);
  addSpace(3);

  if (pattern.garmentType === 'beanie' && pattern.measurements.beanie) {
    addText(`Circumference: ${pattern.measurements.beanie.circumference}" (with 10% negative ease)`, 10, false, 0);
    addText(`Height: ${pattern.measurements.beanie.height}"`, 10, false, 0);
    addText(`Brim Depth: ${pattern.measurements.beanie.brimDepth}"`, 10, false, 0);
  } else if (pattern.garmentType === 'scarf' && pattern.measurements.scarf) {
    addText(`Width: ${pattern.measurements.scarf.width}"`, 10, false, 0);
    addText(`Length: ${pattern.measurements.scarf.length}"`, 10, false, 0);
  } else if (pattern.garmentType === 'sweater' && pattern.measurements.sweater) {
    addText(`Chest: ${pattern.measurements.sweater.chest}"`, 10, false, 0);
    addText(`Length: ${pattern.measurements.sweater.length}"`, 10, false, 0);
    addText(`Armhole Depth: ${pattern.measurements.sweater.armholeDepth}"`, 10, false, 0);
    addText(`Sleeve Length: ${pattern.measurements.sweater.sleeveLength}"`, 10, false, 0);
  }
  addSpace(10);

  // ================== PAGE 2+: ABBREVIATIONS & INSTRUCTIONS ==================
  pdf.addPage();
  yPosition = margin;

  addText('ABBREVIATIONS', 14, true);
  addSpace(3);
  Object.entries(pattern.instructions.abbreviations).forEach(([abbr, full]) => {
    addText(`${abbr} = ${full}`, 10, false, 0);
  });
  addSpace(10);

  // Instructions
  addText('INSTRUCTIONS', 14, true);
  addSpace(5);

  pattern.instructions.sections.forEach((section) => {
    addText(section.title, 12, true);
    addSpace(3);

    section.steps.forEach((step, idx) => {
      const stepText = `${idx + 1}. ${step}`;
      addText(stepText, 10, false, 0);
      addSpace(2);
    });

    addSpace(5);
  });

  // ================== CHART PAGE ==================
  pdf.addPage();
  yPosition = margin;

  addText('COLORWORK CHART', 14, true);
  addSpace(3);
  addText(`Chart dimensions: ${pattern.chart.width} stitches wide × ${pattern.chart.height} rows tall`, 10);
  addSpace(2);
  addText('Read odd rows (right side) from right to left. Read even rows (wrong side) from left to right.', 9);
  addSpace(5);

  // Add chart image if canvas element provided
  if (chartCanvasElement) {
    try {
      const chartImage = chartCanvasElement.toDataURL('image/png');
      const chartWidth = Math.min(contentWidth, 150);
      const chartHeight = (pattern.chart.height / pattern.chart.width) * chartWidth;

      if (yPosition + chartHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.addImage(chartImage, 'PNG', margin, yPosition, chartWidth, chartHeight);
      yPosition += chartHeight + 10;
    } catch (error) {
      console.error('Failed to add chart image to PDF:', error);
      addText('[Chart visualization - see screen for preview]', 9, false, 0);
      addSpace(5);
    }
  } else {
    addText('[Chart visualization - see screen for preview]', 9, false, 0);
    addSpace(5);
  }

  // Color Legend
  addText('Color Key:', 11, true);
  addSpace(3);

  // Deduplicate colors by hex
  const uniqueColors = Array.from(
    new Map(pattern.chart.colorMap.map((color) => [color.hex, color])).values()
  );

  uniqueColors.forEach((color) => {
    // Draw small colored square
    pdf.setFillColor(color.hex);
    pdf.rect(margin, yPosition - 2, 4, 4, 'F');

    // Add color name
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(color.name, margin + 6, yPosition);
    yPosition += 5;
  });

  addSpace(10);

  // ================== FOOTER ON ALL PAGES ==================
  const totalPages = pdf.getNumberOfPages();
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.text(
      `Generated by Knitting Pattern Generator - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Return as Blob
  return pdf.output('blob');
}

/**
 * Download a pattern as PDF file
 */
export async function downloadPatternPDF(
  pattern: Pattern,
  chartCanvasElement?: HTMLCanvasElement
): Promise<void> {
  const pdfBlob = await generatePatternPDF(pattern, chartCanvasElement);

  // Create download link
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pattern.garmentType}-pattern-${pattern.size}-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
