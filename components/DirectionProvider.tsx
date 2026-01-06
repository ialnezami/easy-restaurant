'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Get language from cookie
    const langCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('lang='))
      ?.split('=')[1] || 'en';

    // Set direction based on language
    const isRTL = langCookie === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = langCookie;
  }, [pathname]);

  return <>{children}</>;
}

