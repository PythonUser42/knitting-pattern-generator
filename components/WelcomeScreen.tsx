'use client';

import Image from 'next/image';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import LanguageButton from './LanguageButton';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const setHasSeenWelcome = useStore((state) => state.setHasSeenWelcome);
  const { t, language } = useTranslation();

  const handleGetStarted = () => {
    setHasSeenWelcome(true);
    onGetStarted();
  };

  return (
    <div
      className="relative"
      style={{
        background: 'var(--color-background)',
        minHeight: '100dvh',
        overflowY: 'auto',
      }}
    >
      {/* Language Button in top right */}
      <div style={{ position: 'fixed', top: '12px', right: '12px', zIndex: 10 }}>
        <LanguageButton />
      </div>

      {/* Hero Image Section - shorter on mobile */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(150px, 25vh, 220px)',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/hero-knitting-flatlay.png"
          alt="Cozy knitting supplies with colorwork pattern"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          priority
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to top, var(--color-background) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center px-4 md:px-6 pb-8 -mt-4 sm:-mt-10 relative z-10">
        <div className="w-full max-w-4xl text-center">
          {/* Title - smaller on mobile */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 2px 8px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.8)',
            }}
          >
            {t('welcomeTitle')}
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg md:text-xl"
            style={{ color: 'var(--color-primary)', fontWeight: 500, marginBottom: '16px' }}
          >
            {t('welcomeSubtitle')}
          </p>

          {/* All cards in one grid for consistent spacing */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3"
            style={{ gap: '16px', maxWidth: '700px', width: '100%', margin: '0 auto' }}
          >
            {/* Before/After Transformation - spans all columns on desktop */}
            <div
              className="card sm:col-span-3"
              style={{ padding: '10px 12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                {/* Before - Original Image */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '2px solid var(--color-card-border)',
                      background: '#fff',
                    }}
                  >
                    <img
                      src="/samples/bunny.png"
                      alt="Original image"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {language === 'de' ? 'Dein Bild' : 'Your image'}
                  </p>
                </div>

                {/* Arrow */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
                  <svg width="32" height="20" viewBox="0 0 40 24" fill="none">
                    <path
                      d="M2 12H34M34 12L26 4M34 12L26 20"
                      stroke="var(--color-primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ fontSize: '9px', color: 'var(--color-accent)', fontWeight: 600, marginTop: '4px' }}>
                    {language === 'de' ? 'Magie' : 'Magic'}
                  </span>
                </div>

                {/* After - Knitting Chart */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src="/samples/bunny-pattern.png"
                      alt="Generated knitting pattern"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {language === 'de' ? 'Strickmuster' : 'Knit pattern'}
                  </p>
                </div>
              </div>
            </div>

            {/* Step cards - same grid, same gap */}
            <StepCard
              number={1}
              title={t('stepUpload')}
              description={t('step1Desc')}
            />
            <StepCard
              number={2}
              title={t('stepCustomize')}
              description={t('step2Desc')}
            />
            <StepCard
              number={3}
              title={t('step3Title')}
              description={t('step3Desc')}
            />
          </div>

          {/* Social Proof / Testimonials */}
          <div
            className="mx-auto"
            style={{ maxWidth: '600px', marginTop: '16px', marginBottom: '16px' }}
          >
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <TestimonialChip
                text={language === 'de' ? '"So einfach!" - Maria' : '"So easy to use!" - Sarah'}
                stars={5}
              />
              <TestimonialChip
                text={language === 'de' ? '"Meine Mütze ist perfekt geworden"' : '"My beanie turned out perfect"'}
                stars={5}
              />
              <TestimonialChip
                text={language === 'de' ? '"Tolles Tool für Anfänger"' : '"Great tool for beginners"'}
                stars={4}
              />
            </div>
          </div>

          {/* Garment Icons - smaller */}
          <div style={{ marginBottom: '16px' }}>
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}
            >
              {t('worksGreatFor')}
            </p>
            <div className="flex justify-center" style={{ gap: '16px' }}>
              <GarmentPreview type="beanie" />
              <GarmentPreview type="scarf" />
              <GarmentPreview type="sweater" />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="btn-primary px-8 py-3 text-base font-semibold"
            style={{
              animation: 'pulse-subtle 2s ease-in-out infinite',
            }}
          >
            {t('getStarted')}
          </button>

          <p
            className="text-xs"
            style={{ color: 'var(--color-text-muted)', marginTop: '16px' }}
          >
            {t('freeToUse')}
          </p>

          {/* Trust badges */}
          <div
            className="flex justify-center flex-wrap"
            style={{ opacity: 0.7, marginTop: '16px', gap: '16px' }}
          >
            <TrustBadge icon="lock" text={language === 'de' ? 'Kein Login' : 'No login required'} />
            <TrustBadge icon="zap" text={language === 'de' ? 'Sofort-Ergebnis' : 'Instant results'} />
            <TrustBadge icon="heart" text={language === 'de' ? '100% kostenlos' : '100% free'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialChip({ text, stars }: { text: string; stars: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        background: 'var(--color-background-secondary)',
        borderRadius: '16px',
        fontSize: '11px',
        color: 'var(--color-text-secondary)',
      }}
    >
      <span style={{ color: '#F59E0B', fontSize: '10px' }}>
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </span>
      <span>{text}</span>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: 'lock' | 'zap' | 'heart'; text: string }) {
  const icons = {
    lock: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    zap: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    heart: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        color: 'var(--color-text-muted)',
      }}
    >
      {icons[icon]}
      <span>{text}</span>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: '10px 12px',
        textAlign: 'left',
      }}
    >
      <div className="flex gap-2">
        {/* Number badge - aligned to top */}
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            flexShrink: 0,
            marginTop: '1px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            color: 'var(--color-button-text)',
          }}
        >
          {number}
        </div>
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '1px',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </div>
      </div>
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
        width: '40px',
        height: '40px',
        padding: '8px',
        borderRadius: '8px',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-card-border)',
        color: 'var(--color-accent)',
      }}
    >
      {icons[type]}
    </div>
  );
}
