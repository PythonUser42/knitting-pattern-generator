'use client';

import { useTranslation } from '@/lib/useTranslation';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onDismiss, onRetry }: ErrorMessageProps) {
  const { language } = useTranslation();

  // Parse error message to provide helpful suggestions
  const getSuggestion = (error: string): { title: string; suggestion: string; icon: 'image' | 'settings' | 'general' } => {
    const errorLower = error.toLowerCase();

    if (errorLower.includes('image') || errorLower.includes('process') || errorLower.includes('upload')) {
      return {
        title: language === 'de' ? 'Bildproblem' : 'Image Issue',
        suggestion: language === 'de'
          ? 'Versuche ein einfacheres Bild mit weniger Farben und klaren Formen.'
          : 'Try a simpler image with fewer colors and clear shapes.',
        icon: 'image',
      };
    }

    if (errorLower.includes('pattern') || errorLower.includes('validation') || errorLower.includes('chart')) {
      return {
        title: language === 'de' ? 'Musterproblem' : 'Pattern Issue',
        suggestion: language === 'de'
          ? 'Das Bild ist möglicherweise zu komplex. Versuche eine kleinere Größe oder ein einfacheres Design.'
          : 'The image may be too complex. Try a smaller size or simpler design.',
        icon: 'settings',
      };
    }

    if (errorLower.includes('pdf') || errorLower.includes('download')) {
      return {
        title: language === 'de' ? 'Download-Problem' : 'Download Issue',
        suggestion: language === 'de'
          ? 'Versuche es erneut. Wenn das Problem bestehen bleibt, aktualisiere die Seite.'
          : 'Please try again. If the problem persists, refresh the page.',
        icon: 'general',
      };
    }

    return {
      title: language === 'de' ? 'Etwas ist schiefgelaufen' : 'Something went wrong',
      suggestion: language === 'de'
        ? 'Bitte versuche es erneut oder verwende ein anderes Bild.'
        : 'Please try again or use a different image.',
      icon: 'general',
    };
  };

  const { title, suggestion, icon } = getSuggestion(message);

  const icons = {
    image: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    settings: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    general: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
        border: '1px solid #FECACA',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Icon */}
        <div
          style={{
            flexShrink: 0,
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626',
          }}
        >
          {icons[icon]}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#991B1B',
              marginBottom: '4px',
            }}
          >
            {title}
          </h4>
          <p
            style={{
              fontSize: '13px',
              color: '#B91C1C',
              marginBottom: '8px',
              lineHeight: 1.4,
            }}
          >
            {suggestion}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#DC2626',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
                {language === 'de' ? 'Erneut versuchen' : 'Try again'}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #FECACA',
                  background: 'transparent',
                  color: '#B91C1C',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {language === 'de' ? 'Schließen' : 'Dismiss'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
