'use client';

import { SessionProvider } from 'next-auth/react';
import { DirectionProvider } from '@/components/DirectionProvider';
import { ToastProvider } from '@/components/ToastContainer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DirectionProvider>
        <ToastProvider>{children}</ToastProvider>
      </DirectionProvider>
    </SessionProvider>
  );
}



