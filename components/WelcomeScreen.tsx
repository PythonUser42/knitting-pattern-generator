'use client';

import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import LanguageButton from './LanguageButton';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const setHasSeenWelcome = useStore((state) => state.setHasSeenWelcome);
  const { t } = useTranslation();

  const handleGetStarted = () => {
    setHasSeenWelcome(true);
    onGetStarted();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{ background: 'var(--color-background)' }}
    >
      {/* Language Button in top right */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <LanguageButton />
      </div>

      <div className="max-w-2xl w-full text-center">
        {/* Hero Section */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              borderRadius: '1.5rem',
              boxShadow: 'var(--shadow-hover)',
            }}
          >
            <svg
              style={{ width: '40px', height: '40px', color: 'white' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {t('welcomeTitle')}
          </h1>
          <p
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t('welcomeSubtitle')}
          </p>
        </div>

        {/* Steps */}
        <div
          className="grid md:grid-cols-3 gap-6"
          style={{ marginBottom: '40px' }}
        >
          <StepCard
            number={1}
            title={t('stepUpload')}
            description={t('step1Desc')}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
          />
          <StepCard
            number={2}
            title={t('stepCustomize')}
            description={t('step2Desc')}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            }
          />
          <StepCard
            number={3}
            title={t('step3Title')}
            description={t('step3Desc')}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Preview Images */}
        <div className="mb-10">
          <p
            className="text-sm mb-4"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t('worksGreatFor')}
          </p>
          <div className="flex justify-center gap-4">
            <GarmentPreview type="beanie" />
            <GarmentPreview type="scarf" />
            <GarmentPreview type="sweater" />
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="btn-primary px-10 py-4 text-lg font-semibold"
          style={{
            fontSize: '1.125rem',
          }}
        >
          {t('getStarted')}
        </button>

        <p
          className="mt-6 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {t('freeToUse')}
        </p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="card"
      style={{
        padding: '24px',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            color: 'var(--color-button-text)',
            flexShrink: 0,
          }}
        >
          {number}
        </div>
        <div style={{ color: 'var(--color-accent)', width: '24px', height: '24px' }}>{icon}</div>
      </div>
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '8px',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
        }}
      >
        {description}
      </p>
    </div>
  );
}

function GarmentPreview({ type }: { type: 'beanie' | 'scarf' | 'sweater' }) {
  const icons = {
    beanie: (
      <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }} fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="20" cy="30" rx="14" ry="6" />
        <path d="M6 30c0-10 6-18 14-18s14 8 14 18" />
        <circle cx="20" cy="8" r="3" fill="currentColor" />
      </svg>
    ),
    scarf: (
      <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="12" y="4" width="16" height="32" rx="2" />
        <line x1="12" y1="8" x2="28" y2="8" />
        <line x1="12" y1="32" x2="28" y2="32" />
        <line x1="14" y1="36" x2="14" y2="40" />
        <line x1="18" y1="36" x2="18" y2="39" />
        <line x1="22" y1="36" x2="22" y2="40" />
        <line x1="26" y1="36" x2="26" y2="39" />
      </svg>
    ),
    sweater: (
      <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 12h20v24H10z" />
        <path d="M10 12L4 20v8h6" />
        <path d="M30 12l6 8v8h-6" />
        <path d="M15 12v-4h10v4" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        width: '64px',
        height: '64px',
        padding: '12px',
        borderRadius: '12px',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-card-border)',
        color: 'var(--color-accent)',
      }}
    >
      {icons[type]}
    </div>
  );
}
