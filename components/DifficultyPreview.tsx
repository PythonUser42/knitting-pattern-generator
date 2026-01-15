'use client';

import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';

export default function DifficultyPreview() {
  const { chart, selectedGarment } = useStore();
  const { language } = useTranslation();

  if (!chart) return null;

  // Calculate difficulty factors
  const colorCount = chart.colorMap.length;
  const chartSize = chart.width * chart.height;

  // Calculate color changes per row (complexity metric)
  let totalColorChanges = 0;
  for (let row = 0; row < chart.height; row++) {
    let lastColor = '';
    for (let col = 0; col < chart.width; col++) {
      const currentColor = chart.grid[row]?.[col] || '';
      if (currentColor !== lastColor) {
        if (lastColor !== '') totalColorChanges++;
        lastColor = currentColor;
      }
    }
  }
  const avgChangesPerRow = totalColorChanges / chart.height;

  // Determine difficulty level
  let difficulty: 'beginner' | 'intermediate' | 'advanced';
  let difficultyScore = 0;

  // Color complexity
  if (colorCount <= 2) difficultyScore += 1;
  else if (colorCount <= 4) difficultyScore += 2;
  else difficultyScore += 3;

  // Chart size
  if (chartSize < 1000) difficultyScore += 1;
  else if (chartSize < 3000) difficultyScore += 2;
  else difficultyScore += 3;

  // Color changes
  if (avgChangesPerRow < 3) difficultyScore += 1;
  else if (avgChangesPerRow < 6) difficultyScore += 2;
  else difficultyScore += 3;

  // Garment complexity
  if (selectedGarment === 'scarf') difficultyScore += 0;
  else if (selectedGarment === 'beanie') difficultyScore += 1;
  else difficultyScore += 2;

  if (difficultyScore <= 5) difficulty = 'beginner';
  else if (difficultyScore <= 8) difficulty = 'intermediate';
  else difficulty = 'advanced';

  const difficultyConfig = {
    beginner: {
      label: language === 'de' ? 'Anfänger' : 'Beginner',
      color: '#059669',
      bgColor: '#D1FAE5',
      icon: '✨',
      time: language === 'de' ? '2-4 Stunden' : '2-4 hours',
    },
    intermediate: {
      label: language === 'de' ? 'Mittel' : 'Intermediate',
      color: '#D97706',
      bgColor: '#FEF3C7',
      icon: '🧶',
      time: language === 'de' ? '4-8 Stunden' : '4-8 hours',
    },
    advanced: {
      label: language === 'de' ? 'Fortgeschritten' : 'Advanced',
      color: '#DC2626',
      bgColor: '#FEE2E2',
      icon: '🔥',
      time: language === 'de' ? '8+ Stunden' : '8+ hours',
    },
  };

  const config = difficultyConfig[difficulty];

  return (
    <div
      style={{
        background: config.bgColor,
        borderRadius: '10px',
        padding: '12px 14px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{config.icon}</span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: config.color,
            }}
          >
            {config.label}
          </span>
        </div>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          ~{config.time}
        </span>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          fontSize: '11px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{colorCount}</div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            {language === 'de' ? 'Farben' : 'Colors'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{chart.width}x{chart.height}</div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            {language === 'de' ? 'Maschen' : 'Stitches'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{avgChangesPerRow.toFixed(1)}</div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            {language === 'de' ? 'Wechsel/Reihe' : 'Changes/row'}
          </div>
        </div>
      </div>

      {/* Tips based on difficulty */}
      {difficulty === 'advanced' && (
        <p
          style={{
            marginTop: '8px',
            fontSize: '11px',
            color: config.color,
            lineHeight: 1.4,
          }}
        >
          {language === 'de'
            ? 'Tipp: Viele Farbwechsel erfordern Geduld. Verwende Garnspulen!'
            : 'Tip: Many color changes require patience. Consider using bobbins!'}
        </p>
      )}
    </div>
  );
}
