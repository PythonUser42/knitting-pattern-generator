'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';

interface ShareButtonsProps {
  patternName: string;
}

export default function ShareButtons({ patternName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { language } = useTranslation();

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareText = language === 'de'
    ? `Schau dir mein ${patternName} Strickmuster an! Erstellt mit KnitCraft`
    : `Check out my ${patternName} knitting pattern! Created with KnitCraft`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleSharePinterest = () => {
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=750,height=550');
  };

  const handleShareRavelry = () => {
    // Ravelry doesn't have a direct share URL, so we'll just copy a formatted message
    const ravelryText = `${shareText}\n\n${shareUrl}`;
    navigator.clipboard.writeText(ravelryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        {language === 'de' ? 'Teile dein Muster' : 'Share your pattern'}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-card-border)',
            background: copied ? 'var(--color-success)' : 'var(--color-card)',
            color: copied ? 'white' : 'var(--color-text)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {language === 'de' ? 'Kopiert!' : 'Copied!'}
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
              {language === 'de' ? 'Link kopieren' : 'Copy link'}
            </>
          )}
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleShareTwitter}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--color-card-border)',
            background: 'var(--color-card)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="Share on X"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Pinterest */}
        <button
          onClick={handleSharePinterest}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--color-card-border)',
            background: 'var(--color-card)',
            color: '#E60023',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="Share on Pinterest"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
        </button>

        {/* Ravelry (knitting community) */}
        <button
          onClick={handleShareRavelry}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--color-card-border)',
            background: 'var(--color-card)',
            color: '#EE6352',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="Copy for Ravelry"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
