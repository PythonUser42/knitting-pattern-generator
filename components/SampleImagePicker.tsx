'use client';

import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { TranslationKey } from '@/lib/translations';

const SAMPLE_IMAGES = [
  { id: 'bunny', nameKey: 'sampleBunny' as TranslationKey, path: '/samples/bunny.png', colors: 3, type: 'png' },
  { id: 'penguin', nameKey: 'samplePenguin' as TranslationKey, path: '/samples/penguin.png', colors: 4, type: 'png' },
  { id: 'coffee', nameKey: 'sampleCoffee' as TranslationKey, path: '/samples/coffee.png', colors: 3, type: 'png' },
  { id: 'cloud', nameKey: 'sampleCloud' as TranslationKey, path: '/samples/cloud.png', colors: 3, type: 'png' },
  { id: 'ghost', nameKey: 'sampleGhost' as TranslationKey, path: '/samples/ghost.png', colors: 2, type: 'png' },
  { id: 'cow', nameKey: 'sampleCow' as TranslationKey, path: '/samples/cow.png', colors: 3, type: 'png' },
];

interface SampleImagePickerProps {
  onSelect: (dataUrl: string) => void;
}

export default function SampleImagePicker({ onSelect }: SampleImagePickerProps) {
  const setImageDataUrl = useStore((state) => state.setImageDataUrl);
  const { t } = useTranslation();

  const handleSampleSelect = async (path: string) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setImageDataUrl(dataUrl);
        onSelect(dataUrl);
      };

      img.src = path;
    } catch (error) {
      console.error('Failed to load sample image:', error);
    }
  };

  return (
    <div className="sample-section mt-4">
      <div
        className="sample-title text-center mb-2"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span style={{ fontSize: '12px' }}>{t('orTrySample')}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {SAMPLE_IMAGES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handleSampleSelect(sample.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'var(--color-card)',
              border: '2px solid var(--color-card-border)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--color-card-border)';
            }}
          >
            <img
              src={sample.path}
              alt={t(sample.nameKey)}
              style={{ width: '100%', height: '120px', objectFit: 'contain' }}
            />
            <div
              style={{
                marginTop: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--color-text-muted)'
              }}
            >
              {t(sample.nameKey)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
