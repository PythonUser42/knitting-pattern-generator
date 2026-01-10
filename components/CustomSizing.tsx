'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { CustomMeasurements, GarmentType } from '@/lib/types';
import {
  BEANIE_MEASUREMENTS,
  SCARF_MEASUREMENTS,
  SWEATER_MEASUREMENTS,
} from '@/lib/knitting/measurements';

// Validation ranges for custom measurements (in inches)
const MEASUREMENT_LIMITS = {
  beanie: {
    circumference: { min: 16, max: 26, label: 'Head Circumference' },
    height: { min: 6, max: 12, label: 'Hat Height' },
    brimDepth: { min: 1, max: 4, label: 'Brim Depth' },
  },
  scarf: {
    width: { min: 4, max: 14, label: 'Width' },
    length: { min: 40, max: 90, label: 'Length' },
  },
  sweater: {
    chest: { min: 28, max: 60, label: 'Chest' },
    length: { min: 18, max: 32, label: 'Body Length' },
    armholeDepth: { min: 5, max: 12, label: 'Armhole Depth' },
    sleeveLength: { min: 14, max: 24, label: 'Sleeve Length' },
    cuffWidth: { min: 6, max: 12, label: 'Cuff Width' },
    upperArmWidth: { min: 9, max: 20, label: 'Upper Arm' },
  },
};

export default function CustomSizing() {
  const {
    selectedGarment,
    selectedSize,
    customGauge,
    customMeasurements,
    useCustomMeasurements,
    setCustomMeasurements,
    setUseCustomMeasurements,
  } = useStore();

  const [isOpen, setIsOpen] = useState(useCustomMeasurements);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get default measurements for current garment/size
  const getDefaultMeasurements = () => {
    if (selectedGarment === 'beanie') {
      return BEANIE_MEASUREMENTS[selectedSize as keyof typeof BEANIE_MEASUREMENTS] || BEANIE_MEASUREMENTS.M;
    } else if (selectedGarment === 'scarf') {
      return SCARF_MEASUREMENTS[selectedSize as keyof typeof SCARF_MEASUREMENTS] || SCARF_MEASUREMENTS.standard;
    } else {
      return SWEATER_MEASUREMENTS[selectedSize as keyof typeof SWEATER_MEASUREMENTS] || SWEATER_MEASUREMENTS.M;
    }
  };

  // Initialize measurements when garment changes
  useEffect(() => {
    if (useCustomMeasurements && !customMeasurements?.[selectedGarment]) {
      const defaults = getDefaultMeasurements();
      setCustomMeasurements({
        ...customMeasurements,
        [selectedGarment]: defaults,
      });
    }
  }, [selectedGarment, useCustomMeasurements]);

  const validateMeasurement = (garment: GarmentType, field: string, value: number): string | null => {
    const limits = MEASUREMENT_LIMITS[garment] as Record<string, { min: number; max: number; label: string }>;
    const limit = limits[field];
    if (!limit) return null;

    if (value < limit.min) {
      return `${limit.label} must be at least ${limit.min}"`;
    }
    if (value > limit.max) {
      return `${limit.label} must be at most ${limit.max}"`;
    }
    return null;
  };

  const handleMeasurementChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const error = validateMeasurement(selectedGarment, field, numValue);

    setErrors(prev => ({
      ...prev,
      [field]: error || '',
    }));

    const currentMeasurements = customMeasurements?.[selectedGarment] || getDefaultMeasurements();
    setCustomMeasurements({
      ...customMeasurements,
      [selectedGarment]: {
        ...currentMeasurements,
        [field]: numValue,
      },
    });
  };

  const handleToggle = () => {
    if (!isOpen) {
      // Opening custom sizing
      if (!customGauge) {
        // Don't allow without gauge
        return;
      }
      setIsOpen(true);
      setUseCustomMeasurements(true);
      // Initialize with defaults
      const defaults = getDefaultMeasurements();
      setCustomMeasurements({
        ...customMeasurements,
        [selectedGarment]: defaults,
      });
    } else {
      // Closing custom sizing
      setIsOpen(false);
      setUseCustomMeasurements(false);
      setErrors({});
    }
  };

  const handleReset = () => {
    const defaults = getDefaultMeasurements();
    setCustomMeasurements({
      ...customMeasurements,
      [selectedGarment]: defaults,
    });
    setErrors({});
  };

  const currentMeasurements = customMeasurements?.[selectedGarment] || getDefaultMeasurements();
  const limits = MEASUREMENT_LIMITS[selectedGarment] as Record<string, { min: number; max: number; label: string }>;
  const hasGauge = customGauge !== null;
  const hasErrors = Object.values(errors).some(e => e);

  return (
    <div className="space-y-3">
      {/* Gate: Require gauge first */}
      {!hasGauge && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Custom sizing requires gauge input.</strong>
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Please enter your swatch measurements above to enable custom sizing.
          </p>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={!hasGauge}
        className={`w-full px-4 py-2 text-sm border rounded-lg flex items-center justify-between ${
          hasGauge
            ? 'border-gray-300 hover:bg-gray-50'
            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
        } ${isOpen && useCustomMeasurements ? 'border-purple-500 bg-purple-50' : ''}`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Custom Sizing
          <span className="text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded">Advanced</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen && useCustomMeasurements ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Custom Sizing Panel */}
      {isOpen && useCustomMeasurements && (
        <div className="p-4 border border-purple-200 rounded-lg bg-white space-y-4">
          {/* Warning */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            <strong>Note:</strong> Custom sizing increases the chance of fit issues.
            Always knit a gauge swatch and measure carefully.
          </div>

          {/* Measurements for current garment */}
          <div className="space-y-3">
            {selectedGarment === 'beanie' && (() => {
              const m = currentMeasurements as typeof BEANIE_MEASUREMENTS.M;
              const l = limits as typeof MEASUREMENT_LIMITS.beanie;
              return (
                <>
                  <MeasurementInput
                    label={l.circumference.label}
                    value={m.circumference}
                    min={l.circumference.min}
                    max={l.circumference.max}
                    onChange={(v) => handleMeasurementChange('circumference', v)}
                    error={errors.circumference}
                    hint="Measure around the head where the hat will sit"
                  />
                  <MeasurementInput
                    label={l.height.label}
                    value={m.height}
                    min={l.height.min}
                    max={l.height.max}
                    onChange={(v) => handleMeasurementChange('height', v)}
                    error={errors.height}
                    hint="From brim edge to top of head"
                  />
                  <MeasurementInput
                    label={l.brimDepth.label}
                    value={m.brimDepth}
                    min={l.brimDepth.min}
                    max={l.brimDepth.max}
                    onChange={(v) => handleMeasurementChange('brimDepth', v)}
                    error={errors.brimDepth}
                    hint="How much brim to fold up"
                  />
                </>
              );
            })()}

            {selectedGarment === 'scarf' && (() => {
              const m = currentMeasurements as typeof SCARF_MEASUREMENTS.standard;
              const l = limits as typeof MEASUREMENT_LIMITS.scarf;
              return (
                <>
                  <MeasurementInput
                    label={l.width.label}
                    value={m.width}
                    min={l.width.min}
                    max={l.width.max}
                    onChange={(v) => handleMeasurementChange('width', v)}
                    error={errors.width}
                    hint="How wide the scarf will be"
                  />
                  <MeasurementInput
                    label={l.length.label}
                    value={m.length}
                    min={l.length.min}
                    max={l.length.max}
                    onChange={(v) => handleMeasurementChange('length', v)}
                    error={errors.length}
                    hint="Total length of finished scarf"
                  />
                </>
              );
            })()}

            {selectedGarment === 'sweater' && (() => {
              const m = currentMeasurements as typeof SWEATER_MEASUREMENTS.M;
              const l = limits as typeof MEASUREMENT_LIMITS.sweater;
              return (
                <>
                  <MeasurementInput
                    label={l.chest.label}
                    value={m.chest}
                    min={l.chest.min}
                    max={l.chest.max}
                    onChange={(v) => handleMeasurementChange('chest', v)}
                    error={errors.chest}
                    hint="Full chest measurement (include ease)"
                  />
                  <MeasurementInput
                    label={l.length.label}
                    value={m.length}
                    min={l.length.min}
                    max={l.length.max}
                    onChange={(v) => handleMeasurementChange('length', v)}
                    error={errors.length}
                    hint="From shoulder to bottom hem"
                  />
                  <MeasurementInput
                    label={l.armholeDepth.label}
                    value={m.armholeDepth}
                    min={l.armholeDepth.min}
                    max={l.armholeDepth.max}
                    onChange={(v) => handleMeasurementChange('armholeDepth', v)}
                    error={errors.armholeDepth}
                    hint="From shoulder to underarm"
                  />
                  <MeasurementInput
                    label={l.sleeveLength.label}
                    value={m.sleeveLength}
                    min={l.sleeveLength.min}
                    max={l.sleeveLength.max}
                    onChange={(v) => handleMeasurementChange('sleeveLength', v)}
                    error={errors.sleeveLength}
                    hint="From underarm to wrist"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <MeasurementInput
                      label={l.cuffWidth.label}
                      value={m.cuffWidth}
                      min={l.cuffWidth.min}
                      max={l.cuffWidth.max}
                      onChange={(v) => handleMeasurementChange('cuffWidth', v)}
                      error={errors.cuffWidth}
                      compact
                    />
                    <MeasurementInput
                      label={l.upperArmWidth.label}
                      value={m.upperArmWidth}
                      min={l.upperArmWidth.min}
                      max={l.upperArmWidth.max}
                      onChange={(v) => handleMeasurementChange('upperArmWidth', v)}
                      error={errors.upperArmWidth}
                      compact
                    />
                  </div>
                </>
              );
            })()}
          </div>

          {/* Error Summary */}
          {hasErrors && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              Please fix the errors above before generating your pattern.
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50"
          >
            Reset to Standard Size ({selectedSize})
          </button>
        </div>
      )}
    </div>
  );
}

interface MeasurementInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  compact?: boolean;
}

function MeasurementInput({
  label,
  value,
  min,
  max,
  onChange,
  error,
  hint,
  compact = false,
}: MeasurementInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">{min}" - {max}"</span>
      </div>
      <div className="relative">
        <input
          type="number"
          step="0.5"
          min={min}
          max={max}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">in</span>
      </div>
      {!compact && hint && !error && (
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
