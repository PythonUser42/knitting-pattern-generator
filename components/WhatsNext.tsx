'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';

interface WhatsNextProps {
  garmentType: 'beanie' | 'scarf' | 'sweater';
  onStartNew: () => void;
}

export default function WhatsNext({ garmentType, onStartNew }: WhatsNextProps) {
  const [expanded, setExpanded] = useState(false);
  const { language } = useTranslation();

  const tips = {
    beanie: {
      icon: '🧢',
      tips: language === 'de' ? [
        'Stricke zuerst eine Maschenprobe mit deinem ausgewählten Garn',
        'Verwende Rundstricknadeln für nahtloses Stricken',
        'Beginne mit dem Rippenbund für einen dehnbaren Rand',
        'Blockiere dein fertiges Stück für ein professionelles Finish',
      ] : [
        'Knit a gauge swatch first with your chosen yarn',
        'Use circular needles for seamless knitting',
        'Start with the ribbed brim for a stretchy edge',
        'Block your finished piece for a professional finish',
      ],
    },
    scarf: {
      icon: '🧣',
      tips: language === 'de' ? [
        'Wähle ein weiches, waschbares Garn für Komfort',
        'Randmaschen sorgen für saubere Kanten',
        'Trage die Farben locker auf der Rückseite für Flexibilität',
        'Blockiere beide Enden gleichmäßig',
      ] : [
        'Choose a soft, washable yarn for comfort',
        'Slip stitches at edges create clean selvedges',
        'Carry floats loosely on the back for flexibility',
        'Block both ends evenly to match',
      ],
    },
    sweater: {
      icon: '🧥',
      tips: language === 'de' ? [
        'Stricke UNBEDINGT eine Maschenprobe - Größe ist entscheidend!',
        'Markiere die Mitte des Vorderteils für die Diagrammplatzierung',
        'Verbinde Schulternähte vor dem Aufnehmen der Halsblende',
        'Blockiere alle Teile vor dem Zusammennähen',
      ] : [
        'DEFINITELY knit a gauge swatch - sizing is crucial!',
        'Mark the center of the front for chart placement',
        'Seam shoulders before picking up neckband stitches',
        'Block all pieces before seaming',
      ],
    },
  };

  const currentTips = tips[garmentType];

  return (
    <div
      style={{
        marginTop: '16px',
        background: 'var(--color-background-secondary)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '14px 16px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{currentTips.icon}</span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            {language === 'de' ? 'Nächste Schritte' : "What's Next"}
          </span>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth="2"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px' }}>
          <ol
            style={{
              margin: 0,
              padding: '0 0 0 20px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            {currentTips.tips.map((tip, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {tip}
              </li>
            ))}
          </ol>

          {/* Quick links */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--color-card-border)',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={onStartNew}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-card-border)',
                background: 'var(--color-card)',
                color: 'var(--color-text)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {language === 'de' ? 'Neues Muster' : 'Create another'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
