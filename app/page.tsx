'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import ImageUpload from '@/components/ImageUpload';
import ChartVisualizer, { ChartVisualizerRef } from '@/components/ChartVisualizer';
import CustomizationPanel from '@/components/CustomizationPanel';
import WelcomeScreen from '@/components/WelcomeScreen';
import LanguageButton from '@/components/LanguageButton';
import ErrorMessage from '@/components/ErrorMessage';
import DifficultyPreview from '@/components/DifficultyPreview';
import Confetti from '@/components/Confetti';
import ShareButtons from '@/components/ShareButtons';
import WhatsNext from '@/components/WhatsNext';
import { downloadPatternPDF } from '@/lib/pdf/patternPDF';
import { imageFileToChart, imageDataUrlToChart } from '@/lib/image-processing/chartGenerator';
import { generateBeaniePattern } from '@/lib/pattern-generation/beanieGenerator';
import { generateScarfPattern } from '@/lib/pattern-generation/scarfGenerator';
import { generateSweaterPattern } from '@/lib/pattern-generation/sweaterGenerator';
import { validatePattern } from '@/lib/pattern-generation/patternValidator';
import { BEANIE_MEASUREMENTS, SCARF_MEASUREMENTS, SWEATER_MEASUREMENTS } from '@/lib/knitting/measurements';
import { GarmentType, Size, Gauge, CustomMeasurements } from '@/lib/types';

export default function Home() {
  const [step, setStep] = useState<'upload' | 'customize' | 'preview'>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const chartVisualizerRef = useRef<ChartVisualizerRef>(null);

  const {
    hasSeenWelcome,
    setHasSeenWelcome,
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
    reset,
    language,
  } = useStore();

  const { t } = useTranslation();

  // Check localStorage for welcome state on mount
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenWelcome') === 'true';
    if (seen) {
      setHasSeenWelcome(true);
    }
  }, [setHasSeenWelcome]);

  // Handle logo click - go back to start
  const handleLogoClick = () => {
    reset();
    setStep('upload');
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

    // Minimum chart dimensions to preserve pattern detail (but not exceed garment constraints)
    const MIN_CHART_WIDTH = 40;
    const MIN_CHART_HEIGHT = 20;

    let maxWidth: number;
    let maxHeight: number;

    if (selectedGarment === 'beanie') {
      const beanieM = measurements as typeof BEANIE_MEASUREMENTS.M;
      const circumferenceInches = beanieM.circumference * 0.9; // 10% negative ease
      const bodyHeight = beanieM.height - beanieM.brimDepth - 2; // Subtract brim and crown

      maxWidth = Math.floor(circumferenceInches * selectedGauge.stitchesPerInch);
      maxHeight = Math.floor(bodyHeight * selectedGauge.rowsPerInch);
    } else if (selectedGarment === 'scarf') {
      const scarfM = measurements as typeof SCARF_MEASUREMENTS.standard;
      maxWidth = Math.floor((scarfM.width - 1) * selectedGauge.stitchesPerInch);
      maxHeight = Math.floor(scarfM.length * selectedGauge.rowsPerInch);
    } else {
      const sweaterM = measurements as typeof SWEATER_MEASUREMENTS.M;
      maxWidth = Math.floor((sweaterM.chest / 2) * selectedGauge.stitchesPerInch);
      maxHeight = Math.floor((sweaterM.length - 2) * selectedGauge.rowsPerInch);
    }

    // For width, use minimum to preserve detail if garment allows
    // For height, strictly respect the garment constraint (no minimum override)
    return {
      maxWidth: Math.max(maxWidth, MIN_CHART_WIDTH),
      maxHeight: maxHeight
    };
  };

  const handleProcessImage = async () => {
    if (!uploadedImage && !imageDataUrl) {
      setError(t('uploadImageFirst'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate maximum dimensions based on garment, size, and gauge
      const { maxWidth, maxHeight } = calculateMaxChartDimensions();

      // Use conservative target width (smaller than max to ensure it fits)
      const targetWidth = Math.floor(maxWidth * 0.8);

      let generatedChart;
      if (uploadedImage) {
        generatedChart = await imageFileToChart(uploadedImage, targetWidth, 6, maxHeight);
      } else if (imageDataUrl) {
        generatedChart = await imageDataUrlToChart(imageDataUrl, targetWidth, 6, maxHeight);
      }

      if (generatedChart) {
        setChart(generatedChart);
        setStep('customize');
      }
    } catch (err) {
      setError(t('failedToProcess'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePattern = () => {
    if (!chart) {
      setError(t('noChartAvailable'));
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
        setError(`${t('patternValidationFailed')}: ${validation.errors.join(', ')}`);
        console.error('Pattern validation errors:', validation.errors);
        return;
      }

      // Log warnings but don't block
      if (validation.warnings.length > 0) {
        console.warn('Pattern validation warnings:', validation.warnings);
      }

      setPattern(generatedPattern);
      setStep('preview');
      setShowConfetti(true);
      setDownloadComplete(false);
    } catch (err) {
      setError(t('failedToGeneratePattern'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pattern) {
      setError(t('noPatternAvailable'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const canvas = chartVisualizerRef.current?.getCanvas();
      await downloadPatternPDF(pattern, canvas || undefined, language);
      setDownloadComplete(true);
    } catch (err) {
      setError(t('failedToGeneratePDF'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNew = () => {
    reset();
    setStep('upload');
    setDownloadComplete(false);
    setShowConfetti(false);
  };

  // Show welcome screen for new users
  if (!hasSeenWelcome) {
    return <WelcomeScreen onGetStarted={() => setHasSeenWelcome(true)} />;
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <div className="app-container">
        {/* Top Bar with Logo */}
        <div
          className="top-bar"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            padding: '10px 16px',
            background: 'var(--color-card)',
            borderBottom: '1px solid var(--color-card-border)',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handleLogoClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                style={{ color: 'var(--color-primary)' }}
              >
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
                <path
                  d="M10 12C10 12 12 20 16 20C20 20 22 12 22 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="12" r="2" fill="currentColor" />
                <circle cx="22" cy="12" r="2" fill="currentColor" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                }}
              >
                {t('appName')}
              </span>
            </button>
            <LanguageButton />
          </div>
        </div>

        <div className="main-content" style={{ maxWidth: step === 'customize' ? '1000px' : '600px', margin: '0 auto', padding: '16px 12px' }}>
          {/* Header with Stepper */}
          <header className="header-section" style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h1
              className="app-title"
              style={{
                fontSize: '26px',
                fontWeight: 700,
                marginBottom: '4px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
              }}
            >
              {t('patternGenerator')}
            </h1>
            <p className="app-subtitle" style={{ fontSize: '12px', marginBottom: '10px', color: 'var(--color-text-secondary)' }}>
              {t('tagline')}
            </p>

            {/* Compact Inline Stepper */}
            <div
              className="stepper-container"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                background: 'var(--color-card)',
                borderRadius: '999px',
                border: '1px solid var(--color-card-border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <StepIndicator number={1} label={t('stepUpload')} active={step === 'upload'} completed={step !== 'upload'} />
              <div
                className="stepper-line"
                style={{
                  width: '20px',
                  height: '2px',
                  background: step !== 'upload' ? 'var(--color-primary)' : 'var(--color-card-border)',
                  borderRadius: '1px',
                }}
              />
              <StepIndicator number={2} label={t('stepCustomize')} active={step === 'customize'} completed={step === 'preview'} />
              <div
                className="stepper-line"
                style={{
                  width: '20px',
                  height: '2px',
                  background: step === 'preview' ? 'var(--color-primary)' : 'var(--color-card-border)',
                  borderRadius: '1px',
                }}
              />
              <StepIndicator number={3} label={t('stepPreview')} active={step === 'preview'} completed={false} />
            </div>
          </header>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <ErrorMessage
              message={error}
              onDismiss={() => setError(null)}
              onRetry={step === 'upload' ? handleProcessImage : step === 'customize' ? handleGeneratePattern : handleDownloadPDF}
            />
          </div>
        )}

        {/* Confetti Celebration */}
        <Confetti active={showConfetti} />

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="upload-step-container max-w-2xl mx-auto">
            <ImageUpload />
            {(uploadedImage || imageDataUrl) && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleProcessImage}
                  disabled={loading}
                  className="btn-primary px-6 py-2"
                >
                  {loading ? t('processing') : t('processImage')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Customize */}
        {step === 'customize' && chart && (
          <div>
            {/* Mobile: Stack vertically, Desktop: Side by side */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '24px',
              alignItems: 'start',
            }}>
              {/* Chart Section */}
              <div>
                <ChartVisualizer chart={chart} />
              </div>

              {/* Customization Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CustomizationPanel />
                <DifficultyPreview />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setStep('upload')}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '10px',
                      border: '1px solid var(--color-card-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-text)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t('back')}
                  </button>
                  <button
                    onClick={handleGeneratePattern}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 8px rgba(146, 64, 14, 0.25)',
                    }}
                  >
                    {loading ? t('generating') : t('generatePattern')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && pattern && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            {/* Success Card */}
            <div
              className="card"
              style={{
                textAlign: 'center',
                marginBottom: '16px',
                padding: '32px 24px',
              }}
            >
              {/* Animated Checkmark */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'scale-in 0.5s ease-out',
                  boxShadow: '0 4px 20px rgba(146, 64, 14, 0.3)',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  style={{
                    strokeDasharray: 50,
                    animation: 'draw-check 0.5s ease-out 0.3s forwards',
                  }}
                >
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '4px',
                }}
              >
                {t('patternReady')}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: 0 }}>
                {pattern.garmentType === 'beanie' ? t('beanie') : pattern.garmentType === 'scarf' ? t('scarf') : t('sweater')} · {t('size')} {pattern.size} · {pattern.gauge.yarnWeight.charAt(0).toUpperCase() + pattern.gauge.yarnWeight.slice(1)}
              </p>
            </div>

            {/* Chart Preview */}
            <div style={{ marginBottom: '16px' }}>
              <ChartVisualizer ref={chartVisualizerRef} chart={pattern.chart} />
            </div>

            {/* Quick Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div
                className="card"
                style={{
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {pattern.chart.colorMap.length}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{t('colors')}</div>
              </div>
              <div
                className="card"
                style={{
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  ~{pattern.materials.yardage.totalYards}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{t('yards')}</div>
              </div>
              <div
                className="card"
                style={{
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {pattern.materials.yardage.colorBreakdown.reduce((acc, item) => acc + item.skeins, 0)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{t('skeins')}</div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {loading ? t('generating') : t('downloadPDF')}
            </button>

            {/* Back Button */}
            <button
              onClick={() => setStep('customize')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--color-card-border)',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {t('backToSettings')}
            </button>

            {/* Share Buttons */}
            <ShareButtons
              patternName={pattern.garmentType === 'beanie' ? t('beanie') : pattern.garmentType === 'scarf' ? t('scarf') : t('sweater')}
            />

            {/* What's Next - shown after download */}
            {downloadComplete && (
              <WhatsNext
                garmentType={pattern.garmentType}
                onStartNew={handleStartNew}
              />
            )}
          </div>
        )}

        </div>
      </div>
    </main>
  );
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 700,
          background: active
            ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)'
            : completed
            ? 'var(--color-primary)'
            : 'var(--color-background-secondary)',
          color: active || completed ? 'var(--color-button-text)' : 'var(--color-text-muted)',
          border: !active && !completed ? '1.5px solid var(--color-card-border)' : 'none',
          boxShadow: active ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        {completed && !active ? '✓' : number}
      </div>
      <span
        className="step-label"
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: active ? 'var(--color-primary)' : completed ? 'var(--color-text)' : 'var(--color-text-muted)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

