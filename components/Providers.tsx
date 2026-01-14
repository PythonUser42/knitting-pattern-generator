'use client';

import { ThemeProvider } from '@/lib/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="app-container relative">
        {children}
      </div>
    </ThemeProvider>
  );
}
