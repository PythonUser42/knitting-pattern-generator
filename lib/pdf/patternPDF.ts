import jsPDF from 'jspdf';
import { Pattern } from '@/lib/types';
import { Language, t, TranslationKey } from '@/lib/translations';

// Heritage craft color palette - aged paper and artisan warmth
const COLORS = {
  // Primary tones
  parchment: '#F7F3E9',      // Aged paper background
  cream: '#FFFEF7',          // Card backgrounds
  espresso: '#2C1810',       // Deep brown - primary text
  walnut: '#5C4033',         // Warm brown - secondary text
  terracotta: '#C75B39',     // Rich accent - headers
  copper: '#B87333',         // Metallic accent
  sage: '#8B9A7D',           // Muted green accent

  // Functional
  inkBrown: '#3D2914',       // Dark ink for fine details
  dustyRose: '#C9A9A6',      // Subtle decorative elements
  goldenThread: '#D4A574',   // Highlight accents
  shadow: '#E8E0D0',         // Subtle shadows/borders
};

// Decorative drawing helpers
class PatternPDFRenderer {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;
  private yPosition: number;
  private language: Language;

  constructor(language: Language = 'en') {
    this.language = language;
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 18;
    this.contentWidth = this.pageWidth - 2 * this.margin;
    this.yPosition = this.margin;
  }

  // Helper to get translation
  private t(key: TranslationKey): string {
    return t(key, this.language);
  }

  // Get localized garment name
  private getGarmentTitle(garmentType: string): string {
    const garmentMap: Record<string, TranslationKey> = {
      beanie: 'pdfBeanie',
      scarf: 'pdfScarf',
      sweater: 'pdfSweater',
    };
    return this.t(garmentMap[garmentType] || 'pdfBeanie');
  }

  // Get localized section title
  private getSectionTitle(title: string): string {
    const sectionMap: Record<string, TranslationKey> = {
      'Before You Begin': 'sectionBeforeYouBegin',
      'Brim': 'sectionBrim',
      'Body': 'sectionBody',
      'Crown Shaping': 'sectionCrownShaping',
      'Finishing': 'sectionFinishing',
      'Border': 'sectionBorder',
      'Main Body': 'sectionMainBody',
      'Back': 'sectionBack',
      'Front': 'sectionFront',
      'Sleeves': 'sectionSleeves',
      'Assembly': 'sectionAssembly',
    };
    const key = sectionMap[title];
    return key ? this.t(key) : title;
  }

  private hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 0, g: 0, b: 0 };
  }

  private setTextColor(hex: string) {
    const { r, g, b } = this.hexToRgb(hex);
    this.pdf.setTextColor(r, g, b);
  }

  private setFillColor(hex: string) {
    const { r, g, b } = this.hexToRgb(hex);
    this.pdf.setFillColor(r, g, b);
  }

  private setDrawColor(hex: string) {
    const { r, g, b } = this.hexToRgb(hex);
    this.pdf.setDrawColor(r, g, b);
  }

  // Draw decorative corner flourish
  private drawCornerFlourish(x: number, y: number, size: number, rotation: 0 | 90 | 180 | 270) {
    this.setDrawColor(COLORS.dustyRose);
    this.pdf.setLineWidth(0.4);

    const s = size;
    let dx = 0, dy = 0;
    let flipX = 1, flipY = 1;

    if (rotation === 90) { flipX = -1; dx = size; }
    else if (rotation === 180) { flipX = -1; flipY = -1; dx = size; dy = size; }
    else if (rotation === 270) { flipY = -1; dy = size; }

    // Simple elegant corner bracket
    const px = (ox: number) => x + dx + ox * flipX;
    const py = (oy: number) => y + dy + oy * flipY;

    // L-shaped bracket with curved corner
    this.pdf.line(px(0), py(s * 0.5), px(0), py(s * 0.1));
    this.pdf.line(px(0), py(0), px(s * 0.1), py(0));
    this.pdf.line(px(s * 0.1), py(0), px(s * 0.5), py(0));

    // Small decorative dot
    this.setFillColor(COLORS.dustyRose);
    this.pdf.circle(px(s * 0.08), py(s * 0.08), 0.6, 'F');
  }

  // Draw decorative border frame
  private drawDecorativeFrame(x: number, y: number, width: number, height: number) {
    const inset = 4;

    // Outer subtle shadow
    this.setDrawColor(COLORS.shadow);
    this.pdf.setLineWidth(0.3);
    this.pdf.rect(x - 0.5, y - 0.5, width + 1, height + 1);

    // Main frame
    this.setDrawColor(COLORS.walnut);
    this.pdf.setLineWidth(0.5);
    this.pdf.rect(x, y, width, height);

    // Inner decorative line
    this.setDrawColor(COLORS.dustyRose);
    this.pdf.setLineWidth(0.2);
    this.pdf.rect(x + inset, y + inset, width - inset * 2, height - inset * 2);

    // Corner flourishes
    const flourishSize = 8;
    this.drawCornerFlourish(x + inset, y + inset, flourishSize, 0);
    this.drawCornerFlourish(x + width - inset, y + inset, flourishSize, 90);
    this.drawCornerFlourish(x + width - inset, y + height - inset, flourishSize, 180);
    this.drawCornerFlourish(x + inset, y + height - inset, flourishSize, 270);
  }

  // Draw yarn ball icon
  private drawYarnBall(x: number, y: number, radius: number) {
    this.setDrawColor(COLORS.terracotta);
    this.pdf.setLineWidth(0.4);

    // Main circle
    this.pdf.circle(x, y, radius);

    // Decorative yarn strands
    const r = radius * 0.7;
    this.pdf.setLineWidth(0.25);

    // Curved lines to suggest wrapped yarn
    for (let i = 0; i < 3; i++) {
      const offset = (i - 1) * r * 0.5;
      const startX = x - r * 0.8;
      const endX = x + r * 0.8;
      const midY = y + offset;

      // Draw a simple curved appearance with lines
      this.pdf.line(startX, midY - r * 0.2, x, midY + r * 0.1);
      this.pdf.line(x, midY + r * 0.1, endX, midY - r * 0.2);
    }
  }

  // Draw decorative divider line
  private drawDivider(y: number, style: 'simple' | 'ornate' = 'simple') {
    const centerX = this.pageWidth / 2;

    if (style === 'simple') {
      this.setDrawColor(COLORS.shadow);
      this.pdf.setLineWidth(0.3);
      this.pdf.line(this.margin + 20, y, this.pageWidth - this.margin - 20, y);
    } else {
      // Ornate divider with center element
      const lineWidth = 50;
      this.setDrawColor(COLORS.dustyRose);
      this.pdf.setLineWidth(0.4);

      // Left line
      this.pdf.line(centerX - lineWidth - 8, y, centerX - 8, y);
      // Right line
      this.pdf.line(centerX + 8, y, centerX + lineWidth + 8, y);

      // Center diamond
      this.setFillColor(COLORS.terracotta);
      const d = 2;
      this.pdf.lines(
        [[d, d], [d, -d], [-d, -d], [-d, d]],
        centerX - d, y,
        [1, 1],
        'F'
      );
    }
  }

  // Check if we need a new page
  private checkNewPage(neededSpace: number): boolean {
    if (this.yPosition + neededSpace > this.pageHeight - this.margin - 15) {
      this.pdf.addPage();
      // Apply parchment background to new page
      this.setFillColor(COLORS.parchment);
      this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
      this.yPosition = this.margin + 10;
      this.addPageHeader();
      return true;
    }
    return false;
  }

  // Add header to subsequent pages
  private addPageHeader() {
    // Thin decorative top line
    this.setDrawColor(COLORS.dustyRose);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margin, 12, this.pageWidth - this.margin, 12);

    // Small yarn ball
    this.drawYarnBall(this.pageWidth / 2, 8, 2);
  }

  // Render cover page
  private renderCoverPage(pattern: Pattern) {
    const centerX = this.pageWidth / 2;

    // Full page cream background
    this.setFillColor(COLORS.parchment);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

    // Decorative border frame
    this.drawDecorativeFrame(10, 10, this.pageWidth - 20, this.pageHeight - 20);

    // Top decorative banner
    this.setFillColor(COLORS.terracotta);
    this.pdf.rect(this.margin + 15, 28, this.contentWidth - 30, 1.5, 'F');

    // Brand name - elegant positioning
    this.yPosition = 45;
    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(11);
    this.setTextColor(COLORS.walnut);
    this.pdf.text('K N I T C R A F T', centerX, this.yPosition, { align: 'center' });

    // Subtitle
    this.yPosition += 6;
    this.pdf.setFontSize(8);
    this.setTextColor(COLORS.sage);
    this.pdf.text(this.t('pdfPatternStudio'), centerX, this.yPosition, { align: 'center' });

    // Ornate divider
    this.yPosition += 8;
    this.drawDivider(this.yPosition, 'ornate');

    // Main title block
    this.yPosition += 25;
    const garmentTitle = this.getGarmentTitle(pattern.garmentType);

    this.pdf.setFont('times', 'bold');
    this.pdf.setFontSize(36);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(garmentTitle, centerX, this.yPosition, { align: 'center' });

    // Pattern subtitle
    this.yPosition += 12;
    this.pdf.setFont('times', 'italic');
    this.pdf.setFontSize(14);
    this.setTextColor(COLORS.walnut);
    this.pdf.text(this.t('pdfColorworkPattern'), centerX, this.yPosition, { align: 'center' });

    // Size badge - elegant pill shape
    this.yPosition += 18;
    const sizeText = `${this.t('pdfSize')} ${pattern.size}`;
    const badgeWidth = 35;
    const badgeHeight = 10;
    const badgeX = centerX - badgeWidth / 2;

    this.setFillColor(COLORS.cream);
    this.setDrawColor(COLORS.copper);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(badgeX, this.yPosition - 7, badgeWidth, badgeHeight, 5, 5, 'FD');

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.terracotta);
    this.pdf.text(sizeText, centerX, this.yPosition, { align: 'center' });

    // Yarn balls decorative element
    this.yPosition += 25;
    this.drawYarnBall(centerX - 15, this.yPosition, 4);
    this.drawYarnBall(centerX, this.yPosition - 2, 5);
    this.drawYarnBall(centerX + 15, this.yPosition, 4);

    // Pattern details box
    this.yPosition += 25;
    const detailsBoxY = this.yPosition;
    const detailsBoxHeight = 45;

    this.setFillColor(COLORS.cream);
    this.setDrawColor(COLORS.shadow);
    this.pdf.setLineWidth(0.3);
    this.pdf.roundedRect(this.margin + 25, detailsBoxY, this.contentWidth - 50, detailsBoxHeight, 3, 3, 'FD');

    // Pattern details content
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(9);
    this.setTextColor(COLORS.walnut);

    const detailsCenterX = centerX;
    let detailY = detailsBoxY + 10;

    this.pdf.text(this.t('pdfGauge'), detailsCenterX, detailY, { align: 'center' });
    detailY += 5;
    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(11);
    this.setTextColor(COLORS.espresso);
    const stsLabel = this.language === 'de' ? 'M' : 'sts';
    const rowsLabel = this.language === 'de' ? 'R' : 'rows';
    this.pdf.text(`${pattern.gauge.stitchesPerInch} ${stsLabel} × ${pattern.gauge.rowsPerInch} ${rowsLabel} = 1"`, detailsCenterX, detailY, { align: 'center' });

    detailY += 10;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(9);
    this.setTextColor(COLORS.walnut);
    this.pdf.text(this.t('pdfYarnWeight'), detailsCenterX, detailY, { align: 'center' });
    detailY += 5;
    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(11);
    this.setTextColor(COLORS.espresso);
    const yarnWeightDisplay = pattern.gauge.yarnWeight.charAt(0).toUpperCase() + pattern.gauge.yarnWeight.slice(1);
    this.pdf.text(yarnWeightDisplay, detailsCenterX, detailY, { align: 'center' });

    // Bottom section - materials preview
    this.yPosition = this.pageHeight - 75;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);
    this.setTextColor(COLORS.sage);
    this.pdf.text(this.t('pdfMaterialsRequired'), centerX, this.yPosition, { align: 'center' });

    this.yPosition += 8;
    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.walnut);
    this.pdf.text(`${pattern.materials.yardage.totalYards} ${this.t('pdfYardsTotal')} · ${pattern.chart.colorMap.length} ${this.t('pdfColors')}`, centerX, this.yPosition, { align: 'center' });

    this.yPosition += 5;
    this.pdf.text(pattern.materials.needles, centerX, this.yPosition, { align: 'center' });

    // Date at bottom
    this.yPosition = this.pageHeight - 28;
    this.drawDivider(this.yPosition - 5, 'simple');

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);
    this.setTextColor(COLORS.dustyRose);
    const dateLocale = this.language === 'de' ? 'de-DE' : 'en-US';
    const dateStr = new Date(pattern.createdAt).toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.pdf.text(dateStr, centerX, this.yPosition, { align: 'center' });
  }

  // Render materials page
  private renderMaterialsPage(pattern: Pattern) {
    this.pdf.addPage();

    // Page background
    this.setFillColor(COLORS.parchment);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

    this.yPosition = this.margin;
    this.addPageHeader();
    this.yPosition = 25;

    // Section title
    this.pdf.setFont('times', 'bold');
    this.pdf.setFontSize(18);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(this.t('pdfMaterialsPrep'), this.margin, this.yPosition);

    this.yPosition += 3;
    this.setDrawColor(COLORS.terracotta);
    this.pdf.setLineWidth(0.8);
    this.pdf.line(this.margin, this.yPosition, this.margin + 55, this.yPosition);

    // Yarn requirements card
    this.yPosition += 12;
    const yarnCardY = this.yPosition;
    const yarnCardHeight = 12 + pattern.materials.yardage.colorBreakdown.length * 8 + 15;

    this.setFillColor(COLORS.cream);
    this.setDrawColor(COLORS.shadow);
    this.pdf.setLineWidth(0.3);
    this.pdf.roundedRect(this.margin, yarnCardY, this.contentWidth, yarnCardHeight, 3, 3, 'FD');

    // Card header
    this.setFillColor(COLORS.terracotta);
    this.pdf.roundedRect(this.margin, yarnCardY, this.contentWidth, 10, 3, 3, 'F');
    this.pdf.rect(this.margin, yarnCardY + 5, this.contentWidth, 5, 'F');

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.setTextColor('#FFFFFF');
    this.pdf.text(this.t('pdfYarnRequirements'), this.margin + 5, yarnCardY + 7);

    // Yarn color breakdown
    this.yPosition = yarnCardY + 16;

    pattern.materials.yardage.colorBreakdown.forEach((item, idx) => {
      // Color swatch
      this.setFillColor(item.color.hex);
      this.setDrawColor(COLORS.shadow);
      this.pdf.setLineWidth(0.2);
      this.pdf.roundedRect(this.margin + 5, this.yPosition - 4, 6, 6, 1, 1, 'FD');

      // Color name and yardage
      this.pdf.setFont('times', 'normal');
      this.pdf.setFontSize(10);
      this.setTextColor(COLORS.espresso);
      this.pdf.text(item.color.name, this.margin + 15, this.yPosition);

      // Yardage aligned right
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(9);
      this.setTextColor(COLORS.walnut);
      const skeinLabel = item.skeins > 1 ? this.t('pdfSkeins') : this.t('pdfSkein');
      const yardageText = `~${item.yards} ${this.t('pdfYards')} (${item.skeins} ${skeinLabel})`;
      this.pdf.text(yardageText, this.margin + this.contentWidth - 5, this.yPosition, { align: 'right' });

      this.yPosition += 8;
    });

    // Total line
    this.yPosition += 2;
    this.setDrawColor(COLORS.dustyRose);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margin + 5, this.yPosition - 5, this.margin + this.contentWidth - 5, this.yPosition - 5);

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.terracotta);
    this.pdf.text(this.t('pdfTotal'), this.margin + 5, this.yPosition);
    this.pdf.text(`~${pattern.materials.yardage.totalYards} ${this.t('pdfYards')}`, this.margin + this.contentWidth - 5, this.yPosition, { align: 'right' });

    // Yarn note
    this.yPosition = yarnCardY + yarnCardHeight + 8;
    this.pdf.setFont('times', 'italic');
    this.pdf.setFontSize(8);
    this.setTextColor(COLORS.sage);
    this.pdf.text(this.t('pdfYarnNote'), this.margin, this.yPosition);

    // Tools section
    this.yPosition += 15;
    this.pdf.setFont('times', 'bold');
    this.pdf.setFontSize(14);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(this.t('pdfToolsNotions'), this.margin, this.yPosition);

    this.yPosition += 3;
    this.setDrawColor(COLORS.terracotta);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.yPosition, this.margin + 35, this.yPosition);

    this.yPosition += 10;

    // Needles with icon
    this.setFillColor(COLORS.copper);
    this.pdf.circle(this.margin + 3, this.yPosition - 1.5, 1.5, 'F');

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(9);
    this.setTextColor(COLORS.walnut);
    this.pdf.text(this.t('pdfNeedles'), this.margin + 8, this.yPosition);

    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(pattern.materials.needles, this.margin + 28, this.yPosition);

    // Notions
    this.yPosition += 10;
    this.setFillColor(COLORS.copper);
    this.pdf.circle(this.margin + 3, this.yPosition - 1.5, 1.5, 'F');

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(9);
    this.setTextColor(COLORS.walnut);
    this.pdf.text(this.t('pdfNotions'), this.margin + 8, this.yPosition);

    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(pattern.materials.notions.join(', '), this.margin + 28, this.yPosition);

    // Gauge section with decorative frame
    this.yPosition += 20;
    const gaugeBoxY = this.yPosition;
    const gaugeBoxWidth = 80;
    const gaugeBoxHeight = 35;
    const gaugeBoxX = (this.pageWidth - gaugeBoxWidth) / 2;

    // Gauge box with double border
    this.setFillColor(COLORS.cream);
    this.pdf.roundedRect(gaugeBoxX, gaugeBoxY, gaugeBoxWidth, gaugeBoxHeight, 2, 2, 'F');

    this.setDrawColor(COLORS.terracotta);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(gaugeBoxX, gaugeBoxY, gaugeBoxWidth, gaugeBoxHeight, 2, 2);

    this.setDrawColor(COLORS.dustyRose);
    this.pdf.setLineWidth(0.2);
    this.pdf.roundedRect(gaugeBoxX + 2, gaugeBoxY + 2, gaugeBoxWidth - 4, gaugeBoxHeight - 4, 1, 1);

    // Gauge content
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);
    this.setTextColor(COLORS.sage);
    this.pdf.text(this.t('pdfGauge'), this.pageWidth / 2, gaugeBoxY + 8, { align: 'center' });

    this.pdf.setFont('times', 'bold');
    this.pdf.setFontSize(16);
    this.setTextColor(COLORS.terracotta);
    const stsLabel2 = this.language === 'de' ? 'M' : 'sts';
    const rowsLabel2 = this.language === 'de' ? 'R' : 'rows';
    this.pdf.text(`${pattern.gauge.stitchesPerInch} ${stsLabel2} × ${pattern.gauge.rowsPerInch} ${rowsLabel2}`, this.pageWidth / 2, gaugeBoxY + 18, { align: 'center' });

    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.walnut);
    this.pdf.text(this.t('pdfInStockinette'), this.pageWidth / 2, gaugeBoxY + 26, { align: 'center' });

    // Gauge swatch reminder
    this.yPosition = gaugeBoxY + gaugeBoxHeight + 10;

    this.setFillColor(COLORS.goldenThread);
    this.pdf.setLineWidth(0);
    this.pdf.roundedRect(this.margin + 30, this.yPosition - 4, this.contentWidth - 60, 14, 2, 2, 'F');

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(this.t('pdfGaugeReminder'), this.pageWidth / 2, this.yPosition + 3, { align: 'center' });

    // Finished measurements
    this.yPosition += 25;
    this.pdf.setFont('times', 'bold');
    this.pdf.setFontSize(14);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(this.t('pdfFinishedMeasurements'), this.margin, this.yPosition);

    this.yPosition += 3;
    this.setDrawColor(COLORS.terracotta);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.yPosition, this.margin + 45, this.yPosition);

    this.yPosition += 10;
    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.espresso);

    if (pattern.garmentType === 'beanie' && pattern.measurements.beanie) {
      const m = pattern.measurements.beanie;
      this.pdf.text(`${this.t('pdfCircumference')}: ${m.circumference}" ${this.t('pdfWithNegativeEase')}`, this.margin + 5, this.yPosition);
      this.yPosition += 6;
      this.pdf.text(`${this.t('pdfHeight')}: ${m.height}"`, this.margin + 5, this.yPosition);
      this.yPosition += 6;
      this.pdf.text(`${this.t('pdfBrimDepth')}: ${m.brimDepth}"`, this.margin + 5, this.yPosition);
    } else if (pattern.garmentType === 'scarf' && pattern.measurements.scarf) {
      const m = pattern.measurements.scarf;
      this.pdf.text(`${this.t('pdfWidth')}: ${m.width}"`, this.margin + 5, this.yPosition);
      this.yPosition += 6;
      this.pdf.text(`${this.t('pdfLength')}: ${m.length}"`, this.margin + 5, this.yPosition);
    } else if (pattern.garmentType === 'sweater' && pattern.measurements.sweater) {
      const m = pattern.measurements.sweater;
      const measurements = [
        `${this.t('pdfChest')}: ${m.chest}"`,
        `${this.t('pdfBodyLength')}: ${m.length}"`,
        `${this.t('pdfArmholeDepth')}: ${m.armholeDepth}"`,
        `${this.t('pdfSleeveLength')}: ${m.sleeveLength}"`,
      ];
      measurements.forEach((text) => {
        this.pdf.text(text, this.margin + 5, this.yPosition);
        this.yPosition += 6;
      });
    }
  }

  // Render abbreviations and instructions
  private renderInstructionsPages(pattern: Pattern) {
    this.pdf.addPage();

    // Page background
    this.setFillColor(COLORS.parchment);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

    this.yPosition = this.margin;
    this.addPageHeader();
    this.yPosition = 25;

    // Abbreviations section
    this.pdf.setFont('times', 'bold');
    this.pdf.setFontSize(18);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(this.t('pdfAbbreviations'), this.margin, this.yPosition);

    this.yPosition += 3;
    this.setDrawColor(COLORS.terracotta);
    this.pdf.setLineWidth(0.8);
    this.pdf.line(this.margin, this.yPosition, this.margin + 35, this.yPosition);

    this.yPosition += 10;

    // Two-column abbreviations
    const abbrevEntries = Object.entries(pattern.instructions.abbreviations);
    const midPoint = Math.ceil(abbrevEntries.length / 2);
    const leftCol = abbrevEntries.slice(0, midPoint);
    const rightCol = abbrevEntries.slice(midPoint);

    const startY = this.yPosition;
    const colWidth = this.contentWidth / 2 - 5;

    // Left column
    leftCol.forEach(([abbr, full]) => {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(9);
      this.setTextColor(COLORS.terracotta);
      this.pdf.text(abbr, this.margin, this.yPosition);

      this.pdf.setFont('times', 'normal');
      this.pdf.setFontSize(9);
      this.setTextColor(COLORS.walnut);
      this.pdf.text(` — ${full}`, this.margin + 12, this.yPosition);

      this.yPosition += 5;
    });

    // Right column
    this.yPosition = startY;
    rightCol.forEach(([abbr, full]) => {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(9);
      this.setTextColor(COLORS.terracotta);
      this.pdf.text(abbr, this.margin + colWidth + 10, this.yPosition);

      this.pdf.setFont('times', 'normal');
      this.pdf.setFontSize(9);
      this.setTextColor(COLORS.walnut);
      this.pdf.text(` — ${full}`, this.margin + colWidth + 22, this.yPosition);

      this.yPosition += 5;
    });

    this.yPosition = startY + Math.max(leftCol.length, rightCol.length) * 5 + 15;

    // Pattern instructions
    this.drawDivider(this.yPosition - 5, 'ornate');
    this.yPosition += 10;

    this.pdf.setFont('times', 'bold');
    this.pdf.setFontSize(18);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(this.t('pdfPatternInstructions'), this.margin, this.yPosition);

    this.yPosition += 3;
    this.setDrawColor(COLORS.terracotta);
    this.pdf.setLineWidth(0.8);
    this.pdf.line(this.margin, this.yPosition, this.margin + 50, this.yPosition);

    this.yPosition += 12;

    // Render each section
    pattern.instructions.sections.forEach((section, sectionIdx) => {
      this.checkNewPage(25);

      // Section number badge
      this.setFillColor(COLORS.terracotta);
      const badgeX = this.margin;
      const badgeY = this.yPosition - 5;
      this.pdf.roundedRect(badgeX, badgeY, 7, 7, 1, 1, 'F');

      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(9);
      this.setTextColor('#FFFFFF');
      this.pdf.text(`${sectionIdx + 1}`, badgeX + 2.3, this.yPosition);

      // Section title (translated)
      this.pdf.setFont('times', 'bold');
      this.pdf.setFontSize(13);
      this.setTextColor(COLORS.espresso);
      this.pdf.text(this.getSectionTitle(section.title), this.margin + 12, this.yPosition);

      this.yPosition += 8;

      // Steps
      section.steps.forEach((step, stepIdx) => {
        this.checkNewPage(10);

        // Step marker - small dot
        this.setFillColor(COLORS.copper);
        this.pdf.circle(this.margin + 5, this.yPosition - 1, 1, 'F');

        // Step text - wrapped
        this.pdf.setFont('times', 'normal');
        this.pdf.setFontSize(10);
        this.setTextColor(COLORS.espresso);

        const stepLines = this.pdf.splitTextToSize(step, this.contentWidth - 15);
        stepLines.forEach((line: string, lineIdx: number) => {
          if (lineIdx > 0) this.checkNewPage(5);
          this.pdf.text(line, this.margin + 10, this.yPosition);
          this.yPosition += 4.5;
        });

        this.yPosition += 2;
      });

      this.yPosition += 8;
    });
  }

  // Render chart page
  private renderChartPage(pattern: Pattern, chartCanvasElement?: HTMLCanvasElement) {
    this.pdf.addPage();

    // Page background
    this.setFillColor(COLORS.parchment);
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

    this.yPosition = this.margin;
    this.addPageHeader();
    this.yPosition = 25;

    // Section title
    this.pdf.setFont('times', 'bold');
    this.pdf.setFontSize(18);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(this.t('pdfColorworkChart'), this.margin, this.yPosition);

    this.yPosition += 3;
    this.setDrawColor(COLORS.terracotta);
    this.pdf.setLineWidth(0.8);
    this.pdf.line(this.margin, this.yPosition, this.margin + 42, this.yPosition);

    // Chart dimensions
    this.yPosition += 8;
    this.pdf.setFont('times', 'italic');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.walnut);
    this.pdf.text(`${pattern.chart.width} ${this.t('pdfStitchesWide')} × ${pattern.chart.height} ${this.t('pdfRowsTall')}`, this.margin, this.yPosition);

    // Reading instructions box
    this.yPosition += 10;
    const readingBoxY = this.yPosition;

    this.setFillColor(COLORS.cream);
    this.setDrawColor(COLORS.sage);
    this.pdf.setLineWidth(0.4);
    this.pdf.roundedRect(this.margin, readingBoxY, this.contentWidth, 16, 2, 2, 'FD');

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(8);
    this.setTextColor(COLORS.sage);
    this.pdf.text(this.t('pdfHowToRead'), this.margin + 5, readingBoxY + 5);

    this.pdf.setFont('times', 'normal');
    this.pdf.setFontSize(9);
    this.setTextColor(COLORS.espresso);
    // Beanies are knit in the round - all rounds are RS, read right to left
    const chartReadingText = pattern.garmentType === 'beanie'
      ? this.t('pdfAllRoundsRS')
      : `${this.t('pdfOddRows')}    •    ${this.t('pdfEvenRows')}`;
    this.pdf.text(chartReadingText, this.margin + 5, readingBoxY + 12);

    this.yPosition = readingBoxY + 22;

    // Add chart image
    if (chartCanvasElement) {
      try {
        const chartImage = chartCanvasElement.toDataURL('image/png');
        const maxChartWidth = this.contentWidth - 10;
        const aspectRatio = pattern.chart.height / pattern.chart.width;
        let chartWidth = maxChartWidth;
        let chartHeight = chartWidth * aspectRatio;

        // Cap height
        const maxHeight = this.pageHeight - this.yPosition - 65;
        if (chartHeight > maxHeight) {
          chartHeight = maxHeight;
          chartWidth = chartHeight / aspectRatio;
        }

        // Chart frame
        const chartX = this.margin + (this.contentWidth - chartWidth) / 2;
        const framepadding = 4;

        // Outer decorative frame
        this.setDrawColor(COLORS.walnut);
        this.pdf.setLineWidth(0.6);
        this.pdf.rect(chartX - framepadding - 1, this.yPosition - framepadding - 1, chartWidth + framepadding * 2 + 2, chartHeight + framepadding * 2 + 2);

        // Inner frame
        this.setDrawColor(COLORS.dustyRose);
        this.pdf.setLineWidth(0.3);
        this.pdf.rect(chartX - framepadding + 1, this.yPosition - framepadding + 1, chartWidth + framepadding * 2 - 2, chartHeight + framepadding * 2 - 2);

        // White background for chart
        this.setFillColor('#FFFFFF');
        this.pdf.rect(chartX, this.yPosition, chartWidth, chartHeight, 'F');

        // Chart image
        this.pdf.addImage(chartImage, 'PNG', chartX, this.yPosition, chartWidth, chartHeight);

        this.yPosition += chartHeight + 15;
      } catch (error) {
        console.error('Failed to add chart image:', error);
        this.pdf.setFont('times', 'italic');
        this.pdf.setFontSize(10);
        this.setTextColor(COLORS.walnut);
        this.pdf.text(this.t('pdfChartNotAvailable'), this.pageWidth / 2, this.yPosition + 20, { align: 'center' });
        this.yPosition += 40;
      }
    }

    // Color legend
    this.checkNewPage(40);

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.setTextColor(COLORS.espresso);
    this.pdf.text(this.t('pdfColorKey'), this.margin, this.yPosition);

    this.yPosition += 8;

    // Get unique colors
    const uniqueColors = Array.from(
      new Map(pattern.chart.colorMap.map((color) => [color.hex, color])).values()
    );

    // Display colors in a grid
    const swatchSize = 10;
    const itemWidth = 55;
    const itemsPerRow = Math.floor(this.contentWidth / itemWidth);

    uniqueColors.forEach((color, idx) => {
      const row = Math.floor(idx / itemsPerRow);
      const col = idx % itemsPerRow;

      if (col === 0 && row > 0) {
        this.yPosition += 14;
        this.checkNewPage(14);
      }

      const xPos = this.margin + col * itemWidth;
      const yPos = this.yPosition;

      // Color swatch with shadow
      this.setFillColor(COLORS.shadow);
      this.pdf.roundedRect(xPos + 0.5, yPos - swatchSize + 2.5, swatchSize, swatchSize, 1.5, 1.5, 'F');

      this.setFillColor(color.hex);
      this.setDrawColor(COLORS.walnut);
      this.pdf.setLineWidth(0.3);
      this.pdf.roundedRect(xPos, yPos - swatchSize + 2, swatchSize, swatchSize, 1.5, 1.5, 'FD');

      // Color name
      this.pdf.setFont('times', 'normal');
      this.pdf.setFontSize(9);
      this.setTextColor(COLORS.espresso);
      this.pdf.text(color.name, xPos + swatchSize + 3, yPos);
    });
  }

  // Add footer to all pages
  private addFooters(pattern: Pattern) {
    const totalPages = this.pdf.getNumberOfPages();
    const garmentTitle = this.getGarmentTitle(pattern.garmentType);

    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);

      // Footer divider line
      this.setDrawColor(COLORS.dustyRose);
      this.pdf.setLineWidth(0.3);
      this.pdf.line(this.margin, this.pageHeight - 14, this.pageWidth - this.margin, this.pageHeight - 14);

      // Left: Brand
      this.pdf.setFont('times', 'italic');
      this.pdf.setFontSize(8);
      this.setTextColor(COLORS.walnut);
      this.pdf.text(this.t('pdfBrandStudio'), this.margin, this.pageHeight - 9);

      // Center: Pattern name (skip on cover)
      if (i > 1) {
        this.pdf.setFont('times', 'normal');
        this.setTextColor(COLORS.dustyRose);
        this.pdf.text(`${garmentTitle} · ${this.t('pdfSize')} ${pattern.size}`, this.pageWidth / 2, this.pageHeight - 9, { align: 'center' });
      }

      // Right: Page number
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(8);
      this.setTextColor(COLORS.walnut);
      this.pdf.text(`${i} / ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 9, { align: 'right' });
    }
  }

  // Main render method
  public render(pattern: Pattern, chartCanvasElement?: HTMLCanvasElement): Blob {
    this.renderCoverPage(pattern);
    this.renderMaterialsPage(pattern);
    this.renderInstructionsPages(pattern);
    this.renderChartPage(pattern, chartCanvasElement);
    this.addFooters(pattern);

    return this.pdf.output('blob');
  }
}

/**
 * Generate a professional styled PDF pattern with artisan heritage design
 */
export async function generatePatternPDF(
  pattern: Pattern,
  chartCanvasElement?: HTMLCanvasElement,
  language: Language = 'en'
): Promise<Blob> {
  const renderer = new PatternPDFRenderer(language);
  return renderer.render(pattern, chartCanvasElement);
}

/**
 * Download a pattern as PDF file
 */
export async function downloadPatternPDF(
  pattern: Pattern,
  chartCanvasElement?: HTMLCanvasElement,
  language: Language = 'en'
): Promise<void> {
  const pdfBlob = await generatePatternPDF(pattern, chartCanvasElement, language);

  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `knitcraft-${pattern.garmentType}-${pattern.size}-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
