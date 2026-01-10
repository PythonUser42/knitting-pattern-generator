'use client';

import { StitchChart } from '@/lib/types';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface ChartVisualizerProps {
  chart: StitchChart;
  cellSize?: number;
}

export interface ChartVisualizerRef {
  getCanvas: () => HTMLCanvasElement | null;
}

const ChartVisualizer = forwardRef<ChartVisualizerRef, ChartVisualizerProps>(
  ({ chart, cellSize = 12 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = chart.width * cellSize;
    canvas.height = chart.height * cellSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create color map
    const colorMap = new Map(chart.colorMap.map(c => [c.id, c.hex]));

    // Draw grid
    for (let y = 0; y < chart.height; y++) {
      for (let x = 0; x < chart.width; x++) {
        const colorId = chart.grid[y][x];
        const color = colorMap.get(colorId) || '#FFFFFF';

        // Fill cell
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // Draw border
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }, [chart, cellSize]);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-auto border border-gray-300 rounded-lg p-4 bg-white">
        <canvas
          ref={canvasRef}
          className="mx-auto"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Dimensions:</span> {chart.width} × {chart.height} stitches
        </div>
        <div>
          <span className="font-medium">Colors:</span> {new Set(chart.colorMap.map(c => c.hex)).size}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm mb-2">Color Legend:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Array.from(
            new Map(chart.colorMap.map(color => [color.hex, color])).values()
          ).map((color) => (
            <div key={color.hex} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm">{color.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ChartVisualizer.displayName = 'ChartVisualizer';

export default ChartVisualizer;
