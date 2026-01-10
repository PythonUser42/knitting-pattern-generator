'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { CustomGauge, Gauge } from '@/lib/types';
import { STANDARD_GAUGES } from '@/lib/knitting/measurements';

export default function GaugeCalculator() {
  const {
    selectedGauge,
    customGauge,
    setSelectedGauge,
    setCustomGauge,
  } = useStore();

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
      <div className={`p-4 rounded-lg ${isUsingCustomGauge ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">
            {isUsingCustomGauge ? 'Your Gauge (from swatch)' : 'Standard Gauge'}
          </h4>
          {isUsingCustomGauge && (
            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">Custom</span>
          )}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{selectedGauge.stitchesPerInch} stitches per inch</p>
          <p>{selectedGauge.rowsPerInch} rows per inch</p>
        </div>
        {isUsingCustomGauge && (
          <button
            onClick={handleClearCustomGauge}
            className="text-xs text-red-600 hover:text-red-700 mt-2"
          >
            Reset to standard gauge
          </button>
        )}
      </div>

      {/* Toggle Calculator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculate from Swatch
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
        <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">How to measure your swatch:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Knit a swatch at least 5" x 5" in stockinette</li>
              <li>Lay it flat without stretching</li>
              <li>Count stitches and rows in a measured section</li>
              <li>Enter your measurements below</li>
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Stitches counted
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={swatchStitches}
                onChange={(e) => setSwatchStitches(e.target.value)}
                placeholder="e.g., 20"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Over width (inches)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                value={swatchWidth}
                onChange={(e) => setSwatchWidth(e.target.value)}
                placeholder="e.g., 4"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rows counted
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={swatchRows}
                onChange={(e) => setSwatchRows(e.target.value)}
                placeholder="e.g., 28"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Over height (inches)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                value={swatchHeight}
                onChange={(e) => setSwatchHeight(e.target.value)}
                placeholder="e.g., 4"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Preview */}
          {calculated && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">Your calculated gauge:</p>
              <p className="text-sm text-blue-800">
                {Math.round(calculated.stitchesPerInch * 10) / 10} sts/inch × {Math.round(calculated.rowsPerInch * 10) / 10} rows/inch
              </p>
            </div>
          )}

          <button
            onClick={handleApplyGauge}
            disabled={!hasValidInput}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Apply My Gauge
          </button>
        </div>
      )}
    </div>
  );
}
