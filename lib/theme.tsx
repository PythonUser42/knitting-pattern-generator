'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  primary: string;
  primaryHover: string;
  accent: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  buttonText: string;
  error: string;
  success: string;
  shadow: string;
  shadowHover: string;
}

export interface ThemeConfig {
  name: string;
  description: string;
  colors: ThemeColors;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  borderRadiusLg: string;
  spacing: string;
  transition: string;
}

// Single cozy theme - warm and comfortable
export const theme: ThemeConfig = {
  name: 'Cozy',
  description: 'Warm oatmeal tones, comfortable feel',
  colors: {
    background: '#FAF8F5',
    backgroundSecondary: '#F5F0E8',
    primary: '#92400E',
    primaryHover: '#78350F',
    accent: '#D97706',
    card: '#FFFEF9',
    cardBorder: '#E7E5E4',
    text: '#44403C',
    textSecondary: '#57534E',
    textMuted: '#78716C',
    buttonText: '#FFFFFF',
    error: '#B91C1C',
    success: '#047857',
    shadow: '0 4px 16px -4px rgba(120, 53, 15, 0.1)',
    shadowHover: '0 8px 24px -8px rgba(120, 53, 15, 0.15)',
  },
  fontHeading: "'Fraunces', serif",
  fontBody: "'DM Sans', sans-serif",
  borderRadius: '0.75rem',
  borderRadiusLg: '1rem',
  spacing: '1.25rem',
  transition: 'all 0.25s ease-out',
};

interface ThemeContextType {
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const config = theme;
    const root = document.documentElement;

    // Set CSS variables
    root.style.setProperty('--color-background', config.colors.background);
    root.style.setProperty('--color-background-secondary', config.colors.backgroundSecondary);
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-primary-hover', config.colors.primaryHover);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-card', config.colors.card);
    root.style.setProperty('--color-card-border', config.colors.cardBorder);
    root.style.setProperty('--color-text', config.colors.text);
    root.style.setProperty('--color-text-secondary', config.colors.textSecondary);
    root.style.setProperty('--color-text-muted', config.colors.textMuted);
    root.style.setProperty('--color-button-text', config.colors.buttonText);
    root.style.setProperty('--color-error', config.colors.error);
    root.style.setProperty('--color-success', config.colors.success);
    root.style.setProperty('--shadow', config.colors.shadow);
    root.style.setProperty('--shadow-hover', config.colors.shadowHover);
    root.style.setProperty('--font-heading', config.fontHeading);
    root.style.setProperty('--font-body', config.fontBody);
    root.style.setProperty('--border-radius', config.borderRadius);
    root.style.setProperty('--border-radius-lg', config.borderRadiusLg);
    root.style.setProperty('--spacing', config.spacing);
    root.style.setProperty('--transition', config.transition);

    // Set data attribute for theme-specific CSS
    root.setAttribute('data-theme', 'cozy');
  }, [mounted]);

  return (
    <ThemeContext.Provider value={{ config: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
