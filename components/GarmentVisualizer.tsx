'use client';

import { Pattern, GarmentType } from '@/lib/types';

interface GarmentVisualizerProps {
  pattern: Pattern;
}

export default function GarmentVisualizer({ pattern }: GarmentVisualizerProps) {
  const { garmentType, measurements, chart } = pattern;

  if (garmentType === 'beanie') {
    return <BeanieVisualizer pattern={pattern} />;
  } else if (garmentType === 'scarf') {
    return <ScarfVisualizer pattern={pattern} />;
  } else if (garmentType === 'sweater') {
    return <SweaterVisualizer pattern={pattern} />;
  }

  return null;
}

function BeanieVisualizer({ pattern }: { pattern: Pattern }) {
  const { measurements, chart, gauge } = pattern;

  if (!measurements.beanie) return null;

  const { circumference, height, brimDepth } = measurements.beanie;

  // Convert to pixels for SVG (scale: 1 inch = 20 pixels)
  const scale = 20;
  const width = circumference * scale;
  const totalHeight = height * scale;
  const brimHeight = brimDepth * scale;
  const bodyHeight = totalHeight - brimHeight - (2 * scale); // Subtract crown
  const crownHeight = 2 * scale;

  // Chart positioning (centered)
  const chartWidthInches = chart.width / gauge.stitchesPerInch;
  const chartHeightInches = chart.height / gauge.rowsPerInch;
  const chartWidth = chartWidthInches * scale;
  const chartHeight = chartHeightInches * scale;
  const chartX = (width - chartWidth) / 2;
  const chartY = brimHeight + (bodyHeight - chartHeight) / 2;

  const viewBoxWidth = width + 40;
  const viewBoxHeight = totalHeight + 60;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Beanie Schematic (Laid Flat)</h3>
      <p className="text-sm text-gray-600 mb-4">
        Shows beanie laid flat before seaming. Chart is centered on front panel.
      </p>

      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full max-w-2xl mx-auto border border-gray-300 rounded-lg bg-white"
      >
        {/* Brim */}
        <rect
          x={20}
          y={20}
          width={width}
          height={brimHeight}
          fill="#E5E7EB"
          stroke="#374151"
          strokeWidth={2}
        />
        <text x={width / 2 + 20} y={20 + brimHeight / 2} textAnchor="middle" fontSize={12} fill="#374151">
          Ribbed Brim
        </text>

        {/* Body */}
        <rect
          x={20}
          y={20 + brimHeight}
          width={width}
          height={bodyHeight}
          fill="#F3F4F6"
          stroke="#374151"
          strokeWidth={2}
        />

        {/* Chart overlay */}
        <rect
          x={20 + chartX}
          y={20 + chartY}
          width={chartWidth}
          height={chartHeight}
          fill="#3B82F6"
          fillOpacity={0.3}
          stroke="#2563EB"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <text
          x={20 + chartX + chartWidth / 2}
          y={20 + chartY + chartHeight / 2}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill="#1E40AF"
        >
          Chart
        </text>
        <text
          x={20 + chartX + chartWidth / 2}
          y={20 + chartY + chartHeight / 2 + 16}
          textAnchor="middle"
          fontSize={11}
          fill="#1E40AF"
        >
          {chart.width} × {chart.height} sts
        </text>

        {/* Crown */}
        <polygon
          points={`
            ${20},${20 + brimHeight + bodyHeight}
            ${20 + width},${20 + brimHeight + bodyHeight}
            ${20 + width / 2},${20 + totalHeight}
          `}
          fill="#D1D5DB"
          stroke="#374151"
          strokeWidth={2}
        />
        <text
          x={width / 2 + 20}
          y={20 + brimHeight + bodyHeight + crownHeight / 2}
          textAnchor="middle"
          fontSize={12}
          fill="#374151"
        >
          Crown Decreases
        </text>

        {/* Measurements */}
        {/* Width measurement */}
        <line
          x1={20}
          y1={viewBoxHeight - 25}
          x2={20 + width}
          y2={viewBoxHeight - 25}
          stroke="#EF4444"
          strokeWidth={1}
        />
        <line x1={20} y1={viewBoxHeight - 30} x2={20} y2={viewBoxHeight - 20} stroke="#EF4444" strokeWidth={1} />
        <line x1={20 + width} y1={viewBoxHeight - 30} x2={20 + width} y2={viewBoxHeight - 20} stroke="#EF4444" strokeWidth={1} />
        <text x={width / 2 + 20} y={viewBoxHeight - 10} textAnchor="middle" fontSize={12} fill="#EF4444" fontWeight="bold">
          {circumference}" circumference
        </text>

        {/* Height measurement */}
        <line
          x1={viewBoxWidth - 25}
          y1={20}
          x2={viewBoxWidth - 25}
          y2={20 + totalHeight}
          stroke="#EF4444"
          strokeWidth={1}
        />
        <line x1={viewBoxWidth - 30} y1={20} x2={viewBoxWidth - 20} y2={20} stroke="#EF4444" strokeWidth={1} />
        <line x1={viewBoxWidth - 30} y1={20 + totalHeight} x2={viewBoxWidth - 20} y2={20 + totalHeight} stroke="#EF4444" strokeWidth={1} />
        <text
          x={viewBoxWidth - 10}
          y={totalHeight / 2 + 20}
          textAnchor="middle"
          fontSize={12}
          fill="#EF4444"
          fontWeight="bold"
          transform={`rotate(90, ${viewBoxWidth - 10}, ${totalHeight / 2 + 20})`}
        >
          {height}" height
        </text>
      </svg>
    </div>
  );
}

function ScarfVisualizer({ pattern }: { pattern: Pattern }) {
  const { measurements, chart, gauge } = pattern;

  if (!measurements.scarf) return null;

  const { width, length } = measurements.scarf;

  // Display horizontally - length along x-axis, width along y-axis
  const scale = 8;
  const displayLength = Math.min(length * scale, 600); // Cap display length
  const displayWidth = width * scale;
  const scaleFactor = displayLength / (length * scale);

  // Chart positioning (centered)
  const chartWidthInches = chart.width / gauge.stitchesPerInch;
  const chartHeightInches = chart.height / gauge.rowsPerInch;
  const chartDisplayWidth = chartWidthInches * scale;
  const chartDisplayHeight = chartHeightInches * scale;
  const chartX = (displayLength - chartDisplayWidth * scaleFactor) / 2;
  const chartY = (displayWidth - chartDisplayHeight) / 2;

  const viewBoxWidth = displayLength + 60;
  const viewBoxHeight = displayWidth + 80;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Scarf Schematic</h3>
      <p className="text-sm text-gray-600 mb-4">
        Rectangular scarf with chart centered. Border stitches prevent curling.
      </p>

      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full max-w-3xl mx-auto border border-gray-300 rounded-lg bg-white"
        style={{ maxHeight: '200px' }}
      >
        {/* Main body - horizontal orientation */}
        <rect
          x={30}
          y={20}
          width={displayLength}
          height={displayWidth}
          fill="#F3F4F6"
          stroke="#374151"
          strokeWidth={2}
        />

        {/* Border indication (left/right ends) */}
        <rect x={30} y={20} width={15} height={displayWidth} fill="#E5E7EB" />
        <rect x={30 + displayLength - 15} y={20} width={15} height={displayWidth} fill="#E5E7EB" />

        {/* Chart overlay */}
        <rect
          x={30 + chartX}
          y={20 + chartY}
          width={chartDisplayWidth * scaleFactor}
          height={chartDisplayHeight}
          fill="#3B82F6"
          fillOpacity={0.3}
          stroke="#2563EB"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <text
          x={30 + chartX + (chartDisplayWidth * scaleFactor) / 2}
          y={20 + chartY + chartDisplayHeight / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fontWeight="bold"
          fill="#1E40AF"
        >
          Chart
        </text>

        {/* Measurements */}
        {/* Length (horizontal) */}
        <line x1={30} y1={viewBoxHeight - 25} x2={30 + displayLength} y2={viewBoxHeight - 25} stroke="#EF4444" strokeWidth={1} />
        <line x1={30} y1={viewBoxHeight - 30} x2={30} y2={viewBoxHeight - 20} stroke="#EF4444" strokeWidth={1} />
        <line x1={30 + displayLength} y1={viewBoxHeight - 30} x2={30 + displayLength} y2={viewBoxHeight - 20} stroke="#EF4444" strokeWidth={1} />
        <text x={30 + displayLength / 2} y={viewBoxHeight - 10} textAnchor="middle" fontSize={11} fill="#EF4444" fontWeight="bold">
          {length}" long
        </text>

        {/* Width (vertical) */}
        <line x1={viewBoxWidth - 20} y1={20} x2={viewBoxWidth - 20} y2={20 + displayWidth} stroke="#EF4444" strokeWidth={1} />
        <line x1={viewBoxWidth - 25} y1={20} x2={viewBoxWidth - 15} y2={20} stroke="#EF4444" strokeWidth={1} />
        <line x1={viewBoxWidth - 25} y1={20 + displayWidth} x2={viewBoxWidth - 15} y2={20 + displayWidth} stroke="#EF4444" strokeWidth={1} />
        <text
          x={viewBoxWidth - 8}
          y={20 + displayWidth / 2}
          textAnchor="middle"
          fontSize={11}
          fill="#EF4444"
          fontWeight="bold"
          transform={`rotate(90, ${viewBoxWidth - 8}, ${20 + displayWidth / 2})`}
        >
          {width}" wide
        </text>
      </svg>
    </div>
  );
}

function SweaterVisualizer({ pattern }: { pattern: Pattern }) {
  const { measurements, chart, gauge } = pattern;

  if (!measurements.sweater) return null;

  const { chest, length, armholeDepth, sleeveLength, cuffWidth, upperArmWidth } = measurements.sweater;

  // Scale for display
  const scale = 8;
  const panelWidth = (chest / 2) * scale;
  const panelHeight = length * scale;
  const armholeHeight = armholeDepth * scale;
  const sleeveLen = sleeveLength * scale;
  const cuffW = cuffWidth * scale;
  const upperArmW = upperArmWidth * scale;

  // Chart positioning (on front panel only)
  const chartWidthInches = chart.width / gauge.stitchesPerInch;
  const chartHeightInches = chart.height / gauge.rowsPerInch;
  const chartWidth = chartWidthInches * scale;
  const chartHeight = chartHeightInches * scale;
  const chartX = (panelWidth - chartWidth) / 2;
  const chartY = (panelHeight - chartHeight) / 2;

  const gap = 20;
  const viewBoxWidth = panelWidth * 2 + gap * 3 + Math.max(sleeveLen, 100) * 2;
  const viewBoxHeight = Math.max(panelHeight, upperArmW) + 100;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Sweater Schematic (Pieces Laid Flat)</h3>
      <p className="text-sm text-gray-600 mb-4">
        Drop-shoulder construction. Chart appears on front panel only.
      </p>

      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full border border-gray-300 rounded-lg bg-white"
      >
        {/* Back Panel */}
        <g>
          <rect
            x={gap}
            y={40}
            width={panelWidth}
            height={panelHeight}
            fill="#E5E7EB"
            stroke="#374151"
            strokeWidth={2}
          />
          <text x={gap + panelWidth / 2} y={40 + panelHeight / 2} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#374151">
            BACK
          </text>
          <text x={gap + panelWidth / 2} y={30} textAnchor="middle" fontSize={12} fill="#374151">
            (Solid Color)
          </text>
        </g>

        {/* Front Panel with Chart */}
        <g>
          <rect
            x={gap * 2 + panelWidth}
            y={40}
            width={panelWidth}
            height={panelHeight}
            fill="#F3F4F6"
            stroke="#374151"
            strokeWidth={2}
          />

          {/* Chart overlay */}
          <rect
            x={gap * 2 + panelWidth + chartX}
            y={40 + chartY}
            width={chartWidth}
            height={chartHeight}
            fill="#3B82F6"
            fillOpacity={0.3}
            stroke="#2563EB"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <text
            x={gap * 2 + panelWidth + panelWidth / 2}
            y={40 + panelHeight / 2 - 10}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fill="#1E40AF"
          >
            FRONT
          </text>
          <text
            x={gap * 2 + panelWidth + panelWidth / 2}
            y={40 + panelHeight / 2 + 10}
            textAnchor="middle"
            fontSize={11}
            fill="#1E40AF"
          >
            (with Chart)
          </text>
          <text x={gap * 2 + panelWidth + panelWidth / 2} y={30} textAnchor="middle" fontSize={12} fill="#374151">
            Chart: {chart.width} × {chart.height} sts
          </text>
        </g>

        {/* Left Sleeve */}
        <g>
          <polygon
            points={`
              ${gap},${viewBoxHeight - 40 - upperArmW}
              ${gap + sleeveLen},${viewBoxHeight - 40 - cuffW}
              ${gap + sleeveLen},${viewBoxHeight - 40}
              ${gap},${viewBoxHeight - 40}
            `}
            fill="#F9FAFB"
            stroke="#374151"
            strokeWidth={2}
          />
          <text
            x={gap + sleeveLen / 2}
            y={viewBoxHeight - 40 - upperArmW / 2}
            textAnchor="middle"
            fontSize={12}
            fill="#374151"
          >
            SLEEVE
          </text>
        </g>

        {/* Right Sleeve */}
        <g>
          <polygon
            points={`
              ${gap * 3 + panelWidth * 2},${viewBoxHeight - 40 - cuffW}
              ${gap * 3 + panelWidth * 2 + sleeveLen},${viewBoxHeight - 40 - upperArmW}
              ${gap * 3 + panelWidth * 2 + sleeveLen},${viewBoxHeight - 40}
              ${gap * 3 + panelWidth * 2},${viewBoxHeight - 40}
            `}
            fill="#F9FAFB"
            stroke="#374151"
            strokeWidth={2}
          />
          <text
            x={gap * 3 + panelWidth * 2 + sleeveLen / 2}
            y={viewBoxHeight - 40 - upperArmW / 2}
            textAnchor="middle"
            fontSize={12}
            fill="#374151"
          >
            SLEEVE
          </text>
        </g>

        {/* Measurements labels */}
        <text x={gap + panelWidth} y={viewBoxHeight - 10} textAnchor="middle" fontSize={11} fill="#EF4444" fontWeight="bold">
          Chest: {chest}" | Length: {length}" | Sleeves: {sleeveLength}"
        </text>
      </svg>
    </div>
  );
}
