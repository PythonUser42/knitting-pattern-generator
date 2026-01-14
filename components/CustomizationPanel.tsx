'use client';

import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { GarmentType, Size, Gauge } from '@/lib/types';
import { STANDARD_GAUGES } from '@/lib/knitting/measurements';
import GaugeCalculator from './GaugeCalculator';
import CustomSizing from './CustomSizing';

export default function CustomizationPanel() {
  const {
    selectedGarment,
    selectedSize,
    selectedGauge,
    customGauge,
    setSelectedGarment,
    setSelectedSize,
    setSelectedGauge,
    setCustomGauge,
  } = useStore();

  const { t } = useTranslation();

  const handleGarmentChange = (garment: GarmentType) => {
    setSelectedGarment(garment);
    if (garment === 'beanie') {
      setSelectedSize('M');
    } else if (garment === 'scarf') {
      setSelectedSize('standard');
    } else if (garment === 'sweater') {
      setSelectedSize('M');
    }
  };

  const handleYarnWeightChange = (weight: Gauge['yarnWeight']) => {
    if (customGauge) {
      setSelectedGauge({
        ...selectedGauge,
        yarnWeight: weight,
      });
    } else {
      setSelectedGauge(STANDARD_GAUGES[weight]);
    }
  };

  const garmentOptions: { type: GarmentType; labelKey: 'beanie' | 'scarf' | 'sweater'; descKey: 'beginnerFriendly' | 'easyProject' | 'advanced' }[] = [
    { type: 'beanie', labelKey: 'beanie', descKey: 'beginnerFriendly' },
    { type: 'scarf', labelKey: 'scarf', descKey: 'easyProject' },
    { type: 'sweater', labelKey: 'sweater', descKey: 'advanced' },
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-card-border)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-card-border)',
          backgroundColor: 'var(--color-background-secondary)',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--color-text)',
            fontFamily: 'var(--font-heading)',
            margin: 0,
          }}
        >
          {t('patternSettings')}
        </h3>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Garment Type */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '10px',
            }}
          >
            {t('garmentType')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {garmentOptions.map(({ type, labelKey, descKey }) => (
              <button
                key={type}
                onClick={() => handleGarmentChange(type)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '8px',
                  border: selectedGarment === type
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--color-card-border)',
                  backgroundColor: selectedGarment === type
                    ? 'var(--color-background-secondary)'
                    : 'var(--color-card)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: selectedGarment === type ? 'var(--color-primary)' : 'var(--color-text)',
                    marginBottom: '2px',
                  }}
                >
                  {t(labelKey)}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: type === 'sweater' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    fontWeight: type === 'sweater' ? 500 : 400,
                  }}
                >
                  {t(descKey)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '10px',
            }}
          >
            {t('size')}
          </label>
          {selectedGarment === 'beanie' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['S', 'M', 'L'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: selectedSize === size
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-card-border)',
                    backgroundColor: selectedSize === size
                      ? 'var(--color-background-secondary)'
                      : 'var(--color-card)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: selectedSize === size ? 'var(--color-primary)' : 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          {selectedGarment === 'scarf' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['narrow', 'standard', 'wide'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: selectedSize === size
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-card-border)',
                    backgroundColor: selectedSize === size
                      ? 'var(--color-background-secondary)'
                      : 'var(--color-card)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: selectedSize === size ? 'var(--color-primary)' : 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t(size)}
                </button>
              ))}
            </div>
          )}
          {selectedGarment === 'sweater' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {(['XS', 'S', 'M', 'L', 'XL'] as Size[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '8px',
                    border: selectedSize === size
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-card-border)',
                    backgroundColor: selectedSize === size
                      ? 'var(--color-background-secondary)'
                      : 'var(--color-card)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: selectedSize === size ? 'var(--color-primary)' : 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Yarn Weight */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '10px',
            }}
          >
            {t('yarnWeight')}
          </label>
          <select
            value={selectedGauge.yarnWeight}
            onChange={(e) => handleYarnWeightChange(e.target.value as Gauge['yarnWeight'])}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-card-border)',
              backgroundColor: 'var(--color-card)',
              fontSize: '14px',
              color: 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            <option value="fingering">{t('fingering')}</option>
            <option value="sport">{t('sport')}</option>
            <option value="dk">{t('dk')}</option>
            <option value="worsted">{t('worsted')} - {t('recommended')}</option>
            <option value="aran">{t('aran')}</option>
            <option value="bulky">{t('bulky')}</option>
          </select>
          {customGauge && (
            <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--color-success)' }}>
              {t('usingCustomGauge')}
            </p>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--color-card-border)',
            margin: '20px 0',
          }}
        />

        {/* Advanced Options */}
        <details style={{ marginBottom: '8px' }} className="advanced-options">
          <summary
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '8px 0',
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="advanced-options-arrow"
            >
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {t('advancedOptions')}
          </summary>
          <div style={{ paddingTop: '12px' }}>
            <GaugeCalculator />
            <div style={{ marginTop: '16px' }}>
              <CustomSizing />
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
