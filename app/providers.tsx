'use client';

import { SessionProvider } from 'next-auth/react';
import { DirectionProvider } from '@/components/DirectionProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DirectionProvider>{children}</DirectionProvider>
    </SessionProvider>
  );
}



