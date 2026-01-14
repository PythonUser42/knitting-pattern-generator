'use client';

import { useStore } from '@/lib/store';
import { StitchChart } from '@/lib/types';

interface ProgressTrackerProps {
  chart: StitchChart;
}

export default function ProgressTracker({ chart }: ProgressTrackerProps) {
  const { completedRows, toggleRowComplete, resetProgress } = useStore();

  const totalRows = chart.height;
  const completedCount = completedRows.length;
  const progress = totalRows > 0 ? (completedCount / totalRows) * 100 : 0;

  // Find the current row (first incomplete row)
  const currentRow = (() => {
    for (let i = 0; i < totalRows; i++) {
      if (!completedRows.includes(i)) {
        return i;
      }
    }
    return totalRows; // All done
  })();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold flex items-center gap-2"
          style={{
            color: 'var(--color-text)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          <svg className="w-5 h-5" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Row Progress
        </h3>
        <button
          onClick={resetProgress}
          className="text-xs px-2 py-1 rounded"
          style={{
            color: 'var(--color-error)',
            backgroundColor: 'rgba(185, 28, 28, 0.1)',
          }}
        >
          Reset
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {completedCount} of {totalRows} rows
          </span>
          <span style={{ color: 'var(--color-primary)' }} className="font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-background-secondary)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            }}
          />
        </div>
      </div>

      {/* Current Row Indicator */}
      {currentRow < totalRows && (
        <div
          className="p-3 rounded-lg mb-4 flex items-center gap-3"
          style={{
            backgroundColor: 'rgba(146, 64, 14, 0.1)',
            border: '1px solid var(--color-primary)',
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
            }}
          >
            {currentRow + 1}
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
              Current Row
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Row {currentRow + 1} of {totalRows}
            </p>
          </div>
          <button
            onClick={() => toggleRowComplete(currentRow)}
            className="ml-auto btn-primary text-sm px-3 py-1.5"
          >
            Mark Done
          </button>
        </div>
      )}

      {/* Row Grid */}
      <div className="max-h-48 overflow-y-auto">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: totalRows }).map((_, rowIndex) => {
            const isCompleted = completedRows.includes(rowIndex);
            const isCurrent = rowIndex === currentRow;

            return (
              <button
                key={rowIndex}
                onClick={() => toggleRowComplete(rowIndex)}
                className="aspect-square rounded text-xs font-medium transition-all"
                style={{
                  backgroundColor: isCompleted
                    ? 'var(--color-primary)'
                    : isCurrent
                    ? 'var(--color-accent)'
                    : 'var(--color-background-secondary)',
                  color: isCompleted || isCurrent
                    ? 'white'
                    : 'var(--color-text-muted)',
                  border: isCurrent && !isCompleted
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--color-card-border)',
                }}
                title={`Row ${rowIndex + 1}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
              >
                {rowIndex + 1}
              </button>
            );
          })}
        </div>
      </div>

      {completedCount === totalRows && (
        <div
          className="mt-4 p-3 rounded-lg text-center"
          style={{
            backgroundColor: 'rgba(4, 120, 87, 0.1)',
            border: '1px solid var(--color-success)',
          }}
        >
          <p className="font-medium" style={{ color: 'var(--color-success)' }}>
            Congratulations! You finished all rows!
          </p>
        </div>
      )}
    </div>
  );
}
