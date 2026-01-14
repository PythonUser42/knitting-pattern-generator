'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { CustomGauge, Gauge } from '@/lib/types';
import { STANDARD_GAUGES } from '@/lib/knitting/measurements';

export default function GaugeCalculator() {
  const {
    selectedGauge,
    customGauge,
    setSelectedGauge,
    setCustomGauge,
  } = useStore();

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [swatchStitches, setSwatchStitches] = useState(customGauge?.swatchStitches?.toString() || '');
  const [swatchRows, setSwatchRows] = useState(customGauge?.swatchRows?.toString() || '');
  const [swatchWidth, setSwatchWidth] = useState(customGauge?.swatchWidthInches?.toString() || '');
  const [swatchHeight, setSwatchHeight] = useState(customGauge?.swatchHeightInches?.toString() || '');

  const calculateGauge = () => {
    const stitches = parseFloat(swatchStitches);
    const rows = parseFloat(swatchRows);
    const width = parseFloat(swatchWidth);
    const height = parseFloat(swatchHeight);

    if (!stitches || !rows || !width || !height) return null;
    if (width <= 0 || height <= 0) return null;

    const stitchesPerInch = stitches / width;
    const rowsPerInch = rows / height;

    return { stitchesPerInch, rowsPerInch };
  };

  const calculated = calculateGauge();

  const handleApplyGauge = () => {
    if (!calculated) return;

    const newCustomGauge: CustomGauge = {
      swatchStitches: parseFloat(swatchStitches),
      swatchRows: parseFloat(swatchRows),
      swatchWidthInches: parseFloat(swatchWidth),
      swatchHeightInches: parseFloat(swatchHeight),
      stitchesPerInch: calculated.stitchesPerInch,
      rowsPerInch: calculated.rowsPerInch,
    };

    setCustomGauge(newCustomGauge);

    // Update the selected gauge with custom values
    setSelectedGauge({
      ...selectedGauge,
      stitchesPerInch: Math.round(calculated.stitchesPerInch * 10) / 10,
      rowsPerInch: Math.round(calculated.rowsPerInch * 10) / 10,
    });

    setIsOpen(false);
  };

  const handleClearCustomGauge = () => {
    setCustomGauge(null);
    setSelectedGauge(STANDARD_GAUGES[selectedGauge.yarnWeight]);
    setSwatchStitches('');
    setSwatchRows('');
    setSwatchWidth('');
    setSwatchHeight('');
  };

  const hasValidInput = calculated !== null;
  const isUsingCustomGauge = customGauge !== null;

  return (
    <div className="space-y-3">
      {/* Current Gauge Display */}
      <div
        className="p-4"
        style={{
          backgroundColor: isUsingCustomGauge ? 'rgba(5, 150, 105, 0.1)' : 'var(--color-background-secondary)',
          border: isUsingCustomGauge ? '1px solid var(--color-success)' : '1px solid var(--color-card-border)',
          borderRadius: 'var(--border-radius)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4
            className="font-medium text-sm"
            style={{ color: 'var(--color-text)' }}
          >
            {isUsingCustomGauge ? t('yourGauge') : t('standardGauge')}
          </h4>
          {isUsingCustomGauge && (
            <span
              className="text-xs text-white px-2 py-0.5 rounded"
              style={{ backgroundColor: 'var(--color-success)' }}
            >
              {t('custom')}
            </span>
          )}
        </div>
        <div className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
          <p>{selectedGauge.stitchesPerInch} {t('stitchesPerInch')}</p>
          <p>{selectedGauge.rowsPerInch} {t('rowsPerInch')}</p>
        </div>
        {isUsingCustomGauge && (
          <button
            onClick={handleClearCustomGauge}
            className="text-xs mt-2"
            style={{ color: 'var(--color-error)' }}
          >
            {t('resetToStandard')}
          </button>
        )}
      </div>

      {/* Toggle Calculator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-sm flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-card-border)',
          borderRadius: 'var(--border-radius)',
          color: 'var(--color-text)',
        }}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
{t('calculateFromSwatch')}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Calculator Panel */}
      {isOpen && (
        <div
          className="p-4 space-y-4"
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-card-border)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
              {t('howToMeasure')}
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>{t('swatchInstr1')}</li>
              <li>{t('swatchInstr2')}</li>
              <li>{t('swatchInstr3')}</li>
              <li>{t('swatchInstr4')}</li>
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                {t('stitchesCounted')}
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={swatchStitches}
                onChange={(e) => setSwatchStitches(e.target.value)}
                placeholder="e.g., 20"
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                {t('overWidth')}
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                value={swatchWidth}
                onChange={(e) => setSwatchWidth(e.target.value)}
                placeholder="e.g., 4"
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                {t('rowsCounted')}
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={swatchRows}
                onChange={(e) => setSwatchRows(e.target.value)}
                placeholder="e.g., 28"
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                {t('overHeight')}
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                value={swatchHeight}
                onChange={(e) => setSwatchHeight(e.target.value)}
                placeholder="e.g., 4"
                className="w-full text-sm"
              />
            </div>
          </div>

          {/* Preview */}
          {calculated && (
            <div
              className="p-3"
              style={{
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--color-primary)',
              }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>
              {t('calculatedGauge')}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                {Math.round(calculated.stitchesPerInch * 10) / 10} sts/inch × {Math.round(calculated.rowsPerInch * 10) / 10} rows/inch
              </p>
            </div>
          )}

          <button
            onClick={handleApplyGauge}
            disabled={!hasValidInput}
            className="btn-primary w-full text-sm"
          >
            {t('applyMyGauge')}
          </button>
        </div>
      )}
    </div>
  );
}
