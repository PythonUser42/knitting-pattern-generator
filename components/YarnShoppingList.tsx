'use client';

import { Pattern } from '@/lib/types';

interface YarnShoppingListProps {
  pattern: Pattern;
}

export default function YarnShoppingList({ pattern }: YarnShoppingListProps) {
  const { yardage } = pattern.materials;

  const formatShoppingList = () => {
    const lines = [
      `YARN SHOPPING LIST`,
      `Pattern: ${pattern.garmentType.charAt(0).toUpperCase() + pattern.garmentType.slice(1)} (${pattern.size})`,
      `Yarn Weight: ${pattern.gauge.yarnWeight.charAt(0).toUpperCase() + pattern.gauge.yarnWeight.slice(1)}`,
      ``,
      `COLORS NEEDED:`,
    ];

    yardage.colorBreakdown.forEach((item) => {
      lines.push(`- ${item.color.name}: ${item.skeins} skein${item.skeins > 1 ? 's' : ''} (~${item.yards} yards)`);
    });

    lines.push(``);
    lines.push(`TOTAL: ~${yardage.totalYards} yards`);
    lines.push(``);
    lines.push(`Note: Buy an extra skein of each color to be safe!`);
    lines.push(`Assumes 220 yards per skein.`);

    return lines.join('\n');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatShoppingList());
      alert('Shopping list copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const text = formatShoppingList();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yarn-shopping-list-${pattern.garmentType}-${pattern.size}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h3
        className="text-lg font-semibold mb-4 flex items-center gap-2"
        style={{
          color: 'var(--color-text)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        <svg className="w-5 h-5" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Yarn Shopping List
      </h3>

      <div className="space-y-3 mb-4">
        {yardage.colorBreakdown.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--color-background-secondary)',
            }}
          >
            <div
              className="w-8 h-8 rounded-md flex-shrink-0"
              style={{
                backgroundColor: item.color.hex,
                border: '1px solid var(--color-card-border)',
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                {item.color.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {item.color.brand && `${item.color.brand} • `}{item.color.colorNumber || 'Any brand'}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                {item.skeins} skein{item.skeins > 1 ? 's' : ''}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                ~{item.yards} yds
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-between p-3 rounded-lg mb-4"
        style={{
          backgroundColor: 'var(--color-background-secondary)',
          border: '1px solid var(--color-card-border)',
        }}
      >
        <span className="font-medium" style={{ color: 'var(--color-text)' }}>
          Total Yardage (estimate)
        </span>
        <span className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
          ~{yardage.totalYards} yards
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCopyToClipboard}
          className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>
        <button
          onClick={handleDownload}
          className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>

      <p
        className="text-xs mt-3 text-center"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Tip: Buy an extra skein of each color to be safe!
      </p>
    </div>
  );
}
