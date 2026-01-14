'use client';

import { StitchChart } from '@/lib/types';
import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';

interface ChartVisualizerProps {
  chart: StitchChart;
  cellSize?: number;
  compact?: boolean;
}

export interface ChartVisualizerRef {
  getCanvas: () => HTMLCanvasElement | null;
}

const ChartVisualizer = forwardRef<ChartVisualizerRef, ChartVisualizerProps>(
  ({ chart, cellSize = 10, compact = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
      editMode,
      selectedEditColor,
      setEditMode,
      setSelectedEditColor,
      updateChartCell,
    } = useStore();
    const { t } = useTranslation();

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

    // Handle canvas click for editing
    const handleCanvasClick = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!editMode || !selectedEditColor) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor(((event.clientX - rect.left) * scaleX) / cellSize);
        const y = Math.floor(((event.clientY - rect.top) * scaleY) / cellSize);

        if (x >= 0 && x < chart.width && y >= 0 && y < chart.height) {
          updateChartCell(x, y, selectedEditColor.id);
        }
      },
      [editMode, selectedEditColor, cellSize, chart.width, chart.height, updateChartCell]
    );

    const uniqueColors = Array.from(
      new Map(chart.colorMap.map(color => [color.hex, color])).values()
    );

    if (compact) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <canvas
            ref={canvasRef}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          border: editMode ? '2px solid #3B82F6' : '1px solid var(--color-card-border)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Chart Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-card-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: editMode ? '#EFF6FF' : 'var(--color-background-secondary)',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            {chart.width} × {chart.height} {t('stitches')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {uniqueColors.length} {t('colors')}
            </span>
            <button
              onClick={() => {
                if (editMode) {
                  setEditMode(false);
                  setSelectedEditColor(null);
                } else {
                  setEditMode(true);
                }
              }}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: editMode ? '#3B82F6' : '#E5E7EB',
                color: editMode ? '#FFFFFF' : '#374151',
                transition: 'all 0.15s ease',
              }}
            >
              {editMode ? t('done') : t('edit')}
            </button>
          </div>
        </div>

        {/* Edit Mode Color Palette */}
        {editMode && (
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--color-card-border)',
              backgroundColor: '#F9FAFB',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '8px' }}>
              {t('selectColorInstruction')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {uniqueColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedEditColor(color)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: color.hex,
                    border: selectedEditColor?.id === color.id
                      ? '3px solid #3B82F6'
                      : color.hex.toUpperCase() === '#FFFFFF' || color.hex.toUpperCase() === '#FFF'
                        ? '1px solid #D1D5DB'
                        : '1px solid transparent',
                    cursor: 'pointer',
                    boxShadow: selectedEditColor?.id === color.id
                      ? '0 0 0 2px #BFDBFE'
                      : '0 1px 2px rgba(0,0,0,0.1)',
                    transition: 'all 0.15s ease',
                  }}
                  title={color.name}
                />
              ))}
            </div>
            {selectedEditColor && (
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px' }}>
                {t('selected')}: <strong>{selectedEditColor.name}</strong>
              </div>
            )}
          </div>
        )}

        {/* Chart Canvas */}
        <div
          style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            backgroundColor: '#FAFAFA',
          }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{
              imageRendering: 'pixelated',
              maxWidth: '100%',
              height: 'auto',
              cursor: editMode && selectedEditColor ? 'crosshair' : 'default',
            }}
          />
        </div>

        {/* Color Legend */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--color-card-border)',
            backgroundColor: 'var(--color-card)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {uniqueColors.map((color) => (
              <div
                key={color.hex}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    backgroundColor: color.hex,
                    border: color.hex.toUpperCase() === '#FFFFFF' || color.hex.toUpperCase() === '#FFF'
                      ? '1px solid var(--color-card-border)'
                      : 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ChartVisualizer.displayName = 'ChartVisualizer';

export default ChartVisualizer;
