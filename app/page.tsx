'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import ImageUpload from '@/components/ImageUpload';
import ChartVisualizer, { ChartVisualizerRef } from '@/components/ChartVisualizer';
import CustomizationPanel from '@/components/CustomizationPanel';
import GarmentVisualizer from '@/components/GarmentVisualizer';
import ProjectManager from '@/components/ProjectManager';
import { downloadPatternPDF } from '@/lib/pdf/patternPDF';
import { imageFileToChart, imageDataUrlToChart } from '@/lib/image-processing/chartGenerator';
import { generateBeaniePattern } from '@/lib/pattern-generation/beanieGenerator';
import { generateScarfPattern } from '@/lib/pattern-generation/scarfGenerator';
import { generateSweaterPattern } from '@/lib/pattern-generation/sweaterGenerator';
import { validatePattern } from '@/lib/pattern-generation/patternValidator';
import { BEANIE_MEASUREMENTS, SCARF_MEASUREMENTS, SWEATER_MEASUREMENTS } from '@/lib/knitting/measurements';
import { GarmentType, Size, Gauge, CustomMeasurements } from '@/lib/types';
import { fileToDataUrl } from '@/lib/projectStorage';

export default function Home() {
  const [step, setStep] = useState<'upload' | 'customize' | 'preview'>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartVisualizerRef = useRef<ChartVisualizerRef>(null);

  const {
    uploadedImage,
    imageDataUrl,
    chart,
    selectedGarment,
    selectedSize,
    selectedGauge,
    customMeasurements,
    useCustomMeasurements,
    pattern,
    setChart,
    setPattern,
    setImageDataUrl,
  } = useStore();

  // Determine if we have an image (either uploaded or from a loaded project)
  const hasImage = uploadedImage !== null || imageDataUrl !== null;

  // Handle project loaded - navigate to appropriate step
  const handleProjectLoaded = () => {
    const state = useStore.getState();
    if (state.pattern) {
      setStep('preview');
    } else if (state.chart) {
      setStep('customize');
    } else {
      setStep('upload');
    }
  };

  const getMeasurements = () => {
    // If using custom measurements and they exist for this garment, use them
    if (useCustomMeasurements && customMeasurements?.[selectedGarment]) {
      return customMeasurements[selectedGarment];
    }

    // Otherwise use standard measurements
    if (selectedGarment === 'beanie') {
      return BEANIE_MEASUREMENTS[selectedSize as 'S' | 'M' | 'L'];
    } else if (selectedGarment === 'scarf') {
      return SCARF_MEASUREMENTS[selectedSize as keyof typeof SCARF_MEASUREMENTS];
    } else {
      return SWEATER_MEASUREMENTS[selectedSize as keyof typeof SWEATER_MEASUREMENTS];
    }
  };

  const calculateMaxChartDimensions = (): { maxWidth: number; maxHeight: number } => {
    const measurements = getMeasurements();

    if (selectedGarment === 'beanie') {
      const beanieM = measurements as typeof BEANIE_MEASUREMENTS.M;
      const circumferenceInches = beanieM.circumference * 0.9; // 10% negative ease
      const bodyHeight = beanieM.height - beanieM.brimDepth - 2; // Subtract brim and crown

      const maxWidth = Math.floor(circumferenceInches * selectedGauge.stitchesPerInch);
      const maxHeight = Math.floor(bodyHeight * selectedGauge.rowsPerInch);

      return { maxWidth, maxHeight };
    } else if (selectedGarment === 'scarf') {
      const scarfM = measurements as typeof SCARF_MEASUREMENTS.standard;
      const maxWidth = Math.floor((scarfM.width - 1) * selectedGauge.stitchesPerInch);
      const maxHeight = Math.floor(scarfM.length * selectedGauge.rowsPerInch);

      return { maxWidth, maxHeight };
    } else {
      const sweaterM = measurements as typeof SWEATER_MEASUREMENTS.M;
      const maxWidth = Math.floor((sweaterM.chest / 2) * selectedGauge.stitchesPerInch);
      const maxHeight = Math.floor((sweaterM.length - 2) * selectedGauge.rowsPerInch);

      return { maxWidth, maxHeight };
    }
  };

  const handleProcessImage = async () => {
    if (!hasImage) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate maximum dimensions based on garment, size, and gauge
      const { maxWidth, maxHeight } = calculateMaxChartDimensions();

      // Use conservative target width (smaller than max to ensure it fits)
      let targetWidth = Math.floor(maxWidth * 0.8);

      let generatedChart;

      if (uploadedImage) {
        // Convert and store as data URL for saving
        const dataUrl = await fileToDataUrl(uploadedImage);
        setImageDataUrl(dataUrl);
        generatedChart = await imageFileToChart(uploadedImage, targetWidth, 6, maxHeight);
      } else if (imageDataUrl) {
        // Process from data URL (loaded project)
        generatedChart = await imageDataUrlToChart(imageDataUrl, targetWidth, 6, maxHeight);
      }

      if (generatedChart) {
        setChart(generatedChart);
        setStep('customize');
      }
    } catch (err) {
      setError('Failed to process image. Please try a different image.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePattern = () => {
    if (!chart) {
      setError('No chart available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let generatedPattern;
      const measurements = getMeasurements();

      if (selectedGarment === 'beanie') {
        generatedPattern = generateBeaniePattern(
          chart,
          selectedSize as 'S' | 'M' | 'L',
          selectedGauge,
          useCustomMeasurements ? measurements as typeof BEANIE_MEASUREMENTS.M : undefined
        );
      } else if (selectedGarment === 'scarf') {
        generatedPattern = generateScarfPattern(
          chart,
          selectedSize as 'standard' | 'wide' | 'narrow',
          selectedGauge,
          useCustomMeasurements ? measurements as typeof SCARF_MEASUREMENTS.standard : undefined
        );
      } else {
        generatedPattern = generateSweaterPattern(
          chart,
          selectedSize as any,
          selectedGauge,
          useCustomMeasurements ? measurements as typeof SWEATER_MEASUREMENTS.M : undefined
        );
      }

      // Validate the generated pattern
      const validation = validatePattern(generatedPattern);

      if (!validation.isValid) {
        setError(`Pattern validation failed: ${validation.errors.join(', ')}`);
        console.error('Pattern validation errors:', validation.errors);
        return;
      }

      // Log warnings but don't block
      if (validation.warnings.length > 0) {
        console.warn('Pattern validation warnings:', validation.warnings);
      }

      setPattern(generatedPattern);
      setStep('preview');
    } catch (err) {
      setError('Failed to generate pattern');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pattern) {
      setError('No pattern available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const canvas = chartVisualizerRef.current?.getCanvas();
      await downloadPatternPDF(pattern, canvas || undefined);
    } catch (err) {
      setError('Failed to generate PDF');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadText = () => {
    if (!pattern) {
      setError('No pattern available');
      return;
    }

    const text = formatPatternAsText(pattern);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pattern.garmentType}-pattern-${pattern.size}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Knitting Pattern Generator
          </h1>
          <p className="text-lg text-gray-600">
            Turn any image into a custom knitting pattern
          </p>
        </div>

        {/* Project Manager */}
        <div className="max-w-4xl mx-auto mb-6">
          <ProjectManager onProjectLoaded={handleProjectLoaded} />
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <StepIndicator number={1} label="Upload" active={step === 'upload'} />
            <div className="w-12 h-0.5 bg-gray-300" />
            <StepIndicator number={2} label="Customize" active={step === 'customize'} />
            <div className="w-12 h-0.5 bg-gray-300" />
            <StepIndicator number={3} label="Preview" active={step === 'preview'} />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <ImageUpload />
            {/* Show preview for loaded project with imageDataUrl */}
            {!uploadedImage && imageDataUrl && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Loaded image from project:</p>
                <img
                  src={imageDataUrl}
                  alt="Loaded from project"
                  className="max-h-48 mx-auto rounded"
                />
              </div>
            )}
            {hasImage && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleProcessImage}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Process Image →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Customize */}
        {step === 'customize' && chart && (
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Chart</h2>
              <ChartVisualizer chart={chart} />
            </div>
            <div>
              <CustomizationPanel />
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setStep('upload')}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGeneratePattern}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate Pattern →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && pattern && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Your Pattern</h2>

            {/* Garment Visualizer */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <GarmentVisualizer pattern={pattern} />
            </div>

            {/* Chart Visualization */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Chart Visualization</h3>
              <ChartVisualizer ref={chartVisualizerRef} chart={pattern.chart} />
            </div>

            {/* Full Pattern Text Display */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
              <h3 className="text-xl font-semibold mb-4">Complete Pattern Instructions</h3>
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {formatPatternAsText(pattern)}
              </pre>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('customize')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                ← Edit Pattern
              </button>
              <button
                onClick={handleDownloadText}
                disabled={loading}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Download as Text
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating PDF...' : 'Download as PDF'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StepIndicator({
  number,
  label,
  active,
}: {
  number: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
        w-10 h-10 rounded-full flex items-center justify-center font-semibold
        ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
      `}
      >
        {number}
      </div>
      <span className="text-sm mt-1">{label}</span>
    </div>
  );
}

function formatPatternAsText(pattern: any): string {
  let text = `${pattern.garmentType.toUpperCase()} KNITTING PATTERN\n`;
  text += `Size: ${pattern.size}\n`;
  text += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  text += `MATERIALS\n`;
  text += `Yarn Required (ESTIMATE - buy extra to be safe):\n`;
  pattern.materials.yardage.colorBreakdown.forEach((item: any) => {
    text += `  - ${item.color.name}: ~${item.yards} yards\n`;
  });
  text += `Estimated Total: ~${pattern.materials.yardage.totalYards} yards\n`;
  text += `\n`;
  text += `Suggested Skeins (220 yards each):\n`;
  pattern.materials.yardage.colorBreakdown.forEach((item: any) => {
    text += `  - ${item.color.name}: ${item.skeins} skein${item.skeins > 1 ? 's' : ''}\n`;
  });
  text += `Note: Actual yardage varies by tension and yarn. When in doubt, buy an extra skein.\n`;
  text += `\n`;
  text += `Needles: ${pattern.materials.needles}\n`;
  text += `Notions: ${pattern.materials.notions.join(', ')}\n\n`;

  text += `GAUGE\n`;
  text += `${pattern.gauge.stitchesPerInch} stitches × ${pattern.gauge.rowsPerInch} rows per inch in stockinette stitch\n\n`;

  text += `ABBREVIATIONS\n`;
  Object.entries(pattern.instructions.abbreviations).forEach(([abbr, full]) => {
    text += `${abbr} = ${full}\n`;
  });
  text += `\n`;

  text += `INSTRUCTIONS\n\n`;
  pattern.instructions.sections.forEach((section: any) => {
    text += `${section.title.toUpperCase()}\n`;
    section.steps.forEach((step: string, idx: number) => {
      text += `${idx + 1}. ${step}\n`;
    });
    text += `\n`;
  });

  text += `CHART\n`;
  text += `Chart is ${pattern.chart.width} stitches wide × ${pattern.chart.height} rows tall\n`;
  text += `See attached chart visualization for colorwork pattern.\n\n`;

  text += `This pattern was generated by the Knitting Pattern Generator.\n`;
  text += `Please knit a gauge swatch and adjust needle size if necessary.\n`;

  return text;
}
