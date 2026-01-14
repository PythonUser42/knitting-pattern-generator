'use client';

import { StitchChart } from '@/lib/types';

interface DifficultyBadgeProps {
  chart: StitchChart;
}

export function calculateDifficulty(chart: StitchChart): {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  score: number;
  reasons: string[];
} {
  const colorCount = new Set(chart.colorMap.map(c => c.hex)).size;
  const reasons: string[] = [];
  let score = 0;

  // Color count scoring
  if (colorCount <= 2) {
    score += 1;
    reasons.push('Simple 2-color design');
  } else if (colorCount <= 4) {
    score += 2;
    reasons.push(`${colorCount} colors to manage`);
  } else {
    score += 3;
    reasons.push(`${colorCount} colors - complex colorwork`);
  }

  // Chart size scoring
  const stitches = chart.width * chart.height;
  if (stitches < 500) {
    score += 0;
  } else if (stitches < 1500) {
    score += 1;
    reasons.push('Medium-sized chart');
  } else {
    score += 2;
    reasons.push('Large chart - longer project');
  }

  // Color change frequency scoring
  let colorChanges = 0;
  for (let row = 0; row < chart.height; row++) {
    let prevColor = chart.grid[row][0];
    for (let col = 1; col < chart.width; col++) {
      if (chart.grid[row][col] !== prevColor) {
        colorChanges++;
        prevColor = chart.grid[row][col];
      }
    }
  }
  const avgChangesPerRow = colorChanges / chart.height;

  if (avgChangesPerRow > 5) {
    score += 2;
    reasons.push('Frequent color changes');
  } else if (avgChangesPerRow > 2) {
    score += 1;
    reasons.push('Some color changes per row');
  }

  // Determine level
  let level: 'Beginner' | 'Intermediate' | 'Advanced';
  if (score <= 2) {
    level = 'Beginner';
  } else if (score <= 4) {
    level = 'Intermediate';
  } else {
    level = 'Advanced';
  }

  return { level, score, reasons };
}

export default function DifficultyBadge({ chart }: DifficultyBadgeProps) {
  const { level, reasons } = calculateDifficulty(chart);

  const colors = {
    Beginner: { bg: '#D1FAE5', text: '#047857', border: '#10B981' },
    Intermediate: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
    Advanced: { bg: '#FEE2E2', text: '#B91C1C', border: '#EF4444' },
  };

  const icons = {
    Beginner: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    Intermediate: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="10" cy="10" r="4" fill="currentColor" />
      </svg>
    ),
    Advanced: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="currentColor" />
      </svg>
    ),
  };

  return (
    <div className="inline-flex flex-col">
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: colors[level].bg,
          color: colors[level].text,
          border: `1px solid ${colors[level].border}`,
        }}
        title={reasons.join(', ')}
      >
        {icons[level]}
        <span className="text-sm font-medium">{level}</span>
      </div>
      <span
        className="text-xs mt-1 text-center"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {reasons[0]}
      </span>
    </div>
  );
}
